
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { getQuickSupport } from '../services/geminiService';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Namaste! I am Dak-Mitra, your Posty digital assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const response = await getQuickSupport(userText);
      setMessages(prev => [...prev, { role: 'bot', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Technical issue. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-slate-900 w-80 sm:w-96 h-[550px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col border border-slate-800 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-red-600 p-5 text-white flex justify-between items-center border-b border-red-500 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                <Bot size={20} />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-tighter">Dak-Mitra</p>
                <p className="text-[10px] font-bold text-red-100/70 uppercase tracking-widest">Posty Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/20 p-2 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-5 space-y-6 bg-slate-950 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-red-600 text-white rounded-tr-none shadow-xl shadow-red-900/10 font-medium' 
                    : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none font-medium'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl rounded-tl-none flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Analyzing Query</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-5 border-t border-slate-800 bg-slate-900 flex gap-3">
            <input
              type="text"
              placeholder="Type your inquiry..."
              className="flex-grow px-5 py-3 bg-slate-850 border border-slate-700 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all placeholder:text-slate-600 font-medium"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="bg-red-600 text-white p-3 rounded-2xl hover:bg-red-700 transition shadow-xl shadow-red-600/20 active:scale-90">
              <Send size={20} />
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-red-600 text-white w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:scale-110 transition-all group relative border-2 border-red-500 shadow-red-600/20 active:scale-90"
        >
          <Bot size={32} className="group-hover:animate-wiggle" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full animate-ping opacity-75"></span>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-4 border-slate-950"></span>
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;
