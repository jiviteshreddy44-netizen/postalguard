
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { getQuickSupport } from '../services/geminiService';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Namaste! I am Dak-Mitra, your India Post digital assistant. How can I help you today?' }
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
    <div className="fixed bottom-10 right-10 z-[100]">
      {isOpen ? (
        <div className="bg-white w-80 sm:w-96 h-[550px] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col border border-stone-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-indiapost-red p-5 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot size={20} />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-tighter">Dak-Mitra</p>
                <p className="text-[10px] font-bold text-red-100/70 uppercase tracking-widest leading-none">AI Support</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-2 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-5 space-y-6 bg-indiapost-beige/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indiapost-red text-white font-medium shadow-md' 
                    : 'bg-white border border-stone-200 text-stone-700 font-medium shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 p-4 rounded-xl flex items-center gap-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indiapost-red rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indiapost-red rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indiapost-red rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-stone-100 bg-white flex gap-3">
            <input
              type="text"
              placeholder="Ask Dak-Mitra..."
              className="flex-grow px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-indiapost-red transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="bg-indiapost-red text-white p-3 rounded-lg hover:bg-red-700 transition active:scale-95">
              <Send size={20} />
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indiapost-red text-white w-20 h-20 rounded-full shadow-[0_10px_30px_rgba(209,33,40,0.4)] flex items-center justify-center hover:scale-105 transition-all group relative border-4 border-white"
        >
          <img 
            src="https://www.indiapost.gov.in/PublishingImages/chatbot-icon.png" 
            alt="Dak-Mitra" 
            className="w-14 h-14 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/4712/4712139.png";
            }}
          />
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;
