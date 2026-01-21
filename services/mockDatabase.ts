
import { DesignCharge, PaymentRecord, PriceTemplate, SecurityLog } from '../types';

class MockDatabase {
  private static STORAGE_KEY = 'design_ledger_db';
  private channel = new BroadcastChannel('ledger_sync_channel');

  public getData() {
    const data = localStorage.getItem(MockDatabase.STORAGE_KEY);
    return data ? JSON.parse(data) : { 
      charges: [], 
      payments: [], 
      securityLogs: [],
      templates: [
        { id: '1', name: 'Background Change', amount: 500 },
        { id: '2', name: 'Photo Retouch', amount: 300 },
        { id: '3', name: 'Album Basic', amount: 6000 },
        { id: '4', name: 'Album Premium', amount: 9000 }
      ] 
    };
  }

  private saveData(data: any) {
    localStorage.setItem(MockDatabase.STORAGE_KEY, JSON.stringify(data));
    this.channel.postMessage('update');
    window.dispatchEvent(new CustomEvent('ledger_local_update'));
  }

  subscribe(callback: (data: any) => void) {
    const handler = () => callback(this.getData());
    this.channel.onmessage = () => handler();
    window.addEventListener('ledger_local_update', handler);
    handler();
    return () => {
      window.removeEventListener('ledger_local_update', handler);
    };
  }

  addCharge(charge: DesignCharge) {
    const data = this.getData();
    data.charges.push(charge);
    this.saveData(data);
  }

  addPayment(payment: PaymentRecord) {
    const data = this.getData();
    data.payments.push(payment);
    this.saveData(data);
  }

  addSecurityLog(log: SecurityLog) {
    const data = this.getData();
    if (!data.securityLogs) data.securityLogs = [];
    data.securityLogs.push(log);
    if (data.securityLogs.length > 20) data.securityLogs.shift();
    this.saveData(data);
  }

  saveTemplates(templates: PriceTemplate[]) {
    const data = this.getData();
    data.templates = templates;
    this.saveData(data);
  }

  clearSecurityLogs() {
    const data = this.getData();
    data.securityLogs = [];
    this.saveData(data);
  }

  /**
   * Generates a compressed Base64 string of the current ledger state.
   */
  getExportString() {
    const data = this.getData();
    // Strip sensitive logs for export
    const exportData = { ...data, securityLogs: [] };
    return btoa(encodeURIComponent(JSON.stringify(exportData)));
  }

  /**
   * Imports data from an export string.
   */
  importData(exportString: string) {
    try {
      const decoded = decodeURIComponent(atob(exportString));
      const data = JSON.parse(decoded);
      if (data && (data.charges || data.payments)) {
        this.saveData(data);
        return true;
      }
    } catch (e) {
      console.error("Failed to import ledger data", e);
    }
    return false;
  }
}

export const db = new MockDatabase();
