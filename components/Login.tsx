
import React, { useState } from 'react';
import { AUTHORIZED_USERS } from '../constants';

interface LoginProps {
  onLogin: (email: string, password?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const allowedEmails = Object.keys(AUTHORIZED_USERS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail.includes('@gmail.com')) {
      alert("Please enter a valid Gmail address.");
      return;
    }
    onLogin(normalizedEmail, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl mb-4 shadow-lg rotate-3">
            <i className="fas fa-lock text-3xl text-white"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Secure Ledger</h1>
          <p className="text-slate-500 mt-2 font-medium italic">Sanjaya & Ravi Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Gmail</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input 
                type="email" 
                required
                className="w-full border-2 border-slate-100 p-3 pl-12 rounded-xl outline-none focus:border-indigo-500 bg-slate-50 transition-all font-medium"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <i className="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input 
                type="password" 
                required
                className="w-full border-2 border-slate-100 p-3 pl-12 rounded-xl outline-none focus:border-indigo-500 bg-slate-50 transition-all font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-200 mt-2"
          >
            <i className="fas fa-sign-in-alt"></i>
            Login Securely
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Authorized Emails:</p>
          <div className="space-y-2">
            {allowedEmails.map(mail => (
              <button 
                key={mail}
                type="button"
                onClick={() => setEmail(mail)}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs font-mono text-indigo-600 hover:bg-indigo-50 transition-colors flex justify-between items-center group"
              >
                <span>{mail}</span>
                <span className="text-[8px] bg-indigo-100 px-1 rounded">Select</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
