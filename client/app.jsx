import React, { useState } from 'react';
import { Store, Lock, User, LogIn, LogOut, Sun, Moon, Receipt, ShieldCheck } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Kasir');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username dan password harus diisi!');
      return;
    }
    setError('');
    setIsLoggedIn(true);
  };

  const handleDemoLogin = (demoUser, demoRole) => {
    setUsername(demoUser);
    setPassword('password123');
    setRole(demoRole);
    setIsLoggedIn(true);
    setError('');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  if (isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-br from-indigo-50 to-slate-100 text-slate-800'}`}>
        <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border text-center space-y-6 backdrop-blur-xl ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Selamat Datang, {username}!</h1>
            <p className="text-sm opacity-70 mt-1">Sistem Kasir Pintar (POS)</p>
          </div>

          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">Shift Pagi #01</p>
              <p className="text-[11px] opacity-70">Role: {role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-3.5 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sistem (Logout)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 relative overflow-hidden ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-br from-indigo-50 via-slate-50 to-rose-50 text-slate-800'}`}>
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-40px] left-[-40px] w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-40px] right-[-40px] w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Dark Mode Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-2xl shadow-lg border transition-all flex items-center justify-center cursor-pointer ${darkMode ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          title="Ubah Tema"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border backdrop-blur-xl relative z-10 ${darkMode ? 'bg-slate-900/90 border-slate-800 shadow-black/40' : 'bg-white/90 border-slate-200 shadow-indigo-100'}`}>
        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6">
          <Store className="w-8 h-8 text-white" />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tight">KasirKu POS</h1>
          <p className="text-xs opacity-70 mt-1">Silakan masuk untuk memulai shift penjualan</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Username Kasir</label>
            <div className={`flex items-center px-4 rounded-2xl border transition-all ${darkMode ? 'bg-slate-800/50 border-slate-700 focus-within:border-indigo-500' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-500'}`}>
              <User className="w-4 h-4 opacity-50 mr-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: kasir01"
                className="w-full py-3.5 bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Password</label>
            <div className={`flex items-center px-4 rounded-2xl border transition-all ${darkMode ? 'bg-slate-800/50 border-slate-700 focus-within:border-indigo-500' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-500'}`}>
              <Lock className="w-4 h-4 opacity-50 mr-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-3.5 bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-rose-500 text-white font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Kasir</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/30 text-center">
          <p className="text-xs opacity-60 mb-3">Atau uji coba cepat sebagai:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDemoLogin('Kasir Utama', 'Kasir')}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-indigo-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-indigo-700'}`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Demo Kasir</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('Admin Toko', 'Administrator')}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-rose-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-rose-700'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}