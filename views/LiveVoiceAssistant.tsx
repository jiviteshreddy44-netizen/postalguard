
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
// Fixed: Added Loader2 to the list of imports from lucide-react
import { Mic, MicOff, X, PhoneCall, Volume2, Loader2 } from 'lucide-react';

const encode = (bytes: Uint8Array) => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveVoiceAssistant: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const startSession = async () => {
    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          setIsActive(true);
          setIsConnecting(false);
          const source = audioContextRef.current!.createMediaStreamSource(stream);
          const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              int16[i] = inputData[i] * 32768;
            }
            // Fixed: Use sessionPromise.then to prevent stale closures and ensure session is ready
            sessionPromise.then(session => {
              session.sendRealtimeInput({
                media: {
                  data: encode(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000'
                }
              });
            });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(audioContextRef.current!.destination);
        },
        onmessage: async (message) => {
          const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData && outputAudioContextRef.current) {
            const ctx = outputAudioContextRef.current;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }
          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onclose: () => setIsActive(false),
        onerror: (e) => console.error("Live Audio Error:", e)
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        systemInstruction: 'You are Dak-Sarthi, a real-time voice assistant for India Post. Help users with their grievances naturally.'
      }
    });

    sessionRef.current = sessionPromise;
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.then((s: any) => s.close());
    }
    audioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    setIsActive(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6">
      <div className="bg-white dark:bg-stone-950 w-full max-w-lg rounded-[3rem] p-12 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-indiapost-red animate-pulse"></div>
        <button onClick={stopSession} className="absolute top-8 right-8 p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-500 hover:text-indiapost-red transition-all">
          <X size={24} />
        </button>

        <div className="mb-10">
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 transition-all ${isActive ? 'bg-indiapost-red text-white scale-110 shadow-2xl shadow-indiapost-red/40' : 'bg-stone-100 text-stone-300'}`}>
            {isActive ? <Volume2 size={48} className="animate-bounce" /> : <PhoneCall size={48} />}
          </div>
          <h2 className="text-3xl font-black text-stone-900 dark:text-white uppercase tracking-tighter">Dak-Sarthi Live</h2>
          <p className="text-[10px] font-black text-indiapost-red uppercase tracking-[0.4em] mt-3">Native Audio Interface</p>
        </div>

        <div className="space-y-6">
          <p className="text-sm font-medium text-stone-500 leading-relaxed italic">
            {isActive ? "Connected and Listening. Speak your concern..." : "Initialize a real-time voice session with our advanced AI."}
          </p>

          {!isActive ? (
            <button 
              onClick={startSession} disabled={isConnecting}
              className="w-full bg-indiapost-red text-white py-6 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl flex items-center justify-center gap-4 hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {isConnecting ? <Loader2 className="animate-spin" /> : <Mic size={24} />}
              {isConnecting ? "Connecting to AI..." : "Start Live Conversation"}
            </button>
          ) : (
            <button 
              onClick={stopSession}
              className="w-full bg-stone-900 text-white py-6 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl flex items-center justify-center gap-4 hover:bg-stone-800 transition-all"
            >
              <MicOff size={24} /> Terminate Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveVoiceAssistant;
