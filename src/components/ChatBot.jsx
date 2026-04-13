import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader, ThumbsUp, ThumbsDown, Copy, Check, Mic, MicOff, Trash2 } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_CONTEXT = `You are Azzam's portfolio assistant. Answer questions about Azzam Abdul Khadar concisely and helpfully.

About Azzam:
- Full Stack Developer from Karnataka, India
- B.Tech in Computer Science from Visvesvaraya Technological University (VTU), Sep 2021 – Jun 2025
- Interned at Zenexis Solutions Pvt Ltd (Feb 2025 – Jun 2025) as a Full Stack Developer

Skills:
- Frontend: React.js, Vite.js, HTML5, CSS3, Ant Design, Bootstrap
- Backend: Node.js, Express.js, RESTful APIs, Multer, CORS, Mongoose
- Database: MongoDB
- Languages: JavaScript, Java, PHP
- Tools: Git, GitHub, GitLab, Bitbucket, Postman, VS Code, MySQL

Projects:
1. TaskHive (Jun 2025) – MERN app with user management, notes, lead tracking, event scheduling. 15+ API endpoints, 30% faster queries, 100% responsive UI.
2. BloodHub (Apr–May 2025) – MERN app for blood donation coordination. Reduced manual coordination by 30%, handles 100+ requests.
3. Hotel Booking Management System (Nov–Dec 2024) – PHP + MySQL system for reservations, dynamic pricing, automated check-out.

Contact: azzamcse@gmail.com | +91-7349701430 | Karnataka, India
GitHub: github.com/Azzam-Abdul-Khadar
LinkedIn: linkedin.com/in/azzam-abdul-khadar-a6656729b

Keep answers short (2-4 sentences max). If asked something unrelated to Azzam or tech, politely redirect.`;

const SUGGESTIONS = [
  'What are your skills?',
  'Tell me about your projects',
  'What is your experience?',
  'How can I contact you?',
];

export default function ChatBot() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm Azzam's portfolio assistant 👋 Ask me anything about his skills, projects, or experience!", id: 0 }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [copied, setCopied] = useState({});
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const messageIdRef = useRef(1);
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        // Don't clear input - keep existing text
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';

        // Only process final results to avoid repetition
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }

        // Append to existing text instead of replacing
        if (finalTranscript.trim()) {
          setInput(prev => (prev + ' ' + finalTranscript).trim());
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    const userMsgId = messageIdRef.current++;
    setMessages(m => [...m, { role: 'user', text: msg, id: userMsgId }]);
    setLoading(true);

    try {
      if (!API_KEY || API_KEY === 'your_groq_api_key_here') throw new Error('no_key');

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_CONTEXT },
            { role: 'user', content: msg },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const errMsg = err?.error?.message || `HTTP ${res.status}`;
        throw new Error(errMsg);
      }
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response.";
      const botMsgId = messageIdRef.current++;
      setMessages(m => [...m, { role: 'bot', text: reply, id: botMsgId }]);
    } catch (e) {
      let fallback;
      if (e.message === 'no_key') {
        fallback = "⚠️ API key not set. Add your Groq key to the .env file as VITE_GROQ_API_KEY, then restart the dev server.";
      } else if (e.message.includes('invalid_api_key') || e.message.includes('401')) {
        fallback = "⚠️ Invalid API key. Please check your VITE_GROQ_API_KEY in the .env file.";
      } else {
        fallback = `⚠️ Error: ${e.message}`;
      }
      const botMsgId = messageIdRef.current++;
      setMessages(m => [...m, { role: 'bot', text: fallback, id: botMsgId }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (messageId, type) => {
    // Log feedback to console for analysis
    console.log(`Feedback for message ${messageId}: ${type}`);
    setFeedback(prev => ({
      ...prev,
      [messageId]: feedback[messageId] === type ? null : type
    }));
  };

  const handleCopy = (text, messageId) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({
      ...prev,
      [messageId]: true
    }));
    setTimeout(() => {
      setCopied(prev => ({
        ...prev,
        [messageId]: false
      }));
    }, 2000);
  };

  const handleClearChat = () => {
    setMessages([
      { role: 'bot', text: "Hi! I'm Azzam's portfolio assistant 👋 Ask me anything about his skills, projects, or experience!", id: 0 }
    ]);
    setFeedback({});
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Start listening without clearing existing text
      recognitionRef.current.start();
    }
  };

  return (
    <div data-theme={theme} style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 150 }}>
      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            style={{
              position: 'absolute', bottom: '4.5rem', right: 0,
              width: 360, maxHeight: 520,
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 20, display: 'flex', flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--bg-card)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'var(--accent-glow)', border: '1px solid var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent)',
                }}>
                  <Bot size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-h)' }}>Azzam's Assistant</div>
                  <div style={{ fontSize: '0.7rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                    Online
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button 
                  onClick={handleClearChat}
                  title="Clear chat"
                  style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center',
                    padding: '0.5rem 0.7rem', borderRadius: '8px', transition: 'all 0.2s',
                    fontSize: '0.8rem', fontWeight: 500, gap: '0.3rem',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#ef4444';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = '#ef4444';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                    e.currentTarget.style.color = 'var(--text)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <Trash2 size={14} />
                  Clear
                </button>
                <button 
                  onClick={() => setOpen(false)}
                  title="Close chat"
                  style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center',
                    padding: '0.5rem 0.7rem', borderRadius: '8px', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--accent)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                    e.currentTarget.style.color = 'var(--text)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', overscrollBehavior: 'contain',
              padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
            }}>
              {messages.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', gap: '0.5rem',
                    flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    group: 'message',
                  }}
                  className="message-group"
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: m.role === 'bot' ? 'var(--accent-glow)' : 'var(--accent)',
                    border: `1px solid ${m.role === 'bot' ? 'var(--accent)' : 'transparent'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: m.role === 'bot' ? 'var(--accent)' : '#fff',
                  }}>
                    {m.role === 'bot' ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1,
                  }}>
                    <div style={{
                      maxWidth: '85%',
                      background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-card)',
                      color: m.role === 'user' ? '#fff' : 'var(--text-h)',
                      border: m.role === 'bot' ? '1px solid var(--border)' : 'none',
                      borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      padding: '0.6rem 0.9rem',
                      fontSize: '0.875rem', lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {m.text}
                    </div>
                    {m.role === 'bot' && (
                      <div style={{
                        display: 'flex', gap: '0.3rem', alignItems: 'center',
                        paddingLeft: '0.2rem', opacity: 0.6, transition: 'opacity 0.2s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                      >
                        <button
                          onClick={() => handleCopy(m.text, m.id)}
                          title="Copy message"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--text)', padding: '0.2rem',
                            transition: 'color 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
                        >
                          {copied[m.id] ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={() => handleFeedback(m.id, 'like')}
                          title="Helpful"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: feedback[m.id] === 'like' ? 'var(--accent)' : 'var(--text)',
                            padding: '0.2rem',
                            transition: 'color 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                          onMouseLeave={e => {
                            if (feedback[m.id] !== 'like') e.currentTarget.style.color = 'var(--text)';
                          }}
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button
                          onClick={() => handleFeedback(m.id, 'dislike')}
                          title="Not helpful"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: feedback[m.id] === 'dislike' ? '#ef4444' : 'var(--text)',
                            padding: '0.2rem',
                            transition: 'color 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => {
                            if (feedback[m.id] !== 'dislike') e.currentTarget.style.color = 'var(--text)';
                          }}
                        >
                          <ThumbsDown size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--accent-glow)', border: '1px solid var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)',
                  }}>
                    <Bot size={14} />
                  </div>
                  <div style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: '16px 16px 16px 4px', padding: '0.6rem 0.9rem',
                    display: 'flex', gap: 4, alignItems: 'center',
                  }}>
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                        style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'block' }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions (only on first message) */}
            {messages.length === 1 && (
              <div style={{ padding: '0 1rem 0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 20, padding: '4px 10px', cursor: 'pointer',
                    fontSize: '0.75rem', color: 'var(--text)', fontFamily: 'var(--font)',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{
              padding: '0.75rem 1rem', borderTop: '1px solid var(--border)',
              display: 'flex', gap: '0.5rem', alignItems: 'center',
              background: 'var(--bg-card)',
            }}>
              <button
                onClick={toggleVoiceInput}
                disabled={loading}
                title={isListening ? 'Stop listening' : 'Start voice input'}
                style={{
                  width: 36, height: 36, borderRadius: '50%', border: 'none',
                  background: isListening ? '#ef4444' : 'var(--border)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isListening ? '#fff' : 'var(--text)',
                  transition: 'all 0.2s', flexShrink: 0,
                }}
              >
                {isListening ? <Mic size={15} style={{ animation: 'pulse 1s infinite' }} /> : <MicOff size={15} />}
              </button>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask me anything..."
                style={{
                  flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '0.55rem 0.85rem',
                  color: 'var(--text-h)', fontFamily: 'var(--font)', fontSize: '0.875rem',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                style={{
                  width: 36, height: 36, borderRadius: '50%', border: 'none',
                  background: input.trim() && !loading ? 'var(--accent)' : 'var(--border)',
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', transition: 'background 0.2s', flexShrink: 0,
                }}
              >
                {loading ? <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: 54, height: 54, borderRadius: '50%', border: 'none',
          background: 'var(--gradient)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', boxShadow: '0 4px 20px var(--accent-glow)',
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={22} /></motion.span>
            : <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><MessageCircle size={22} /></motion.span>
          }
        </AnimatePresence>
        {/* Unread dot when closed */}
        {!open && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            width: 12, height: 12, borderRadius: '50%',
            background: '#22c55e', border: '2px solid var(--bg)',
          }} />
        )}
      </motion.button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );
}
