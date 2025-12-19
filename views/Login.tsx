
import React, { useState, useContext } from 'react';
import { User } from '../types';
import { LangContext } from '../App';
import { Smartphone, Lock, User as UserIcon, Mail, Briefcase, ChevronLeft, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t } = useContext(LangContext);
  const [role, setRole] = useState<'user' | 'staff' | null>(null);
  const [step, setStep] = useState<'phone' | 'otp' | 'profile' | 'staff_form'>('phone');
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');

  const swachhBharatLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Swachh_Bharat_Abhiyan_logo.svg/1024px-Swachh_Bharat_Abhiyan_logo.svg.png";
  const digitalIndiaLogo = "https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Digital_India_logo.svg/1024px-Digital_India_logo.svg.png";

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') setStep('profile');
    else alert("Verification failed. Use demo code 123456.");
  };

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: `CIT-${Date.now()}`,
      phone,
      name,
      email,
      role: 'user'
    });
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffId && password) {
      onLogin({
        id: staffId,
        phone: 'N/A',
        name: `Officer ${staffId.split('-')[1] || staffId}`,
        email: `${staffId}@indiapost.gov.in`,
        role: 'agent'
      });
    }
  };

  const BrandingBox = () => (
    <div className="flex flex-col items-center mb-10">
      <div className="flex justify-center gap-10 mb-12">
        <img src={swachhBharatLogo} alt="Swachh Bharat" className="h-10 object-contain opacity-40 grayscale hover:grayscale-0 transition-all hover:opacity-100" />
        <img src={digitalIndiaLogo} alt="Digital India" className="h-8 object-contain opacity-40 grayscale hover:grayscale-0 transition-all hover:opacity-100" />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-black text-indiapost-red uppercase tracking-tighter leading-none mb-1">India Post</h1>
        <p className="text-[10px] font-bold text-indiapost-sand uppercase tracking-[0.5em] mt-2">Government of India</p>
      </div>
    </div>
  );

  if (!role) {
    return (
      <div className="max-w-xl mx-auto mt-6 p-12 bg-white dark:bg-stone-900 border border-indiapost-sand/30 dark:border-stone-800 rounded-[3.5rem] shadow-2xl transition-all animate-in fade-in zoom-in duration-500">
        <BrandingBox />
        
        <div className="my-12 flex items-center gap-4 text-center justify-center">
          <div className="h-px bg-indiapost-sand/30 flex-grow"></div>
          <h2 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] whitespace-nowrap">{t.login_title}</h2>
          <div className="h-px bg-indiapost-sand/30 flex-grow"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => { setRole('user'); setStep('phone'); }}
            className="flex flex-col items-center gap-6 p-10 bg-indiapost-cream/30 dark:bg-stone-800 border-2 border-transparent hover:border-indiapost-red group transition-all rounded-[2.5rem] shadow-sm hover:shadow-xl"
          >
            <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl text-indiapost-red group-hover:bg-indiapost-red group-hover:text-white transition-all shadow-md">
              <UserIcon size={32} />
            </div>
            <div className="text-center">
              <p className="font-black text-stone-900 dark:text-white uppercase text-xs tracking-tight">{t.login_citizen}</p>
              <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-2">Public Portal</p>
            </div>
          </button>

          <button 
            onClick={() => { setRole('staff'); setStep('staff_form'); }}
            className="flex flex-col items-center gap-6 p-10 bg-indiapost-cream/30 dark:bg-stone-800 border-2 border-transparent hover:border-stone-800 group transition-all rounded-[2.5rem] shadow-sm hover:shadow-xl"
          >
            <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl text-stone-600 dark:text-stone-400 group-hover:bg-stone-800 group-hover:text-white transition-all shadow-md">
              <Briefcase size={32} />
            </div>
            <div className="text-center">
              <p className="font-black text-stone-900 dark:text-white uppercase text-xs tracking-tight">{t.login_staff}</p>
              <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-2">Admin Panel</p>
            </div>
          </button>
        </div>

        <div className="mt-16 text-center">
           <div className="flex items-center justify-center gap-2 text-stone-400 mb-2">
             <ShieldCheck size={14} />
             <p className="text-[9px] font-black uppercase tracking-widest">End-to-End Encrypted Portal</p>
           </div>
           <p className="text-[8px] font-bold text-indiapost-sand uppercase tracking-[0.2em] leading-loose max-w-xs mx-auto">
             Official Ministry of Communications Infrastructure for AI-Enhanced Grievance Redressal
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-12 bg-white dark:bg-stone-900 border border-indiapost-sand/30 dark:border-stone-800 rounded-[3rem] shadow-2xl transition-all animate-in slide-in-from-right duration-500">
      <button 
        onClick={() => setRole(null)}
        className="flex items-center gap-3 text-[10px] font-black text-indiapost-sand hover:text-indiapost-red mb-12 uppercase tracking-[0.2em] transition-colors group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t.login_back}
      </button>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-stone-900 dark:text-white uppercase tracking-tighter">
          {role === 'staff' ? t.login_officer : t.login_verify}
        </h2>
        <p className="text-[9px] text-indiapost-sand font-bold uppercase tracking-[0.4em] mt-3">Identity Authentication</p>
      </div>

      {role === 'staff' ? (
        <form onSubmit={handleStaffLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Department ID</label>
            <input
              type="text"
              placeholder="e.g. DPO-5521"
              required
              className="w-full px-6 py-5 bg-indiapost-cream/20 dark:bg-stone-800 text-stone-900 dark:text-white border-2 border-indiapost-sand/20 dark:border-stone-700 rounded-2xl outline-none focus:border-indiapost-red transition-all font-bold placeholder:text-stone-300"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-6 py-5 bg-indiapost-cream/20 dark:bg-stone-800 text-stone-900 dark:text-white border-2 border-indiapost-sand/20 dark:border-stone-700 rounded-2xl outline-none focus:border-indiapost-red transition-all font-bold placeholder:text-stone-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-indiapost-red text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-red-800 transition shadow-xl shadow-indiapost-red/20 active:scale-95">
            {t.login_btn_verify}
          </button>
        </form>
      ) : (
        <>
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">{t.login_phone}</label>
                <div className="relative">
                  <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-indiapost-sand" size={20} />
                  <input
                    type="tel"
                    placeholder="10 digit mobile number"
                    required
                    className="w-full pl-16 pr-6 py-5 bg-indiapost-cream/20 dark:bg-stone-800 text-stone-900 dark:text-white border-2 border-indiapost-sand/20 dark:border-stone-700 rounded-2xl outline-none focus:border-indiapost-red transition-all font-bold"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-indiapost-red text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-red-800 shadow-xl shadow-indiapost-red/20 active:scale-95">
                {t.login_btn_send}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-8">
              <div className="space-y-3 text-center">
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{t.login_otp}</label>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-2 mb-10">Verification Code sent to {phone}</p>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-indiapost-sand" size={20} />
                  <input
                    type="text"
                    placeholder="••••••"
                    required
                    maxLength={6}
                    className="w-full pl-16 pr-6 py-5 bg-indiapost-cream/20 dark:bg-stone-800 text-stone-900 dark:text-white border-2 border-indiapost-sand/20 dark:border-stone-700 rounded-2xl outline-none focus:border-indiapost-red transition-all text-center tracking-[0.6em] font-black text-xl"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-indiapost-red text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-red-800 shadow-xl shadow-indiapost-red/20 active:scale-95">
                {t.login_btn_verify}
              </button>
            </form>
          )}

          {step === 'profile' && (
            <form onSubmit={handleCompleteProfile} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">{t.login_name}</label>
                <div className="relative">
                  <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-indiapost-sand" size={20} />
                  <input
                    type="text"
                    placeholder="Full Legal Name"
                    required
                    className="w-full pl-16 pr-6 py-5 bg-indiapost-cream/20 dark:bg-stone-800 text-stone-900 dark:text-white border-2 border-indiapost-sand/20 dark:border-stone-700 rounded-2xl outline-none focus:border-indiapost-red transition-all font-bold"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">{t.login_email}</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-indiapost-sand" size={20} />
                  <input
                    type="email"
                    placeholder="Email address for updates"
                    required
                    className="w-full pl-16 pr-6 py-5 bg-indiapost-cream/20 dark:bg-stone-800 text-stone-900 dark:text-white border-2 border-indiapost-sand/20 dark:border-stone-700 rounded-2xl outline-none focus:border-indiapost-red transition-all font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-indiapost-red text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-red-800 shadow-xl shadow-indiapost-red/20 active:scale-95">
                {t.login_btn_account}
              </button>
            </form>
          )}
        </>
      )}

      <div className="mt-16 pt-10 border-t border-indiapost-sand/20 text-center">
        <p className="text-[8px] font-black text-indiapost-sand uppercase tracking-[0.4em]">National Grievance Loop • Secure Official Access</p>
      </div>
    </div>
  );
};

export default Login;
