
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Complaint, ComplaintStatus } from '../types';
import { LangContext } from '../App';
import { ArrowLeft, ChevronRight, Calendar, MapPin, Tag, Info, History } from 'lucide-react';

interface MenuProps {
  complaints: Complaint[];
}

const ComplaintMenu: React.FC<MenuProps> = ({ complaints }) => {
  const navigate = useNavigate();
  const { t } = useContext(LangContext);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-700">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-indiapost-sand hover:text-indiapost-red mb-12 transition-colors font-black text-[10px] uppercase tracking-[0.3em]">
        <ArrowLeft size={16} /> {t.nav_home}
      </button>

      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-black text-stone-900 dark:text-white tracking-tighter uppercase leading-none">{t.records_title}</h1>
          <p className="text-indiapost-sand font-bold text-[10px] uppercase tracking-[0.4em] mt-3">Verified Citizen Records</p>
        </div>
        <div className="bg-white dark:bg-stone-900 border-2 border-indiapost-sand/20 dark:border-stone-800 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-4">
          <History size={16} className="text-indiapost-red" />
          <span>{t.records_total}: <span className="text-indiapost-red text-lg ml-1">{complaints.length}</span></span>
        </div>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 p-24 text-center rounded-[3rem] border border-indiapost-sand/30 dark:border-stone-800 shadow-xl">
          <div className="w-24 h-24 bg-indiapost-beige dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-indiapost-sand/10">
            <Info size={40} className="text-indiapost-sand" />
          </div>
          <h3 className="text-2xl font-black text-stone-900 dark:text-white uppercase tracking-tight mb-2">{t.records_empty}</h3>
          <p className="text-sm text-stone-400 mb-12 font-bold uppercase tracking-widest">{t.records_empty_sub}</p>
          <button onClick={() => navigate('/submit')} className="bg-indiapost-red text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-red-800 transition shadow-2xl shadow-indiapost-red/20">{t.nav_submit}</button>
        </div>
      ) : (
        <div className="grid gap-8">
          {complaints.map((c) => (
            <div key={c.id} className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-indiapost-sand/20 dark:border-stone-800 hover:border-indiapost-red transition-all shadow-sm hover:shadow-xl group">
              <div className="p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="text-2xl font-black text-stone-900 dark:text-white uppercase tracking-tighter">#{c.id}</span>
                    <span className={`px-5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${
                      c.status === ComplaintStatus.OPEN 
                        ? 'bg-amber-500/5 text-amber-600 border-amber-500/10' 
                        : 'bg-green-500/5 text-green-600 border-green-500/10'
                    }`}>
                      {c.status}
                    </span>
                    {c.analysis?.priority === 'Urgent' && (
                      <span className="bg-indiapost-red/5 text-indiapost-red px-5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-indiapost-red/10 animate-pulse">Critical Priority</span>
                    )}
                  </div>
                  <p className="text-base font-medium text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed mb-8 italic">"{c.description}"</p>
                  <div className="flex flex-wrap items-center gap-10 text-[10px] font-black uppercase text-indiapost-sand tracking-[0.2em]">
                    <div className="flex items-center gap-3"><Calendar size={16} className="text-indiapost-red/40" /> {new Date(c.date).toLocaleDateString()}</div>
                    <div className="flex items-center gap-3"><MapPin size={16} className="text-indiapost-red/40" /> {c.postOffice}</div>
                    <div className="flex items-center gap-3"><Tag size={16} className="text-indiapost-red/40" /> {c.analysis?.category || 'General'}</div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/track')}
                  className="bg-indiapost-beige dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-black px-10 py-4 rounded-2xl border-2 border-indiapost-sand/20 dark:border-stone-700 group-hover:bg-indiapost-red group-hover:text-white group-hover:border-indiapost-red transition-all text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-sm"
                >
                  {t.records_locate} <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintMenu;
