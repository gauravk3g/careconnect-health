/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Bot,
  User,
  ShieldCheck,
  LifeBuoy,
  PhoneCall,
  Info,
} from 'lucide-react';
import { api } from '../services/api.js';
import { ChatMessage } from '../types/index.js';

interface AssistantPageProps {
  onNavigate: (tab: string) => void;
}

export const AssistantPage: React.FC<AssistantPageProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        "Hello! I'm your CareConnect Health Assistant. I can help explain healthcare terminology in plain language, help you organize questions for your doctor, clarify discharge routines, and navigate clinic resources.\n\nHow can I help you understand your healthcare information today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'How can I prepare for a routine doctor appointment?',
        'Can you explain this healthcare term in simple language?',
        'Where can I find general information about preventive care?',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'helpful' | 'not_helpful'>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Can you explain this healthcare term in simple language?',
    'How can I prepare for a routine doctor appointment?',
    'Can you help me understand my discharge instructions?',
    'Where can I find general information about preventive care?',
    'How can I contact my healthcare provider?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // Build lightweight conversation history
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const res = await api.sendChatMessage(text, history);

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergencyAlert: res.isEmergencyAlert,
        suggestedFollowUps: res.suggestedFollowUps,
        disclaimer: res.disclaimer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown communication error';
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I apologize, but I encountered an issue connecting to the educational service: "${errorMsg}".\n\nCareConnect Health cannot replace medical staff. If you have an urgent medical question, please call your clinic or contact human support.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content:
          "Conversation cleared. I am ready to help you explore general health education or explain medical concepts in simple terms. What would you like to discuss?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = async (messageId: string, rating: 'helpful' | 'not_helpful') => {
    setFeedbackGiven((prev) => ({ ...prev, [messageId]: rating }));
    try {
      await api.submitFeedback({
        targetType: 'chat_response',
        targetId: messageId,
        rating,
      });
    } catch (err) {
      console.warn('Feedback could not be submitted:', err);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto space-y-3">
      {/* Top Header Card */}
      <div className="bg-white px-5 py-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-base">AI Health Assistant</h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Educational Support
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Plain-language medical terms & patient navigation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('support')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Human Support</span>
          </button>
          <button
            onClick={handleClearChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-700 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Mandatory Regulatory & Scope Disclaimer */}
      <div className="bg-sky-50/80 border border-sky-200/70 p-3 rounded-xl text-xs text-sky-900 flex items-start gap-2.5 shrink-0">
        <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
        <div className="leading-snug">
          <strong>Notice:</strong> CareConnect Health provides general educational and patient-support information. It does not diagnose conditions, prescribe treatment, or replace advice from a qualified healthcare professional. If this is an emergency, call <strong className="font-bold underline">911</strong> immediately.
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-150`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                {/* Emergency Box if flagged */}
                {msg.isEmergencyAlert && (
                  <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-900 font-medium flex items-start gap-2 shadow-xs">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-red-800">POTENTIAL EMERGENCY DETECTED:</strong>
                      <p className="mt-0.5">
                        If you or someone around you is in acute distress (chest pressure, severe breathing difficulty, stroke signs), please dial 911 or visit the nearest ER right away.
                      </p>
                      <a
                        href="tel:911"
                        className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 bg-red-600 text-white rounded-lg text-[11px] font-bold hover:bg-red-700"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Dial 911 Now</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                    isUser
                      ? 'bg-teal-700 text-white rounded-br-xs'
                      : msg.error
                      ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-bl-xs'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Bubble Footer: Timestamp & Actions */}
                <div
                  className={`flex items-center gap-2 text-[11px] text-slate-400 px-1 ${
                    isUser ? 'justify-end' : 'justify-between'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {!isUser && !msg.error && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <div className="h-3 w-px bg-slate-200 mx-0.5" />

                      <button
                        onClick={() => handleFeedback(msg.id, 'helpful')}
                        className={`p-1 rounded transition-colors ${
                          feedbackGiven[msg.id] === 'helpful'
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'hover:text-emerald-600 hover:bg-slate-100'
                        }`}
                        title="Mark as helpful"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleFeedback(msg.id, 'not_helpful')}
                        className={`p-1 rounded transition-colors ${
                          feedbackGiven[msg.id] === 'not_helpful'
                            ? 'text-rose-700 bg-rose-50'
                            : 'hover:text-rose-600 hover:bg-slate-100'
                        }`}
                        title="Mark as unhelpful"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Follow up suggestions */}
                {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {msg.suggestedFollowUps.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/60 font-medium transition-colors text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 justify-start animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 rounded-bl-xs flex items-center gap-2 text-xs text-slate-500 font-medium">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="ml-1">CareConnect Assistant is formulating guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Ribbon */}
      <div className="shrink-0 overflow-x-auto pb-1 pt-0.5 no-scrollbar flex items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
          Suggested:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200/80 font-medium transition-colors whitespace-nowrap shadow-2xs cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 shadow-2xs shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about medical terms, visit prep, or discharge paperwork..."
            aria-label="Ask health assistant"
            disabled={loading}
            className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Private Server-Side Gemini 3.8 Flash • Non-diagnostic educational assistant</span>
          </span>
          <span>Max 4,000 chars</span>
        </div>
      </div>
    </div>
  );
};
