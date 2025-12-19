
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { User, Complaint, ComplaintStatus } from '../types';
import { LangContext } from '../App';
import { 
  PlusCircle, 
  Search, 
  ClipboardList, 
  ChevronRight,
  Mail,
  MapPin,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  user: User;
  complaints: Complaint[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, complaints }) => {
  const { t } = useContext(LangContext);
  const activeCount = complaints.filter(c => c.status !== ComplaintStatus.CLOSED && c.status !== ComplaintStatus.SOLVED).length;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Welcome Section - White Banner background as requested */}
      <section className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white p-12 rounded-[3rem] border border-indiapost-sand/30 dark:border-stone-800 shadow-xl shadow-indiapost-sand/5 flex flex-col md:flex-row items-center justify-between gap-10 transition-all relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4 opacity-70">
            <Sparkles size={16} className="text-indiapost-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-500">{t.smart_redressal}</span>
          </div>
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">
            {t.welcome},<br/>
            <span className="text-indiapost-red">{user.name}</span>
          </h2>
          <p className="font-bold opacity-60 uppercase text-[10px] tracking-widest mt-6 text-stone-400">Member since {new Date().getFullYear()}</p>
        </div>
        
        <div className="relative z-10 bg-indiapost-cream/50 dark:bg-stone-800 px-10 py-8 rounded-[2rem] border border-indiapost-sand/20 text-center shadow-inner flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">{t.active_cases}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-indiapost-red">{activeCount}</span>
            <span className="text-sm font-bold text-stone-400 uppercase">Pending</span>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-indiapost-cream/40 dark:bg-stone-800 rounded-full blur-3xl"></div>
        <Mail className="absolute -bottom-20 -left-10 text-indiapost-red/5 w-80 h-80 rotate-12" />
      </section>

      {/* Action Grid - Enhanced Beige Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { 
            to: "/submit", 
            icon: PlusCircle, 
            title: t.reg, 
            sub: t.reg_sub, 
            color: "text-indiapost-red",
            bg: "bg-indiapost-cream"
          },
          { 
            to: "/track", 
            icon: Search, 
            title: t.track, 
            sub: t.track_sub, 
            color: "text-amber-600",
            bg: "bg-indiapost-cream"
          },
          { 
            to: "/menu", 
            icon: ClipboardList, 
            title: t.hub, 
            sub: t.hub_sub, 
            color: "text-stone-600",
            bg: "bg-indiapost-cream"
          }
        ].map((action, idx) => (
          <Link 
            key={idx}
            to={action.to} 
            className="group p-10 bg-white dark:bg-stone-900 border border-indiapost-sand/40 dark:border-stone-800 rounded-[2.5rem] hover:border-indiapost-red transition-all shadow-sm hover:shadow-2xl hover:-translate-y-1"
          >
            <div className={`${action.bg} dark:bg-stone-800 w-20 h-20 rounded-3xl flex items-center justify-center ${action.color} mb-10 border border-indiapost-sand/20 dark:border-stone-700 group-hover:bg-indiapost-red group-hover:text-white transition-all shadow-inner`}>
              <action.icon size={36} />
            </div>
            <h3 className="text-2xl font-black text-stone-900 dark:text-white mb-4 uppercase tracking-tighter">{action.title}</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 font-medium leading-relaxed mb-10">{action.sub}</p>
            <div className="flex items-center text-stone-900 dark:text-stone-100 group-hover:text-indiapost-red text-[10px] font-black uppercase tracking-[0.2em] gap-2 transition-colors">
              {t.proceed} <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Resources Bar - Soft Sand Palette */}
      <div className="bg-white dark:bg-stone-900 border border-indiapost-sand/40 dark:border-stone-800 rounded-[3.5rem] p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-sm">
        <div className="space-y-6 max-w-xl text-center md:text-left">
          <h4 className="text-3xl font-black text-stone-900 dark:text-white uppercase tracking-tighter leading-none">{t.resources}</h4>
          <p className="text-base text-stone-500 dark:text-stone-400 font-medium leading-relaxed">
            {t.resources_sub}
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
             <span className="px-5 py-2 bg-indiapost-cream/30 dark:bg-stone-800 border border-indiapost-sand rounded-full text-[10px] font-black uppercase tracking-widest text-indiapost-sand">Pincode Lookup</span>
             <span className="px-5 py-2 bg-indiapost-cream/30 dark:bg-stone-800 border border-indiapost-sand rounded-full text-[10px] font-black uppercase tracking-widest text-indiapost-sand">Rate Calculator</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
          <div className="p-8 bg-white dark:bg-stone-800 border border-indiapost-sand/30 rounded-3xl text-center group cursor-pointer hover:border-indiapost-red transition-all hover:shadow-xl hover:-translate-y-1">
            <Mail className="mx-auto mb-4 text-indiapost-red" size={32} />
            <span className="text-[11px] font-black uppercase text-stone-600 dark:text-stone-300 tracking-[0.2em]">{t.speed}</span>
          </div>
          <div className="p-8 bg-white dark:bg-stone-800 border border-indiapost-sand/30 rounded-3xl text-center group cursor-pointer hover:border-indiapost-red transition-all hover:shadow-xl hover:-translate-y-1">
            <MapPin className="mx-auto mb-4 text-indiapost-red" size={32} />
            <span className="text-[11px] font-black uppercase text-stone-600 dark:text-stone-300 tracking-[0.2em]">{t.find}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
