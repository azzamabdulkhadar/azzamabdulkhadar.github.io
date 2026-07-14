import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader, ThumbsUp, ThumbsDown, Copy, Check, Mic, MicOff, Trash2 } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_CONTEXT = `You are Azzam's portfolio assistant. Answer questions about Azzam Abdul Khadar helpfully and in a well-structured format.

Always format your responses using markdown:
- Use **bold** for important terms, names, and titles
- Use bullet points (- item) for lists of skills, features, or items
- Use numbered lists (1. item) for steps or ranked items
- Use headings (### Heading) to separate sections when the answer has multiple categories
- Use inline code (\`code\`) for technology names like \`React.js\`, \`Node.js\`, etc.
- Keep responses concise but well-structured (not walls of text)
- IMPORTANT: Always add spaces around bold and code text. Write "is a **Full Stack** Developer" NOT "is a**Full Stack**Developer".

About Azzam:
- Full-Stack and App Developer currently based in Hyderabad, Telangana
- B.Tech in Computer Science from Visvesvaraya Technological University (VTU), graduated 06/2025, Belagavi, Karnataka
- Pre-University Course from Department of Pre-University Education Karnataka, 07/2019 – 07/2021, Bidar, Karnataka

### Experience:
1. **App Developer Trainee** at **Atmez AI Solutions**, Hyderabad, Telangana (01/2026 – Present)
   - Engineered and maintained 4+ production Flutter apps across HR, education, and productivity domains (incl. EMS & Master Admin), serving real users
   - Built 20+ responsive UI screens and integrated 10+ RESTful APIs for real-time data synchronization
   - Crafted role-based UI components for dashboards, attendance tracking, and employee workflows with HTTP/Dio and MySQL backend
   - Implemented Provider-based state management for efficient UI updates
   - Optimized UI performance by 20–30% via efficient state management and widget rendering, cutting crash rate by 15%
   - Collaborated in Agile teams for feature delivery, debugging, and iterative improvements

2. **Full Stack Trainee** at **Zenexis Solutions Pvt Ltd**, Bidar, Karnataka (02/2025 – 06/2025)
   - Collaborated on 2+ full-stack MERN applications with 15+ REST APIs, reducing backend response times by 30% through Mongoose query optimization and scalable database schema redesign
   - Implemented 5+ secure React.js interfaces with file uploads (Multer) and production-ready APIs, reducing form error rates by 20%
   - Built and deployed TaskHive with real-time data handling, responsive UI using Vite, Bootstrap, and Ant Design
   - Configured CORS for secure cross-origin access across multiple domains
   - Conducted peer code reviews and resolved high-priority bugs, contributing to on-time releases and improved application stability
   - Contributed to Agile workflows including sprint planning, code reviews, and debugging

### Skills:
- **Programming Languages:** \`JavaScript\`, \`TypeScript\`, \`Dart\`, \`Java\`, \`Python\`
- **Frontend:** \`React.js\`, \`Next.js\`, \`Vite\`, \`HTML\`, \`CSS\`, \`Tailwind CSS\`, \`Bootstrap\`, \`React Bootstrap\`, \`Ant Design\`
- **Backend & Database:** \`Node.js\`, \`Express.js\`, \`Flask\`, RESTful APIs, \`Redis\`, \`MongoDB\`, \`PostgreSQL\`, \`SQL\`
- **Mobile Development:** \`Flutter\`, Android Development (Material UI)
- **Version Control:** \`Git\`, \`GitHub\`, \`GitLab\`, \`Bitbucket\`
- **Development Tools:** \`VS Code\`, \`Android Studio\`, \`Postman\`
- **Deployment & Publishing:** \`Vercel\`, \`Render\`, \`Coolify\`, Google Play Console, App Store Connect
- **Architecture:** System Design, Scalable Architecture, Agile/Scrum

### Projects:
1. **Employee Management System (EMS)** (Present) – Flutter-based system for managing employee tasks, attendance, and profiles. Reusable UI components, REST API integration with MySQL via Dio, optimized rendering.
2. **TaskHive** (06/2025) – MERN-based app for task management, lead tracking, and scheduling. 30% faster API response, secure file handling, responsive UI with Ant Design.
3. **BloodHub** (04/2025) – Full-stack MERN platform for blood donation coordination. Automated donor-recipient matching reducing manual effort by 30%, handles 100+ concurrent requests.

### Contact:
- **Email:** azzamcse@gmail.com
- **Phone:** +91 7349701430
- **Location:** Hyderabad, Telangana
- **GitHub:** github.com/azzamabdulkhadar
- **LinkedIn:** linkedin.com/in/azzamabdulkhadar

If asked something unrelated to Azzam or tech, politely redirect.`;

function MarkdownMessage({ text }) {
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  const parseInline = (str) => {
    // bold **text** or __text__, inline code `code`
    const parts = str.split(/(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`)/g);
    return parts.map((part, idx) => {
      if (/^\*\*(.+)\*\*$/.test(part) || /^__(.+)__$/.test(part)) {
        const inner = part.replace(/^\*\*|\*\*$|^__|__$/g, '');
        return <strong key={idx} style={{ color: 'var(--text-h)', fontWeight: 700 }}>{inner}</strong>;
      }
      if (/^`(.+)`$/.test(part)) {
        const inner = part.slice(1, -1);
        return (
          <code key={idx} style={{
            background: 'rgba(124,58,237,0.15)', color: 'var(--accent)',
            borderRadius: 4, padding: '1px 6px', fontFamily: 'var(--mono)', fontSize: '0.82em',
            display: 'inline-block', margin: '1px 2px',
          }}>{inner}</code>
        );
      }
      // preserve plain text as-is (including spaces)
      return part || null;
    }).filter(Boolean);
  };

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    // Numbered list: 1. or 1)
    if (/^\d+[.)]\s/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\d+[.)]\s/.test(lines[i].trim())) {
        const content = lines[i].trim().replace(/^\d+[.)]\s/, '');
        listItems.push(<li key={i} style={{ marginBottom: '0.25rem' }}>{parseInline(content)}</li>);
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} style={{ paddingLeft: '1.25rem', margin: '0.4rem 0', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          {listItems}
        </ol>
      );
      continue;
    }

    // Lettered list: a. or a)
    if (/^[a-z][.)]\s/i.test(line)) {
      const listItems = [];
      while (i < lines.length && /^[a-z][.)]\s/i.test(lines[i].trim())) {
        const content = lines[i].trim().replace(/^[a-z][.)]\s/i, '');
        listItems.push(<li key={i} style={{ marginBottom: '0.25rem' }}>{parseInline(content)}</li>);
        i++;
      }
      elements.push(
        <ol key={`alpha-${i}`} type="a" style={{ paddingLeft: '1.25rem', margin: '0.4rem 0', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          {listItems}
        </ol>
      );
      continue;
    }

    // Bullet list: - or * or •
    if (/^[-*•]\s/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i].trim())) {
        const content = lines[i].trim().replace(/^[-*•]\s/, '');
        listItems.push(
          <li key={i} style={{ marginBottom: '0.3rem', display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--accent)', marginTop: '0.35em', flexShrink: 0, fontSize: '0.6em' }}>●</span>
            <span style={{ flex: 1 }}>{parseInline(content)}</span>
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ listStyle: 'none', padding: 0, margin: '0.4rem 0', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          {listItems}
        </ul>
      );
      continue;
    }

    // Heading: #### or ### or ## or #
    if (/^#{1,4}\s/.test(line)) {
      const content = line.replace(/^#{1,4}\s/, '');
      elements.push(
        <div key={i} style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '0.2rem' }}>
          {parseInline(content)}
        </div>
      );
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} style={{ margin: '0.2rem 0', lineHeight: 1.6 }}>{parseInline(line)}</p>
    );
    i++;
  }

  return <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>{elements}</div>;
}

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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
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
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
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
    setFeedback(prev => ({
      ...prev,
      [messageId]: prev[messageId] === type ? null : type
    }));
  };

  const handleCopy = (text, messageId) => {
    // Strip markdown symbols for clean plain text copy
    const plain = text
      .replace(/#{1,4}\s/g, '')           // headings
      .replace(/\*\*([^*]+)\*\*/g, '$1')  // bold
      .replace(/__([^_]+)__/g, '$1')      // bold alt
      .replace(/`([^`]+)`/g, '$1')        // inline code
      .replace(/^[-*•]\s/gm, '• ')        // bullets
      .replace(/^\d+[.)]\s/gm, (m) => m)  // numbered lists (keep as-is)
      .trim();
    navigator.clipboard.writeText(plain);
    setCopied(prev => ({ ...prev, [messageId]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [messageId]: false })), 2000);
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
      recognitionRef.current.start();
    }
  };

  return (
    <div data-theme={theme} style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 150 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            style={{
              position: 'absolute', bottom: '4.5rem', right: 0,
              width: 'min(360px, calc(100vw - 3rem))', maxHeight: 'min(520px, calc(100vh - 8rem))',
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 20, display: 'flex', flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
              overflow: 'hidden', direction: 'ltr',
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
                  aria-label="Clear chat"
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
                  aria-label="Close chat"
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
              padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
            }}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', gap: '0.5rem',
                    flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
                    <div style={{
                      maxWidth: '85%',
                      background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-card)',
                      color: m.role === 'user' ? '#fff' : 'var(--text-h)',
                      border: m.role === 'bot' ? '1px solid var(--border)' : 'none',
                      borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      padding: '0.6rem 0.9rem',
                      fontSize: '0.875rem', lineHeight: 1.6,
                    }}>
                      {m.role === 'bot' ? <MarkdownMessage text={m.text} /> : m.text}
                    </div>
                    {m.role === 'bot' && (
                      <div
                        style={{
                          display: 'flex', gap: '0.3rem', alignItems: 'center',
                          paddingLeft: '0.2rem', opacity: 0.6, transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                      >
                        <button
                          onClick={() => handleCopy(m.text, m.id)}
                          title="Copy message"
                          aria-label="Copy message"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--text)', padding: '0.2rem', transition: 'color 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
                        >
                          {copied[m.id] ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={() => handleFeedback(m.id, 'like')}
                          title="Helpful"
                          aria-label="Mark as helpful"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: feedback[m.id] === 'like' ? 'var(--accent)' : 'var(--text)',
                            padding: '0.2rem', transition: 'color 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                          onMouseLeave={e => { if (feedback[m.id] !== 'like') e.currentTarget.style.color = 'var(--text)'; }}
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button
                          onClick={() => handleFeedback(m.id, 'dislike')}
                          title="Not helpful"
                          aria-label="Mark as not helpful"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: feedback[m.id] === 'dislike' ? '#ef4444' : 'var(--text)',
                            padding: '0.2rem', transition: 'color 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => { if (feedback[m.id] !== 'dislike') e.currentTarget.style.color = 'var(--text)'; }}
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

            {/* Suggestions */}
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
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
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
                aria-label="Send message"
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
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
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
