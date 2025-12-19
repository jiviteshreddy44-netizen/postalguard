
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
  Hash,
  Globe
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
  const [isListening, setIsListening] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('en-IN');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Set default voice mode based on UI language
    setVoiceMode(lang === 'hi' ? 'hi-IN' : 'en-IN');
  }, [lang]);

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

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch(e) {}
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = voiceMode === 'hinglish' ? 'en-IN' : voiceMode;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceError(null);
    };
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setDescription(prev => prev + (prev && !prev.endsWith(' ') ? " " : "") + finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      console.error("Speech Recognition Error:", event.error);
      
      if (event.error === 'network') {
        setVoiceError(lang === 'hi' ? "कनेक्शन एरर: कृपया इंटरनेट की जांच करें।" : "Internet issue: Please check your connection.");
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
    <div className="max-w-4xl mx-auto py-6 px-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-indiapost-sand hover:text-indiapost-red mb-10 transition-colors font-black text-[10px] uppercase tracking-[0.3em]"
      >
        <ArrowLeft size={16} /> {t.nav_home}
      </button>

      <div className="bg-white dark:bg-stone-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-indiapost-sand/30 dark:border-stone-800 rounded-[3rem] overflow-hidden">
        <div className="bg-white dark:bg-stone-800 p-12 relative border-b border-indiapost-sand/20 dark:border-stone-700">
          <h2 className="text-3xl font-black uppercase tracking-tight text-stone-900 dark:text-white">{t.submit_title}</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-indiapost-red mt-2">Grievance Registration Protocol</p>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indiapost-cream/50 dark:bg-stone-700/30 rounded-bl-[100%]"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-12">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <label className="text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-widest flex items-center gap-3">
                <FileText size={18} className="text-indiapost-red" /> {t.submit_desc}
              </label>
              
              <div className="flex items-center gap-3 bg-indiapost-beige dark:bg-stone-800 p-2 rounded-2xl border border-indiapost-sand/20">
                <div className="flex bg-white dark:bg-stone-900 rounded-xl overflow-hidden shadow-sm border border-indiapost-sand/10">
                  {[
                    { id: 'en-IN', label: 'English' },
                    { id: 'hi-IN', label: 'हिन्दी' },
                    { id: 'hinglish', label: 'Mix' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setVoiceMode(m.id as VoiceMode)}
                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-tighter transition-all ${
                        voiceMode === m.id 
                          ? 'bg-indiapost-red text-white' 
                          : 'text-stone-400 hover:bg-white dark:hover:bg-stone-800'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <button 
                  type="button" 
                  onClick={startVoice}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isListening 
                      ? 'bg-indiapost-red text-white animate-pulse shadow-lg shadow-indiapost-red/20' 
                      : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-2 border-indiapost-sand/20 hover:border-indiapost-red shadow-sm'
                  }`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  {isListening ? 'Stop' : 'Voice'}
                </button>
              </div>
            </div>
            
            <div className="relative group">
              <textarea
                required
                rows={7}
                placeholder={t.submit_placeholder_desc}
                className="w-full p-8 bg-indiapost-cream/20 dark:bg-stone-800 text-stone-900 dark:text-white border-2 border-indiapost-sand/20 dark:border-stone-700 rounded-[2rem] outline-none focus:border-indiapost-red transition-all font-medium text-base shadow-inner resize-none placeholder:text-stone-300"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {isListening && (
                <div className="absolute top-6 right-6 flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-indiapost-red rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-indiapost-red rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-indiapost-red rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}
            </div>

            {voiceError && (
              <div className="flex items-center gap-4 text-indiapost-red text-[11px] font-black uppercase tracking-widest bg-indiapost-red/5 p-5 rounded-2xl border border-indiapost-red/10 animate-in shake duration-300">
                <AlertCircle size={18} /> 
                <p>{voiceError}</p>
                <button type="button" onClick={() => setVoiceError(null)} className="ml-auto p-1.5 hover:bg-indiapost-red/10 rounded-full transition-colors"><X size={14} /></button>
              </div>
            )}
            
            {isListening && (
              <div className="flex items-center gap-3 px-6 py-3 bg-indiapost-red/5 text-indiapost-red text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-indiapost-red/10">
                 <div className="w-2 h-2 bg-indiapost-red rounded-full animate-ping" />
                 Listening: {voiceMode === 'hinglish' ? 'Hinglish (Mix)' : voiceMode === 'hi-IN' ? 'Hindi' : 'English'}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Hash size={14} className="text-indiapost-red" /> Tracking ID
              </label>
              <input
                type="text"
                placeholder="e.g. EB123456789IN"
                className="w-full p-5 bg-indiapost-cream/20 dark:bg-stone-800 text-stone-900 dark:text-white border-2 border-indiapost-sand/20 dark:border-stone-700 rounded-2xl outline-none focus:border-indiapost-red transition-all font-bold placeholder:text-stone-300 shadow-sm"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <MapPin size={14} className="text-indiapost-red" /> Post Office
              </label>
              <input
                type="text"
                required
                placeholder={t.submit_placeholder_branch}
                className="w-full p-5 bg-indiapost-cream/20 dark:bg-stone-800 text-stone-900 dark:text-white border-2 border-indiapost-sand/20 dark:border-stone-700 rounded-2xl outline-none focus:border-indiapost-red transition-all font-bold placeholder:text-stone-300 shadow-sm"
                value={postOffice}
                onChange={(e) => setPostOffice(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={14} className="text-indiapost-red" /> Incident Date
              </label>
              <input
                type="date"
                required
                className="w-full p-5 bg-indiapost-cream/20 dark:bg-stone-800 text-stone-900 dark:text-white border-2 border-indiapost-sand/20 dark:border-stone-700 rounded-2xl outline-none focus:border-indiapost-red transition-all font-bold shadow-sm dark:[color-scheme:dark]"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Camera size={14} className="text-indiapost-red" /> Evidence Upload
            </label>
            <div className="border-2 border-dashed border-indiapost-sand/30 dark:border-stone-800 rounded-[2.5rem] p-16 text-center hover:bg-indiapost-cream/20 dark:hover:bg-stone-800/50 transition-all relative group cursor-pointer shadow-inner">
              {image ? (
                <div className="relative inline-block">
                  <img src={image} alt="Preview" className="max-h-72 mx-auto rounded-3xl shadow-2xl border-4 border-white dark:border-stone-700" />
                  <button onClick={(e) => { e.preventDefault(); setImage(null); }} className="absolute -top-4 -right-4 bg-indiapost-red text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform"><X size={20} /></button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-indiapost-beige dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto group-hover:bg-indiapost-red transition-all group-hover:scale-110">
                    <Camera className="text-indiapost-sand group-hover:text-white transition-colors" size={32} />
                  </div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Drop Receipt or Photo here</p>
                  <p className="text-[9px] font-bold text-stone-300 uppercase">Max size: 5MB • JPG, PNG</p>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                </div>
              )}
            </div>
          </div>

          <div className="pt-8">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-indiapost-red text-white py-8 rounded-[2rem] font-black uppercase text-sm tracking-[0.4em] hover:bg-red-800 transition shadow-2xl shadow-indiapost-red/30 flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin" size={20} /> {statusMsg}</>
              ) : (
                <><CheckCircle2 size={24} /> {t.submit_btn}</>
              )}
            </button>
            <div className="flex items-center justify-center gap-3 mt-10">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em]">
                {t.submit_triage}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
