
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
  MapPin
} from 'lucide-react';

interface DashboardProps {
  user: User;
  complaints: Complaint[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, complaints }) => {
  const { t } = useContext(LangContext);
  const activeCount = complaints.filter(c => c.status !== ComplaintStatus.CLOSED && c.status !== ComplaintStatus.SOLVED).length;

  return (
    <div className="max-w-6xl mx-auto py-4 px-4 space-y-12">
      {/* Welcome Section */}
      <section className="bg-indiapost-red text-white p-10 rounded-[2rem] shadow-2xl shadow-red-900/20 flex flex-col md:flex-row items-center justify-between gap-10 transition-all relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tighter uppercase">{t.welcome}, {user.name}</h2>
          <p className="font-bold opacity-80 uppercase text-[11px] tracking-[0.4em] mt-3">{t.smart_redressal}</p>
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-md px-8 py-5 rounded-2xl border border-white/20 text-center shadow-inner">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{t.active_cases}</p>
          <p className="text-4xl font-black">{activeCount}</p>
        </div>
        <Mail className="absolute -bottom-10 -left-10 text-white/5 w-64 h-64" />
      </section>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/submit" className="group p-10 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[2rem] hover:border-indiapost-red transition-all shadow-sm hover:shadow-2xl">
          <div className="bg-stone-50 dark:bg-stone-800 w-16 h-16 rounded-2xl flex items-center justify-center text-indiapost-red mb-8 border border-stone-100 dark:border-stone-700 group-hover:bg-indiapost-red group-hover:text-white transition-all shadow-inner">
            <PlusCircle size={32} />
          </div>
          <h3 className="text-2xl font-black text-stone-900 dark:text-white mb-4 uppercase tracking-tighter">{t.reg}</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-medium leading-relaxed mb-8">{t.reg_sub}</p>
          <div className="flex items-center text-indiapost-red text-[11px] font-black uppercase tracking-widest gap-2">
            {t.proceed} <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </div>
        </Link>

        <Link to="/track" className="group p-10 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[2rem] hover:border-indiapost-red transition-all shadow-sm hover:shadow-2xl">
          <div className="bg-stone-50 dark:bg-stone-800 w-16 h-16 rounded-2xl flex items-center justify-center text-stone-600 mb-8 border border-stone-100 dark:border-stone-700 group-hover:bg-indiapost-red group-hover:text-white transition-all shadow-inner">
            <Search size={32} />
          </div>
          <h3 className="text-2xl font-black text-stone-900 dark:text-white mb-4 uppercase tracking-tighter">{t.track}</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-medium leading-relaxed mb-8">{t.track_sub}</p>
          <div className="flex items-center text-stone-600 group-hover:text-indiapost-red text-[11px] font-black uppercase tracking-widest gap-2">
            {t.open} <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </div>
        </Link>

        <Link to="/menu" className="group p-10 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[2rem] hover:border-indiapost-red transition-all shadow-sm hover:shadow-2xl">
          <div className="bg-stone-50 dark:bg-stone-800 w-16 h-16 rounded-2xl flex items-center justify-center text-stone-600 mb-8 border border-stone-100 dark:border-stone-700 group-hover:bg-indiapost-red group-hover:text-white transition-all shadow-inner">
            <ClipboardList size={32} />
          </div>
          <h3 className="text-2xl font-black text-stone-900 dark:text-white mb-4 uppercase tracking-tighter">{t.hub}</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-medium leading-relaxed mb-8">{t.hub_sub}</p>
          <div className="flex items-center text-stone-600 group-hover:text-indiapost-red text-[11px] font-black uppercase tracking-widest gap-2">
            {t.view} <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Resources Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 shadow-xl shadow-stone-200/20">
        <div className="space-y-4 max-w-xl">
          <h4 className="text-3xl font-black text-stone-900 dark:text-white uppercase tracking-tighter">{t.resources}</h4>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-medium leading-relaxed">
            {t.resources_sub}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
          <div className="p-6 border border-stone-100 dark:border-stone-800 rounded-2xl text-center bg-stone-50 dark:bg-stone-800 group cursor-pointer hover:border-indiapost-red transition-all hover:shadow-lg">
            <Mail className="mx-auto mb-3 text-indiapost-red" size={24} />
            <span className="text-[10px] font-black uppercase text-stone-600 dark:text-stone-300 tracking-widest">{t.speed}</span>
          </div>
          <div className="p-6 border border-stone-100 dark:border-stone-800 rounded-2xl text-center bg-stone-50 dark:bg-stone-800 group cursor-pointer hover:border-indiapost-red transition-all hover:shadow-lg">
            <MapPin className="mx-auto mb-3 text-indiapost-red" size={24} />
            <span className="text-[10px] font-black uppercase text-stone-600 dark:text-stone-300 tracking-widest">{t.find}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
