import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { getHealthAdvice } from '../services/geminiService';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "Does blood cancer mean I am going to die?",
    answer: "No. Many types of blood cancer are treatable, and in many cases, patients recover fully or live long, controlled lives. Outcomes depend on the type, stage, and response to treatment."
  },
  {
    id: 2,
    question: "What type of blood cancer do I have?",
    answer: "Blood cancer mainly includes three types: Leukemia, Lymphoma, and Multiple Myeloma. Each has different treatments and outcomes."
  },
  {
    id: 3,
    question: "At what stage is my cancer?",
    answer: "The stage shows how advanced the cancer is. Early diagnosis usually leads to better treatment results."
  },
  {
    id: 4,
    question: "What treatment will I need?",
    answer: "Treatment may include chemotherapy, targeted therapy, immunotherapy, radiation, or bone marrow (stem cell) transplant."
  },
  {
    id: 5,
    question: "Will chemotherapy be very painful or difficult?",
    answer: "Side effects vary from person to person. Modern treatments manage pain and side effects much better than before."
  },
  {
    id: 6,
    question: "How long will the treatment last?",
    answer: "Treatment can last from a few months to several years, depending on the cancer type and how the body responds."
  },
  {
    id: 7,
    question: "Will I be able to live a normal life again?",
    answer: "Many patients return to normal or near-normal life during or after treatment, though recovery may take time."
  },
  {
    id: 8,
    question: "Why did this happen to me? Did I do something wrong?",
    answer: "In most cases, blood cancer is not caused by anything the patient did. It usually results from genetic changes in blood cells."
  },
  {
    id: 9,
    question: "How much will the treatment cost?",
    answer: "Costs depend on the treatment plan and location. Financial assistance and support programs are often available."
  },
  {
    id: 10,
    question: "How do I tell my family about my diagnosis?",
    answer: "Be honest but gentle. Sharing information gradually and involving doctors can help families understand better."
  },
  {
    id: 11,
    question: "How can I cope mentally and emotionally?",
    answer: "Fear, anxiety, and sadness are normal. Support from family, friends, counselors, or patient support groups is very helpful."
  }
];

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', sender: 'bot', text: 'Hello! I am your AI Health Assistant. Ask me anything about blood donation or finding a doctor.' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const replyText = await getHealthAdvice(userMsg.text);

    const botMsg: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: replyText };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleFAQClick = (faq: FAQItem) => {
    // Add user question message
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: faq.question };
    setMessages(prev => [...prev, userMsg]);

    // Add bot answer message after a short delay
    setTimeout(() => {
      const botMsg: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: faq.answer };
      setMessages(prev => [...prev, botMsg]);
    }, 300);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${!isOpen ? 'pointer-events-none' : ''}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          } transition-all duration-300 absolute bottom-0 right-0 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center pointer-events-auto`}
        aria-label="Open Chat"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <div
        className={`${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'
          } transition-all duration-300 origin-bottom-right w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col`}
        style={{ maxHeight: '600px', height: '80vh' }}
      >
        {/* Header */}
        <div className="bg-red-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-full">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">HemoCare Assistant</h3>
              <span className="text-xs text-red-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Online
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                  ? 'bg-red-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* FAQ Suggestions */}
          {!loading && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-xs text-slate-500 font-medium px-1">Frequently Asked Questions:</div>
              <div className="flex flex-wrap gap-2">
                {FAQ_DATA.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleFAQClick(faq)}
                    className="text-xs bg-white border border-red-200 text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all shadow-sm text-left"
                  >
                    <span className="font-semibold">Q{faq.id}:</span> {faq.question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about blood donation..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;

