
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Complaint, ComplaintStatus } from '../types';
import { analyzeComplaint } from '../services/geminiService';
import { 
  ArrowLeft, 
  Camera, 
  FileText, 
  MapPin, 
  Calendar, 
  Send,
  Loader2,
  Mic,
  MicOff,
  Languages,
  Zap,
  CheckCircle2,
  X
} from 'lucide-react';

interface SubmitProps {
  user: User;
  onSubmit: (complaint: Complaint) => void;
  existingComplaints?: Complaint[];
}

const SubmitComplaint: React.FC<SubmitProps> = ({ user, onSubmit, existingComplaints = [] }) => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [postOffice, setPostOffice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setDescription(prev => prev + (prev ? " " : "") + transcript);
    };
    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setProcessingStatus('Connecting to AI Core...');
    try {
      const context = existingComplaints
        .map(c => `[${c.id}]: ${c.description.substring(0, 50)}... Category: ${c.analysis?.category}`)
        .join('\n');

      setProcessingStatus('Extracting Entities...');
      const analysis = await analyzeComplaint(description, image || undefined, context);
      
      setProcessingStatus('Mapping Intelligent Routing...');
      const newComplaint: Complaint = {
        id: `PGC-${Math.floor(Math.random() * 90000) + 10000}`,
        userId: user.id,
        description,
        postOffice,
        date,
        imageUrl: image || undefined,
        status: ComplaintStatus.OPEN,
        analysis,
        updates: [
          {
            timestamp: new Date().toISOString(),
            author: user.name,
            message: "Grievance registered. AI analysis complete.",
            isInternal: false
          }
        ]
      };

      onSubmit(newComplaint);
      setProcessingStatus('Registration Successful');
      setTimeout(() => navigate('/menu'), 1000);
    } catch (err) {
      alert("Intelligence layer unreachable. Retrying manual entry.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-12 max-w-4xl mx-auto w-full animate-in fade-in zoom-in duration-500">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-stone-500 hover:text-red-600 mb-10 transition-colors font-black text-sm uppercase tracking-widest"
      >
        <ArrowLeft size={18} /> Dashboard
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-3xl overflow-hidden border border-stone-200 dark:border-slate-800">
        <div className="bg-stone-50 dark:bg-slate-850 p-12 text-stone-900 dark:text-white relative border-b border-stone-200 dark:border-slate-800">
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold tracking-tighter mb-2">File a Grievance</h2>
            <p className="text-red-600 dark:text-red-500 font-black uppercase text-xs tracking-[0.3em]">India Post Neural Redressal Layer</p>
          </div>
          <div className="absolute top-0 right-0 p-10 opacity-5 hidden sm:block">
            <Languages size={140} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-12">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-stone-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} className="text-red-600" />
                Problem Description
              </label>
              <button 
                type="button"
                onClick={startVoice}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400 hover:bg-red-600 hover:text-white'}`}
              >
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                {isListening ? 'Listening...' : 'Voice Dictate'}
              </button>
            </div>
            <textarea
              required
              rows={5}
              placeholder="Provide a detailed description of the incident..."
              className="w-full p-6 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-3xl text-stone-900 dark:text-white focus:ring-4 focus:ring-red-600/10 focus:border-red-600 outline-none transition-all placeholder:text-stone-300 dark:placeholder:text-slate-700 font-medium text-lg leading-relaxed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-xs font-black text-stone-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={16} className="text-red-600" />
                Post Office Branch
              </label>
              <input
                type="text"
                required
                placeholder="Name of the post office"
                className="w-full p-5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-2xl text-stone-900 dark:text-white focus:ring-4 focus:ring-red-600/10 focus:border-red-600 outline-none transition-all placeholder:text-stone-300 dark:placeholder:text-slate-700 font-bold"
                value={postOffice}
                onChange={(e) => setPostOffice(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-stone-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={16} className="text-red-600" />
                Incident Date
              </label>
              <input
                type="date"
                required
                className="w-full p-5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-2xl text-stone-900 dark:text-white focus:ring-4 focus:ring-red-600/10 focus:border-red-600 outline-none transition-all font-bold dark:[color-scheme:dark]"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-stone-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Camera size={16} className="text-red-600" />
              Evidence Attachment
            </label>
            <div className="border-4 border-dashed border-stone-100 dark:border-slate-800 rounded-[3rem] p-12 text-center hover:bg-stone-50 dark:hover:bg-slate-850/50 hover:border-red-600/30 transition-all relative group cursor-pointer">
              {image ? (
                <div className="relative inline-block">
                  <img src={image} alt="Preview" className="max-h-80 mx-auto rounded-[2rem] shadow-3xl border border-stone-200 dark:border-slate-800 object-cover" />
                  <button 
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute -top-6 -right-6 bg-red-600 text-white p-4 rounded-full shadow-3xl hover:scale-110 transition-transform active:rotate-12 border-4 border-white dark:border-slate-900"
                  >
                    <X size={24} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="bg-stone-100 dark:bg-slate-800 p-8 rounded-full group-hover:scale-110 transition-transform shadow-inner">
                    <Camera size={48} className="text-stone-300 dark:text-slate-500 group-hover:text-red-600 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg text-stone-900 dark:text-slate-300 font-extrabold tracking-tight">Drop your photo here</p>
                    <p className="text-xs text-stone-400 dark:text-slate-500 font-bold uppercase tracking-widest">Supports PNG, JPG (Up to 10MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-8">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full bg-red-600 text-white font-black py-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 shadow-3xl transition transform active:scale-95 shadow-red-900/30 ${isSubmitting ? 'opacity-90 grayscale' : 'hover:bg-red-700 hover:-translate-y-2'}`}
            >
              {isSubmitting ? (
                <div className="flex flex-col items-center gap-4">
                   <div className="flex items-center gap-4">
                     <Loader2 className="animate-spin" size={32} />
                     <span className="uppercase text-sm tracking-[0.4em] font-black">AI Processing</span>
                   </div>
                   <div className="px-6 py-2 bg-black/20 rounded-full">
                     <span className="text-xs text-red-100 font-bold animate-pulse">{processingStatus}</span>
                   </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <CheckCircle2 size={32} />
                  <span className="text-2xl tracking-tighter">Submit to Triage</span>
                </div>
              )}
            </button>
          </div>

          {!isSubmitting && (
             <div className="flex flex-wrap items-center gap-4 text-stone-400 dark:text-slate-500 justify-center py-6 border-t border-stone-100 dark:border-slate-800 mt-4">
                <div className="flex items-center gap-2 bg-stone-100 dark:bg-slate-850 px-5 py-2.5 rounded-2xl border border-stone-200 dark:border-slate-800">
                  <Zap size={16} className="text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Intelligent Priority Map</span>
                </div>
                <div className="flex items-center gap-2 bg-stone-100 dark:bg-slate-800 px-5 py-2.5 rounded-2xl border border-stone-200 dark:border-slate-700">
                  <Languages size={16} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Multilingual NLU</span>
                </div>
             </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
