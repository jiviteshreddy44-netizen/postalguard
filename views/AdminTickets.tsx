
import React, { useState, useMemo, useEffect } from 'react';
import { Complaint, ComplaintStatus, TicketUpdate, User } from '../types';
import { polishDraft } from '../services/geminiService';
import { 
  Search, CheckCircle, Clock, ShieldCheck, Zap, Send, Flag, Inbox,
  Square, X, LayoutGrid, BarChart, Timer, AlertTriangle, UserPlus, Layers, Target, Tag,
  Sparkles, ShieldAlert, Cpu, Loader2, TrendingUp, Users, PieChart, Map as MapIcon, Star, ArrowLeft, ChevronRight,
  ShieldQuestion, AlertCircle, Thermometer, Info, FileText, Activity, MessageCircle, AlertOctagon, History,
  UserCheck, MapPin, Package, Gauge, Plus, MoreHorizontal, Settings, Trash2, Mail, Hash, ExternalLink,
  MessageSquare, User as UserAvatar, Bold, Italic, Underline, Link, Paperclip, Smile, Image as ImageIcon, PlayCircle,
  Sticker, FileJson, ListChecks, ShieldCheck as Shield, Bot, Globe, Zap as ZapIcon
} from 'lucide-react';

interface AdminProps {
  complaints: Complaint[];
  user: User;
  onUpdate: (updatedComplaints: Complaint[]) => void;
}

type ViewFilter = 'inbox' | 'unassigned' | 'all' | 'snoozed' | 'closed' | 'trash' | 'spam' | 'dashboard';
type EditorMode = 'public' | 'internal';

const AdminTickets: React.FC<AdminProps> = ({ complaints: initialComplaints, user, onUpdate }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [selectedId, setSelectedId] = useState<string | null>(initialComplaints[0]?.id || null);
  const [currentView, setCurrentView] = useState<ViewFilter>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>('public');

  const selectedTicket = complaints.find(c => c.id === selectedId);

  const stats = useMemo(() => {
    const total = complaints.length;
    const closed = complaints.filter(c => c.status === ComplaintStatus.CLOSED).length;
    const open = total - closed;
    const avgPriority = complaints.reduce((acc, c) => acc + (c.analysis?.priorityScore || 0), 0) / (total || 1);
    const criticalCount = complaints.filter(c => (c.analysis?.priorityScore || 0) > 85).length;
    
    return {
      inbox: open,
      unassigned: complaints.filter(c => !c.assignedAgentId).length,
      all: total,
      closed,
      avgPriority: Math.round(avgPriority),
      criticalCount,
      resolvedRate: total > 0 ? Math.round((closed / total) * 100) : 0
    };
  }, [complaints]);

  const filtered = useMemo(() => {
    return complaints.filter(c => {
      const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           c.userName.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesView = true;
      if (currentView === 'inbox') matchesView = c.status !== ComplaintStatus.CLOSED;
      if (currentView === 'unassigned') matchesView = !c.assignedAgentId;
      if (currentView === 'closed') matchesView = c.status === ComplaintStatus.CLOSED;
      if (currentView === 'dashboard') matchesView = false; // Dashboard handles its own render
      return matchesSearch && matchesView;
    }).sort((a, b) => (b.analysis?.priorityScore || 0) - (a.analysis?.priorityScore || 0));
  }, [complaints, searchQuery, currentView]);

  const handleAction = (status: ComplaintStatus, message: string, isInternal: boolean = false) => {
    if (!selectedId || !message.trim()) return;
    const update: TicketUpdate = {
      timestamp: new Date().toISOString(),
      author: user.name,
      message,
      isInternal,
      type: isInternal ? 'internal_note' : (status === selectedTicket?.status ? 'message' : 'status_change')
    };
    const updated = complaints.map(c => 
      c.id === selectedId ? { 
        ...c, 
        status: isInternal ? c.status : status, 
        updates: [...c.updates, update], 
        lastActivityAt: new Date().toISOString() 
      } : c
    );
    setComplaints(updated);
    onUpdate(updated);
    setReplyText('');
  };

  const handlePolish = async () => {
    if (!replyText.trim()) return;
    setIsPolishing(true);
    try {
      const polished = await polishDraft(replyText);
      if (polished) setReplyText(polished);
    } catch (error) {
      console.error("Polishing failed", error);
    } finally {
      setIsPolishing(false);
    }
  };

  const calculateSLA = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return { hours, critical: hours < 24 };
  };

  const macros = [
    { label: "Status Update", text: "Namaste, we are currently investigating your grievance regarding the tracking number provided. We expect a resolution within 48 hours." },
    { label: "Delivery Delay Apology", text: "We sincerely apologize for the delay in your delivery. Our logistics team at the local branch has been notified to expedite the process." },
    { label: "Resolve Case", text: "Based on our investigation, the issue has been resolved. Please let us know if you require further assistance. Jai Hind." },
    { label: "Internal: Escalate", text: "Requesting higher authority review. Potential SLA breach detected in Hub-Sortation level.", isInternal: true }
  ];

  const CommandCenter = () => (
    <div className="flex-grow overflow-y-auto p-12 bg-[#F4F6F8] dark:bg-slate-950 space-y-10 custom-scrollbar animate-in fade-in duration-500">
       <div className="flex justify-between items-end">
          <div>
             <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">Supervisor Hub</h2>
             <p className="text-[10px] font-black text-indiapost-red uppercase tracking-[0.4em] mt-3">Logistics Intelligence Command</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black uppercase text-slate-500">Live: System Healthy</span>
             </div>
             <button className="bg-black dark:bg-white dark:text-black text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                <FileJson size={16} /> Export Intelligence
             </button>
          </div>
       </div>

       {/* Kpi Grid */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Grievances', val: stats.inbox, sub: 'Needs Attention', color: 'text-slate-900', icon: Inbox },
            { label: 'Resolution Rate', val: `${stats.resolvedRate}%`, sub: 'Weekly Trend', color: 'text-green-600', icon: TrendingUp },
            { label: 'Avg Priority', val: stats.avgPriority, sub: 'Scale 0-100', color: 'text-indiapost-red', icon: Target },
            { label: 'Critical Breaches', val: stats.criticalCount, sub: 'SLA < 12h', color: 'text-amber-600', icon: AlertTriangle },
          ].map((kpi, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
               <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 group-hover:bg-indiapost-red group-hover:text-white transition-all">
                     <kpi.icon size={20} />
                  </div>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
               <h3 className={`text-4xl font-black ${kpi.color} dark:text-white mt-2 leading-none`}>{kpi.val}</h3>
               <p className="text-[9px] font-bold text-slate-300 uppercase mt-2">{kpi.sub}</p>
            </div>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Regional Stress Heatmap */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                   <Globe size={18} className="text-blue-500" /> Regional Hotspots
                </h3>
                <button className="text-[9px] font-black text-blue-600 uppercase">View Map</button>
             </div>
             <div className="space-y-6">
                {[
                  { region: 'Mumbai NSH', count: 142, stress: 88, color: 'bg-red-500' },
                  { region: 'Delhi Air Hub', count: 98, stress: 62, color: 'bg-amber-500' },
                  { region: 'Kolkata Sorting', count: 45, stress: 30, color: 'bg-green-500' },
                  { region: 'Chennai GPO', count: 72, stress: 54, color: 'bg-blue-500' },
                ].map((r, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                        <span className="text-slate-900 dark:text-white">{r.region}</span>
                        <span className="text-slate-400">{r.count} Cases</span>
                     </div>
                     <div className="h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${r.color} transition-all duration-1000`} style={{ width: `${r.stress}%` }} />
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* SLA Health */}
          <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 text-white relative overflow-hidden">
             <Activity className="absolute -right-6 -bottom-6 text-white/5" size={160} />
             <div className="relative z-10">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-3 mb-8">
                   <Timer size={18} className="text-indiapost-red" /> SLA Integrity
                </h3>
                <div className="flex items-center gap-10">
                   <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="364.4" strokeDashoffset={364.4 * (1 - 0.74)} className="text-indiapost-red" />
                      </svg>
                      <span className="absolute text-2xl font-black">74%</span>
                   </div>
                   <div className="space-y-4 flex-grow">
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase">On-Time Resolutions</p>
                         <p className="text-lg font-black text-green-400 uppercase">Above Target</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-3 bg-white/5 rounded-xl">
                            <p className="text-[8px] font-black text-slate-400 uppercase">Avg Response</p>
                            <p className="text-xs font-black">2.4 Hours</p>
                         </div>
                         <div className="p-3 bg-white/5 rounded-xl">
                            <p className="text-[8px] font-black text-slate-400 uppercase">SLA Breaches</p>
                            <p className="text-xs font-black">04 Today</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Real-time Ticker */}
       <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Live AI Intelligence Stream</h3>
          <div className="space-y-4">
             {complaints.slice(0, 3).map((c, i) => (
               <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all cursor-pointer">
                  <div className="bg-red-50 text-indiapost-red p-2 rounded-xl"><ZapIcon size={16} /></div>
                  <div className="flex-grow">
                     <p className="text-[11px] font-black uppercase tracking-tight text-slate-900 dark:text-white">#{c.id} - Potential {c.analysis?.category} Detect</p>
                     <p className="text-[9px] font-bold text-slate-400 mt-1 truncate max-w-lg">Posty AI recommends immediate routing to {c.postOffice} Node.</p>
                  </div>
                  <span className="text-[9px] font-black text-slate-300 uppercase">2m ago</span>
               </div>
             ))}
          </div>
       </div>
    </div>
  );

  return (
    <div className="flex h-screen -m-8 bg-[#F4F6F8] dark:bg-black overflow-hidden font-sans text-slate-800 dark:text-slate-200">
      
      {/* 1. PRIMARY SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 dark:border-slate-900">
           <h2 className="text-xl font-black tracking-tighter flex items-center gap-2">
             <div className="bg-indiapost-red text-white p-1 rounded">
               <Mail size={16} />
             </div>
             GrievanceHQ
           </h2>
        </div>
        
        <div className="flex-grow overflow-y-auto py-4 px-3 space-y-6">
          <div>
             <div className="mt-4 space-y-1">
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-bold transition-all ${currentView === 'dashboard' ? 'bg-slate-100 dark:bg-slate-800 text-indiapost-red' : 'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                >
                  <div className="flex items-center gap-3"><LayoutGrid size={18} /> Dashboard</div>
                </button>
              {[
                { id: 'inbox', label: 'Inbox', icon: Inbox, count: stats.inbox },
                { id: 'unassigned', label: 'Unassigned', icon: UserAvatar, count: stats.unassigned },
                { id: 'all', label: 'All', icon: Layers, count: stats.all },
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setCurrentView(item.id as ViewFilter)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-bold transition-all ${currentView === item.id ? 'bg-slate-100 dark:bg-slate-800 text-indiapost-red' : 'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                >
                  <div className="flex items-center gap-3"><item.icon size={18} /> {item.label}</div>
                  <span className="text-[10px] opacity-60">{item.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
           <button className="p-2 text-slate-400 hover:text-slate-900"><Settings size={18} /></button>
           <div className="w-8 h-8 bg-indiapost-red rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">{user.name.charAt(0)}</div>
        </div>
      </aside>

      {currentView === 'dashboard' ? (
        <CommandCenter />
      ) : (
        <>
          {/* 2. TICKET LIST */}
          <aside className="w-[320px] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-100 dark:border-slate-900 flex items-center gap-3 bg-white dark:bg-slate-950 sticky top-0 z-10">
               <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input 
                    type="text" placeholder="Search by Citizen or ID..." 
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-md text-xs outline-none focus:ring-1 focus:ring-indiapost-red transition-all"
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
               {filtered.map(ticket => {
                 const sla = calculateSLA(ticket.analysis?.slaDeadline || new Date().toISOString());
                 return (
                   <div 
                     key={ticket.id}
                     onClick={() => setSelectedId(ticket.id)}
                     className={`p-4 border-b border-slate-50 dark:border-slate-900 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-900 relative ${selectedId === ticket.id ? 'bg-[#F0F7FF] dark:bg-slate-900 border-l-4 border-l-indiapost-red shadow-inner' : ''}`}
                   >
                      <div className="flex items-start gap-3">
                         <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-center mb-1">
                               <h4 className="text-[11px] font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{ticket.userName}</h4>
                               <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap">
                                  {new Date(ticket.lastActivityAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2">{ticket.description}</p>
                            <div className="flex items-center justify-between">
                               <div className="flex gap-1.5">
                                  {ticket.analysis?.priorityScore && ticket.analysis.priorityScore > 75 && (
                                    <span className="bg-red-100 text-red-600 text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase">URGENT</span>
                                  )}
                                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase ${sla.critical ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                    SLA: {sla.hours}h
                                  </span>
                               </div>
                               <div className="flex items-center gap-1">
                                  {ticket.analysis?.sentiment === 'Angry' && <AlertOctagon size={12} className="text-red-500 animate-pulse" />}
                                  <span className="text-[8px] font-bold text-slate-300">#{ticket.id}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                 );
               })}
            </div>
          </aside>

          {/* 3. MAIN CONVERSATION AREA */}
          <main className="flex-grow flex flex-col min-w-0 bg-white dark:bg-black">
            {selectedTicket ? (
              <>
                <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-950 z-10 shrink-0">
                   <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <h2 className="text-sm font-black uppercase text-slate-900 dark:text-white truncate max-w-md">
                           {selectedTicket.description.slice(0, 50)}...
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{selectedTicket.analysis?.category}</span>
                           <span className="text-[9px] font-black text-blue-500 uppercase flex items-center gap-1"><Shield size={10} /> Case ID: {selectedTicket.id}</span>
                        </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <button onClick={() => handleAction(ComplaintStatus.CLOSED, "System resolution finalized.")} className="px-3 py-1.5 bg-white border border-slate-200 rounded text-[10px] font-black uppercase hover:bg-slate-50 transition-all flex items-center gap-2">
                         <CheckCircle size={14} /> Close Ticket
                      </button>
                      <div className="w-px h-6 bg-slate-100 mx-2" />
                      <button className="p-2 hover:bg-slate-100 rounded text-slate-400"><History size={18} /></button>
                   </div>
                </header>

                <div className="flex-grow overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900 p-8">
                   <div className="max-w-4xl mx-auto space-y-8">
                      {/* AI INSIGHT BANNER */}
                      <div className="bg-gradient-to-r from-red-600 to-indiapost-red p-6 rounded-3xl text-white shadow-xl shadow-red-200/50 dark:shadow-none flex items-center justify-between group overflow-hidden relative">
                        <div className="relative z-10">
                           <div className="flex items-center gap-2 mb-2">
                              <Cpu size={18} className="animate-pulse" />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Principal Intelligence Architect</span>
                           </div>
                           <h3 className="text-xl font-black italic tracking-tighter leading-tight">"{selectedTicket.analysis?.summary}"</h3>
                           <p className="text-xs font-medium text-white/70 mt-3 max-w-xl">{selectedTicket.analysis?.intelligenceBriefing?.riskAssessment} Risk Level Detected. Automated Priority Score: {selectedTicket.analysis?.priorityScore}/100.</p>
                        </div>
                        <Sparkles className="absolute -right-4 -top-4 text-white/10 group-hover:scale-125 transition-transform duration-700" size={160} />
                      </div>

                      {/* THREAD */}
                      <div className="space-y-6">
                        {/* User Message */}
                        <div className="flex gap-4">
                           <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 font-bold shrink-0">
                              {selectedTicket.userName.charAt(0)}
                           </div>
                           <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm max-w-[80%]">
                              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{selectedTicket.description}</p>
                              {selectedTicket.imageUrl && (
                                 <img src={selectedTicket.imageUrl} className="mt-4 rounded-xl border border-slate-100 w-full max-w-sm" alt="attachment" />
                              )}
                           </div>
                        </div>

                        {/* Replies */}
                        {selectedTicket.updates.map((u, i) => (
                          <div key={i} className={`flex gap-4 ${u.isInternal ? 'justify-center w-full' : ''}`}>
                             {u.isInternal ? (
                               <div className="w-full max-w-2xl bg-amber-50 dark:bg-amber-900/10 border border-dashed border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-start gap-3">
                                  <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
                                  <div className="flex-grow">
                                     <div className="flex justify-between items-center mb-1">
                                        <span className="text-[9px] font-black text-amber-700 uppercase">INTERNAL NOTE BY {u.author}</span>
                                        <span className="text-[9px] text-amber-500 font-bold">{new Date(u.timestamp).toLocaleTimeString()}</span>
                                     </div>
                                     <p className="text-xs italic font-medium text-amber-900 dark:text-amber-200">{u.message}</p>
                                  </div>
                               </div>
                             ) : (
                               <>
                                  <div className="w-10 h-10 bg-indiapost-red rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                    {u.author.charAt(0)}
                                  </div>
                                  <div className="bg-[#F0F7FF] dark:bg-slate-800 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm max-w-[80%]">
                                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-medium">{u.message}</p>
                                  </div>
                               </>
                             )}
                          </div>
                        ))}
                      </div>
                   </div>
                </div>

                {/* REPLY EDITOR */}
                <footer className="p-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0">
                   <div className="flex items-center gap-4 mb-4">
                      <button 
                        onClick={() => setEditorMode('public')}
                        className={`text-[10px] font-black uppercase tracking-widest pb-2 transition-all ${editorMode === 'public' ? 'text-indiapost-red border-b-2 border-indiapost-red' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Public Reply
                      </button>
                      <button 
                        onClick={() => setEditorMode('internal')}
                        className={`text-[10px] font-black uppercase tracking-widest pb-2 transition-all ${editorMode === 'internal' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Internal Note
                      </button>
                   </div>

                   <div className="mb-4 flex flex-wrap gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mr-2">Macros:</span>
                      {macros.map((m, idx) => (
                        <button key={idx} onClick={() => { setReplyText(m.text); if(m.isInternal) setEditorMode('internal'); }} className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-[9px] font-bold text-slate-600 hover:border-indiapost-red transition-all">
                          {m.label}
                        </button>
                      ))}
                      <button onClick={() => setReplyText(selectedTicket.analysis?.suggestedResponse || '')} className="px-2.5 py-1.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded text-[9px] font-black text-indiapost-red hover:bg-red-100 transition-all flex items-center gap-1">
                        <ZapIcon size={10} /> AI Macro
                      </button>
                   </div>

                   <div className={`relative rounded-2xl border transition-all ${editorMode === 'internal' ? 'bg-amber-50/30 border-amber-200 focus-within:ring-amber-500' : 'bg-slate-50 border-slate-200 focus-within:ring-indiapost-red'} focus-within:ring-1`}>
                      <textarea 
                        className="w-full p-6 bg-transparent outline-none min-h-[140px] text-sm font-medium"
                        placeholder={editorMode === 'public' ? "Type public message to citizen..." : "Type internal-only staff note..."}
                        value={replyText} onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="flex justify-between items-center p-4 border-t border-inherit">
                         <div className="flex items-center gap-4">
                            <button className="p-1.5 text-slate-400 hover:text-slate-900"><Bold size={14} /></button>
                            <button className="p-1.5 text-slate-400 hover:text-slate-900"><ImageIcon size={14} /></button>
                            <button className="p-1.5 text-slate-400 hover:text-slate-900"><Paperclip size={14} /></button>
                         </div>
                         <div className="flex gap-2">
                            {editorMode === 'public' && (
                              <button onClick={handlePolish} disabled={isPolishing} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight flex items-center gap-2">
                                 {isPolishing ? <Loader2 className="animate-spin" size={12} /> : <Zap size={12} className="text-indiapost-red" />} AI Polish
                              </button>
                            )}
                            <button 
                              onClick={() => handleAction(ComplaintStatus.ACKNOWLEDGED, replyText, editorMode === 'internal')}
                              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all ${editorMode === 'internal' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indiapost-red hover:bg-red-800'}`}
                            >
                              {editorMode === 'public' ? 'Send Reply' : 'Add Note'}
                            </button>
                         </div>
                      </div>
                   </div>
                </footer>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-20 opacity-30">
                 <MessageCircle size={64} className="mb-4" />
                 <h2 className="text-2xl font-black uppercase">Select a Grievance</h2>
              </div>
            )}
          </main>

          {/* 4. INTELLIGENCE PANEL (RIGHT) */}
          <aside className="w-[340px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
            {selectedTicket ? (
              <div className="p-6 space-y-8">
                 {/* CITIZEN PROFILE */}
                 <section>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Citizen DNA</h4>
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xl font-black text-slate-400 uppercase">
                         {selectedTicket.userName.charAt(0)}
                       </div>
                       <div>
                          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase leading-none">{selectedTicket.userName}</h3>
                          <p className="text-[10px] font-bold text-slate-400 mt-2">Verified Citizen • IP-Auth</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                          <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Tier</p>
                          <p className="text-[10px] font-black text-indiapost-red uppercase">{selectedTicket.analysis?.intelligenceBriefing?.citizenProfile?.loyaltyLevel || 'STANDARD'}</p>
                       </div>
                       <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                          <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Sentiment Trend</p>
                          <p className="text-[10px] font-black text-green-600 uppercase">{selectedTicket.analysis?.intelligenceBriefing?.citizenProfile?.historicalSentimentTrend || 'STABLE'}</p>
                       </div>
                    </div>
                 </section>

                 {/* PRIORITY BREAKDOWN (VISUAL) */}
                 <section className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden shadow-xl">
                    <Target className="absolute -bottom-4 -right-4 text-white/5" size={80} />
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                       Priority Breakdown <BarChart size={12} className="text-indiapost-red" />
                    </h4>
                    <div className="space-y-4">
                       {[
                         { label: 'Keyword Severity', val: selectedTicket.analysis?.intelligenceBriefing?.priorityBreakdown?.keywordSeverity || 50, color: 'bg-red-500' },
                         { label: 'Sentiment Impact', val: selectedTicket.analysis?.intelligenceBriefing?.priorityBreakdown?.sentimentImpact || 50, color: 'bg-amber-500' },
                         { label: 'Category Weight', val: selectedTicket.analysis?.intelligenceBriefing?.priorityBreakdown?.categoryWeight || 50, color: 'bg-blue-500' },
                       ].map((item, i) => (
                         <div key={i} className="space-y-1">
                            <div className="flex justify-between text-[8px] font-black uppercase">
                               <span className="text-slate-400">{item.label}</span>
                               <span>{item.val}%</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                               <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.val}%` }} />
                            </div>
                         </div>
                       ))}
                    </div>
                    <p className="text-[8px] italic font-medium text-slate-400 mt-6 leading-relaxed">AI Rationalization: {selectedTicket.analysis?.intelligenceBriefing?.priorityBreakdown?.explanation}</p>
                 </section>

                 {/* INVESTIGATION STRATEGY CHECKLIST */}
                 <section>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
                       <ListChecks size={14} className="text-blue-500" /> Investigation Protocol
                    </h4>
                    <div className="space-y-3">
                       {selectedTicket.analysis?.intelligenceBriefing?.investigationStrategy?.map((step, i) => (
                         <div key={i} className="flex gap-3 group cursor-pointer">
                            <div className="w-5 h-5 rounded-md border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 group-hover:border-indiapost-red transition-all">
                               <CheckCircle size={12} className="text-transparent group-hover:text-indiapost-red" />
                            </div>
                            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-tight pt-0.5">{step}</p>
                         </div>
                       ))}
                    </div>
                 </section>

                 {/* LOGISTICS AUDIT */}
                 <section className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/40">
                    <h4 className="text-[9px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest mb-3 flex items-center gap-2">
                       <Package size={14} /> Logistics Audit
                    </h4>
                    <p className="text-[10px] font-bold text-blue-800 dark:text-blue-200 leading-relaxed italic">
                       {selectedTicket.analysis?.intelligenceBriefing?.logisticsAudit || "No tracking conflicts detected. Proceed with standard branch-level enquiry."}
                    </p>
                 </section>

                 <div className="pt-10 pb-10 opacity-20 text-center">
                    <p className="text-[7px] font-black uppercase tracking-[0.5em]">India Post Neural Architecture v3.1</p>
                 </div>
              </div>
            ) : (
              <div className="p-10 text-center opacity-30 mt-20">
                 <Bot size={48} className="mx-auto mb-4" />
                 <p className="text-xs font-black uppercase">No Strategic Context</p>
              </div>
            )}
          </aside>
        </>
      )}
    </div>
  );
};

export default AdminTickets;
