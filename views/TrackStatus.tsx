
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Complaint, ComplaintStatus } from '../types';
import { Search, ArrowLeft, CheckCircle, Clock, ShieldCheck, AlertCircle, MapPin, Tag, FileText as FileIcon, Star, Send, Package, Activity, Inbox, ChevronRight } from 'lucide-react';

interface TrackProps {
  complaints: Complaint[];
}

const TrackStatus: React.FC<TrackProps> = ({ complaints }) => {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(complaints[0] || null);
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = complaints.find(c => c.id.toLowerCase() === searchId.toLowerCase());
    setSelectedComplaint(found || null);
    if (!found) alert("No matching record found in the central registry.");
  };

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    if (selectedComplaint) {
      selectedComplaint.feedback = {
        rating,
        comment,
        timestamp: new Date().toISOString()
      };
    }
    setIsFeedbackSent(true);
  };

  const steps = [
    { key: ComplaintStatus.OPEN, label: 'Logged', icon: FileIcon },
    { key: ComplaintStatus.PENDING, label: 'Reviewing', icon: Clock },
    { key: ComplaintStatus.SOLVED, label: 'Resolved', icon: CheckCircle },
    { key: ComplaintStatus.CLOSED, label: 'Completed', icon: ShieldCheck },
  ];

  const getStatusIndex = (status: ComplaintStatus) => {
    const vals = Object.values(ComplaintStatus);
    return vals.indexOf(status);
  };

  return (
    <div className="p-4 md:p-12 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between mb-12">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-stone-500 dark:text-slate-500 hover:text-red-600 transition-colors font-black text-[10px] uppercase tracking-widest">
          <ArrowLeft size={16} /> Home Portal
        </button>
        <div className="hidden sm:flex items-center gap-2">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/20"></span>
           <span className="text-[10px] text-stone-400 dark:text-slate-500 font-bold uppercase tracking-widest">Central Database Synchronized</span>
        </div>
      </div>

      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 dark:text-white mb-4 tracking-tighter uppercase leading-none">Track <span className="text-red-600 italic">Registry</span></h1>
        <p className="text-stone-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.5em]">India Post Intelligent Tracking Layer</p>
      </div>

      <form onSubmit={handleSearch} className="mb-20">
        <div className="relative group max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Registry ID (e.g. PGC-12345)"
            className="w-full pl-10 pr-48 py-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-stone-200 dark:border-slate-800 shadow-xl outline-none focus:border-red-600 transition-all text-xl font-bold text-stone-900 dark:text-white placeholder:text-stone-200 dark:placeholder:text-slate-800"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-3 bg-red-600 text-white px-12 py-5 rounded-[1.75rem] font-black hover:bg-red-700 transition transform active:scale-95 shadow-lg shadow-red-900/20 flex items-center gap-3 uppercase text-xs tracking-widest">
            <Search size={20} /> Locate
          </button>
        </div>
      </form>

      {selectedComplaint ? (
        <div className="space-y-12">
          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-stone-50 dark:bg-slate-850 p-10 md:p-14 flex flex-col md:flex-row justify-between items-center border-b border-stone-100 dark:border-slate-800 gap-8">
              <div>
                <p className="text-[10px] font-black text-stone-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-2">Docket Reference</p>
                <h2 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-white tracking-tighter">{selectedComplaint.id}</h2>
              </div>
              <div className="flex flex-col items-center md:items-end gap-3">
                <div className="bg-white dark:bg-slate-950 px-8 py-3 rounded-2xl text-[10px] font-black flex items-center gap-3 border border-stone-100 dark:border-slate-800 shadow-xl uppercase tracking-widest text-stone-500 dark:text-slate-300">
                  <Activity size={18} className="text-red-600" />
                  Live Status: {selectedComplaint.status}
                </div>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest px-3">Priority: {selectedComplaint.analysis?.priority || 'Standard'}</p>
              </div>
            </div>

            <div className="p-10 md:p-16">
              <div className="relative flex justify-between mb-24 px-4 md:px-12">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-100 dark:bg-slate-800 -translate-y-1/2 z-0 rounded-full"></div>
                {steps.map((step, i) => {
                  const currentIdx = getStatusIndex(selectedComplaint.status);
                  const isActive = currentIdx >= i;
                  const isCurrent = currentIdx === i;
                  return (
                    <div key={i} className="relative z-10 flex flex-col items-center group">
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.75rem] flex items-center justify-center transition-all duration-700 border-2 ${isActive ? 'bg-red-600 border-red-500 text-white shadow-2xl shadow-red-600/30 scale-110' : 'bg-white dark:bg-slate-900 border-stone-100 dark:border-slate-800 text-stone-300 dark:text-slate-700'} ${isCurrent ? 'ring-8 ring-red-600/5' : ''}`}>
                        <step.icon size={32} className={isActive ? 'animate-in zoom-in duration-500' : ''} />
                      </div>
                      <span className={`absolute -bottom-10 whitespace-nowrap text-[9px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-red-600' : 'text-stone-400 dark:text-slate-600'}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 pt-8">
                <div className="lg:col-span-2 space-y-10">
                  <div className="bg-stone-50 dark:bg-slate-850 p-10 rounded-[2.5rem] border border-stone-100 dark:border-slate-800 shadow-inner">
                    <div className="flex items-center gap-3 text-stone-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-widest mb-6">
                      <Package size={20} className="text-red-600" /> Neural Classifier
                    </div>
                    <p className="text-stone-900 dark:text-white font-black text-3xl tracking-tight leading-tight mb-4 italic">
                      {selectedComplaint.analysis?.category || "Analyzing..."}
                    </p>
                    <p className="text-stone-500 dark:text-slate-400 text-sm leading-relaxed font-medium">Auto-assigned based on incident semantic markers.</p>
                  </div>

                  <div className="space-y-10 px-4">
                    <div className="flex items-start gap-6">
                      <div className="p-4 bg-stone-50 dark:bg-slate-850 rounded-2xl text-stone-400 dark:text-slate-600 border border-stone-100 dark:border-slate-800 shadow-sm"><FileIcon size={24}/></div>
                      <div>
                        <p className="text-[10px] font-black text-stone-400 dark:text-slate-600 uppercase tracking-widest mb-2">Original Filing</p>
                        <p className="text-stone-900 dark:text-slate-300 text-sm leading-relaxed font-semibold">{selectedComplaint.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-10">
                      <div className="flex items-start gap-5">
                        <div className="p-4 bg-stone-50 dark:bg-slate-850 rounded-2xl text-stone-400 dark:text-slate-600 border border-stone-100 dark:border-slate-800 shadow-sm"><MapPin size={24}/></div>
                        <div>
                          <p className="text-[10px] font-black text-stone-400 dark:text-slate-600 uppercase tracking-widest mb-1">Target Branch</p>
                          <p className="text-stone-900 dark:text-slate-300 text-sm font-black truncate">{selectedComplaint.postOffice}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-5">
                        <div className="p-4 bg-stone-50 dark:bg-slate-850 rounded-2xl text-stone-400 dark:text-slate-600 border border-stone-100 dark:border-slate-800 shadow-sm"><Clock size={24}/></div>
                        <div>
                          <p className="text-[10px] font-black text-stone-400 dark:text-slate-600 uppercase tracking-widest mb-1">Entry Timestamp</p>
                          <p className="text-stone-900 dark:text-slate-300 text-sm font-black">{new Date(selectedComplaint.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-3 space-y-10">
                   <div className="flex items-center justify-between px-2">
                     <p className="text-[10px] font-black text-stone-400 dark:text-slate-600 uppercase tracking-widest">Protocol Updates</p>
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-ping opacity-75"></span>
                        <span className="text-[9px] text-stone-500 dark:text-slate-500 font-bold uppercase tracking-widest">Live Feed active</span>
                     </div>
                   </div>
                   <div className="space-y-6 max-h-[600px] overflow-y-auto pr-6 custom-scrollbar">
                      {selectedComplaint.updates.slice().reverse().map((update, idx) => (
                        <div key={idx} className={`p-8 rounded-[2.5rem] border transition-all duration-300 group hover:translate-x-1 ${update.author === 'Admin Staff' ? 'bg-red-500/5 dark:bg-red-500/5 border-red-500/20 shadow-xl' : 'bg-stone-50 dark:bg-slate-850 border-stone-100 dark:border-slate-800'}`}>
                           <div className="flex justify-between items-center mb-6">
                              <div className="flex items-center gap-3">
                                 <div className={`w-1.5 h-6 rounded-full ${update.author === 'Admin Staff' ? 'bg-red-600' : 'bg-stone-300 dark:bg-slate-700'}`}></div>
                                 <span className={`text-[10px] font-black uppercase tracking-widest ${update.author === 'Admin Staff' ? 'text-red-600' : 'text-stone-500 dark:text-slate-400'}`}>
                                    {update.author === 'Admin Staff' ? 'Officer Response' : 'User Entry'}
                                 </span>
                              </div>
                              <span className="text-[9px] text-stone-400 dark:text-slate-600 font-bold uppercase">{new Date(update.timestamp).toLocaleString()}</span>
                           </div>
                           <p className="text-stone-800 dark:text-slate-300 leading-relaxed font-bold italic">"{update.message}"</p>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>

          {(selectedComplaint.status === ComplaintStatus.SOLVED || selectedComplaint.status === ComplaintStatus.CLOSED) && !selectedComplaint.feedback && !isFeedbackSent && (
            <div className="bg-stone-900 dark:bg-slate-900 rounded-[3.5rem] p-12 md:p-20 border border-stone-800 dark:border-slate-800 shadow-3xl animate-in zoom-in duration-700 text-center text-white relative overflow-hidden">
               <div className="max-w-3xl mx-auto relative z-10">
                  <div className="inline-block bg-amber-500 p-5 rounded-[2rem] mb-10 shadow-2xl shadow-amber-500/20 animate-bounce-slow">
                    <Star size={48} className="text-white fill-white" />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase">Rate Your Experience</h3>
                  <p className="text-slate-400 mb-12 font-bold uppercase text-[10px] tracking-[0.4em]">Optimizing the departmental resolution loop</p>
                  
                  <form onSubmit={submitFeedback} className="space-y-12">
                    <div className="flex justify-center gap-6 md:gap-10">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="transition-all transform hover:scale-125 active:scale-90"
                        >
                          <Star 
                            size={64} 
                            className={`transition-all duration-300 ${
                              (hoverRating || rating) >= star ? 'text-amber-500 fill-amber-500 drop-shadow-lg' : 'text-slate-800'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      placeholder="Help us improve. Provide details of your satisfaction..."
                      className="w-full p-8 rounded-[2.5rem] bg-slate-800/50 border border-slate-700 text-white focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none min-h-[160px] transition-all font-bold placeholder:text-slate-600 shadow-inner"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />

                    <button
                      type="submit"
                      disabled={rating === 0}
                      className={`w-full py-6 rounded-[2rem] font-black transition-all transform active:scale-95 flex items-center justify-center gap-4 uppercase tracking-widest text-sm shadow-2xl ${
                        rating === 0 ? 'bg-slate-800 text-slate-600' : 'bg-red-600 text-white hover:bg-red-700 shadow-red-900/40'
                      }`}
                    >
                      <Send size={20} /> Transmit Feedback
                    </button>
                  </form>
               </div>
               <div className="absolute top-0 left-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl -ml-40 -mt-40"></div>
            </div>
          )}

          {isFeedbackSent && (
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-20 text-center border border-green-500/20 shadow-2xl animate-in fade-in duration-500">
               <div className="inline-block bg-green-100 dark:bg-green-500/10 p-6 rounded-full mb-8 border border-green-200 dark:border-green-500/30">
                  <CheckCircle size={56} className="text-green-500" />
               </div>
               <h3 className="text-4xl font-black text-stone-900 dark:text-white mb-4 tracking-tighter">Feedback Securely Stored</h3>
               <p className="text-stone-500 dark:text-slate-500 font-bold uppercase text-[10px] tracking-widest">Protocol completed. Thank you for using PostGuard.</p>
            </div>
          )}
        </div>
      ) : searchId && (
        <div className="text-center p-24 bg-white dark:bg-slate-900 rounded-[3.5rem] border-2 border-dashed border-stone-100 dark:border-slate-800 shadow-inner animate-in fade-in duration-300">
          <div className="bg-stone-50 dark:bg-slate-850 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-stone-100 dark:border-slate-800">
             <AlertCircle size={48} className="text-stone-200 dark:text-slate-700" />
          </div>
          <p className="text-xl font-black text-stone-900 dark:text-white tracking-tighter uppercase mb-2">Record Authorization Failed</p>
          <p className="text-stone-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-widest">The ID "{searchId}" was not found in our central registry.</p>
          <button onClick={() => setSearchId('')} className="mt-8 text-red-600 font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-2 mx-auto">
             Retry Search <ChevronRight size={16} />
          </button>
        </div>
      )}
      
      {!selectedComplaint && !searchId && complaints.length > 0 && (
         <div className="mt-20">
            <h4 className="text-[10px] font-black text-stone-400 dark:text-slate-600 uppercase tracking-[0.4em] mb-8 text-center">Recent Records</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {complaints.slice(0, 3).map(c => (
                 <button key={c.id} onClick={() => setSelectedComplaint(c)} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-stone-200 dark:border-slate-800 text-left hover:border-red-600 transition-all group shadow-sm hover:shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-xs font-black text-stone-900 dark:text-white uppercase tracking-tighter">#{c.id}</span>
                       <span className="text-[9px] text-stone-400 font-bold">{new Date(c.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[10px] text-stone-500 dark:text-slate-400 line-clamp-2 font-bold mb-4 uppercase tracking-widest leading-relaxed">"{c.description}"</p>
                    <div className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                       Inspect <ChevronRight size={14} />
                    </div>
                 </button>
               ))}
            </div>
         </div>
      )}
    </div>
  );
};

export default TrackStatus;
