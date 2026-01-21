
import React, { useState } from 'react';
import { UserProfile, PaymentRecord } from '../types';
import { db } from '../services/mockDatabase';
import { PAYMENT_METHODS } from '../constants';

interface PaymentsProps {
  payments: PaymentRecord[];
  user: UserProfile;
}

const Payments: React.FC<PaymentsProps> = ({ payments, user }) => {
  const isRavi = user.role === 'PAYER';
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    method: PAYMENT_METHODS[0],
    amount: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return;

    const newPayment: PaymentRecord = {
      id: Date.now().toString(),
      date: formData.date,
      method: formData.method,
      amount: Number(formData.amount),
      note: formData.note,
      addedBy: user.name,
      timestamp: Date.now()
    };

    db.addPayment(newPayment);
    setFormData({ ...formData, amount: '', note: '' });
  };

  return (
    <div className="space-y-8">
      {isRavi && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-hand-holding-usd text-green-500"></i> Enter New Payment
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input 
                type="date" 
                className="w-full border p-2 rounded-lg bg-slate-50 outline-green-500"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Method</label>
              <select 
                className="w-full border p-2 rounded-lg bg-slate-50 outline-green-500"
                value={formData.method}
                onChange={e => setFormData({...formData, method: e.target.value})}
              >
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount (Rs.)</label>
              <input 
                type="number" 
                placeholder="2000"
                className="w-full border p-2 rounded-lg bg-slate-50 outline-green-500 font-bold"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="bg-green-600 text-white py-2 rounded-lg font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all h-10"
            >
              Record Payment
            </button>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Ref #, Bank details etc)</label>
              <input 
                type="text" 
                placeholder="e.g. Paid via HNB Bank transfer"
                className="w-full border p-2 rounded-lg bg-slate-50 outline-green-500"
                value={formData.note}
                onChange={e => setFormData({...formData, note: e.target.value})}
              />
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Payment History</h2>
          <div className="text-sm font-medium text-slate-400">Total: {payments.length} receipts</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Notes</th>
                <th className="px-6 py-4">Recorded By</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No payments recorded yet</td>
                </tr>
              ) : (
                payments.slice().reverse().map(payment => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm whitespace-nowrap">{payment.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">{payment.method}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate italic">
                      {payment.note || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold uppercase tracking-tighter">{payment.addedBy}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-green-700 whitespace-nowrap">
                      Rs. {payment.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
