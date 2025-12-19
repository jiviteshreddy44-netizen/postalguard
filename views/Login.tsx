
import React, { useState, useContext } from 'react';
import { User } from '../types';
import { LangContext } from '../App';
import { Smartphone, Lock, User as UserIcon, Mail, Briefcase, ChevronLeft } from 'lucide-react';

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

  const [logoError, setLogoError] = useState(false);
  const logoUrl = "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/India_Post_Logo.svg/1200px-India_Post_Logo.svg.png";
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
        email: `${staffId}@posty.gov.in`,
        role: 'agent'
      });
    }
  };

  const LogoBox = () => (
    <div className="flex flex-col items-center mb-6">
      <div className="flex justify-center gap-4 mb-8 opacity-60">
        <img src={swachhBharatLogo} alt="Swachh Bharat" className="h-10 grayscale hover:grayscale-0 transition-all" />
        <img src={digitalIndiaLogo} alt="Digital India" className="h-10 grayscale hover:grayscale-0 transition-all" />
      </div>
      <div className="h-24 md:h-32 w-24 md:w-32 flex items-center justify-center bg-white dark:bg-stone-800 rounded-full shadow-2xl border border-stone-100 dark:border-stone-700 p-4 overflow-hidden">
        {!logoError ? (
          <img 
            src={logoUrl} 
            alt="Posty Logo" 
            className="h-full w-auto object-contain" 
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="bg-indiapost-red text-white font-black p-4 rounded-full text-2xl flex flex-col items-center justify-center uppercase">
            <span>P</span>
          </div>
        )}
      </div>
      <h1 className="text-3xl font-black text-indiapost-red mt-4 uppercase tracking-tighter">POSTY</h1>
      <p className="text-[11px] font-black text-stone-500 uppercase tracking-widest mt-3 text-center max-w-xs leading-relaxed px-4">
        AI-Based Complaint Analysis & Automated Response System
      </p>
      <div className="h-1.5 w-16 bg-indiapost-red mt-4 rounded-full opacity-30"></div>
    </div>
  );

  if (!role) {
    return (
      <div className="max-w-md mx-auto mt-6 p-10 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl transition-all animate-in fade-in zoom-in duration-300">
        <LogoBox />
        <h2 className="text-xl font-black text-stone-900 dark:text-white uppercase tracking-tighter mb-10 text-center mt-6">{t.login_title}</h2>
        
        <div className="space-y-4">
          <button 
            onClick={() => { setRole('user'); setStep('phone'); }}
            className="w-full flex items-center justify-between p-6 bg-[#fcfcf2] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl hover:border-indiapost-red group transition-all hover:shadow-lg active:scale-[0.98]"
          >
            <div className="flex items-center gap-5">
              <div className="p-3 bg-white dark:bg-stone-900 rounded-xl text-indiapost-red group-hover:bg-indiapost-red group-hover:text-white transition-all shadow-sm">
                <UserIcon size={24} />
              </div>
              <div className="text-left">
                <p className="font-black text-stone-900 dark:text-white uppercase text-xs tracking-tight">{t.login_citizen}</p>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Grievance Hub</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => { setRole('staff'); setStep('staff_form'); }}
            className="w-full flex items-center justify-between p-6 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl hover:border-indiapost-red group transition-all hover:shadow-lg active:scale-[0.98]"
          >
            <div className="flex items-center gap-5">
              <div className="p-3 bg-white dark:bg-stone-900 rounded-xl text-stone-600 dark:text-stone-400 group-hover:bg-stone-900 group-hover:text-white transition-all shadow-sm">
                <Briefcase size={24} />
              </div>
              <div className="text-left">
                <p className="font-black text-stone-900 dark:text-white uppercase text-xs tracking-tight">{t.login_staff}</p>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Management</p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-100 dark:border-stone-800 text-center">
           <p className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.3em] leading-loose">
             Powered by AI Triage <br/> Posty Smart Portal
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-10 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl transition-all animate-in slide-in-from-right duration-300">
      <button 
        onClick={() => setRole(null)}
        className="flex items-center gap-2 text-[10px] font-black text-stone-400 hover:text-indiapost-red mb-10 uppercase tracking-widest transition-colors group"
      >
        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t.login_back}
      </button>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-stone-900 dark:text-white uppercase tracking-tighter">
          {role === 'staff' ? t.login_officer : t.login_verify}
        </h2>
        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.4em] mt-2">Secure Identity Loop</p>
      </div>

      {role === 'staff' ? (
        <form onSubmit={handleStaffLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Employee Reference ID</label>
            <input
              type="text"
              placeholder="e.g. POST-8821"
              required
              className="w-full px-5 py-4 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-indiapost-red transition-all font-bold"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Official Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-5 py-4 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-indiapost-red transition-all font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-indiapost-red text-white py-4.5 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-red-700 transition shadow-xl active:scale-[0.98]">
            {t.login_btn_verify}
          </button>
        </form>
      ) : (
        <>
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{t.login_phone}</label>
                <div className="relative">
                  <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="tel"
                    placeholder="10 digit number"
                    required
                    className="w-full pl-14 pr-5 py-4 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-indiapost-red transition-all font-bold"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-indiapost-red text-white py-4.5 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-red-700 transition shadow-xl active:scale-[0.98]">
                {t.login_btn_send}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2 text-center">
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{t.login_otp}</label>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-2 mb-8">Sent to: {phone}</p>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="text"
                    placeholder="••••••"
                    required
                    maxLength={6}
                    className="w-full pl-14 pr-5 py-4 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-indiapost-red transition-all text-center tracking-[0.5em] font-black"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-indiapost-red text-white py-4.5 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-red-700 shadow-xl active:scale-[0.98]">
                {t.login_btn_verify}
              </button>
              <button onClick={() => setStep('phone')} className="w-full text-[10px] font-black text-stone-400 uppercase hover:text-indiapost-red mt-4 transition-colors">Change Number</button>
            </form>
          )}

          {step === 'profile' && (
            <form onSubmit={handleCompleteProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{t.login_name}</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="text"
                    placeholder="As per legal document"
                    required
                    className="w-full pl-14 pr-5 py-4 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-indiapost-red transition-all font-bold"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{t.login_email}</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="email"
                    placeholder="For tracking updates"
                    required
                    className="w-full pl-14 pr-5 py-4 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-indiapost-red transition-all font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-indiapost-red text-white py-4.5 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-red-700 shadow-xl active:scale-[0.98]">
                {t.login_btn_account}
              </button>
            </form>
          )}
        </>
      )}

      <div className="mt-12 pt-8 border-t border-stone-100 dark:border-stone-800 text-center">
        <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em]">National Grievance Loop • Built on Posty</p>
      </div>
    </div>
  );
};

export default Login;
