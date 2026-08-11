import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Zap } from 'lucide-react';
import { useAskAiAssistant } from '../hooks/useErpQueries';

export const AiServiceChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am the Uday Electrical Works AI Technical Assistant. Ask me about motor rewinding, transformer oil testing, APFC panels, or trip code troubleshooting.'
    }
  ]);

  const askAiMutation = useAskAiAssistant();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userQuery = inputMsg;
    setMessages((prev) => [...prev, { sender: 'user', text: userQuery }]);
    setInputMsg('');

    try {
      const res = await askAiMutation.mutateAsync({ query: userQuery });
      const aiData = res?.data;
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiData?.reply || 'Our electrical engineering team is available for on-site plant inspection.',
          actionText: aiData?.actionText
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Apologies, I encountered a connection issue. Please contact our 24/7 helpline at +91 98765 43210.' }
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Toggle Button — Icon Only */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(true)}
          className="p-3.5 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white shadow-lg shadow-[#F97316]/30 flex items-center justify-center border-2 border-white transition-all relative group"
          title="AI Technical Assistant"
        >
          <Sparkles className="w-5 h-5 fill-current animate-pulse" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="w-80 sm:w-96 h-[480px] bg-white border border-slate-200 rounded-xl shadow-card flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 border border-orange-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">UEW Technical AI</h3>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Class-A Engineering Engine</span>
                  </span>
                </div>
              </div>

              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-lg ${
                      m.sender === 'user'
                        ? 'bg-orange-500 text-white font-semibold'
                        : 'bg-slate-50 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <p>{m.text}</p>
                    {m.actionText && (
                      <span className="mt-2 inline-block px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/30 text-orange-700 font-bold text-[10px]">
                        💡 Suggestion: {m.actionText}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-slate-50 border-t border-slate-200 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask about motor trip, transformer BDV..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-orange-500 text-white hover:bg-orange-400 font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
