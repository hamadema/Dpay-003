
import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  balance: number;
}

const Header: React.FC<HeaderProps> = ({ user, balance }) => {
  return (
    <header className="bg-white border-b px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Welcome, {user.name}
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
            <i className="fas fa-circle text-[6px] text-emerald-500 animate-pulse"></i>
            Live System Active
          </p>
        </div>
      </div>
      
      <div className={`px-6 py-2 rounded-2xl border-2 flex items-center gap-4 transition-all duration-500 ${
        balance < 0 ? 'border-rose-100 bg-rose-50 text-rose-600' : 'border-emerald-100 bg-emerald-50 text-emerald-600'
      }`}>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block">Net Balance</span>
          <span className="text-xl font-black">Rs. {balance.toLocaleString()}</span>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${balance < 0 ? 'bg-rose-100' : 'bg-emerald-100'}`}>
           <i className={`fas ${balance < 0 ? 'fa-arrow-down' : 'fa-arrow-up'} text-sm`}></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
