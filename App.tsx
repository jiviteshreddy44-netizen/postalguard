
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  User as UserIcon, 
  LogOut,
  Mail,
  Bell,
  Globe,
  Search,
  ChevronDown,
  Accessibility,
  Menu
} from 'lucide-react';

import { User, Complaint } from './types';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import SubmitComplaint from './views/SubmitComplaint';
import TrackStatus from './views/TrackStatus';
import ComplaintMenu from './views/ComplaintMenu';
import AdminTickets from './views/AdminTickets';
import ChatAssistant from './views/ChatAssistant';

const OfficialHeader = ({ user, onLogout }: { user: User | null, onLogout: () => void }) => {
  return (
    <header className="w-full flex flex-col bg-white border-b border-indiapost-red/20">
      {/* Top Bar */}
      <div className="bg-white border-b border-stone-100 py-1.5 px-4 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] md:text-[11px] font-bold text-stone-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="GOI" className="h-4 object-contain" />
              <span>भारत सरकार | GOVERNMENT OF INDIA</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-indiapost-red flex items-center gap-1"><Accessibility size={12} /> Screen Reader Access</button>
            <div className="h-3 w-px bg-stone-200"></div>
            <button className="hover:text-indiapost-red font-bold">अ</button>
            <button className="hover:text-indiapost-red font-bold">A</button>
            <div className="h-3 w-px bg-stone-200"></div>
            <button className="hover:text-indiapost-red uppercase">English</button>
            <button className="hover:text-indiapost-red">हिन्दी</button>
            <div className="h-3 w-px bg-stone-200"></div>
            <UserIcon size={14} className="text-stone-400" />
          </div>
        </div>
      </div>

      {/* Brand Header */}
      <div className="py-6 px-4 md:px-12 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-8">
        <div className="flex items-center gap-6 flex-shrink-0">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="GOI Emblem" className="h-14" />
          <div className="h-16 w-px bg-stone-200"></div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c4/India_Post_Logo.svg" alt="India Post" className="h-14" />
          <div className="flex flex-col">
            <h1 className="text-lg font-extrabold text-[#741115] leading-none uppercase tracking-tight">Department of Posts</h1>
            <h2 className="text-2xl font-black text-indiapost-slate tracking-tight">Government of India</h2>
            <p className="text-[10px] uppercase font-bold text-stone-400 mt-1">Ministry of Communications</p>
          </div>
        </div>

        <div className="flex-grow flex justify-center">
          <div className="w-full max-w-md relative group">
            <input 
              type="text" 
              placeholder="Namaste! What can I find for you?"
              className="w-full pl-6 pr-12 py-3 bg-white border border-stone-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-indiapost-red/20 focus:border-indiapost-red transition-all text-sm placeholder:italic placeholder:text-stone-400"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 group-hover:text-indiapost-red transition-colors">
              <Search size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 flex-shrink-0">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c4/India_Post_Logo.svg" alt="Swachh Bharat" className="h-12 hidden lg:block grayscale opacity-60" />
          <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Digital_India_logo.svg/1200px-Digital_India_logo.svg.png" alt="Digital India" className="h-12 hidden lg:block" />
          
          {user && (
            <div className="flex items-center gap-4 bg-stone-50 px-4 py-2 rounded-lg border border-stone-100">
              <div className="text-right">
                <p className="text-[10px] font-black text-indiapost-red uppercase tracking-widest">{user.role === 'staff' ? 'Staff Core' : 'Citizen'}</p>
                <p className="text-xs font-black text-stone-800">{user.name}</p>
              </div>
              <button onClick={onLogout} className="text-stone-400 hover:text-indiapost-red transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="bg-white border-y border-stone-100 px-4 md:px-12 official-shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <ul className="flex flex-wrap gap-8 py-3 text-[12px] font-black text-stone-700 uppercase tracking-tight">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><button className="nav-link flex items-center gap-1">Ministry <ChevronDown size={14} /></button></li>
            <li><button className="nav-link flex items-center gap-1">Online Services <ChevronDown size={14} /></button></li>
            <li><button className="nav-link flex items-center gap-1">Offerings <ChevronDown size={14} /></button></li>
            <li><button className="nav-link flex items-center gap-1">Documents <ChevronDown size={14} /></button></li>
            <li><button className="nav-link flex items-center gap-1">Media <ChevronDown size={14} /></button></li>
            <li><button className="nav-link flex items-center gap-1">Connect <ChevronDown size={14} /></button></li>
          </ul>
          <button className="p-2 md:hidden text-stone-700"><Menu size={20} /></button>
        </div>
      </nav>
    </header>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedComplaints = localStorage.getItem('complaints');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedComplaints) setComplaints(JSON.parse(savedComplaints));
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addComplaint = (newComplaint: Complaint) => {
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white selection:bg-indiapost-red/10">
        <OfficialHeader user={user} onLogout={handleLogout} />

        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            
            <Route path="/" element={
              user ? (
                user.role === 'staff' ? <AdminTickets complaints={complaints} /> : <Dashboard user={user} complaints={complaints} />
              ) : <Navigate to="/login" />
            } />

            <Route path="/submit" element={
              user ? <SubmitComplaint user={user} onSubmit={addComplaint} existingComplaints={complaints} /> : <Navigate to="/login" />
            } />

            <Route path="/track" element={
              user ? <TrackStatus complaints={complaints} /> : <Navigate to="/login" />
            } />

            <Route path="/menu" element={
              user ? <ComplaintMenu complaints={complaints} /> : <Navigate to="/login" />
            } />
          </Routes>
        </main>

        {user && user.role === 'user' && <ChatAssistant />}

        {/* Footer */}
        <footer className="bg-white border-t border-stone-200 mt-20">
          <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c4/India_Post_Logo.svg" alt="India Post" className="h-12 mb-6 grayscale opacity-40" />
              <p className="text-[11px] text-stone-500 leading-relaxed font-medium">The Department of Posts (DoP) is a government-operated postal system in India. It is generally called "the Post Office" within India.</p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-6">Quick Links</h4>
              <ul className="text-xs text-stone-600 space-y-3 font-bold uppercase tracking-tight">
                <li><a href="#" className="hover:text-indiapost-red">Citizen's Charter</a></li>
                <li><a href="#" className="hover:text-indiapost-red">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indiapost-red">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-indiapost-red">RTI Information</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-6">Support</h4>
              <ul className="text-xs text-stone-600 space-y-3 font-bold uppercase tracking-tight">
                <li><a href="#" className="hover:text-indiapost-red">Find Pincode</a></li>
                <li><a href="#" className="hover:text-indiapost-red">Locate Post Office</a></li>
                <li><a href="#" className="hover:text-indiapost-red">Service Alerts</a></li>
                <li><a href="#" className="hover:text-indiapost-red">Contact Helpdesk</a></li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-2">Socials</h4>
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-indiapost-red cursor-pointer"><Globe size={16} /></div>
                 <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-indiapost-red cursor-pointer"><Mail size={16} /></div>
                 <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-indiapost-red cursor-pointer"><Bell size={16} /></div>
              </div>
            </div>
          </div>
          <div className="bg-stone-50 py-6 border-t border-stone-100 text-center">
             <p className="text-[10px] text-stone-400 uppercase font-black tracking-[0.2em]">© 2024 Department of Posts, Govt of India. Powered by PostGuard AI.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
