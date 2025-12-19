
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  LogOut,
  Sun,
  Moon,
  Accessibility,
  Menu,
  Languages,
  ChevronDown,
  Phone,
  Info,
  Mail as MailIcon,
  Search,
  UserCircle,
  CreditCard,
  Type
} from 'lucide-react';

import { User, Complaint } from './types';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import SubmitComplaint from './views/SubmitComplaint';
import TrackStatus from './views/TrackStatus';
import ComplaintMenu from './views/ComplaintMenu';
import AdminTickets from './views/AdminTickets';
import ChatAssistant from './views/ChatAssistant';

const translations = {
  en: {
    brand_name: "Posty",
    nav_home: "Home",
    nav_submit: "Register Complaint",
    nav_track: "Track Complaint",
    nav_records: "My Complaints",
    nav_queue: "Task Queue",
    nav_insights: "Statistics",
    helpline: "Customer Care",
    citizen_portal: "CITIZEN SECTION",
    admin_portal: "STAFF LOGIN",
    login_title: "Posty Help Portal",
    login_subtitle: "AI-Based Complaint Analysis & Automated Response System",
    login_staff: "Department Staff",
    login_citizen: "Citizen Login",
    login_verify: "OTP Verification",
    login_officer: "Officer Login",
    login_phone: "Mobile Number",
    login_otp: "OTP Code",
    login_name: "Full Name",
    login_email: "Email ID",
    login_btn_send: "Get OTP",
    login_btn_verify: "Submit",
    login_btn_account: "Create Profile",
    login_back: "Back",
    welcome: "Welcome",
    smart_redressal: "Grievance Redressal System",
    active_cases: "Pending Requests",
    reg: "File a Complaint",
    reg_sub: "Late delivery, missing items, or counter issues.",
    track: "Track Status",
    track_sub: "Check the current status of your request.",
    hub: "My History",
    hub_sub: "View your previous complaints and their answers.",
    resources: "Helpful Links",
    resources_sub: "Important Posty services at your fingertips.",
    speed: "Express Mail",
    find: "Branch Finder",
    proceed: "Click to proceed",
    open: "Check Now",
    view: "Open List",
    submit_title: "New Complaint",
    submit_desc: "Describe the Problem",
    submit_branch: "Post Office Branch",
    submit_date: "Date of Incident",
    submit_evidence: "Photo / Receipt (Optional)",
    submit_btn: "Submit Complaint",
    submit_placeholder_desc: "Please explain your problem in simple words. If you have a tracking number, please mention it here.",
    submit_placeholder_branch: "Post office name or Pincode",
    submit_triage: "Processing your request...",
    submit_confirmed: "Complaint submitted successfully!",
    track_title: "Track Your Request",
    track_placeholder: "Enter Ref Number (e.g. PGC-12345)",
    track_search: "Search",
    track_ref: "REF NUMBER",
    track_timeline_reported: "Reported",
    track_timeline_processing: "In Review",
    track_timeline_resolved: "Resolved",
    track_timeline_closed: "Closed",
    track_logs: "History of Action",
    records_title: "Your Complaints",
    records_empty: "No records found",
    records_empty_sub: "You have not filed any complaints yet.",
    records_total: "Total Records",
    records_locate: "Track",
    footer_text: "Posty - Grievance Redressal Portal",
    footer_subtext: "Official website for handling citizen issues. Powered by Posty.",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    charter: "Citizen Charter",
    branch_dir: "Directory"
  },
  hi: {
    brand_name: "पोस्टी",
    nav_home: "मुख्य पृष्ठ",
    nav_submit: "शिकायत दर्ज करें",
    nav_track: "स्थिति जानें",
    nav_records: "मेरी शिकायतें",
    nav_queue: "कार्य सूची",
    nav_insights: "आंकड़े",
    helpline: "कस्टमर केयर",
    citizen_portal: "नागरिक अनुभाग",
    admin_portal: "कर्मचारी लॉगिन",
    login_title: "पोस्टी हेल्प पोर्टल",
    login_subtitle: "एआई-आधारित शिकायत विश्लेषण और स्वचालित प्रतिक्रिया प्रणाली",
    login_staff: "विभाग कर्मचारी",
    login_citizen: "नागरिक लॉगिन",
    login_verify: "ओटीपी सत्यापन",
    login_officer: "अधिकारी लॉगिन",
    login_phone: "मोबाइल नंबर",
    login_otp: "ओटीपी कोड",
    login_name: "पूरा नाम",
    login_email: "ईमेल आईडी",
    login_btn_send: "ओटीपी प्राप्त करें",
    login_btn_verify: "जमा करें",
    login_btn_account: "प्रोफ़ाइल बनाएं",
    login_back: "पीछे",
    welcome: "स्वागत है",
    smart_redressal: "शिकायत निवारण प्रणाली",
    active_cases: "लंबित अनुरोध",
    reg: "शिकायत दर्ज करें",
    reg_sub: "देरी से वितरण, खोया सामान, या काउंटर समस्या।",
    track: "स्थिति जांचें",
    track_sub: "अपने अनुरोध की वर्तमान स्थिति देखें।",
    hub: "मेरा इतिहास",
    hub_sub: "अपनी पिछली शिकायतों और उनके उत्तर देखें।",
    resources: "सहायक लिंक",
    resources_sub: "पोस्टी की महत्वपूर्ण सेवाएं आपके हाथ में।",
    speed: "एक्सप्रेस मेल",
    find: "शाखा खोजें",
    proceed: "आगे बढ़ें",
    open: "अभी जांचें",
    view: "सूची खोलें",
    submit_title: "नई शिकायत",
    submit_desc: "समस्या का विवरण",
    submit_branch: "डाकघर शाखा",
    submit_date: "घटना की तारीख",
    submit_evidence: "फोटो / रसीद (वैकल्पिक)",
    submit_btn: "शिकायत जमा करें",
    submit_placeholder_desc: "कृपया अपनी समस्या सरल शब्दों में बताएं। ट्रैकिंग नंबर यहाँ लिखें।",
    submit_placeholder_branch: "डाकघर का नाम या पिनकोड",
    submit_triage: "अनुरोध प्रोसेस हो रहा है...",
    submit_confirmed: "शिकायत सफलतापूर्वक दर्ज की गई!",
    track_title: "अपना अनुरोध ट्रैक करें",
    track_placeholder: "रेफरेंस नंबर लिखें (जैसे PGC-12345)",
    track_search: "खोजें",
    track_ref: "रेफरेंस नंबर",
    track_timeline_reported: "दर्ज की गई",
    track_timeline_processing: "समीक्षा में",
    track_timeline_resolved: "सुलझ गई",
    track_timeline_closed: "बंद",
    track_logs: "कार्रवाई का इतिहास",
    records_title: "आपकी शिकायतें",
    records_empty: "कोई रिकॉर्ड नहीं मिला",
    records_empty_sub: "आपने अभी तक कोई शिकायत दर्ज नहीं की है।",
    records_total: "कुल रिकॉर्ड",
    records_locate: "ट्रैक",
    footer_text: "पोस्टी - शिकायत निवारण पोर्टल",
    footer_subtext: "नागरिकों की समस्याओं के समाधान के लिए आधिकारिक वेबसाइट। पोस्टी द्वारा संचालित।",
    privacy: "गोपनीयता नीति",
    terms: "उपयोग की शर्तें",
    charter: "नागरिक चार्टर",
    branch_dir: "निर्देशिका"
  }
};

type Language = 'en' | 'hi';
export const LangContext = createContext<{ lang: Language, setLang: (l: Language) => void, t: any }>({
  lang: 'en',
  setLang: () => {},
  t: translations.en
});

const OfficialHeader = ({ 
  user, 
  onLogout, 
  isDark, 
  toggleTheme 
}: { 
  user: User | null, 
  onLogout: () => void, 
  isDark: boolean, 
  toggleTheme: () => void 
}) => {
  const { lang, setLang, t } = useContext(LangContext);
  const emblemUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png";
  const indiaPostLogo = "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/India_Post_Logo.svg/1200px-India_Post_Logo.svg.png";
  const swachhBharatLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Swachh_Bharat_Abhiyan_logo.svg/1024px-Swachh_Bharat_Abhiyan_logo.svg.png";
  const digitalIndiaLogo = "https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Digital_India_logo.svg/1024px-Digital_India_logo.svg.png";
  const indianFlag = "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png";

  return (
    <header className="w-full flex flex-col bg-white dark:bg-stone-900 shadow-sm">
      {/* 1. Top White Bar with GOI and Icons */}
      <div className="bg-white dark:bg-stone-800 py-2 px-4 md:px-12 border-b border-stone-100 dark:border-stone-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={indianFlag} alt="Indian Flag" className="h-4 w-6 object-cover shadow-sm" />
            <div className="flex flex-col text-[10px] md:text-xs leading-tight">
               <span className="font-bold text-stone-800 dark:text-stone-200">भारत सरकार</span>
               <span className="font-extrabold text-stone-900 dark:text-white">GOVERNMENT OF INDIA</span>
            </div>
          </div>
          <div className="flex items-center gap-5 text-stone-600 dark:text-stone-400">
            <button className="hover:text-indiapost-red transition-colors"><CreditCard size={18} /></button>
            <div className="h-4 w-px bg-stone-300 dark:bg-stone-600"></div>
            <button className="hover:text-indiapost-red transition-colors flex items-center gap-1 font-bold text-sm">
               <span>अ</span> <span className="text-xs">/</span> <span>A</span>
            </button>
            <div className="h-4 w-px bg-stone-300 dark:bg-stone-600"></div>
            <button className="hover:text-indiapost-red transition-colors"><Accessibility size={18} /></button>
            <div className="h-4 w-px bg-stone-300 dark:bg-stone-600"></div>
            <button className="hover:text-indiapost-red transition-colors"><UserCircle size={18} /></button>
          </div>
        </div>
      </div>

      {/* 2. Red Ministry Bar */}
      <div className="bg-indiapost-red text-white py-2 px-4 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <img src={emblemUrl} alt="Emblem" className="h-5 brightness-0 invert" />
             <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">
               GOVERNMENT OF INDIA • MINISTRY OF COMMUNICATIONS
             </span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="font-bold text-[11px] hover:underline">
               {lang === 'en' ? 'हिन्दी' : 'English'}
             </button>
             <button onClick={toggleTheme} className="p-1 hover:text-indiapost-amber transition-colors">
               {isDark ? <Sun size={14} /> : <Moon size={14} />}
             </button>
          </div>
        </div>
      </div>

      {/* 3. Main Branding White Section with Search */}
      <div className="py-6 px-4 md:px-12 bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-6 shrink-0">
            <img src={emblemUrl} alt="Emblem" className="h-14 w-auto hidden sm:block" />
            <div className="flex flex-col items-center">
               <img src={indiaPostLogo} alt="India Post" className="h-12 w-auto" />
               <span className="text-[9px] font-black uppercase text-indiapost-red mt-1 tracking-widest">India Post</span>
               <span className="text-[7px] font-bold text-stone-400 uppercase tracking-tighter">Dak Sewa Jan Sewa</span>
            </div>
            <div className="border-l-2 border-stone-100 dark:border-stone-700 pl-6">
              <h1 className="text-3xl font-black text-indiapost-red leading-none mb-1">Department of Posts</h1>
              <h2 className="text-2xl font-black text-stone-900 dark:text-white leading-none mb-1">Government of India</h2>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-tight">Ministry of Communications</p>
            </div>
          </Link>

          {/* Central Search Bar */}
          <div className="flex-grow max-w-xl w-full relative group">
            <input 
              type="text" 
              placeholder="Namaste! What can I find for you?" 
              className="w-full pl-6 pr-14 py-3.5 bg-stone-50 dark:bg-stone-800 border-b-2 border-stone-200 dark:border-stone-700 outline-none focus:border-indiapost-red transition-all font-medium text-stone-600 dark:text-stone-300 rounded-t-lg"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400 group-hover:text-indiapost-red transition-colors" size={20} />
          </div>

          {/* Right Logos */}
          <div className="flex items-center gap-8 shrink-0">
             <img src={swachhBharatLogo} alt="Swachh Bharat" className="h-10 md:h-14 w-auto object-contain" />
             <img src={digitalIndiaLogo} alt="Digital India" className="h-8 md:h-12 w-auto object-contain" />
          </div>
        </div>
      </div>

      {/* 4. Navbar & User Profile Context */}
      <nav className="bg-stone-50 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
        <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-col md:flex-row items-center justify-between">
          <ul className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-tight w-full md:w-auto">
            {user?.role === 'user' ? (
              <>
                <li><Link to="/" className="block py-4 px-6 hover:bg-white dark:hover:bg-stone-700 transition-colors border-b-2 border-transparent hover:border-indiapost-red">{t.nav_home}</Link></li>
                <li><Link to="/submit" className="block py-4 px-6 hover:bg-white dark:hover:bg-stone-700 transition-colors border-b-2 border-transparent hover:border-indiapost-red">{t.nav_submit}</Link></li>
                <li><Link to="/track" className="block py-4 px-6 hover:bg-white dark:hover:bg-stone-700 transition-colors border-b-2 border-transparent hover:border-indiapost-red">{t.nav_track}</Link></li>
                <li><Link to="/menu" className="block py-4 px-6 hover:bg-white dark:hover:bg-stone-700 transition-colors border-b-2 border-transparent hover:border-indiapost-red">{t.nav_records}</Link></li>
              </>
            ) : user ? (
              <>
                <li><Link to="/" className="block py-4 px-6 hover:bg-white dark:hover:bg-stone-700 transition-colors border-b-2 border-transparent hover:border-indiapost-red">{t.nav_queue}</Link></li>
                <li><Link to="/reports" className="block py-4 px-6 hover:bg-white dark:hover:bg-stone-700 transition-colors border-b-2 border-transparent hover:border-indiapost-red">{t.nav_insights}</Link></li>
              </>
            ) : null}
          </ul>
          <div className="flex items-center gap-6">
            {user && (
              <div className="flex items-center gap-3 bg-white dark:bg-stone-900 px-4 py-2 border-x border-stone-200 dark:border-stone-700">
                <div className="text-right">
                  <p className="text-[8px] font-black text-indiapost-red uppercase leading-none mb-1">{user.role !== 'user' ? t.admin_portal : t.citizen_portal}</p>
                  <p className="text-[10px] font-black text-stone-800 dark:text-white uppercase leading-none">{user.name}</p>
                </div>
                <button onClick={onLogout} className="text-stone-400 hover:text-indiapost-red transition-all p-1.5 hover:bg-stone-50 rounded-lg">
                  <LogOut size={14} />
                </button>
              </div>
            )}
            <div className="py-4 md:py-0 text-[10px] font-black text-indiapost-red uppercase tracking-widest flex items-center gap-2">
               <Phone size={14} className="opacity-70" />
               <span>{t.helpline}: 1800 266 6868</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedComplaints = localStorage.getItem('complaints');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedComplaints) setComplaints(JSON.parse(savedComplaints));
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleUpdateComplaints = (updated: Complaint[]) => {
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));
  };

  const addComplaint = (newComplaint: Complaint) => {
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const t = translations[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <Router>
        <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 transition-colors">
          <OfficialHeader 
            user={user} 
            onLogout={handleLogout} 
            isDark={isDarkMode} 
            toggleTheme={toggleTheme} 
          />

          <main className="flex-grow max-w-7xl mx-auto w-full py-8 px-4">
            <Routes>
              <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
              <Route path="/" element={user ? (user.role === 'user' ? <Dashboard user={user} complaints={complaints} /> : <AdminTickets complaints={complaints} user={user} onUpdate={handleUpdateComplaints} />) : <Navigate to="/login" />} />
              <Route path="/submit" element={user?.role === 'user' ? <SubmitComplaint user={user} onSubmit={addComplaint} existingComplaints={complaints} /> : <Navigate to="/login" />} />
              <Route path="/track" element={user?.role === 'user' ? <TrackStatus complaints={complaints} /> : <Navigate to="/login" />} />
              <Route path="/menu" element={user?.role === 'user' ? <ComplaintMenu complaints={complaints} /> : <Navigate to="/login" />} />
            </Routes>
          </main>

          {user?.role === 'user' && <ChatAssistant />}

          <footer className="bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-12 transition-colors">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-[11px] text-stone-500 font-bold uppercase tracking-[0.3em] mb-4">{t.footer_text}</p>
              <p className="text-[10px] text-stone-400 max-w-2xl mx-auto leading-relaxed">{t.footer_subtext}</p>
              <div className="flex justify-center gap-8 mt-10 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                <a href="#" className="hover:text-indiapost-red">{t.privacy}</a>
                <a href="#" className="hover:text-indiapost-red">{t.terms}</a>
                <a href="#" className="hover:text-indiapost-red">{t.charter}</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </LangContext.Provider>
  );
};

export default App;
