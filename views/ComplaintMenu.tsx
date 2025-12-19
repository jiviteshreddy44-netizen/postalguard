
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Complaint, ComplaintStatus } from '../types';
import { ArrowLeft, ChevronRight, Calendar, MapPin, Tag, Info } from 'lucide-react';

interface MenuProps {
  complaints: Complaint[];
}

const ComplaintMenu: React.FC<MenuProps> = ({ complaints }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-300 mb-8 transition-colors font-bold text-sm">
        <ArrowLeft size={20} /> Dashboard
      </button>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Your Grievances</h1>
          <p className="text-slate-400 mt-1">Full history of reported postal issues.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-6 py-2.5 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-widest shadow-xl">
          Active Records: <span className="text-white">{complaints.length}</span>
        </div>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-slate-900 p-24 text-center rounded-[2.5rem] border border-slate-800 shadow-2xl">
          <div className="bg-slate-850 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-600 shadow-inner">
            <Info size={48} />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">Archive Empty</h3>
          <p className="text-slate-500 mb-10 max-w-sm mx-auto">You haven't registered any grievances with India Post yet.</p>
          <button 
            onClick={() => navigate('/submit')}
            className="bg-red-600 text-white font-black px-12 py-4 rounded-2xl hover:bg-red-700 transition shadow-2xl shadow-red-900/20 active:scale-95 uppercase tracking-widest text-sm"
          >
            File Complaint
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {complaints.map((c) => (
            <div key={c.id} className="bg-slate-900 rounded-[2rem] shadow-xl border border-slate-800 hover:border-slate-700 transition-all group overflow-hidden">
              <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="text-xl font-black text-white tracking-tighter">#{c.id}</span>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${c.status === ComplaintStatus.SOLVED ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                      {c.status.replace(/_/g, ' ')}
                    </span>
                    {c.analysis?.priority === 'Urgent' && (
                      <span className="bg-red-500/10 text-red-500 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 shadow-lg animate-pulse">Critical Priority</span>
                    )}
                  </div>
                  <p className="text-slate-400 mb-6 line-clamp-2 leading-relaxed font-medium">{c.description}</p>
                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-bold">
                    <div className="flex items-center gap-2 group-hover:text-slate-300 transition-colors">
                      <Calendar size={16} className="text-slate-600" /> {new Date(c.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 group-hover:text-slate-300 transition-colors">
                      <MapPin size={16} className="text-slate-600" /> {c.postOffice}
                    </div>
                    <div className="flex items-center gap-2 group-hover:text-slate-300 transition-colors">
                      <Tag size={16} className="text-slate-600" /> {c.analysis?.category || 'General'}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/track')}
                  className="flex items-center justify-center gap-3 bg-slate-850 text-slate-400 font-black px-8 py-4 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs"
                >
                  Locate Ticket <ChevronRight size={18} />
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
