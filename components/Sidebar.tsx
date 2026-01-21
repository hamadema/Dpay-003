
import React from 'react';
import { Role } from '../types';

interface SidebarProps {
  role: Role;
  activeTab: string;
  onTabChange: (tab: any) => void;
  onLogout: () => void;
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, onTabChange, onLogout, userName }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'charges', label: 'Design Costs', icon: 'fa-paint-brush' },
    { id: 'payments', label: 'Payments', icon: 'fa-money-bill-wave' },
  ];

  if (role === 'DESIGNER') {
    navItems.push({ id: 'templates', label: 'Price List', icon: 'fa-tags' });
  }

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
          <i className="fas fa-file-invoice text-xl"></i>
        </div>
        <span className="font-bold text-lg tracking-tight">Design Ledger</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-lg mb-4">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs">
            {userName.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-semibold truncate">{userName}</div>
            <div className="text-xs text-slate-500 truncate">{role}</div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <i className="fas fa-sign-out-alt w-5"></i>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
