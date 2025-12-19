
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Complaint } from '../types';
import { 
  PlusCircle, 
  Search, 
  ArrowUpRight,
  ShieldCheck,
  Package,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Mail,
  User as UserIcon,
  MapPin,
  ClipboardList
} from 'lucide-react';

interface DashboardProps {
  user: User;
  complaints: Complaint[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, complaints }) => {
  return (
    <div className="flex flex-col w-full animate-in fade-in duration-700">
      {/* Hero Section / Banner Mimicry */}
      <section className="relative w-full h-[300px] md:h-[500px] overflow-hidden bg-[#e6ded5]">
        <img 
          src="https://images.unsplash.com/photo-1587560699334-cc4ff634909a?q=80&w=2070&auto=format&fit=crop" 
          alt="Banner" 
          className="w-full h-full object-cover mix-blend-multiply opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-transparent flex items-center px-4 md:px-24">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black text-indiapost-slate tracking-tighter mb-4 uppercase leading-[0.9]">
              Dak <span className="text-indiapost-red">Samvaad</span>
            </h2>
            <p className="text-xl md:text-2xl font-bold text-indiapost-slate mb-8">Official Grievance Redressal Portal</p>
            <div className="flex gap-4">
              <button className="bg-indiapost-red text-white px-8 py-4 rounded-md font-black uppercase text-xs tracking-widest shadow-xl hover:bg-red-700 transition-all">Register Grievance</button>
              <button className="bg-white text-indiapost-slate px-8 py-4 rounded-md font-black uppercase text-xs tracking-widest shadow-xl border border-stone-200">Track Status</button>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-indiapost-red/80 text-white flex items-center justify-center hover:bg-indiapost-red transition-all">
          <ChevronLeft size={24} />
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-indiapost-red/80 text-white flex items-center justify-center hover:bg-indiapost-red transition-all">
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          <div className="carousel-dot active"></div>
          <div className="carousel-dot"></div>
          <div className="carousel-dot"></div>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card: New Grievance */}
          <Link to="/submit" className="group">
            <div className="bg-white p-10 h-full flex flex-col justify-between border-b-4 border-indiapost-red official-shadow hover:-translate-y-1 transition-all">
              <div>
                <div className="w-16 h-16 bg-indiapost-red text-white flex items-center justify-center mb-8 rounded-sm">
                  <PlusCircle size={32} />
                </div>
                <h3 className="text-2xl font-black text-indiapost-slate mb-4 uppercase tracking-tighter">Register Complaint</h3>
                <p className="text-stone-500 text-sm font-medium leading-relaxed">
                  Facing issues with mail delivery, insurance, or post office staff? Register your grievance here for smart AI triage.
                </p>
              </div>
              <div className="mt-12 flex items-center text-indiapost-red font-black text-xs uppercase tracking-widest gap-2">
                Click to Start <ArrowUpRight size={18} />
              </div>
            </div>
          </Link>

          {/* Card: Track Status */}
          <Link to="/track" className="group">
            <div className="bg-white p-10 h-full flex flex-col justify-between border-b-4 border-indiapost-red official-shadow hover:-translate-y-1 transition-all">
              <div>
                <div className="w-16 h-16 bg-indiapost-red text-white flex items-center justify-center mb-8 rounded-sm">
                  <Search size={32} />
                </div>
                <h3 className="text-2xl font-black text-indiapost-slate mb-4 uppercase tracking-tighter">Track Registry</h3>
                <p className="text-stone-500 text-sm font-medium leading-relaxed">
                  Real-time tracking of your grievance resolution status. Enter your docket ID to see the latest updates.
                </p>
              </div>
              <div className="mt-12 flex items-center text-indiapost-red font-black text-xs uppercase tracking-widest gap-2">
                Check Status <ArrowUpRight size={18} />
              </div>
            </div>
          </Link>

          {/* Card: Pincode / Tools */}
          <div className="bg-white p-10 h-full flex flex-col justify-between border-b-4 border-indiapost-red official-shadow group hover:-translate-y-1 transition-all cursor-pointer">
            <div>
              <div className="w-16 h-16 bg-indiapost-slate text-white flex items-center justify-center mb-8 rounded-sm">
                <Navigation size={32} />
              </div>
              <h3 className="text-2xl font-black text-indiapost-slate mb-4 uppercase tracking-tighter">Find Pincode</h3>
              <p className="text-stone-500 text-sm font-medium leading-relaxed">
                Search the national pin code directory to verify delivery zones and regional sorting offices.
              </p>
            </div>
            <div className="mt-12 flex items-center text-stone-900 font-black text-xs uppercase tracking-widest gap-2">
              Launch Directory <ArrowUpRight size={18} />
            </div>
          </div>
        </div>

        {/* Official Services Strip */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { icon: Mail, label: 'Speed Post' },
            { icon: Package, label: 'Logistics Post' },
            { icon: ShieldCheck, label: 'Postal Insurance' },
            { icon: MapPin, label: 'Post Office Guide' },
            { icon: ClipboardList, label: 'Service Alerts' },
            { icon: UserIcon, label: 'My Account' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="w-20 h-20 bg-white rounded-full border border-stone-100 official-shadow flex items-center justify-center text-stone-400 group-hover:text-indiapost-red group-hover:border-indiapost-red transition-all">
                <item.icon size={28} />
              </div>
              <span className="text-[10px] font-black uppercase text-stone-500 tracking-widest text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
