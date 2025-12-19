
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
  Calendar
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
    if (score >= 90) return 'text-red-600 bg-red-50';
    if (score >= 70) return 'text-orange-600 bg-orange-50';
    if (score >= 40) return 'text-blue-600 bg-blue-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch(status) {
      case ComplaintStatus.OPEN: return 'text-amber-600 bg-amber-50';
      case ComplaintStatus.SOLVED: return 'text-green-600 bg-green-50';
      case ComplaintStatus.PENDING: return 'text-blue-600 bg-blue-50';
      default: return 'text-stone-600 bg-stone-50';
    }
  };

  const renderQueue = () => (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col flex-grow shadow-sm overflow-hidden animate-in fade-in duration-500">
      {/* Table Header & Tabs */}
      <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-8 border-b md:border-b-0 border-stone-100">
           {['all', 'OPEN', 'PENDING', 'SOLVED'].map(s => (
             <button 
               key={s}
               onClick={() => setFilterStatus(s)}
               className={`pb-4 px-2 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                 filterStatus === s ? 'text-blue-600' : 'text-stone-400 hover:text-stone-600'
               }`}
             >
               {s} Cases
               {filterStatus === s && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-in fade-in zoom-in duration-300"></div>}
             </button>
           ))}
         </div>

         <div className="flex items-center gap-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
             <input 
               type="text" 
               placeholder="Search records..." 
               className="pl-10 pr-4 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all w-64"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           <button className="p-2 border border-stone-100 dark:border-stone-700 rounded-lg text-stone-400 hover:bg-stone-50 transition-colors">
             <Filter size={16} />
           </button>
         </div>
      </div>

      {/* The Main Table */}
      <div className="flex-grow overflow-y-auto custom-scrollbar relative">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-stone-50 dark:bg-stone-800 z-10 border-b border-stone-100 dark:border-stone-700">
            <tr className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
              <th className="px-6 py-4 w-10"><Square size={14} /></th>
              <th className="px-6 py-4">Options</th>
              <th className="px-6 py-4">Ref Number</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Sender</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Priority Score</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50 dark:divide-stone-800">
            {filtered.map(c => (
              <tr 
                key={c.id} 
                className={`group hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-colors cursor-pointer ${selectedId === c.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                onClick={() => setSelectedId(c.id)}
              >
                <td className="px-6 py-4">
                  <input type="checkbox" className="accent-blue-600" checked={selectedBulkIds.has(c.id)} onChange={() => toggleBulkId(c.id)} onClick={(e) => e.stopPropagation()} />
                </td>
                <td className="px-6 py-4">
                  <button className="p-1 hover:bg-white dark:hover:bg-stone-700 rounded transition-all text-stone-400"><MoreVertical size={14} /></button>
                </td>
                <td className="px-6 py-4 text-xs font-black text-indiapost-red">{c.id}</td>
                <td className="px-6 py-4 text-[11px] font-bold text-stone-400">{new Date(c.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-xs font-bold text-stone-700 dark:text-stone-300">{c.userName}</td>
                <td className="px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-tighter">{c.postOffice}</td>
                <td className="px-6 py-4">
                  <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">{c.analysis?.category || 'General'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-4 py-1.5 rounded-lg text-xs font-black tabular-nums transition-colors ${getPriorityColor(c.analysis?.priorityScore || 0)}`}>
                    {c.analysis?.priorityScore || 0}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-30">
            <History size={64} className="text-stone-300" />
            <p className="text-xs font-black uppercase tracking-[0.4em]">No matching tickets found</p>
          </div>
        )}
      </div>

      {/* Footer / Pagination */}
      <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/50 flex justify-between items-center px-8">
         <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
           Showing {filtered.length} of {complaints.length} records
         </p>
         <div className="flex gap-2">
           <button className="px-4 py-1.5 border border-stone-100 dark:border-stone-700 rounded text-[10px] font-bold text-stone-400 hover:bg-white transition-all">Prev</button>
           <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-[10px] font-bold shadow-md">1</button>
           <button className="px-4 py-1.5 border border-stone-100 dark:border-stone-700 rounded text-[10px] font-bold text-stone-400 hover:bg-white transition-all">Next</button>
         </div>
      </div>
    </div>
  );

  const renderReports = () => {
    const solved = complaints.filter(c => c.status === ComplaintStatus.SOLVED).length;
    const pending = complaints.filter(c => c.status === ComplaintStatus.PENDING).length;
    const open = complaints.filter(c => c.status === ComplaintStatus.OPEN).length;
    
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-y-auto custom-scrollbar flex-grow p-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Total Received</p>
            <p className="text-3xl font-black text-stone-900 dark:text-white">{complaints.length}</p>
            <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-green-500">
               <TrendingUp size={12} /> +12% from last week
            </div>
          </div>
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Resolved</p>
            <p className="text-3xl font-black text-green-600">{solved}</p>
            <div className="mt-4 h-1 w-full bg-stone-100 dark:bg-stone-800 rounded-full">
               <div className="h-full bg-green-500 rounded-full" style={{ width: `${(solved/complaints.length)*100}%` }}></div>
            </div>
          </div>
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Avg. Resolution</p>
            <p className="text-3xl font-black text-blue-600">2.4 <span className="text-sm">days</span></p>
            <p className="text-[10px] font-bold text-stone-400 mt-4 uppercase">Target: 3.0 days</p>
          </div>
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Satisfaction Score</p>
            <p className="text-3xl font-black text-amber-500">4.8 <span className="text-sm">/ 5</span></p>
            <div className="flex gap-1 mt-4">
              {[1,2,3,4,5].map(i => <div key={i} className={`w-3 h-1.5 rounded ${i === 5 ? 'bg-stone-100' : 'bg-amber-500'}`}></div>)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black uppercase tracking-tighter">Volume by Category</h3>
                <PieChart size={18} className="text-stone-300" />
             </div>
             <div className="space-y-6">
                {[
                  { label: 'Lost Parcel', val: 45, color: 'bg-red-500' },
                  { label: 'Delivery Delay', val: 30, color: 'bg-amber-500' },
                  { label: 'Damaged Item', val: 15, color: 'bg-blue-500' },
                  { label: 'Other', val: 10, color: 'bg-stone-500' }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                      <span>{item.label}</span>
                      <span>{item.val}%</span>
                    </div>
                    <div className="h-2 w-full bg-stone-50 dark:bg-stone-800 rounded-full">
                       <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
           </div>
           
           <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black uppercase tracking-tighter">Staff Performance</h3>
                <BarChart size={18} className="text-stone-300" />
             </div>
             <div className="space-y-6">
                {[
                  { name: 'Arjun K.', cases: 142, rate: 98 },
                  { name: 'Meera S.', cases: 98, rate: 85 },
                  { name: 'Rahul V.', cases: 76, rate: 92 }
                ].map((staff, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-stone-50 dark:border-stone-800 pb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-[10px] font-black">{staff.name.charAt(0)}</div>
                       <span className="text-xs font-bold">{staff.name}</span>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-stone-900 dark:text-white uppercase">{staff.cases} Solved</p>
                       <p className="text-[9px] font-bold text-green-500">{staff.rate}% Success</p>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    );
  };

  const renderActivity = () => {
    const allUpdates = complaints.flatMap(c => c.updates.map(u => ({ ...u, ticketId: c.id })))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden flex flex-col flex-grow animate-in fade-in duration-500">
        <div className="p-8 border-b border-stone-100 dark:border-stone-800">
           <h3 className="text-sm font-black uppercase tracking-tighter">System-wide Activity Log</h3>
        </div>
        <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {allUpdates.map((u, i) => (
            <div key={i} className="flex gap-6 group">
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  u.type === 'status_change' ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-blue-50 text-blue-500 border-blue-100'
                }`}>
                  {u.type === 'status_change' ? <RotateCcw size={18} /> : <MessageCircle size={18} />}
                </div>
                {i !== allUpdates.length - 1 && <div className="w-px h-full bg-stone-100 dark:bg-stone-800 my-2"></div>}
              </div>
              <div className="pb-8 border-b border-stone-50 dark:border-stone-800 w-full group-last:border-0">
                <div className="flex justify-between items-center mb-2">
                   <p className="text-xs font-black text-stone-900 dark:text-white uppercase tracking-tighter">
                     {u.author} <span className="text-stone-300 mx-2 font-normal">updated</span> <span className="text-indiapost-red">#{u.ticketId}</span>
                   </p>
                   <span className="text-[10px] font-bold text-stone-400">{new Date(u.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm text-stone-500 dark:text-stone-400 font-medium leading-relaxed italic">"{u.message}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCitizens = () => {
    const uniqueUsers = Array.from(new Set(complaints.map(c => c.userId))).map(id => {
      const c = complaints.find(comp => comp.userId === id);
      const userComplaints = complaints.filter(comp => comp.userId === id);
      return {
        id,
        name: c?.userName,
        count: userComplaints.length,
        lastDate: userComplaints[0].date
      };
    });

    return (
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden flex flex-col flex-grow animate-in fade-in duration-500">
        <div className="p-8 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
           <h3 className="text-sm font-black uppercase tracking-tighter">Registered Citizens</h3>
           <div className="flex gap-2">
             <button className="px-4 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-lg text-xs font-bold text-stone-600">Export CSV</button>
           </div>
        </div>
        <div className="overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-stone-50 dark:bg-stone-800 sticky top-0">
              <tr className="text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100 dark:border-stone-700">
                <th className="px-8 py-4">Citizen Name</th>
                <th className="px-8 py-4">Contact Ref</th>
                <th className="px-8 py-4">Total Filings</th>
                <th className="px-8 py-4">Recent Date</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50 dark:divide-stone-800">
              {uniqueUsers.map(u => (
                <tr key={u.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-[10px]">{u.name?.charAt(0)}</div>
                      <span className="text-sm font-bold">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs text-stone-400 font-bold">{u.id}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-[10px] font-black">{u.count} Cases</span>
                  </td>
                  <td className="px-8 py-5 text-xs text-stone-400">{new Date(u.lastDate).toLocaleDateString()}</td>
                  <td className="px-8 py-5">
                    <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">View History</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm p-10">
         <h3 className="text-sm font-black uppercase tracking-tighter mb-8 border-b border-stone-50 dark:border-stone-800 pb-4">Portal Configuration</h3>
         <div className="space-y-8">
            <div className="flex items-center justify-between p-6 bg-stone-50 dark:bg-stone-800/50 rounded-2xl">
               <div>
                  <p className="text-xs font-black uppercase mb-1">AI-Assisted Classification</p>
                  <p className="text-[10px] font-bold text-stone-400">Automatically categorize incoming complaints using NLP models.</p>
               </div>
               <div className="w-12 h-6 bg-green-500 rounded-full relative shadow-inner"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
            </div>
            <div className="flex items-center justify-between p-6 bg-stone-50 dark:bg-stone-800/50 rounded-2xl">
               <div>
                  <p className="text-xs font-black uppercase mb-1">Real-time Translation</p>
                  <p className="text-[10px] font-bold text-stone-400">Automatically translate regional languages to official English/Hindi.</p>
               </div>
               <div className="w-12 h-6 bg-green-500 rounded-full relative shadow-inner"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
            </div>
            <div className="flex items-center justify-between p-6 bg-stone-50 dark:bg-stone-800/50 rounded-2xl">
               <div>
                  <p className="text-xs font-black uppercase mb-1">Citizen SMS Alerts</p>
                  <p className="text-[10px] font-bold text-stone-400">Send automatic updates to citizens when their ticket status changes.</p>
               </div>
               <div className="w-12 h-6 bg-stone-300 rounded-full relative shadow-inner"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm p-10">
         <h3 className="text-sm font-black uppercase tracking-tighter mb-8 text-red-600">Administrative Actions</h3>
         <button className="px-6 py-3 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-50 transition-colors">Clear Local History Logs</button>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-140px)] bg-[#f8fafc] dark:bg-stone-950 -m-8 overflow-hidden font-sans">
      
      {/* --- LEFT SIDEBAR (Category Based Navigation) --- */}
      <aside className="w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-stone-100 dark:border-stone-800">
           <h2 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Management Console</h2>
        </div>
        
        <nav className="flex-grow py-4 overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-8">
            <h3 className="px-2 text-[9px] font-black text-indiapost-red uppercase tracking-widest mb-4">Inbox Section</h3>
            <ul className="space-y-1">
              <li 
                onClick={() => setActiveView('queue')}
                className={`p-3 rounded-lg flex items-center gap-3 font-bold text-xs cursor-pointer transition-all ${activeView === 'queue' ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400' : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
              >
                <Inbox size={16} /> Ticket Queue
              </li>
              <li 
                onClick={() => setActiveView('activity')}
                className={`p-3 rounded-lg flex items-center gap-3 font-bold text-xs cursor-pointer transition-all ${activeView === 'activity' ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400' : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
              >
                <Activity size={16} /> Real-time Activity
              </li>
              <li 
                onClick={() => setActiveView('flagged')}
                className={`p-3 rounded-lg flex items-center gap-3 font-bold text-xs cursor-pointer transition-all ${activeView === 'flagged' ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400' : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
              >
                <Flag size={16} /> Flagged Items
              </li>
            </ul>
          </div>

          <div className="px-4 mb-8">
            <h3 className="px-2 text-[9px] font-black text-stone-400 uppercase tracking-widest mb-4">Users Section</h3>
            <ul className="space-y-1">
              <li 
                onClick={() => setActiveView('citizens')}
                className={`p-3 rounded-lg flex items-center gap-3 font-bold text-xs cursor-pointer transition-all ${activeView === 'citizens' ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400' : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
              >
                <Users size={16} /> Citizen Profiles
              </li>
              <li 
                onClick={() => setActiveView('staff')}
                className={`p-3 rounded-lg flex items-center gap-3 font-bold text-xs cursor-pointer transition-all ${activeView === 'staff' ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400' : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
              >
                <Briefcase size={16} /> Staff Directory
              </li>
            </ul>
          </div>

          <div className="px-4">
            <h3 className="px-2 text-[9px] font-black text-stone-400 uppercase tracking-widest mb-4">Configuration</h3>
            <ul className="space-y-1">
              <li 
                onClick={() => setActiveView('reports')}
                className={`p-3 rounded-lg flex items-center gap-3 font-bold text-xs cursor-pointer transition-all ${activeView === 'reports' ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400' : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
              >
                <BarChart size={16} /> Reports & Analytics
              </li>
              <li 
                onClick={() => setActiveView('settings')}
                className={`p-3 rounded-lg flex items-center gap-3 font-bold text-xs cursor-pointer transition-all ${activeView === 'settings' ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400' : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
              >
                <Settings size={16} /> Portal Settings
              </li>
            </ul>
          </div>
        </nav>

        <div className="p-6 border-t border-stone-100 dark:border-stone-800">
           <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-800 p-3 rounded-xl">
             <div className="w-8 h-8 rounded-lg bg-indiapost-red flex items-center justify-center text-white font-black text-xs">A</div>
             <div className="overflow-hidden">
               <p className="text-[10px] font-black truncate">{user.name}</p>
               <p className="text-[8px] font-bold text-stone-400 uppercase truncate">Branch Admin</p>
             </div>
           </div>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-grow flex flex-col min-w-0">
        
        {/* Top Action Bar */}
        <header className="bg-white dark:bg-stone-900 h-16 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-8 shrink-0">
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-stone-400">
               <span className="text-xs font-bold">Tickets</span>
               <ChevronRight size={14} />
               <span className="text-xs font-black text-stone-900 dark:text-white uppercase tracking-tighter">
                 {activeView === 'queue' ? 'Active Workspace' : activeView.toUpperCase()}
               </span>
             </div>
           </div>
           
           <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors">
               <Plus size={16} /> New Entry
             </button>
             <button className="p-2 text-stone-400 hover:bg-stone-100 rounded-lg transition-colors">
                <Search size={18} />
             </button>
             <button className="p-2 text-stone-400 hover:bg-stone-100 rounded-lg transition-colors">
                <AlertCircle size={18} />
             </button>
           </div>
        </header>

        {/* Content Section */}
        <div className="flex-grow p-8 overflow-hidden flex flex-col">
          {activeView === 'queue' && renderQueue()}
          {activeView === 'reports' && renderReports()}
          {activeView === 'activity' && renderActivity()}
          {activeView === 'citizens' && renderCitizens()}
          {activeView === 'settings' && renderSettings()}
          {(activeView === 'flagged' || activeView === 'staff') && (
            <div className="bg-white dark:bg-stone-900 p-20 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center gap-6 opacity-40">
               <ShieldCheck size={48} className="text-stone-300" />
               <p className="text-sm font-black uppercase tracking-widest text-center">Section under maintenance<br/><span className="text-xs font-bold mt-2 block">Enterprise access only</span></p>
            </div>
          )}
        </div>
      </main>

      {/* --- SLIDE-OVER DETAIL PANE --- */}
      {selectedTicket && activeView === 'queue' && (
        <aside className="fixed inset-y-0 right-0 w-[500px] bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-[-20px_0_40px_rgba(0,0,0,0.1)] z-50 flex flex-col animate-in slide-in-from-right duration-300">
           <header className="p-8 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-800/50">
             <div>
               <h2 className="text-xl font-black tracking-tighter text-stone-900 dark:text-white uppercase leading-none">Record Details</h2>
               <p className="text-[10px] font-black text-indiapost-red uppercase tracking-widest mt-2">Case ID: {selectedTicket.id}</p>
             </div>
             <button onClick={() => setSelectedId(null)} className="p-3 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full transition-colors text-stone-400">
               <X size={20} />
             </button>
           </header>

           <div className="flex-grow overflow-y-auto p-8 custom-scrollbar space-y-10">
              <section className="space-y-4">
                 <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                   <FileText size={14} /> Description
                 </h4>
                 <div className="p-6 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 shadow-inner">
                    <p className="text-sm font-bold text-stone-800 dark:text-stone-200 leading-relaxed italic">"{selectedTicket.description}"</p>
                    {selectedTicket.imageUrl && (
                      <div className="mt-6 rounded-xl overflow-hidden shadow-lg">
                        <img src={selectedTicket.imageUrl} alt="evidence" className="w-full h-auto" />
                      </div>
                    )}
                 </div>
              </section>

              <section className="space-y-4">
                 <div className="flex justify-between items-center">
                   <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                     <MessageCircle size={14} /> Conversation History
                   </h4>
                   <button className="text-[9px] font-black text-blue-600 uppercase">View All logs</button>
                 </div>
                 <div className="space-y-4">
                    {selectedTicket.updates.map((u, i) => (
                      <div key={i} className={`p-5 rounded-2xl border ${u.isInternal ? 'bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/20' : 'bg-white dark:bg-stone-800 border-stone-100 dark:border-stone-700 shadow-sm'}`}>
                         <div className="flex justify-between text-[8px] font-black uppercase text-stone-400 mb-2">
                           <span>{u.author}</span>
                           <span>{new Date(u.timestamp).toLocaleString()}</span>
                         </div>
                         <p className="text-xs font-bold">{u.message}</p>
                      </div>
                    ))}
                 </div>
              </section>

              <section className="space-y-4">
                 <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                   <Zap size={14} className="text-indiapost-red fill-indiapost-red" /> Staff Assistant Suggestion
                 </h4>
                 <div className="p-5 bg-stone-900 rounded-2xl text-stone-100 shadow-xl border border-white/10">
                    <p className="text-xs font-medium leading-relaxed mb-4">{selectedTicket.analysis?.suggestedResponse}</p>
                    <button 
                      onClick={() => setReply(selectedTicket.analysis?.suggestedResponse || '')}
                      className="text-[9px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
                    >
                      Use Suggestion
                    </button>
                 </div>
              </section>
           </div>

           <footer className="p-8 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
              <div className="flex gap-2 mb-4">
                 <button onClick={() => setIsInternal(false)} className={`px-5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isInternal ? 'bg-stone-900 text-white' : 'text-stone-400 hover:bg-stone-50'}`}>Public Reply</button>
                 <button onClick={() => setIsInternal(true)} className={`px-5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isInternal ? 'bg-amber-500 text-white' : 'text-stone-400 hover:bg-stone-50'}`}><Lock size={12} /> Internal Note</button>
              </div>
              <div className="relative">
                <textarea 
                  placeholder={isInternal ? "Official supervisor notes..." : "Respond to the citizen professionally..."}
                  className={`w-full p-6 pr-24 rounded-2xl border outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-sm min-h-[120px] shadow-inner ${isInternal ? 'bg-amber-50/20 border-amber-100' : 'bg-stone-50 dark:bg-stone-800 border-stone-100 dark:border-stone-700'}`}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button 
                  onClick={handleReply}
                  className="absolute right-4 bottom-4 p-4 bg-blue-600 text-white rounded-xl shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Send size={24} />
                </button>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleStatusChange(ComplaintStatus.SOLVED)} className="flex-1 py-3 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-900/10">Mark Resolved</button>
                <button className="p-3 border border-stone-200 dark:border-stone-700 text-stone-400 rounded-xl hover:bg-stone-50 transition-colors"><MoreVertical size={20} /></button>
              </div>
           </footer>
        </aside>
      )}
      
      {/* Detail Overlay Backdrop */}
      {selectedId && <div onClick={() => setSelectedId(null)} className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 animate-in fade-in duration-300" />}

    </div>
  );
};

export default AdminTickets;
