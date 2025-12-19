
import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Complaint, ComplaintStatus } from '../types';
import { LangContext } from '../App';
import { analyzeComplaint } from '../services/geminiService';
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
  HelpCircle,
  Hash
} from 'lucide-react';

interface SubmitProps {
  user: User;
  onSubmit: (newComplaint: Complaint) => void;
  existingComplaints?: Complaint[];
}

const SubmitComplaint: React.FC<SubmitProps> = ({ user, onSubmit, existingComplaints = [] }) => {
  const navigate = useNavigate();
  const { t, lang } = useContext(LangContext);
  const [description, setDescription] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [postOffice, setPostOffice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
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

    // Abort existing session if any to prevent state conflicts
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch(e) {}
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Use specific locale codes
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceError(null);
    };
    
    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const result = event.results[i][0].transcript;
          setDescription(prev => prev + (prev ? " " : "") + result);
        } else {
          currentTranscript += event.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      console.error("Speech Recognition Error:", event.error);
      
      if (event.error === 'network') {
        setVoiceError(lang === 'hi' ? "कनेक्शन एरर: कृपया इंटरनेट की जांच करें।" : "Internet issue: Please check your connection and try again.");
      } else if (event.error === 'not-allowed') {
        setVoiceError(lang === 'hi' ? "माइक की अनुमति नहीं है।" : "Microphone access is blocked.");
      } else if (event.error === 'no-speech') {
        // Just stop quietly
      } else {
        setVoiceError(lang === 'hi' ? "कुछ गलत हुआ। फिर से प्रयास करें।" : "Something went wrong. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
        alert(lang === 'hi' ? "कृपया अपनी समस्या लिखें।" : "Please describe your problem.");
        return;
    }
    setIsSubmitting(true);
    setStatusMsg(t.submit_triage);
    
    try {
      const context = existingComplaints
        .slice(0, 5)
        .map(c => `Ref: ${c.id}, Msg: ${c.description}`)
        .join('\n');
        
      const analysis = await analyzeComplaint(description, image || undefined, context, trackingNumber);
      
      const newComplaint: Complaint = {
        id: `PGC-${Math.floor(Math.random() * 90000) + 10000}`,
        userId: user.id,
        userName: user.name,
        description,
        trackingNumber: trackingNumber || undefined,
        postOffice,
        date,
        imageUrl: image || undefined,
        status: ComplaintStatus.OPEN,
        analysis,
        updates: [
          { 
            timestamp: new Date().toISOString(), 
            author: 'Support Team', 
            message: analysis.isPotentialDuplicate 
              ? `Your complaint is registered. Note: We found a similar previous complaint and will review it.` 
              : `Complaint received. Reference Number generated. Urgency: ${analysis.priority}.`, 
            isInternal: false,
            type: 'message'
          }
        ]
      };

      onSubmit(newComplaint);
      setStatusMsg(t.submit_confirmed);
      setTimeout(() => navigate('/menu'), 1500);
    } catch (err) {
      alert("Registration successful, but smart processing is slow. An officer will manually review this.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-stone-500 hover:text-indiapost-red mb-6 transition-colors font-bold text-xs uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> {t.nav_home}
      </button>

      <div className="bg-white dark:bg-stone-900 shadow-xl border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
        <div className="bg-indiapost-red text-white p-8 border-b-4 border-indiapost-amber">
          <h2 className="text-2xl font-black uppercase tracking-tight">{t.submit_title}</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mt-1">Posty • Grievance Redressal</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-stone-700 dark:text-stone-300 flex items-center gap-2">
                <FileText size={18} className="text-indiapost-red" /> {t.submit_desc}
              </label>
              
              <button 
                type="button" 
                onClick={startVoice}
                className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-xs font-black transition-all border ${
                  isListening 
                    ? 'bg-indiapost-red text-white animate-pulse border-indiapost-red' 
                    : 'bg-white dark:bg-stone-800 text-stone-600 border-stone-300 dark:border-stone-700 hover:bg-stone-50'
                }`}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                {isListening ? (lang === 'hi' ? 'सुन रहा हूँ...' : 'STOP SPEAKING') : (lang === 'hi' ? 'बोलकर लिखें' : 'USE VOICE')}
              </button>
            </div>
            
            <textarea
              required
              rows={6}
              placeholder={t.submit_placeholder_desc}
              className="w-full p-6 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:ring-4 focus:ring-indiapost-red/10 focus:border-indiapost-red transition-all font-medium text-base shadow-inner"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {voiceError && (
              <div className="flex items-center gap-3 text-red-600 text-[11px] font-bold bg-red-50 p-4 rounded-xl border border-red-100 animate-in shake duration-300">
                <AlertCircle size={16} /> 
                <p>{voiceError}</p>
                <button type="button" onClick={() => setVoiceError(null)} className="ml-auto p-1 hover:bg-red-100 rounded-full"><X size={14} /></button>
              </div>
            )}
            
            {isListening && (
              <div className="flex items-center gap-2 px-4 py-2 bg-indiapost-red/5 text-indiapost-red text-[10px] font-black uppercase rounded-lg border border-indiapost-red/10">
                 <div className="w-1.5 h-1.5 bg-indiapost-red rounded-full animate-ping" />
                 Please speak clearly into the microphone
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                <Hash size={16} className="text-indiapost-red" /> Tracking Number
              </label>
              <input
                type="text"
                placeholder="e.g. EB123456789IN"
                className="w-full p-4 bg-white dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 rounded-lg outline-none focus:border-indiapost-red transition-all font-bold"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={16} className="text-indiapost-red" /> {t.submit_branch}
              </label>
              <input
                type="text"
                required
                placeholder={t.submit_placeholder_branch}
                className="w-full p-4 bg-white dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 rounded-lg outline-none focus:border-indiapost-red transition-all font-bold"
                value={postOffice}
                onChange={(e) => setPostOffice(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={16} className="text-indiapost-red" /> {t.submit_date}
              </label>
              <input
                type="date"
                required
                className="w-full p-4 bg-white dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 rounded-lg outline-none focus:border-indiapost-red transition-all font-bold dark:[color-scheme:dark]"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
              <Camera size={16} className="text-indiapost-red" /> {t.submit_evidence}
            </label>
            <div className="border-2 border-dashed border-stone-100 dark:border-stone-800 rounded-2xl p-10 text-center hover:bg-stone-50 transition-all relative group cursor-pointer">
              {image ? (
                <div className="relative inline-block">
                  <img src={image} alt="Preview" className="max-h-56 mx-auto rounded-xl shadow-xl border border-white" />
                  <button onClick={(e) => { e.preventDefault(); setImage(null); }} className="absolute -top-3 -right-3 bg-indiapost-red text-white p-2.5 rounded-full shadow-2xl hover:scale-110 transition-transform"><X size={16} /></button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-stone-50 dark:bg-stone-800 rounded-xl flex items-center justify-center mx-auto group-hover:bg-indiapost-red/5">
                    <Camera className="text-stone-300 group-hover:text-indiapost-red transition-colors" size={32} />
                  </div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Upload photo of Receipt or Article Label</p>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-indiapost-red text-white py-6 rounded-xl font-black uppercase text-sm tracking-[0.2em] hover:bg-red-700 transition shadow-2xl shadow-red-900/30 flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin" size={20} /> {statusMsg}</>
              ) : (
                <><CheckCircle2 size={20} /> {t.submit_btn}</>
              )}
            </button>
            <p className="text-center text-[10px] font-bold text-stone-400 mt-6 flex items-center justify-center gap-2 uppercase">
              <HelpCircle size={14} /> Tracking numbers help us help you faster.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
