
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Complaint, ComplaintStatus } from '../types';
import { LangContext } from '../App';
import { ArrowLeft, ChevronRight, Calendar, MapPin, Tag, Info } from 'lucide-react';

interface MenuProps {
  complaints: Complaint[];
}

const ComplaintMenu: React.FC<MenuProps> = ({ complaints }) => {
  const navigate = useNavigate();
  const { t } = useContext(LangContext);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-stone-500 hover:text-indiapost-red mb-10 transition-colors font-black text-[10px] uppercase tracking-widest">
        <ArrowLeft size={14} /> {t.nav_home}
      </button>

      <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-stone-900 dark:text-white tracking-tighter uppercase">{t.records_title}</h1>
          <p className="text-stone-500 dark:text-stone-400 font-bold text-xs uppercase tracking-widest mt-1">Official Personal Registry</p>
        </div>
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest shadow-sm">
          {t.records_total}: <span className="text-indiapost-red">{complaints.length}</span>
        </div>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 p-20 text-center rounded border border-stone-200 dark:border-stone-800 shadow-xl">
          <Info size={40} className="mx-auto mb-6 text-stone-200 dark:text-stone-700" />
          <h3 className="text-lg font-black text-stone-900 dark:text-white uppercase tracking-tight">{t.records_empty}</h3>
          <p className="text-xs text-stone-500 mb-8 font-bold">{t.records_empty_sub}</p>
          <button onClick={() => navigate('/submit')} className="bg-indiapost-red text-white px-8 py-3 rounded font-black uppercase text-xs tracking-widest hover:bg-red-700 transition">{t.nav_submit}</button>
        </div>
      ) : (
        <div className="grid gap-6">
          {complaints.map((c) => (
            <div key={c.id} className="bg-white dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-800 hover:border-indiapost-red transition-all shadow-sm group">
              <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="text-xl font-black text-stone-900 dark:text-white uppercase tracking-tighter">#{c.id}</span>
                    <span className={`px-4 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${c.status === ComplaintStatus.OPEN ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20'}`}>
                      {c.status}
                    </span>
                    {c.analysis?.priority === 'Urgent' && (
                      <span className="bg-red-500/10 text-red-600 px-4 py-1 rounded text-[9px] font-black uppercase tracking-widest border border-red-500/20 animate-pulse">Critical Priority</span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed mb-6">{c.description}</p>
                  <div className="flex flex-wrap items-center gap-8 text-[9px] font-black uppercase text-stone-400 tracking-widest">
                    <div className="flex items-center gap-2"><Calendar size={14} className="text-stone-300" /> {new Date(c.date).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-stone-300" /> {c.postOffice}</div>
                    <div className="flex items-center gap-2"><Tag size={14} className="text-stone-300" /> {c.analysis?.category || 'General'}</div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/track')}
                  className="bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-black px-8 py-3 rounded border border-stone-200 dark:border-stone-700 group-hover:bg-indiapost-red group-hover:text-white transition-all text-[10px] uppercase tracking-widest flex items-center gap-2"
                >
                  {t.records_locate} <ChevronRight size={14} />
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
