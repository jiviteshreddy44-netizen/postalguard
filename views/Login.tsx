
import React, { useState } from 'react';
import { User } from '../types';
import { Smartphone, Lock, User as UserIcon, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<'user' | 'staff' | null>(null);
  const [step, setStep] = useState<'phone' | 'otp' | 'profile' | 'staff_form'>('phone');
  
  // User states
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Staff states
  const [staffId, setStaffId] = useState('');
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
    onLogin({
      id: `CIT-${Math.floor(Math.random() * 90000)}`,
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
        name: staffId.toUpperCase(),
        email: `${staffId}@indiapost.gov.in`,
        role: 'staff'
      });
    }
  };

  if (!role) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-stone-50">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-100 p-12 text-center animate-in zoom-in duration-500">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c4/India_Post_Logo.svg" alt="India Post" className="h-24 mx-auto mb-10" />
          <h2 className="text-3xl font-black text-stone-900 tracking-tighter mb-4 uppercase">Identity Selection</h2>
          <p className="text-stone-500 font-bold text-sm uppercase tracking-widest mb-12">Choose your access protocol</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button 
              onClick={() => { setRole('user'); setStep('phone'); }}
              className="group p-10 bg-white border-2 border-stone-100 rounded-3xl hover:border-indiapost-red hover:bg-stone-50 transition-all flex flex-col items-center gap-6"
            >
              <div className="bg-stone-50 p-6 rounded-2xl text-stone-400 group-hover:text-indiapost-red group-hover:bg-red-50 transition-all">
                <UserCheck size={48} />
              </div>
              <div>
                <h3 className="text-xl font-black text-stone-900 uppercase tracking-tighter">I am a Citizen</h3>
                <p className="text-xs text-stone-400 font-bold uppercase mt-2">Personal Grievance Access</p>
              </div>
            </button>

            <button 
              onClick={() => { setRole('staff'); setStep('staff_form'); }}
              className="group p-10 bg-white border-2 border-stone-100 rounded-3xl hover:border-indiapost-red hover:bg-stone-50 transition-all flex flex-col items-center gap-6"
            >
              <div className="bg-stone-50 p-6 rounded-2xl text-stone-400 group-hover:text-indiapost-red group-hover:bg-red-50 transition-all">
                <Briefcase size={48} />
              </div>
              <div>
                <h3 className="text-xl font-black text-stone-900 uppercase tracking-tighter">I am Staff</h3>
                <p className="text-xs text-stone-400 font-bold uppercase mt-2">Departmental Triage Login</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center p-6 bg-stone-50">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-indiapost-red py-12 text-center text-white relative overflow-hidden">
          <button onClick={() => setRole(null)} className="absolute left-6 top-6 text-white/50 hover:text-white transition-colors flex items-center gap-1 font-black text-[10px] uppercase tracking-widest">Back</button>
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c4/India_Post_Logo.svg" alt="Logo" className="h-16 mx-auto mb-4 brightness-0 invert" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">{role === 'staff' ? 'Staff Authentication' : 'Citizen Access'}</h2>
        </div>

        <div className="p-12">
          {role === 'staff' ? (
            <form onSubmit={handleStaffLogin} className="space-y-6">
              <div className="relative group">
                <UserIcon className="absolute left-5 top-4 text-stone-300 group-focus-within:text-indiapost-red transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Employee ID"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-indiapost-red/20 focus:border-indiapost-red font-bold"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-4 text-stone-300 group-focus-within:text-indiapost-red transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="Official Password"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-indiapost-red/20 focus:border-indiapost-red font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full bg-indiapost-red text-white font-black py-4 rounded-xl hover:bg-red-700 transition active:scale-95 shadow-xl uppercase tracking-widest text-sm">
                Unlock Dashboard
              </button>
            </form>
          ) : (
            <>
              {step === 'phone' && (
                <form onSubmit={handleSendOtp} className="space-y-8">
                  <div className="relative group">
                    <Smartphone className="absolute left-6 top-5 text-stone-300 group-focus-within:text-indiapost-red" size={24} />
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      required
                      className="w-full pl-16 pr-6 py-5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-indiapost-red/20 focus:border-indiapost-red outline-none transition-all text-lg font-bold"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="w-full bg-indiapost-red text-white font-black py-5 rounded-xl hover:bg-red-700 transition shadow-xl active:scale-95 text-lg uppercase tracking-tighter">
                    Request OTP
                  </button>
                </form>
              )}

              {step === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-8">
                  <input
                    type="text"
                    placeholder="6-digit code (123456)"
                    required
                    maxLength={6}
                    className="w-full py-5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-indiapost-red/20 focus:border-indiapost-red outline-none tracking-[0.5em] text-2xl font-black text-center"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button type="submit" className="w-full bg-indiapost-red text-white font-black py-5 rounded-xl hover:bg-red-700 transition active:scale-95 text-lg shadow-xl uppercase tracking-tighter">
                    Verify Securely
                  </button>
                </form>
              )}

              {step === 'profile' && (
                <form onSubmit={handleCompleteProfile} className="space-y-6">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-indiapost-red/20 focus:border-indiapost-red font-bold"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-indiapost-red/20 focus:border-indiapost-red font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="w-full bg-indiapost-red text-white font-black py-5 rounded-xl hover:bg-red-700 transition shadow-xl active:scale-95 uppercase tracking-tighter text-lg">
                    Finish Setup
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
