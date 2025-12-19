
import React, { useState, useMemo } from 'react';
import { Complaint, ComplaintStatus, TicketUpdate } from '../types';
import { 
  Search, 
  MessageSquare, 
  CheckCircle, 
  MoreVertical, 
  Activity, 
  Smile, 
  Frown, 
  Meh, 
  Send,
  MapPin,
  Tag as TagIcon,
  ShieldCheck,
  Inbox,
  User as UserIcon,
  ChevronDown,
  Paperclip,
  Hash,
  Star,
  Zap,
  RotateCcw,
  Languages,
  Locate,
  Navigation,
  Copy,
  AlertTriangle,
  Building,
  Target,
  BarChart3,
  Users,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface AdminProps {
  complaints: Complaint[];
}

const AdminTickets: React.FC<AdminProps> = ({ complaints: initialComplaints }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(complaints[0]?.id || null);
  const [reply, setReply] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [currentView, setCurrentView] = useState<'all' | 'unassigned' | 'solved' | 'trends'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedTicket = useMemo(() => 
    complaints.find(c => c.id === selectedTicketId) || null, 
    [complaints, selectedTicketId]
  );

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           c.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (currentView === 'unassigned') return !c.assignedAgent;
      if (currentView === 'solved') return c.status === ComplaintStatus.SOLVED;
      return true;
    });
  }, [complaints, currentView, searchQuery]);

  // Analytics helper functions
  const analytics = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === ComplaintStatus.SOLVED).length;
    const urgent = complaints.filter(c => c.analysis?.priority === 'Urgent').length;
    const avgRating = complaints.reduce((acc, c) => acc + (c.feedback?.rating || 0), 0) / 
                      (complaints.filter(c => c.feedback).length || 1);
    
    const categoryStats = complaints.reduce((acc: any, c) => {
      const cat = c.analysis?.category || 'Other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    return { total, resolved, urgent, avgRating, categoryStats };
  }, [complaints]);

  const getSentimentIcon = (sentiment?: string) => {
    switch(sentiment) {
      case 'Angry': return <Frown className="text-red-500" size={16} />;
      case 'Frustrated': return <Frown className="text-orange-500" size={16} />;
      case 'Neutral': return <Meh className="text-slate-400" size={16} />;
      case 'Positive': return <Smile className="text-green-500" size={16} />;
      default: return <Meh className="text-slate-400" size={16} />;
    }
  };

  const handleStatusChange = (status: ComplaintStatus) => {
    if (!selectedTicketId) return;
    setComplaints(prev => prev.map(c => 
      c.id === selectedTicketId ? { ...c, status } : c
    ));
  };

  const handleReply = () => {
    if (!selectedTicketId || !reply.trim()) return;
    const newUpdate: TicketUpdate = {
      timestamp: new Date().toISOString(),
      author: 'Admin Staff',
      message: reply,
      isInternal
    };
    setComplaints(prev => prev.map(c => 
      c.id === selectedTicketId ? { ...c, updates: [...c.updates, newUpdate] } : c
    ));
    setReply('');
  };

  if (currentView === 'trends') {
    return (
      <div className="flex-grow p-8 bg-slate-950 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Department Analytics</h1>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Resolution Protocol Monitoring</p>
            </div>
            <button onClick={() => setCurrentView('all')} className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl text-sm font-black text-white flex items-center gap-2 hover:bg-slate-800 transition shadow-xl">
              <Inbox size={18} /> Back to Triage
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-800">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Total Registry</p>
               <p className="text-4xl font-black text-white tracking-tighter">{analytics.total}</p>
               <div className="mt-6 flex items-center gap-1.5 text-green-500 text-[10px] font-black uppercase">
                 <ArrowUpRight size={14} /> 12.4% Productivity
               </div>
            </div>
            <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-800">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Resolution Rate</p>
               <p className="text-4xl font-black text-green-500 tracking-tighter">{Math.round((analytics.resolved/analytics.total)*100)}%</p>
               <div className="mt-6 w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-green-500 h-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{ width: `${(analytics.resolved/analytics.total)*100}%` }}></div>
               </div>
            </div>
            <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-800">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Critical Triage</p>
               <p className="text-4xl font-black text-red-600 tracking-tighter">{analytics.urgent}</p>
               <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-6 animate-pulse">Action Required</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-800">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Citizen Satisfaction</p>
               <div className="flex items-center gap-3">
                 <p className="text-4xl font-black text-white tracking-tighter">{analytics.avgRating.toFixed(1)}</p>
                 <Star className="text-yellow-400 fill-yellow-400" size={24} />
               </div>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-6">Protocol Rating</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800">
                <h3 className="font-black text-white text-xl mb-8 flex items-center gap-3 uppercase tracking-tighter">
                   <div className="bg-red-600/10 p-2 rounded-xl border border-red-600/20">
                    <BarChart3 size={20} className="text-red-600" />
                   </div>
                   Domain Distribution
                </h3>
                <div className="space-y-6">
                   {Object.entries(analytics.categoryStats).map(([cat, count]: [string, any]) => (
                     <div key={cat}>
                        <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-widest">
                           <span className="text-slate-400">{cat}</span>
                           <span className="text-white">{count} Units</span>
                        </div>
                        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                           <div className="bg-red-600 h-full" style={{ width: `${(count/analytics.total)*100}%` }}></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800">
                <h3 className="font-black text-white text-xl mb-8 flex items-center gap-3 uppercase tracking-tighter">
                   <div className="bg-yellow-400/10 p-2 rounded-xl border border-yellow-400/20">
                    <Users size={20} className="text-yellow-400" />
                   </div>
                   Experience Logs
                </h3>
                <div className="space-y-6">
                   {complaints.filter(c => c.feedback).slice(0, 4).map(c => (
                     <div key={c.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 transition-all hover:border-slate-700">
                        <div className="flex justify-between mb-2">
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">DOCKET #{c.id}</span>
                           <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} className={i < (c.feedback?.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-800'} />
                              ))}
                           </div>
                        </div>
                        <p className="text-sm text-slate-400 italic leading-relaxed">"{c.feedback?.comment}"</p>
                     </div>
                   ))}
                   {complaints.filter(c => c.feedback).length === 0 && (
                     <div className="h-full flex flex-col items-center justify-center text-slate-700 p-10 opacity-50">
                        <Activity size={48} className="mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest">No Feedback Streamed</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex h-[calc(100vh-64px)] overflow-hidden bg-slate-950">
      {/* 1. Side Navigation */}
      <div className="w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="p-6 flex items-center gap-4 border-b border-slate-800 bg-slate-900/50">
          <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-900/20">
             <ShieldCheck size={20} className="text-white" />
          </div>
          <span className="font-black text-white tracking-tighter uppercase text-lg">Staff Unit</span>
        </div>
        
        <nav className="flex-grow py-6 overflow-y-auto custom-scrollbar">
          <p className="px-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Grievance Hub</p>
          <button 
            onClick={() => setCurrentView('all')}
            className={`w-full flex items-center gap-3 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${currentView === 'all' ? 'bg-slate-850 text-white border-l-4 border-red-600 shadow-inner' : 'hover:bg-slate-850/50 text-slate-500'}`}
          >
            <Inbox size={18} /> Master Registry
            <span className="ml-auto bg-slate-800 text-[9px] px-2 py-0.5 rounded-full border border-slate-700">{complaints.length}</span>
          </button>
          <button 
            onClick={() => setCurrentView('unassigned')}
            className={`w-full flex items-center gap-3 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${currentView === 'unassigned' ? 'bg-slate-850 text-white border-l-4 border-red-600 shadow-inner' : 'hover:bg-slate-850/50 text-slate-500'}`}
          >
            <Star size={18} /> New Triage
          </button>
          <button 
            onClick={() => setCurrentView('solved')}
            className={`w-full flex items-center gap-3 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${currentView === 'solved' ? 'bg-slate-850 text-white border-l-4 border-red-600 shadow-inner' : 'hover:bg-slate-850/50 text-slate-500'}`}
          >
            <CheckCircle size={18} /> Resolved
          </button>
          
          <div className="mt-10">
            <p className="px-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Unit Control</p>
            <button 
              onClick={() => setCurrentView('trends')}
              className={`w-full flex items-center gap-3 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${(currentView as string) === 'trends' ? 'bg-slate-850 text-white border-l-4 border-red-600 shadow-inner' : 'hover:bg-slate-850/50 text-slate-500'}`}
            >
              <BarChart3 size={18} /> Analytics Core
            </button>
            <button className="w-full flex items-center gap-3 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-850/50 transition-all">
              <Zap size={18} /> Semantic Search
            </button>
          </div>
        </nav>
        
        <div className="p-6 border-t border-slate-800">
           <div className="bg-slate-850/50 rounded-2xl p-4 border border-slate-800">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Neural Layer Active</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-relaxed font-bold">Multilingual auto-normalization engine is processing live incoming data.</p>
           </div>
        </div>
      </div>

      {/* 2. Ticket List Panel */}
      <div className="w-96 bg-slate-950 border-r border-slate-800 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-950 sticky top-0 z-10">
          <div className="relative group">
            <Search className="absolute left-4 top-3.5 text-slate-600 group-focus-within:text-red-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search registry..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600/50 transition-all placeholder:text-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          {filteredComplaints.length === 0 ? (
            <div className="p-20 text-center text-slate-700 italic text-sm font-bold uppercase tracking-widest opacity-50">Empty Registry</div>
          ) : (
            filteredComplaints.map(c => (
              <button 
                key={c.id}
                onClick={() => setSelectedTicketId(c.id)}
                className={`w-full p-6 border-b border-slate-900 text-left transition-all relative ${selectedTicketId === c.id ? 'bg-slate-900 border-l-4 border-l-red-600 shadow-2xl z-10' : 'hover:bg-slate-900/50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${c.status === ComplaintStatus.OPEN ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : c.status === ComplaintStatus.PENDING ? 'bg-blue-400' : 'bg-green-500'}`}></div>
                     <span className="font-black text-white text-xs tracking-tighter uppercase">#{c.id}</span>
                   </div>
                   <span className="text-[10px] text-slate-600 font-black">{new Date(c.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-400 truncate mb-2">{c.description}</h3>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-[9px] px-2 py-1 rounded-lg font-black uppercase tracking-wider border ${c.analysis?.priority === 'Urgent' ? 'bg-red-600/10 text-red-500 border-red-600/20' : 'bg-slate-800 text-slate-600 border-slate-700'}`}>
                    {c.analysis?.priority}
                  </span>
                  {c.analysis?.isPotentialDuplicate && (
                    <span className="bg-orange-500/10 text-orange-500 text-[9px] px-2 py-1 rounded-lg font-black flex items-center gap-1 border border-orange-500/20">
                      <Copy size={10} /> DUP
                    </span>
                  )}
                  {c.feedback && (
                    <div className="flex ml-auto items-center gap-1">
                       <Star size={12} className="text-yellow-400 fill-yellow-400" />
                       <span className="text-[10px] font-black text-slate-400">{c.feedback.rating}</span>
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* 3. Ticket Detail & Intelligence Dashboard */}
      <div className="flex-grow flex flex-col bg-slate-950">
        {selectedTicket ? (
          <div className="flex flex-col h-full animate-in fade-in duration-500">
            {/* Ticket Header */}
            <header className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-white tracking-tighter uppercase">#{selectedTicket.id}</span>
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-800 hover:bg-slate-800 transition-all">
                      {selectedTicket.status} <ChevronDown size={14} />
                    </button>
                    <div className="absolute hidden group-hover:block top-full left-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 w-40 animate-in fade-in zoom-in duration-200">
                       {Object.values(ComplaintStatus).map(s => (
                         <button key={s} onClick={() => handleStatusChange(s)} className="w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-850 rounded-xl text-slate-400 hover:text-white transition-all">{s}</button>
                       ))}
                    </div>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800 mx-2"></div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-black uppercase tracking-widest">
                  <UserIcon size={16} className="text-slate-700" /> {selectedTicket.userId}
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-2.5 hover:bg-slate-900 rounded-xl text-slate-600 transition-all hover:text-white border border-transparent hover:border-slate-800"><RotateCcw size={20} /></button>
                <button className="p-2.5 hover:bg-slate-900 rounded-xl text-slate-600 transition-all hover:text-white border border-transparent hover:border-slate-800"><MoreVertical size={20} /></button>
              </div>
            </header>

            <div className="flex-grow flex overflow-hidden">
              {/* Conversation Area */}
              <div className="flex-grow flex flex-col overflow-hidden">
                <div className="flex-grow p-8 overflow-y-auto space-y-10 bg-slate-950 custom-scrollbar">
                  
                  {selectedTicket.analysis?.isPotentialDuplicate && (
                    <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-3xl flex items-start gap-5 shadow-2xl">
                       <div className="bg-orange-500/10 p-3 rounded-2xl border border-orange-500/20">
                          <AlertTriangle className="text-orange-500" size={24} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-orange-500 uppercase tracking-widest">Registry Conflict Alert</p>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">Confidence Score: {Math.round((selectedTicket.analysis.duplicateConfidence || 0) * 100)}%. Neural engine indicates this may be a redundant entry. Cross-reference with master registry before assigning resources.</p>
                       </div>
                    </div>
                  )}

                  {selectedTicket.analysis?.translatedText && selectedTicket.analysis?.translatedText !== selectedTicket.description && (
                    <div className="bg-blue-600/5 border border-blue-600/20 p-6 rounded-3xl flex items-start gap-5 shadow-2xl">
                      <div className="bg-blue-600/10 p-3 rounded-2xl border border-blue-600/20">
                        <Languages className="text-blue-500" size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Language Normalization Layer</p>
                        <p className="text-sm text-slate-200 leading-relaxed font-bold italic">"{selectedTicket.analysis.translatedText}"</p>
                        <p className="text-[10px] text-slate-600 mt-3 font-black flex items-center gap-2 uppercase tracking-widest">
                          <Target size={12} /> Regional dialect detected and mapped to system core
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedTicket.updates.map((update, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className={`w-12 h-12 rounded-[1.25rem] flex-shrink-0 flex items-center justify-center font-black text-xs text-white shadow-2xl transition-all group-hover:scale-110 ${update.isInternal ? 'bg-orange-500 shadow-orange-900/20' : 'bg-red-600 shadow-red-900/20'}`}>
                        {update.author.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-black text-white uppercase tracking-widest">{update.author}</span>
                          <span className="text-[10px] text-slate-600 font-bold uppercase">{new Date(update.timestamp).toLocaleTimeString()}</span>
                          {update.isInternal && <span className="text-[9px] bg-orange-500/10 text-orange-500 px-3 py-1 rounded-lg font-black uppercase border border-orange-500/20 shadow-inner">Internal Protocol Note</span>}
                        </div>
                        <div className={`p-6 rounded-[2rem] text-sm leading-relaxed border shadow-xl transition-all ${update.isInternal ? 'bg-slate-900/50 border-orange-500/20 text-slate-300' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                          {update.message}
                          {i === 0 && selectedTicket.imageUrl && (
                             <div className="mt-6 pt-6 border-t border-slate-800">
                                <img src={selectedTicket.imageUrl} alt="evidence" className="max-h-[500px] rounded-3xl shadow-2xl border border-slate-800 object-cover w-full" />
                             </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Response Drafting Area */}
                <div className="p-6 border-t border-slate-800 bg-slate-950">
                  <div className="flex gap-4 mb-4">
                    <button 
                      onClick={() => setIsInternal(false)}
                      className={`text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-2xl transition-all border ${!isInternal ? 'bg-red-600 text-white border-red-500 shadow-xl -translate-y-1' : 'bg-slate-900 text-slate-600 border-slate-800 hover:bg-slate-800 hover:text-slate-400'}`}
                    >
                      Public Transmission
                    </button>
                    <button 
                      onClick={() => setIsInternal(true)}
                      className={`text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-2xl transition-all border ${isInternal ? 'bg-orange-500 text-white border-orange-400 shadow-xl -translate-y-1' : 'bg-slate-900 text-slate-600 border-slate-800 hover:bg-slate-800 hover:text-slate-400'}`}
                    >
                      Staff Protocol
                    </button>
                  </div>
                  <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden focus-within:ring-4 focus-within:ring-red-600/5 focus-within:border-red-600/30 transition-all shadow-2xl">
                    <textarea 
                      className="w-full bg-transparent p-6 text-sm focus:outline-none min-h-[160px] resize-none font-medium placeholder:text-slate-800 text-white"
                      placeholder={isInternal ? "Log internal investigative findings or triage notes..." : "Draft official correspondence to citizen..."}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                    />
                    <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
                      <div className="flex gap-3">
                        <button className="p-2.5 hover:bg-slate-800 rounded-2xl text-slate-600 transition-all hover:text-white border border-slate-800"><Paperclip size={20} /></button>
                        <button 
                          onClick={() => setReply(selectedTicket.analysis?.suggestedResponse || '')}
                          className="flex items-center gap-2 text-[10px] font-black text-red-500 px-5 py-2.5 bg-red-600/5 rounded-2xl hover:bg-red-600/10 transition shadow-inner border border-red-600/20"
                        >
                          <Zap size={16} className="fill-red-500" /> Apply Neural Draft
                        </button>
                      </div>
                      <button 
                        onClick={handleReply}
                        className={`flex items-center gap-3 px-10 py-3 rounded-2xl text-xs font-black shadow-2xl transition transform active:scale-95 uppercase tracking-widest ${isInternal ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-red-600 text-white hover:bg-red-700'}`}
                      >
                        <Send size={18} /> {isInternal ? 'Log Record' : 'Transmit'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intelligence Layer Dashboard (Right Sidebar) */}
              <div className="w-[400px] border-l border-slate-800 bg-slate-900/30 overflow-y-auto p-8 space-y-10 shadow-inner custom-scrollbar">
                
                <section>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-5">SLA Monitoring</p>
                   <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl">
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Triage Window</span>
                         <span className="text-xs font-black text-red-500 flex items-center gap-1.5 uppercase tracking-tighter"><Clock size={14} /> 18h 42m</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                         <div className="bg-red-600 h-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ width: '65%' }}></div>
                      </div>
                   </div>
                </section>

                <section>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-5">Automated Routing</p>
                   <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-xl flex items-start gap-5 transition-all hover:border-slate-700">
                      <div className="bg-red-600/10 p-3 rounded-2xl border border-red-600/20 shadow-inner">
                         <Target size={22} className="text-red-500" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Target Office</p>
                         <p className="text-sm font-black text-white leading-tight uppercase tracking-tighter">{selectedTicket.analysis?.routingOffice || 'Analyzing Vector...'}</p>
                         <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Mapping: PIN {selectedTicket.analysis?.entities?.pin_code || 'TBD'}</p>
                      </div>
                   </div>
                </section>

                <section>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-5">Neural Entities</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900 px-5 py-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between group transition-all hover:bg-slate-850">
                       <div className="flex items-center gap-3">
                          <Navigation size={16} className="text-slate-600 group-hover:text-red-500 transition-colors" />
                          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Tracking #</span>
                       </div>
                       <span className="text-xs font-mono font-black text-red-500 bg-red-600/5 px-3 py-1 rounded-lg border border-red-600/10">{selectedTicket.analysis?.entities?.tracking_number || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-900 px-5 py-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between group transition-all hover:bg-slate-850">
                       <div className="flex items-center gap-3">
                          <Locate size={16} className="text-slate-600 group-hover:text-red-500 transition-colors" />
                          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Pin Index</span>
                       </div>
                       <span className="text-xs font-black text-white">{selectedTicket.analysis?.entities?.pin_code || '---'}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-5">Sentiment Analysis</p>
                  <div className="flex items-center justify-between bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl mb-4">
                    <div className="flex items-center gap-4">
                      {getSentimentIcon(selectedTicket.analysis?.sentiment)}
                      <span className="text-sm font-black text-white uppercase tracking-tighter">{selectedTicket.analysis?.sentiment || 'Analyzing...'}</span>
                    </div>
                  </div>
                  <div className={`p-5 rounded-2xl border font-black text-[10px] text-center uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-[1.02] ${selectedTicket.analysis?.priority === 'Urgent' ? 'bg-red-600 border-red-500 text-white shadow-red-900/30' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                    Priority Vector: {selectedTicket.analysis?.priority || 'NORMAL'}
                  </div>
                </section>

                <section className="bg-gradient-to-br from-red-600 to-red-800 rounded-[2.5rem] p-8 text-white shadow-[0_20px_40px_rgba(220,38,38,0.2)] relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-red-100/70 uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
                      <Zap size={16} className="fill-yellow-400 text-yellow-400" /> Executive Intelligence
                    </p>
                    <p className="text-sm leading-relaxed font-black italic tracking-tight">
                      "{selectedTicket.analysis?.summary || 'NLU engine streaming analysis results...'}"
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-all duration-700 group-hover:scale-125">
                    <ShieldCheck size={120} />
                  </div>
                </section>

                <section>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-5">Semantic Metadata</p>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedTicket.analysis?.tags?.map((tag, i) => (
                      <span key={i} className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-400 px-4 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:border-red-600/50 transition-all cursor-default group">
                        <TagIcon size={12} className="text-red-600 group-hover:scale-110 transition-transform" /> {tag}
                      </span>
                    )) || <span className="text-xs text-slate-700 font-bold uppercase italic tracking-widest">Scanning metadata...</span>}
                  </div>
                </section>
                
                {selectedTicket.feedback && (
                  <section className="bg-yellow-400/5 rounded-[2.5rem] p-8 border border-yellow-400/20 shadow-2xl border-dashed">
                    <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                      <Star size={14} className="fill-yellow-500 text-yellow-500" /> Resolution Review
                    </p>
                    <div className="flex gap-1.5 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className={i < (selectedTicket.feedback?.rating || 0) ? 'text-yellow-400 fill-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-slate-800'} />
                      ))}
                    </div>
                    <p className="text-sm text-yellow-100/70 font-bold leading-relaxed italic tracking-tight">"{selectedTicket.feedback.comment}"</p>
                  </section>
                )}

              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-800 p-20">
             <div className="bg-slate-900/50 p-32 rounded-full mb-12 shadow-inner ring-1 ring-slate-800 animate-in zoom-in duration-700">
                <ShieldCheck size={160} className="text-slate-900" />
             </div>
             <p className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Registry Standby</p>
             <p className="text-xs mt-3 text-slate-700 max-w-sm text-center font-black uppercase tracking-[0.2em]">PostGuard Intelligent Unit Ready for Data Processing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTickets;
