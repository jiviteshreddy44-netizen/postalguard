
import React, { useState } from 'react';
import { User } from '../types';
import { Smartphone, Lock, User as UserIcon, Mail, Mail as MailIcon, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const PostGuardLogoLarge = () => (
  <div className="flex flex-col items-center gap-4">
    <div className="relative animate-float">
      <div className="bg-red-600 p-6 rounded-[2rem] shadow-2xl shadow-red-900/30 transform rotate-6 border-4 border-white/20">
        <MailIcon className="text-white" size={64} />
      </div>
      <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-2xl p-3 border-4 border-white dark:border-slate-900 shadow-xl">
        <ShieldCheck className="text-white" size={24} />
      </div>
    </div>
    <div className="text-center">
      <h1 className="text-4xl font-black tracking-tighter text-stone-900 dark:text-white">Post<span className="text-red-600">Guard</span></h1>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 dark:text-slate-500 mt-2">Department of Posts Core</p>
    </div>
  </div>
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
      setStep('profile');
    } else {
      alert("Demo OTP is 123456");
    }
  };

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      phone,
      name,
      email
    };
    onLogin(newUser);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 bg-beige-50 dark:bg-slate-950">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-3xl overflow-hidden border border-stone-200 dark:border-slate-800 animate-in zoom-in duration-700">
        <div className="bg-stone-50/50 dark:bg-slate-850/50 py-16 text-center border-b border-stone-100 dark:border-slate-800">
          <PostGuardLogoLarge />
        </div>

        <div className="p-12">
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-8">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">Citizen Access</h2>
                <p className="text-stone-500 dark:text-slate-400 text-sm font-medium">Verify your mobile to enter the redressal portal.</p>
              </div>
              <div className="relative group">
                <Smartphone className="absolute left-6 top-5 text-stone-300 dark:text-slate-600 group-focus-within:text-red-600 transition-colors" size={24} />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  required
                  className="w-full pl-16 pr-6 py-5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-2xl text-stone-900 dark:text-white focus:ring-4 focus:ring-red-600/10 focus:border-red-600 outline-none transition-all text-lg font-bold placeholder:text-stone-200 dark:placeholder:text-slate-800"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full bg-red-600 text-white font-black py-5 rounded-2xl hover:bg-red-700 transition shadow-2xl shadow-red-900/30 active:scale-95 text-lg tracking-tight">
                Request Security Code
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-8">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">One-Time Password</h2>
                <p className="text-stone-500 dark:text-slate-400 text-sm font-medium">Authentication required for account security.</p>
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-5 text-stone-300 dark:text-slate-600 group-focus-within:text-red-600 transition-colors" size={24} />
                <input
                  type="text"
                  placeholder="6-digit code (123456)"
                  required
                  maxLength={6}
                  className="w-full pl-16 pr-6 py-5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-2xl text-stone-900 dark:text-white focus:ring-4 focus:ring-red-600/10 focus:border-red-600 outline-none tracking-[0.5em] text-2xl font-black text-center"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full bg-red-600 text-white font-black py-5 rounded-2xl hover:bg-red-700 transition active:scale-95 text-lg shadow-2xl">
                Verify Securely
              </button>
              <button onClick={() => setStep('phone')} className="w-full text-stone-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest py-2 hover:text-red-600">
                Change Identification
              </button>
            </form>
          )}

          {step === 'profile' && (
            <form onSubmit={handleCompleteProfile} className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">Establish Identity</h2>
                <p className="text-stone-500 dark:text-slate-400 text-sm font-medium">Finalize your official resident profile.</p>
              </div>
              <div className="relative">
                <UserIcon className="absolute left-5 top-4 text-stone-400 dark:text-slate-600" size={20} />
                <input
                  type="text"
                  placeholder="Legal Full Name"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-2xl text-stone-900 dark:text-white focus:ring-4 focus:ring-red-600/10 focus:border-red-600 outline-none font-bold"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-5 top-4 text-stone-400 dark:text-slate-600" size={20} />
                <input
                  type="email"
                  placeholder="Email for Digital Receipts"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-2xl text-stone-900 dark:text-white focus:ring-4 focus:ring-red-600/10 focus:border-red-600 outline-none font-bold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-4 text-stone-400 dark:text-slate-600" size={20} />
                <input
                  type="password"
                  placeholder="Account Password"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-2xl text-stone-900 dark:text-white focus:ring-4 focus:ring-red-600/10 focus:border-red-600 outline-none font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full bg-red-600 text-white font-black py-5 rounded-2xl hover:bg-red-700 transition shadow-3xl shadow-red-900/30 active:scale-95 text-lg">
                Activate PostGuard
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
