
import React, { useState, useMemo } from 'react';
import { Complaint, ComplaintStatus, TicketUpdate, User } from '../types';
import { 
  Search, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Zap,
  RotateCcw,
  User as UserIcon,
  Send,
  Lock,
  Flag,
  Inbox,
  CheckSquare,
  Square,
  Activity,
  History,
  X,
  ChevronRight,
  LayoutGrid,
  BarChart,
  MessageCircle,
  AlertCircle,
  Settings,
  Users,
  Briefcase,
  FileText,
  Filter,
  ArrowUpRight,
  MoreVertical,
  HelpCircle,
  Plus,
  TrendingUp,
  PieChart,
  Calendar,
  GanttChart
} from 'lucide-react';

interface AdminProps {
  complaints: Complaint[];
  user: User;
  onUpdate: (updatedComplaints: Complaint[]) => void;
}

type AdminView = 'queue' | 'activity' | 'flagged' | 'citizens' | 'staff' | 'reports' | 'settings';

const AdminTickets: React.FC<AdminProps> = ({ complaints: initialComplaints, user, onUpdate }) => {
  const [activeView, setActiveView] = useState<AdminView>('queue');
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [selectedBulkIds, setSelectedBulkIds] = useState<Set<string>>(new Set());

  const selectedTicket = useMemo(() => 
    complaints.find(c => c.id === selectedId) || null, 
    [complaints, selectedId]
  );

  const filtered = useMemo(() => {
    return complaints.filter(c => {
      const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => (b.analysis?.priorityScore || 0) - (a.analysis?.priorityScore || 0));
  }, [complaints, searchQuery, filterStatus]);

  const toggleBulkId = (id: string) => {
    const next = new Set(selectedBulkIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedBulkIds(next);
  };

  const handleStatusChange = (status: ComplaintStatus) => {
    if (!selectedId) return;
    const newUpdate: TicketUpdate = {
      timestamp: new Date().toISOString(),
      author: user.name,
      message: `Status updated to ${status}.`,
      isInternal: true,
      type: 'status_change'
    };
    const updated = complaints.map(c => 
      c.id === selectedId ? { ...c, status, updates: [...c.updates, newUpdate] } : c
    );
    setComplaints(updated);
    onUpdate(updated);
  };

  const handleReply = () => {
    if (!selectedId || !reply.trim()) return;
    const newUpdate: TicketUpdate = {
      timestamp: new Date().toISOString(),
      author: user.name,
      message: reply,
      isInternal,
      type: 'message'
    };
    const updated = complaints.map(c => 
      c.id === selectedId ? { ...c, updates: [...c.updates, newUpdate] } : c
    );
    setComplaints(updated);
    onUpdate(updated);
    setReply('');
  };

  const getPriorityColor = (score: number) => {
    if (score >= 90) return 'text-red-600 bg-red-50 border-red-100';
    if (score >= 70) return 'text-orange-600 bg-orange-50 border-orange-100';
    if (score >= 40) return 'text-blue-600 bg-blue-50 border-blue-100';
    return 'text-green-600 bg-green-50 border-green-100';
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch(status) {
      case ComplaintStatus.OPEN: return 'text-amber-600 bg-amber-50 border-amber-100';
      case ComplaintStatus.SOLVED: return 'text-green-600 bg-green-50 border-green-100';
      case ComplaintStatus.PENDING: return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-stone-600 bg-stone-50 border-stone-100';
    }
  };

  const renderQueue = () => (
    <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-indiapost-sand/30 dark:border-stone-800 flex flex-col flex-grow shadow-2xl shadow-indiapost-sand/10 overflow-hidden animate-in fade-in duration-700">
      {/* Table Header & Tabs */}
      <div className="p-8 border-b border-indiapost-sand/20 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-indiapost-cream/10">
         <div className="flex items-center gap-10">
           {['all', 'OPEN', 'PENDING', 'SOLVED'].map(s => (
             <button 
               key={s}
               onClick={() => setFilterStatus(s)}
               className={`pb-4 px-2 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                 filterStatus === s ? 'text-indiapost-red' : 'text-stone-400 hover:text-stone-600'
               }`}
             >
               {s} Cases
               {filterStatus === s && <div className="absolute bottom-0 left-0 w-full h-1 bg-indiapost-red rounded-full animate-in fade-in zoom-in duration-300"></div>}
             </button>
           ))}
         </div>

         <div className="flex items-center gap-4">
           <div className="relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indiapost-sand group-focus-within:text-indiapost-red transition-colors" size={16} />
             <input 
               type="text" 
               placeholder="Search records..." 
               className="pl-12 pr-6 py-3 bg-indiapost-cream/30 dark:bg-stone-800 border-2 border-indiapost-sand/20 dark:border-stone-700 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:border-indiapost-red transition-all w-72 shadow-inner"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           <button className="p-3 bg-white dark:bg-stone-800 border-2 border-indiapost-sand/20 rounded-2xl text-indiapost-sand hover:text-indiapost-red hover:border-indiapost-red transition-all shadow-sm">
             <Filter size={18} />
           </button>
         </div>
      </div>

      {/* The Main Table */}
      <div className="flex-grow overflow-y-auto custom-scrollbar relative">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-indiapost-cream/50 dark:bg-stone-800 backdrop-blur-md z-10 border-b border-indiapost-sand/20 dark:border-stone-700">
            <tr className="text-[9px] font-black text-indiapost-sand uppercase tracking-[0.3em]">
              <th className="px-8 py-5 w-10 text-center"><Square size={14} className="mx-auto" /></th>
              <th className="px-8 py-5">Options</th>
              <th className="px-8 py-5">Ref Number</th>
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5">Sender</th>
              <th className="px-8 py-5">Location</th>
              <th className="px-8 py-5">Category</th>
              <th className="px-8 py-5">Priority Score</th>
              <th className="px-8 py-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indiapost-sand/10 dark:divide-stone-800">
            {filtered.map(c => (
              <tr 
                key={c.id} 
                className={`group hover:bg-indiapost-cream/30 dark:hover:bg-blue-900/5 transition-colors cursor-pointer ${selectedId === c.id ? 'bg-indiapost-cream/50 dark:bg-blue-900/10' : ''}`}
                onClick={() => setSelectedId(c.id)}
              >
                <td className="px-8 py-5 text-center">
                  <input type="checkbox" className="accent-indiapost-red w-4 h-4" checked={selectedBulkIds.has(c.id)} onChange={() => toggleBulkId(c.id)} onClick={(e) => e.stopPropagation()} />
                </td>
                <td className="px-8 py-5">
                  <button className="p-2 hover:bg-white dark:hover:bg-stone-700 rounded-xl transition-all text-indiapost-sand"><MoreVertical size={16} /></button>
                </td>
                <td className="px-8 py-5 text-[11px] font-black text-indiapost-red tracking-widest">{c.id}</td>
                <td className="px-8 py-5 text-[10px] font-bold text-stone-400">{new Date(c.date).toLocaleDateString()}</td>
                <td className="px-8 py-5 text-xs font-black text-stone-800 dark:text-stone-200 uppercase tracking-tight">{c.userName}</td>
                <td className="px-8 py-5 text-[10px] font-black text-indiapost-sand uppercase tracking-widest truncate max-w-[120px]">{c.postOffice}</td>
                <td className="px-8 py-5">
                  <span className="text-[10px] font-black text-stone-600 dark:text-stone-400 uppercase tracking-widest">{c.analysis?.category || 'General'}</span>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-5 py-2 rounded-xl text-[11px] font-black tabular-nums border-2 transition-all ${getPriorityColor(c.analysis?.priorityScore || 0)} shadow-sm`}>
                    {c.analysis?.priorityScore || 0}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border-2 ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-48 gap-8 opacity-20">
            <Inbox size={80} className="text-indiapost-sand" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">No matching records found in registry</p>
          </div>
        )}
      </div>

      {/* Footer / Pagination */}
      <div className="p-6 border-t border-indiapost-sand/20 dark:border-stone-800 bg-indiapost-cream/10 dark:bg-stone-800/50 flex justify-between items-center px-12">
         <p className="text-[10px] font-black text-indiapost-sand uppercase tracking-[0.3em]">
           Live Registry View • {filtered.length} Results
         </p>
         <div className="flex gap-3">
           <button className="px-6 py-2 border-2 border-indiapost-sand/20 dark:border-stone-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-indiapost-sand hover:bg-white transition-all">Previous</button>
           <button className="px-6 py-2 bg-indiapost-red text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indiapost-red/20">1</button>
           <button className="px-6 py-2 border-2 border-indiapost-sand/20 dark:border-stone-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-indiapost-sand hover:bg-white transition-all">Next</button>
         </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 overflow-y-auto custom-scrollbar flex-grow p-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: "Total Received", val: complaints.length, trend: "+12%", color: "text-stone-900" },
          { label: "Case Resolved", val: complaints.filter(c => c.status === ComplaintStatus.SOLVED).length, trend: "88% rate", color: "text-green-600" },
          { label: "Avg. Latency", val: "2.4d", trend: "-0.5d", color: "text-blue-600" },
          { label: "Public Score", val: "4.8", trend: "★ ★ ★ ★", color: "text-amber-500" }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-stone-900 p-8 rounded-[2rem] border border-indiapost-sand/30 dark:border-stone-800 shadow-sm shadow-indiapost-sand/10">
            <p className="text-[10px] font-black text-indiapost-sand uppercase tracking-[0.3em] mb-6">{stat.label}</p>
            <p className={`text-4xl font-black ${stat.color}`}>{stat.val}</p>
            <p className="text-[10px] font-bold text-stone-400 mt-4 uppercase tracking-widest">{stat.trend} efficiency</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white dark:bg-stone-900 p-10 rounded-[2.5rem] border border-indiapost-sand/30 dark:border-stone-800 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-10 text-stone-900 dark:text-white flex items-center gap-3">
             <GanttChart size={20} className="text-indiapost-red" /> Performance Distribution
          </h3>
          <div className="space-y-8">
            {[
              { label: 'Lost Parcel', val: 45, color: 'bg-red-500' },
              { label: 'Delivery Delay', val: 30, color: 'bg-amber-500' },
              { label: 'Staff Misconduct', val: 15, color: 'bg-blue-500' },
              { label: 'Other Queries', val: 10, color: 'bg-stone-500' }
            ].map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-stone-500">
                  <span>{item.label}</span>
                  <span>{item.val}% Volume</span>
                </div>
                <div className="h-3 w-full bg-indiapost-cream dark:bg-stone-800 rounded-full overflow-hidden shadow-inner">
                   <div className={`h-full ${item.color} rounded-full transition-all duration-1000 delay-300`} style={{ width: `${item.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-10 rounded-[2.5rem] border border-indiapost-sand/30 dark:border-stone-800 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-10 text-stone-900 dark:text-white flex items-center gap-3">
             <TrendingUp size={20} className="text-indiapost-red" /> Staff Performance
          </h3>
          <div className="divide-y divide-indiapost-sand/10">
            {[
              { name: 'Arjun K.', cases: 142, rate: 98 },
              { name: 'Meera S.', cases: 98, rate: 85 },
              { name: 'Rahul V.', cases: 76, rate: 92 }
            ].map((staff, i) => (
              <div key={i} className="flex items-center justify-between py-6 group">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-indiapost-cream dark:bg-stone-800 border border-indiapost-sand/20 flex items-center justify-center text-xs font-black text-indiapost-red shadow-sm group-hover:bg-indiapost-red group-hover:text-white transition-all">
                     {staff.name.charAt(0)}
                   </div>
                   <div>
                     <span className="text-sm font-black text-stone-800 dark:text-stone-200 uppercase tracking-tight">{staff.name}</span>
                     <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Branch Officer</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[11px] font-black text-stone-900 dark:text-white uppercase tracking-widest">{staff.cases} Solved</p>
                   <p className="text-[10px] font-bold text-green-500 mt-1">{staff.rate}% Efficiency</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-140px)] bg-indiapost-beige dark:bg-stone-950 -m-8 overflow-hidden font-sans transition-colors duration-300">
      
      {/* SIDEBAR - Enhanced Beige Styling */}
      <aside className="w-72 bg-white dark:bg-stone-900 border-r border-indiapost-sand/30 dark:border-stone-800 flex flex-col shrink-0 shadow-xl">
        <div className="p-10 border-b border-indiapost-sand/10 dark:border-stone-800">
           <h2 className="text-[10px] font-black text-indiapost-sand uppercase tracking-[0.5em] leading-none mb-1">Dak-Vahan</h2>
           <p className="text-[8px] font-bold text-stone-300 uppercase tracking-widest">Admin Control Module</p>
        </div>
        
        <nav className="flex-grow py-8 overflow-y-auto custom-scrollbar px-6">
          <div className="mb-12">
            <h3 className="px-4 text-[9px] font-black text-indiapost-red uppercase tracking-[0.3em] mb-6">Central Queue</h3>
            <ul className="space-y-2">
              {[
                { id: 'queue', icon: Inbox, label: 'Active Registry' },
                { id: 'activity', icon: Activity, label: 'Live Stream' },
                { id: 'flagged', icon: Flag, label: 'Escalations' }
              ].map(item => (
                <li 
                  key={item.id}
                  onClick={() => setActiveView(item.id as AdminView)}
                  className={`p-4 rounded-2xl flex items-center gap-4 font-black text-[11px] uppercase tracking-widest cursor-pointer transition-all border-2 ${
                    activeView === item.id 
                      ? 'bg-indiapost-red text-white border-indiapost-red shadow-lg shadow-indiapost-red/20 scale-[1.02]' 
                      : 'text-indiapost-sand border-transparent hover:bg-indiapost-cream/50 dark:hover:bg-stone-800'
                  }`}
                >
                  <item.icon size={18} /> {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-12">
            <h3 className="px-4 text-[9px] font-black text-indiapost-sand uppercase tracking-[0.3em] mb-6">Database</h3>
            <ul className="space-y-2">
              {[
                { id: 'citizens', icon: Users, label: 'Citizen Base' },
                { id: 'staff', icon: Briefcase, label: 'Department' }
              ].map(item => (
                <li 
                  key={item.id}
                  onClick={() => setActiveView(item.id as AdminView)}
                  className={`p-4 rounded-2xl flex items-center gap-4 font-black text-[11px] uppercase tracking-widest cursor-pointer transition-all border-2 ${
                    activeView === item.id 
                      ? 'bg-stone-800 text-white border-stone-800 shadow-lg scale-[1.02]' 
                      : 'text-indiapost-sand border-transparent hover:bg-indiapost-cream/50 dark:hover:bg-stone-800'
                  }`}
                >
                  <item.icon size={18} /> {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="px-4 text-[9px] font-black text-indiapost-sand uppercase tracking-[0.3em] mb-6">Intelligence</h3>
            <ul className="space-y-2">
              {[
                { id: 'reports', icon: BarChart, label: 'Statistics' },
                { id: 'settings', icon: Settings, label: 'Framework' }
              ].map(item => (
                <li 
                  key={item.id}
                  onClick={() => setActiveView(item.id as AdminView)}
                  className={`p-4 rounded-2xl flex items-center gap-4 font-black text-[11px] uppercase tracking-widest cursor-pointer transition-all border-2 ${
                    activeView === item.id 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-[1.02]' 
                      : 'text-indiapost-sand border-transparent hover:bg-indiapost-cream/50 dark:hover:bg-stone-800'
                  }`}
                >
                  <item.icon size={18} /> {item.label}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="p-8 border-t border-indiapost-sand/10 dark:border-stone-800">
           <div className="flex items-center gap-4 bg-indiapost-beige dark:bg-stone-800 p-4 rounded-2xl border border-indiapost-sand/20 shadow-inner">
             <div className="w-10 h-10 rounded-xl bg-indiapost-red flex items-center justify-center text-white font-black text-xs shadow-md shadow-indiapost-red/20">A</div>
             <div className="overflow-hidden">
               <p className="text-[11px] font-black text-stone-900 dark:text-white uppercase truncate">{user.name}</p>
               <p className="text-[8px] font-bold text-indiapost-sand uppercase tracking-widest truncate">Authorized Admin</p>
             </div>
           </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="flex-grow flex flex-col min-w-0">
        
        {/* Header Bar */}
        <header className="bg-white dark:bg-stone-900 h-20 border-b border-indiapost-sand/20 dark:border-stone-800 flex items-center justify-between px-12 shrink-0 shadow-sm">
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-4">
               <span className="text-[10px] font-black text-indiapost-sand uppercase tracking-widest">Posty Platform</span>
               <ChevronRight size={14} className="text-indiapost-sand/40" />
               <span className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-tighter">
                 {activeView === 'queue' ? 'Registry Workspace' : activeView.toUpperCase()}
               </span>
             </div>
           </div>
           
           <div className="flex items-center gap-6">
             <button className="flex items-center gap-3 bg-indiapost-red text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indiapost-red/20 hover:bg-red-800 transition-all hover:-translate-y-0.5 active:translate-y-0">
               <Plus size={18} /> New Ticket
             </button>
             <div className="h-10 w-px bg-indiapost-sand/20"></div>
             <button className="p-3 text-indiapost-sand hover:bg-indiapost-beige rounded-xl transition-all"><Search size={20} /></button>
             <button className="p-3 text-indiapost-sand hover:bg-indiapost-beige rounded-xl transition-all relative">
                <AlertCircle size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-indiapost-red rounded-full animate-ping"></span>
             </button>
           </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-grow p-10 overflow-hidden flex flex-col">
          {activeView === 'queue' && renderQueue()}
          {activeView === 'reports' && renderReports()}
          
          {(activeView === 'activity' || activeView === 'citizens' || activeView === 'settings') && (
            <div className="bg-white dark:bg-stone-900 p-32 rounded-[3.5rem] border border-dashed border-indiapost-sand/30 dark:border-stone-800 flex flex-col items-center justify-center gap-10 opacity-30 shadow-inner">
               <History size={100} className="text-indiapost-sand" />
               <div className="text-center">
                 <p className="text-xl font-black uppercase tracking-[0.4em] mb-3 text-stone-900 dark:text-white">Workspace Loading...</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Syncing with Central Ministry Database</p>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* DETAIL PANE SLIDE-OVER */}
      {selectedTicket && activeView === 'queue' && (
        <aside className="fixed inset-y-0 right-0 w-[550px] bg-white dark:bg-stone-900 border-l border-indiapost-sand/30 dark:border-stone-800 shadow-[-40px_0_80px_rgba(180,180,140,0.15)] z-50 flex flex-col animate-in slide-in-from-right duration-500">
           <header className="p-10 border-b border-indiapost-sand/20 dark:border-stone-800 flex justify-between items-center bg-indiapost-cream/20 dark:bg-stone-800/50">
             <div>
               <h2 className="text-2xl font-black tracking-tighter text-stone-900 dark:text-white uppercase leading-none mb-1">Record Inspector</h2>
               <p className="text-[10px] font-black text-indiapost-red uppercase tracking-[0.4em] mt-3">Ref ID: {selectedTicket.id}</p>
             </div>
             <button onClick={() => setSelectedId(null)} className="p-4 hover:bg-indiapost-beige dark:hover:bg-stone-700 rounded-2xl transition-all text-indiapost-sand hover:text-indiapost-red shadow-sm bg-white dark:bg-stone-900">
               <X size={24} />
             </button>
           </header>

           <div className="flex-grow overflow-y-auto p-10 custom-scrollbar space-y-12">
              <section className="space-y-6">
                 <h4 className="text-[10px] font-black text-indiapost-sand uppercase tracking-[0.3em] flex items-center gap-3">
                   <FileText size={16} /> Original Input
                 </h4>
                 <div className="p-8 bg-indiapost-cream/10 dark:bg-stone-800 rounded-[2.5rem] border-2 border-indiapost-sand/10 dark:border-stone-700 shadow-inner">
                    <p className="text-base font-medium text-stone-800 dark:text-stone-200 leading-relaxed italic">"{selectedTicket.description}"</p>
                    {selectedTicket.imageUrl && (
                      <div className="mt-8 rounded-[1.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-stone-700">
                        <img src={selectedTicket.imageUrl} alt="evidence" className="w-full h-auto" />
                      </div>
                    )}
                 </div>
              </section>

              <section className="space-y-6">
                 <div className="flex justify-between items-center">
                   <h4 className="text-[10px] font-black text-indiapost-sand uppercase tracking-[0.3em] flex items-center gap-3">
                     <MessageCircle size={16} /> Internal Audit
                   </h4>
                   <button className="text-[9px] font-black text-indiapost-red uppercase tracking-widest border-b border-indiapost-red/20">Full Logs</button>
                 </div>
                 <div className="space-y-5">
                    {selectedTicket.updates.map((u, i) => (
                      <div key={i} className={`p-6 rounded-2xl border-2 ${u.isInternal ? 'bg-amber-500/5 border-amber-500/10' : 'bg-indiapost-cream/5 border-indiapost-sand/10'} shadow-sm`}>
                         <div className="flex justify-between text-[8px] font-black uppercase text-indiapost-sand tracking-widest mb-3">
                           <span>{u.author}</span>
                           <span>{new Date(u.timestamp).toLocaleString()}</span>
                         </div>
                         <p className="text-xs font-bold text-stone-700 dark:text-stone-300">{u.message}</p>
                      </div>
                    ))}
                 </div>
              </section>

              <section className="space-y-6">
                 <h4 className="text-[10px] font-black text-indiapost-sand uppercase tracking-[0.3em] flex items-center gap-3">
                   <Zap size={16} className="text-indiapost-red fill-indiapost-red animate-pulse" /> AI Support Response
                 </h4>
                 <div className="p-8 bg-stone-900 rounded-[2.5rem] text-stone-100 shadow-2xl border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indiapost-red/10 rounded-bl-full group-hover:scale-110 transition-transform"></div>
                    <p className="text-sm font-medium leading-relaxed mb-8 relative z-10">{selectedTicket.analysis?.suggestedResponse}</p>
                    <button 
                      onClick={() => setReply(selectedTicket.analysis?.suggestedResponse || '')}
                      className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all relative z-10 shadow-lg"
                    >
                      Autofill Template
                    </button>
                 </div>
              </section>
           </div>

           <footer className="p-10 border-t border-indiapost-sand/20 dark:border-stone-800 bg-indiapost-cream/5 dark:bg-stone-900 shadow-[0_-20px_50px_rgba(180,180,140,0.08)]">
              <div className="flex gap-4 mb-6">
                 <button onClick={() => setIsInternal(false)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isInternal ? 'bg-stone-900 text-white shadow-xl' : 'text-indiapost-sand hover:bg-indiapost-cream'}`}>Citizen Response</button>
                 <button onClick={() => setIsInternal(true)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isInternal ? 'bg-amber-500 text-white shadow-xl' : 'text-indiapost-sand hover:bg-indiapost-cream'}`}><Lock size={12} /> Officer Note</button>
              </div>
              <div className="relative">
                <textarea 
                  placeholder={isInternal ? "Classified supervisor remarks..." : "Compose professional response..."}
                  className={`w-full p-8 pr-28 rounded-[2rem] border-2 outline-none focus:ring-8 focus:ring-indiapost-red/5 transition-all font-bold text-sm min-h-[150px] shadow-inner placeholder:text-stone-300 ${isInternal ? 'bg-amber-500/5 border-amber-500/10' : 'bg-white dark:bg-stone-800 border-indiapost-sand/20 dark:border-stone-700'}`}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button 
                  onClick={handleReply}
                  className="absolute right-6 bottom-6 p-5 bg-indiapost-red text-white rounded-2xl shadow-2xl shadow-indiapost-red/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Send size={28} />
                </button>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button onClick={() => handleStatusChange(ComplaintStatus.SOLVED)} className="flex-1 py-5 bg-green-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-900/10 active:scale-[0.98]">Authorize Resolution</button>
                <button className="p-5 border-2 border-indiapost-sand/20 dark:border-stone-700 text-indiapost-sand rounded-2xl hover:bg-indiapost-beige transition-all shadow-sm"><MoreVertical size={24} /></button>
              </div>
           </footer>
        </aside>
      )}
      
      {/* Detail Overlay Backdrop */}
      {selectedId && <div onClick={() => setSelectedId(null)} className="fixed inset-0 bg-stone-900/10 backdrop-blur-[2px] z-40 animate-in fade-in duration-500" />}

    </div>
  );
};

export default AdminTickets;
