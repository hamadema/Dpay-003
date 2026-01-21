
import React, { useState } from 'react';
import { UserProfile, DesignCharge, PriceTemplate } from '../types';
import { db } from '../services/mockDatabase';

interface DesignChargesProps {
  charges: DesignCharge[];
  templates: PriceTemplate[];
  user: UserProfile;
}

const DesignCharges: React.FC<DesignChargesProps> = ({ charges, templates, user }) => {
  const isSanjaya = user.role === 'DESIGNER';
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    description: '',
    amount: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.type) return;

    const newCharge: DesignCharge = {
      id: Date.now().toString(),
      date: formData.date,
      type: formData.type,
      description: formData.description,
      amount: Number(formData.amount),
      addedBy: user.name,
      timestamp: Date.now()
    };

    db.addCharge(newCharge);
    setFormData({ ...formData, type: '', description: '', amount: '' });
  };

  const applyTemplate = (template: PriceTemplate) => {
    setFormData({
      ...formData,
      type: template.name,
      amount: template.amount.toString()
    });
  };

  return (
    <div className="space-y-8">
      {isSanjaya && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-plus-circle text-indigo-500"></i> Add New Design Charge
          </h2>
          
          <div className="mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Fill</p>
            <div className="flex flex-wrap gap-2">
              {templates.map(t => (
                <button 
                  key={t.id}
                  onClick={() => applyTemplate(t)}
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                >
                  {t.name} (Rs. {t.amount})
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input 
                type="date" 
                className="w-full border p-2 rounded-lg bg-slate-50 outline-indigo-500"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <input 
                type="text" 
                placeholder="e.g. Logo Design"
                className="w-full border p-2 rounded-lg bg-slate-50 outline-indigo-500"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount (Rs.)</label>
              <input 
                type="number" 
                placeholder="500"
                className="w-full border p-2 rounded-lg bg-slate-50 outline-indigo-500 font-bold"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="bg-indigo-600 text-white py-2 rounded-lg font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all h-10"
            >
              Add Cost
            </button>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
              <input 
                type="text" 
                placeholder="Brief details about the work"
                className="w-full border p-2 rounded-lg bg-slate-50 outline-indigo-500"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">History of Design Costs</h2>
          <div className="text-sm font-medium text-slate-400">Total: {charges.length} items</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Service Type</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Added By</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {charges.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No charges recorded yet</td>
                </tr>
              ) : (
                charges.slice().reverse().map(charge => (
                  <tr key={charge.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm whitespace-nowrap">{charge.date}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{charge.type}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">
                      {charge.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold">{charge.addedBy}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-900 whitespace-nowrap">
                      Rs. {charge.amount.toLocaleString()}
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

export default DesignCharges;
