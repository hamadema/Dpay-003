
import React, { useState, useEffect } from 'react';
import { AUTHORIZED_USERS } from './constants';
import { UserProfile, DesignCharge, PaymentRecord, PriceTemplate, SecurityLog } from './types';
import { db } from './services/mockDatabase';
import Dashboard from './components/Dashboard';
import DesignCharges from './components/DesignCharges';
import Payments from './components/Payments';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('logged_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [charges, setCharges] = useState<DesignCharge[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [templates, setTemplates] = useState<PriceTemplate[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'charges' | 'payments' | 'templates'>('dashboard');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showImportPrompt, setShowImportPrompt] = useState<{data: string, summary: any} | null>(null);

  useEffect(() => {
    const unsubscribe = db.subscribe((data) => {
      setCharges(data.charges || []);
      setPayments(data.payments || []);
      setTemplates(data.templates || []);
      setSecurityLogs(data.securityLogs || []);
    });

    // Check URL for incoming 'Cloud Bridge' data
    const urlParams = new URLSearchParams(window.location.search);
    const bridgeData = urlParams.get('bridge');
    if (bridgeData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(bridgeData)));
        setShowImportPrompt({
          data: bridgeData,
          summary: {
            charges: decoded.charges?.length || 0,
            payments: decoded.payments?.length || 0
          }
        });
      } catch (e) {
        console.error("Invalid Bridge Link");
      }
    }

    return unsubscribe;
  }, []);

  const handleConfirmImport = () => {
    if (showImportPrompt) {
      db.importData(showImportPrompt.data);
      setShowImportPrompt(null);
      // Clean URL without refresh
      window.history.replaceState({}, document.title, window.location.pathname);
      alert("Ledger successfully updated via Cloud Bridge!");
    }
  };

  const runAiAnalysis = async () => {
    if (charges.length === 0 && payments.length === 0) {
      setAiAnalysis("The ledger is currently empty. Start adding charges or payments to see insights.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze this design project ledger between Sanjaya (Designer) and Ravi (Job Giver).
      Costs: ${JSON.stringify(charges)}
      Payments: ${JSON.stringify(payments)}
      Total Costs: Rs. ${charges.reduce((a, b) => a + b.amount, 0)}
      Total Paid: Rs. ${payments.reduce((a, b) => a + b.amount, 0)}
      
      Provide a concise 3-sentence professional summary:
      1. Overall financial health of the project.
      2. Payment status (is Ravi paying on time?).
      3. A quick action recommendation for either party.
      Keep it professional yet friendly. Use emojis sparingly.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiAnalysis(response.text || "No analysis available.");
    } catch (error) {
      console.error(error);
      setAiAnalysis("AI Analysis is temporarily unavailable.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogin = (email: string, password?: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    const authUser = AUTHORIZED_USERS[normalizedEmail];
    
    if (authUser) {
      if (authUser.password === password) {
        setCurrentUser(authUser);
        localStorage.setItem('logged_user', JSON.stringify(authUser));
      } else {
        db.addSecurityLog({
          id: Date.now().toString(),
          attemptedEmail: email,
          timestamp: Date.now(),
          date: new Date().toLocaleString(),
          status: 'WRONG_PASSWORD'
        });
        alert("Incorrect password for this account.");
      }
    } else {
      db.addSecurityLog({
        id: Date.now().toString(),
        attemptedEmail: email,
        timestamp: Date.now(),
        date: new Date().toLocaleString(),
        status: 'UNAUTHORIZED_EMAIL'
      });
      alert("Unauthorized Access Attempt Recorded.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('logged_user');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const totals = {
    costs: charges.reduce((acc, c) => acc + c.amount, 0),
    paid: payments.reduce((acc, p) => acc + p.amount, 0),
  };
  const balance = totals.paid - totals.costs;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans">
      <Sidebar 
        role={currentUser.role} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout}
        userName={currentUser.name}
      />
      
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Header user={currentUser} balance={balance} />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'dashboard' && (
            <Dashboard 
              charges={charges} 
              payments={payments} 
              totals={totals} 
              balance={balance}
              securityLogs={securityLogs}
              aiAnalysis={aiAnalysis}
              isAnalyzing={isAnalyzing}
              onRunAnalysis={runAiAnalysis}
            />
          )}
          {activeTab === 'charges' && (
            <DesignCharges 
              charges={charges} 
              templates={templates} 
              user={currentUser} 
            />
          )}
          {activeTab === 'payments' && (
            <Payments 
              payments={payments} 
              user={currentUser} 
            />
          )}
          {activeTab === 'templates' && currentUser.role === 'DESIGNER' && (
            <TemplateView templates={templates} />
          )}
        </div>
      </main>

      {/* Cloud Bridge Import Modal */}
      {showImportPrompt && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border-4 border-indigo-500 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                 <i className="fas fa-cloud-download-alt text-4xl"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-800 text-center mb-2">Incoming Ledger Update</h3>
              <p className="text-slate-500 text-sm text-center mb-8">
                A shared link from {currentUser.name === 'Sanjaya' ? 'Ravi' : 'Sanjaya'} was detected. This will update your local records.
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 flex justify-around">
                 <div className="text-center">
                    <div className="text-2xl font-black text-rose-500">{showImportPrompt.summary.charges}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Charges</div>
                 </div>
                 <div className="w-px bg-slate-200"></div>
                 <div className="text-center">
                    <div className="text-2xl font-black text-emerald-500">{showImportPrompt.summary.payments}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payments</div>
                 </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setShowImportPrompt(null);
                    window.history.replaceState({}, document.title, window.location.pathname);
                  }}
                  className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  Ignore
                </button>
                <button 
                  onClick={handleConfirmImport}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:scale-105"
                >
                  Update Now
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const TemplateView: React.FC<{ templates: PriceTemplate[] }> = ({ templates }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
           <i className="fas fa-tags"></i>
        </div>
        <h2 className="text-2xl font-black text-slate-800">Price List Management</h2>
      </div>
      <p className="text-slate-500 mb-8 font-medium">Create and manage your preset service costs for quick entry.</p>
      <TemplateManager templates={templates} />
    </div>
  );
};

const TemplateManager: React.FC<{ templates: PriceTemplate[] }> = ({ templates }) => {
  const [newTemplate, setNewTemplate] = useState({ name: '', amount: '' });

  const addTemplate = () => {
    if (!newTemplate.name || !newTemplate.amount) return;
    const next = [...templates, { id: Date.now().toString(), name: newTemplate.name, amount: Number(newTemplate.amount) }];
    db.saveTemplates(next);
    setNewTemplate({ name: '', amount: '' });
  };

  const removeTemplate = (id: string) => {
    db.saveTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Service Name</label>
          <input 
            placeholder="e.g. Logo Design Package" 
            className="w-full border-2 border-white shadow-sm p-3 rounded-xl outline-none focus:border-indigo-500 transition-all font-semibold"
            value={newTemplate.name}
            onChange={e => setNewTemplate({...newTemplate, name: e.target.value})}
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Price (Rs.)</label>
          <input 
            type="number" 
            placeholder="0" 
            className="w-full border-2 border-white shadow-sm p-3 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold"
            value={newTemplate.amount}
            onChange={e => setNewTemplate({...newTemplate, amount: e.target.value})}
          />
        </div>
        <button 
          onClick={addTemplate} 
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 self-end h-[52px] shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
        >
          Add Template
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(t => (
          <div key={t.id} className="group relative bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-800 leading-tight">{t.name}</h3>
              <button onClick={() => removeTemplate(t.id)} className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                <i className="fas fa-times-circle"></i>
              </button>
            </div>
            <div className="text-xl font-black text-indigo-600">Rs. {t.amount.toLocaleString()}</div>
            <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <i className="fas fa-magic"></i> Quick Add Enabled
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
