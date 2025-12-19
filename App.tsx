
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { 
  LogOut,
  Sun,
  Moon,
  Accessibility,
  Search,
  UserCircle,
  Phone,
  Mail as MailIcon,
  CreditCard,
  Type,
  Menu
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
    brand_name: "India Post",
    nav_home: "Home",
    nav_submit: "Register Complaint",
    nav_track: "Track Complaint",
    nav_records: "My Complaints",
    nav_queue: "Task Queue",
    nav_insights: "Statistics",
    helpline: "Customer Care",
    citizen_portal: "CITIZEN SECTION",
    admin_portal: "STAFF LOGIN",
    login_title: "India Post Help Portal",
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
    resources_sub: "Important India Post services at your fingertips.",
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
    footer_text: "India Post - Grievance Redressal Portal",
    footer_subtext: "Official website for handling citizen issues. Ministry of Communications, Government of India.",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    charter: "Citizen Charter",
    branch_dir: "Directory"
  },
  hi: {
    brand_name: "भारतीय डाक",
    nav_home: "मुख्य पृष्ठ",
    nav_submit: "शिकायत दर्ज करें",
    nav_track: "स्थिति जानें",
    nav_records: "मेरी शिकायतें",
    nav_queue: "कार्य सूची",
    nav_insights: "आंकड़े",
    helpline: "कस्टमर केयर",
    citizen_portal: "नागरिक अनुभाग",
    admin_portal: "कर्मचारी लॉगिन",
    login_title: "भारतीय डाक हेल्प पोर्टल",
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
    resources_sub: "भारतीय डाक की महत्वपूर्ण सेवाएं आपके हाथ में।",
    speed: "एक्सप्रेस मेल",
    find: "शाखा खोजें",
    proceed: "आगे बढ़ें",
    open: "अभी जांचें",
    view: "सूची खोलें",
    submit_title: "नई शिकायत",
    submit_desc: "समस्या का विवरण",
    submit_branch: "डाकघर शाखा",
    submit_date: "घटना की तारीख",
    submit_evidence: "फोटो / रसीद (वैकल्फिक)",
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
    footer_text: "भारतीय डाक - शिकायत निवारण पोर्टल",
    footer_subtext: "नागरिकों की समस्याओं के समाधान के लिए आधिकारिक वेबसाइट। संचार मंत्रालय, भारत सरकार।",
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
  
  // Official Asset URLs
  const emblemUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png";
  const swachhBharatLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Swachh_Bharat_Abhiyan_logo.svg/1024px-Swachh_Bharat_Abhiyan_logo.svg.png";
  const digitalIndiaLogo = "https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Digital_India_logo.svg/1024px-Digital_India_logo.svg.png";
  const indianFlag = "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png";

  return (
    <header className="w-full flex flex-col bg-indiapost-beige dark:bg-stone-950 transition-colors shadow-sm">
      {/* 1. Government Top Bar */}
      <div className="bg-indiapost-cream/50 dark:bg-stone-900 py-1.5 px-4 md:px-12 border-b border-indiapost-sand/50 dark:border-stone-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] md:text-xs">
          <div className="flex items-center gap-3">
            <img src={indianFlag} alt="Flag" className="h-3.5 w-auto shadow-sm" />
            <div className="flex gap-2 font-bold text-stone-700 dark:text-stone-300">
               <span>भारत सरकार</span>
               <span className="text-indiapost-sand">|</span>
               <span>GOVERNMENT OF INDIA</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-stone-600 dark:text-stone-400">
            <button className="hover:text-indiapost-red font-bold transition-colors"><Accessibility size={14} /></button>
            <div className="h-3 w-px bg-indiapost-sand"></div>
            <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="hover:text-indiapost-red font-bold transition-colors">
               {lang === 'en' ? 'हिन्दी' : 'English'}
            </button>
            <div className="h-3 w-px bg-indiapost-sand"></div>
            <button onClick={toggleTheme} className="hover:text-indiapost-red transition-colors">
               {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <div className="h-3 w-px bg-indiapost-sand"></div>
            <Link to="/login" className="hover:text-indiapost-red flex items-center gap-1 font-bold transition-colors">
               <UserCircle size={14} /> <span>{user ? user.name : 'Login'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Branding Section */}
      <div className="py-8 px-4 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Logo Group */}
          <div className="flex items-center gap-6 shrink-0">
            <img src={emblemUrl} alt="Emblem of India" className="h-16 w-auto object-contain" />
            <div className="h-16 w-px bg-indiapost-sand hidden md:block"></div>
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-extrabold text-indiapost-red leading-tight tracking-tight font-serif italic">Department of Posts</h1>
              <h2 className="text-xl md:text-2xl font-black text-stone-800 dark:text-white leading-none tracking-tight">Government of India</h2>
              <p className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">MINISTRY OF COMMUNICATIONS</p>
            </div>
          </div>

          {/* Search bar with beige styling */}
          <div className="flex-grow max-w-lg w-full">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Namaste! What can I find for you?" 
                className="w-full bg-white dark:bg-stone-900 border-2 border-indiapost-sand/30 dark:border-stone-800 py-3.5 px-6 outline-none focus:border-indiapost-red transition-all font-medium text-stone-600 dark:text-stone-300 rounded-2xl shadow-sm group-hover:shadow-md"
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-indiapost-sand group-focus-within:text-indiapost-red transition-colors" size={20} />
            </div>
          </div>

          {/* Secondary Official Logos */}
          <div className="flex items-center gap-8 shrink-0">
            <div className="flex flex-col items-center">
               <p className="text-[10px] font-black text-indiapost-red tracking-widest">INDIA POST</p>
               <p className="text-[7px] font-bold text-stone-400 tracking-tighter uppercase">Dak Sewa Jan Sewa</p>
            </div>
            <img src={swachhBharatLogo} alt="Swachh Bharat" className="h-14 w-auto object-contain opacity-80" />
            <img src={digitalIndiaLogo} alt="Digital India" className="h-12 w-auto object-contain opacity-80" />
          </div>
        </div>
      </div>

      {/* 3. Navigation Bar */}
      <nav className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-y border-indiapost-sand/50 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-col md:flex-row items-center justify-between">
          <ul className="flex flex-wrap gap-1 text-[11px] font-black uppercase tracking-tight w-full md:w-auto">
            {user?.role === 'user' ? (
              <>
                <li><Link to="/" className="block py-4 px-5 hover:bg-indiapost-beige dark:hover:bg-stone-800 transition-colors border-b-2 border-transparent hover:border-indiapost-red">{t.nav_home}</Link></li>
                <li><Link to="/submit" className="block py-4 px-5 hover:bg-indiapost-beige dark:hover:bg-stone-800 transition-colors border-b-2 border-transparent hover:border-indiapost-red">{t.nav_submit}</Link></li>
                <li><Link to="/track" className="block py-4 px-5 hover:bg-indiapost-beige dark:hover:bg-stone-800 transition-colors border-b-2 border-transparent hover:border-indiapost-red">{t.nav_track}</Link></li>
                <li><Link to="/menu" className="block py-4 px-5 hover:bg-indiapost-beige dark:hover:bg-stone-800 transition-colors border-b-2 border-transparent hover:border-indiapost-red">{t.nav_records}</Link></li>
              </>
            ) : user ? (
              <>
                <li><Link to="/" className="block py-4 px-5 hover:bg-indiapost-beige dark:hover:bg-stone-800 transition-colors border-b-2 border-transparent hover:border-indiapost-red">{t.nav_queue}</Link></li>
                <li><Link to="/reports" className="block py-4 px-5 hover:bg-indiapost-beige dark:hover:bg-stone-800 transition-colors border-b-2 border-transparent hover:border-indiapost-red">{t.nav_insights}</Link></li>
              </>
            ) : (
              <li><Link to="/login" className="block py-4 px-5 hover:bg-indiapost-beige dark:hover:bg-stone-800 transition-colors border-b-2 border-transparent hover:border-indiapost-red">CITIZEN PORTAL</Link></li>
            )}
          </ul>
          
          {user && (
            <div className="flex items-center gap-4 py-4 md:py-0 border-t md:border-t-0 md:border-l border-indiapost-sand/50 dark:border-stone-800 pl-4">
              <div className="text-right">
                <p className="text-[9px] font-black text-indiapost-red uppercase leading-none">{user.role !== 'user' ? t.admin_portal : t.citizen_portal}</p>
                <p className="text-[11px] font-black text-stone-800 dark:text-white uppercase leading-tight">{user.name}</p>
              </div>
              <button onClick={onLogout} className="text-indiapost-sand hover:text-indiapost-red p-2 hover:bg-indiapost-beige dark:hover:bg-stone-800 rounded-xl transition-all shadow-sm">
                <LogOut size={16} />
              </button>
            </div>
          )}
          
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-black text-indiapost-red uppercase ml-6 border-l border-indiapost-sand/50 pl-6 h-10 my-auto">
            <Phone size={14} className="opacity-70" /> 
            <span>1800 266 6868</span>
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
        <div className="min-h-screen flex flex-col bg-indiapost-beige dark:bg-stone-950 transition-colors">
          <OfficialHeader 
            user={user} 
            onLogout={handleLogout} 
            isDark={isDarkMode} 
            toggleTheme={toggleTheme} 
          />

          <main className="flex-grow max-w-7xl mx-auto w-full py-12 px-4">
            <Routes>
              <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
              <Route path="/" element={user ? (user.role === 'user' ? <Dashboard user={user} complaints={complaints} /> : <AdminTickets complaints={complaints} user={user} onUpdate={handleUpdateComplaints} />) : <Navigate to="/login" />} />
              <Route path="/submit" element={user?.role === 'user' ? <SubmitComplaint user={user} onSubmit={addComplaint} existingComplaints={complaints} /> : <Navigate to="/login" />} />
              <Route path="/track" element={user?.role === 'user' ? <TrackStatus complaints={complaints} /> : <Navigate to="/login" />} />
              <Route path="/menu" element={user?.role === 'user' ? <ComplaintMenu complaints={complaints} /> : <Navigate to="/login" />} />
            </Routes>
          </main>

          {user?.role === 'user' && <ChatAssistant />}

          <footer className="bg-indiapost-cream/30 dark:bg-stone-900 border-t border-indiapost-sand/30 dark:border-stone-800 py-16 transition-colors">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-[11px] text-indiapost-sand font-black uppercase tracking-[0.4em] mb-6">{t.footer_text}</p>
              <p className="text-[10px] text-stone-500 max-w-2xl mx-auto leading-relaxed font-medium uppercase tracking-widest">{t.footer_subtext}</p>
              <div className="flex justify-center gap-10 mt-12 text-[10px] font-black text-indiapost-sand uppercase tracking-[0.3em]">
                <a href="#" className="hover:text-indiapost-red transition-colors">{t.privacy}</a>
                <a href="#" className="hover:text-indiapost-red transition-colors">{t.terms}</a>
                <a href="#" className="hover:text-indiapost-red transition-colors">{t.charter}</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </LangContext.Provider>
  );
};

export default App;
