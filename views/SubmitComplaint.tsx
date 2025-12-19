
import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Complaint, ComplaintStatus } from '../types';
import { LangContext } from '../App';
import { analyzeComplaint, extractDetailsFromImage } from '../services/geminiService';
import { 
  ArrowLeft, 
  Camera, 
  FileText, 
  MapPin, 
  Calendar, 
  Loader2,
  Mic,
  MicOff,
  CheckCircle2,
  X,
  AlertCircle,
  Hash,
  Sparkles
} from 'lucide-react';

interface SubmitProps {
  user: User;
  onSubmit: (newComplaint: Complaint) => void;
  existingComplaints?: Complaint[];
}

type VoiceMode = 'en-IN' | 'hi-IN' | 'hinglish';

const SubmitComplaint: React.FC<SubmitProps> = ({ user, onSubmit, existingComplaints = [] }) => {
  const navigate = useNavigate();
  const { t, lang } = useContext(LangContext);
  const [description, setDescription] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [postOffice, setPostOffice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('en-IN');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setVoiceMode(lang === 'hi' ? 'hi-IN' : 'en-IN');
  }, [lang]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleExtractDetails = async () => {
    if (!image) return;
    setIsExtracting(true);
    const details = await extractDetailsFromImage(image);
    if (details) {
      if (details.trackingNumber) setTrackingNumber(details.trackingNumber);
      if (details.postOffice) setPostOffice(details.postOffice);
    }
    setIsExtracting(false);
  };

  const startVoice = () => {
    setVoiceError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setVoiceError(lang === 'hi' ? "आपका ब्राउज़र वॉयस इनपुट का समर्थन नहीं करता है।" : "Voice typing is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = voiceMode === 'hinglish' ? 'en-IN' : voiceMode;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) setDescription(prev => prev + (prev && !prev.endsWith(' ') ? " " : "") + finalTranscript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setIsSubmitting(true);
    setStatusMsg(t.submit_triage);
    
    try {
      const context = existingComplaints.slice(0, 3).map(c => c.description).join('\n');
      const analysis = await analyzeComplaint(description, image || undefined, context, trackingNumber);
      
      const newComplaint: Complaint = {
        id: `PGC-${Math.floor(Math.random() * 90000) + 10000}`,
        userId: user.id, userName: user.name, description, trackingNumber, postOffice, date, imageUrl: image || undefined,
        status: ComplaintStatus.NEW, analysis,
        updates: [{ timestamp: new Date().toISOString(), author: 'System', message: 'Complaint Logged Successfully.', isInternal: false, type: 'message' }],
        escalationLevel: 0,
        lastActivityAt: new Date().toISOString(),
        slaPaused: false
      };

      onSubmit(newComplaint);
      setStatusMsg(t.submit_confirmed);
      setTimeout(() => navigate('/menu'), 1500);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-indiapost-red mb-10 transition-colors font-black text-[10px] uppercase tracking-[0.3em]">
        <ArrowLeft size={16} /> {t.nav_home}
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] overflow-hidden shadow-sm">
        <div className="bg-slate-50 dark:bg-slate-800 p-12 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">{t.submit_title}</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-indiapost-red mt-2">Grievance Registration Protocol</p>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-12">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-3">
                <FileText size={18} className="text-indiapost-red" /> {t.submit_desc}
              </label>
              
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                  {['en-IN', 'hi-IN', 'hinglish'].map((m) => (
                    <button key={m} type="button" onClick={() => setVoiceMode(m as VoiceMode)} className={`px-4 py-2 text-[10px] font-black uppercase tracking-tighter transition-all ${voiceMode === m ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-slate-400 hover:bg-slate-50'}`}>{m === 'hinglish' ? 'Mix' : m.split('-')[0]}</button>
                  ))}
                </div>
                <button type="button" onClick={startVoice} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${isListening ? 'bg-indiapost-red text-white animate-pulse' : 'bg-white text-slate-600 border border-slate-200 hover:border-black'}`}>
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />} {isListening ? 'Stop' : 'Voice'}
                </button>
              </div>
            </div>
            
            <textarea required rows={7} placeholder={t.submit_placeholder_desc} className="w-full p-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] outline-none focus:border-black dark:focus:border-white transition-all font-medium placeholder:text-slate-300" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Hash size={14} className="text-indiapost-red" /> Tracking ID</label>
              <input type="text" placeholder="e.g. EB123456789IN" className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-black transition-all font-bold" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><MapPin size={14} className="text-indiapost-red" /> Post Office</label>
              <input type="text" required placeholder={t.submit_placeholder_branch} className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-black transition-all font-bold" value={postOffice} onChange={(e) => setPostOffice(e.target.value)} />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={14} className="text-indiapost-red" /> Date</label>
              <input type="date" required className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-black transition-all font-bold" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Camera size={14} className="text-indiapost-red" /> Evidence</label>
              {image && (
                <button type="button" onClick={handleExtractDetails} disabled={isExtracting} className="flex items-center gap-2 text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-black hover:text-white transition-all">
                  {isExtracting ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />} Extract Details from Photo
                </button>
              )}
            </div>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 text-center hover:bg-slate-50 transition-all relative group cursor-pointer">
              {image ? (
                <div className="relative inline-block">
                  <img src={image} alt="Preview" className="max-h-72 mx-auto rounded-3xl shadow-lg" />
                  <button onClick={(e) => { e.preventDefault(); setImage(null); }} className="absolute -top-4 -right-4 bg-black text-white p-3 rounded-full shadow-2xl hover:scale-110"><X size={20} /></button>
                </div>
              ) : (
                <div className="space-y-4 py-10">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto group-hover:bg-black dark:group-hover:bg-white transition-all">
                    <Camera className="text-slate-300 group-hover:text-white dark:group-hover:text-black" size={32} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drop Receipt or Photo here</p>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                </div>
              )}
            </div>
          </div>

          <div className="pt-8">
            <button type="submit" disabled={isSubmitting} className="w-full bg-black dark:bg-white dark:text-black text-white py-8 rounded-[2rem] font-black uppercase text-sm tracking-[0.4em] hover:bg-slate-800 transition shadow-2xl flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50">
              {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> {statusMsg}</> : <><CheckCircle2 size={24} /> {t.submit_btn}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
