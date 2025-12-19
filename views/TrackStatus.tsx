
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Complaint, ComplaintStatus } from '../types';
import { LangContext } from '../App';
import { Search, ArrowLeft, CheckCircle, Clock, ShieldCheck, MapPin, Package } from 'lucide-react';

interface TrackProps {
  complaints: Complaint[];
}

const TrackStatus: React.FC<TrackProps> = ({ complaints }) => {
  const navigate = useNavigate();
  const { t } = useContext(LangContext);
  const [searchId, setSearchId] = useState('');
  const [selected, setSelected] = useState<Complaint | null>(complaints[0] || null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = complaints.find(c => c.id.toLowerCase() === searchId.toLowerCase());
    setSelected(found || null);
    if (!found) alert("No record found with that ID.");
  };

  const steps = [
    { key: ComplaintStatus.OPEN, label: t.track_timeline_reported, icon: Clock },
    { key: ComplaintStatus.PENDING, label: t.track_timeline_processing, icon: Clock },
    { key: ComplaintStatus.SOLVED, label: t.track_timeline_resolved, icon: CheckCircle },
    { key: ComplaintStatus.CLOSED, label: t.track_timeline_closed, icon: ShieldCheck },
  ];

  const getStatusIndex = (status: ComplaintStatus) => Object.values(ComplaintStatus).indexOf(status);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-stone-500 hover:text-indiapost-red mb-10 transition-colors font-black text-[10px] uppercase tracking-widest">
        <ArrowLeft size={14} /> {t.nav_home}
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-stone-900 dark:text-white tracking-tighter uppercase">{t.track_title}</h1>
        <p className="text-indiapost-red font-bold uppercase text-[10px] tracking-[0.4em] mt-2">Official Monitoring Protocol</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16 relative">
        <input
          type="text"
          placeholder={t.track_placeholder}
          className="w-full pl-6 pr-40 py-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded shadow-xl outline-none focus:border-indiapost-red transition-all text-lg font-bold"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button type="submit" className="absolute right-2 top-2 bottom-2 bg-indiapost-red text-white px-8 rounded font-black hover:bg-red-700 transition flex items-center gap-3 uppercase text-[10px] tracking-widest">
          <Search size={16} /> {t.track_search}
        </button>
      </form>

      {selected ? (
        <div className="bg-white dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{t.track_ref}</p>
              <h2 className="text-3xl font-black text-stone-900 dark:text-white uppercase tracking-tighter">{selected.id}</h2>
            </div>
            <div className="flex gap-4">
               <span className="px-6 py-2 bg-indiapost-red/10 text-indiapost-red border border-indiapost-red/20 rounded text-[10px] font-black uppercase tracking-widest">
                 Live: {selected.status}
               </span>
            </div>
          </div>

          <div className="p-10">
            <div className="relative flex justify-between mb-20 px-4">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-stone-100 dark:bg-stone-800 -translate-y-1/2 z-0"></div>
              {steps.map((step, i) => {
                const isActive = getStatusIndex(selected.status) >= i;
                return (
                  <div key={i} className="relative z-10 flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'bg-indiapost-red border-indiapost-red text-white' : 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 text-stone-200 dark:text-stone-700'}`}>
                      <step.icon size={20} />
                    </div>
                    <span className={`absolute -bottom-8 whitespace-nowrap text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-indiapost-red' : 'text-stone-400'}`}>{step.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-8">
                  <div className="p-6 bg-stone-50 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700">
                    <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Package size={14} /> {t.hub}
                    </h3>
                    <p className="text-xl font-black text-stone-900 dark:text-white uppercase tracking-tight">
                       {selected.analysis?.category || 'General Issue'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-stone-100 dark:border-stone-800 rounded">
                       <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">{t.submit_branch}</p>
                       <p className="text-sm font-bold text-stone-800 dark:text-stone-200">{selected.postOffice}</p>
                    </div>
                    <div className="p-4 border border-stone-100 dark:border-stone-800 rounded">
                       <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">{t.submit_date}</p>
                       <p className="text-sm font-bold text-stone-800 dark:text-stone-200">{new Date(selected.date).toLocaleDateString()}</p>
                    </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{t.track_logs}</h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                     {selected.updates.map((update, i) => (
                       <div key={i} className="p-4 bg-stone-50 dark:bg-stone-800 rounded border border-stone-100 dark:border-stone-700">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black text-indiapost-red uppercase tracking-widest">{update.author}</span>
                            <span className="text-[9px] text-stone-400 font-bold">{new Date(update.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-xs font-bold text-stone-700 dark:text-stone-300 leading-relaxed">{update.message}</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      ) : searchId && (
        <div className="text-center p-20 bg-white dark:bg-stone-900 rounded border-2 border-dashed border-stone-200 dark:border-stone-800">
          <p className="text-xs font-black text-stone-400 uppercase tracking-widest">No matching record found</p>
        </div>
      )}
    </div>
  );
};

export default TrackStatus;
