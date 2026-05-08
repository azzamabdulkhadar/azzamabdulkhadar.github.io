import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Palette, Gamepad2, Globe } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useTranslation } from 'react-i18next';
import GamesModal from './games/GamesModal';

const LANGUAGES = {
  en: { code: 'en', name: 'English', flag: '🇬🇧' },
  hi: { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  kn: { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  ur: { code: 'ur', name: 'اردو', flag: '🇵🇰' },
};

const themeOptions = [
  { value: 'default', label: 'Default', icon: Palette },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'light', label: 'Light', icon: Sun },
];

const navIds = ['about', 'skills', 'projects', 'experience', 'education', 'contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const language = i18n.language;

  const links = navIds.map(id => ({ id, label: t(`nav.${id}`) }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setLanguageOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 2rem',
        background: scrolled ? 'var(--bg-secondary)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}
    >
      <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 600, fontSize: '1.1rem' }}>
        &lt;Azzam /&gt;
      </span>

      {/* Desktop links */}
      <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0 }} className="nav-desktop">
        {links.map(({ id, label }) => (
          <li key={id}>
            <button onClick={() => handleNav(id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text)', fontSize: '0.9rem', fontFamily: 'var(--font)',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--accent)'}
              onMouseLeave={e => e.target.style.color = 'var(--text)'}
            >{label}</button>
          </li>
        ))}
      </ul>

      {/* Theme switcher + Language + Games */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Games button */}
        <button
          onClick={() => setGamesOpen(true)}
          style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: '8px',
            cursor: 'pointer', color: 'var(--text-h)', padding: '6px 10px',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '0.8rem', fontFamily: 'var(--font)',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-h)'; }}
        >
          <Gamepad2 size={15} />
          <span className="theme-label">{t('nav.games')}</span>
        </button>

        {/* Language button */}
        <button
          onClick={() => setLanguageOpen(!languageOpen)}
          title="Switch language"
          style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: '8px',
            cursor: 'pointer', color: 'var(--text-h)', padding: '6px 10px',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '0.8rem', fontFamily: 'var(--font)',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-h)'; }}
        >
          <Globe size={15} />
          <span className="theme-label">{LANGUAGES[language]?.flag ?? ''}</span>
        </button>

        <AnimatePresence>
          {languageOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '10px', overflow: 'hidden', minWidth: '140px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
            >
              {Object.values(LANGUAGES).map(({ code, name, flag }) => (
                <button
                  key={code}
                  onClick={() => changeLanguage(code)}
                  style={{
                    width: '100%', background: language === code ? 'var(--accent-glow)' : 'none',
                    border: 'none', cursor: 'pointer', color: language === code ? 'var(--accent)' : 'var(--text)',
                    padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '0.85rem', fontFamily: 'var(--font)', textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (language !== code) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                  onMouseLeave={e => { if (language !== code) e.currentTarget.style.background = 'none'; }}
                >
                  <span>{flag}</span> {name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme button */}
        <button
          onClick={() => setThemeOpen(!themeOpen)}
          title="Switch theme"
          style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: '8px',
            cursor: 'pointer', color: 'var(--text-h)', padding: '6px 10px',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '0.8rem', fontFamily: 'var(--font)',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-h)'; }}
        >
          {(() => { const Icon = themeOptions.find(o => o.value === theme)?.icon || Palette; return <Icon size={15} />; })()}
          <span className="theme-label">{themeOptions.find(o => o.value === theme)?.label}</span>
        </button>

        <AnimatePresence>
          {themeOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '10px', overflow: 'hidden', minWidth: '130px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
            >
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => { setTheme(value); setThemeOpen(false); }}
                  style={{
                    width: '100%', background: theme === value ? 'var(--accent-glow)' : 'none',
                    border: 'none', cursor: 'pointer', color: theme === value ? 'var(--accent)' : 'var(--text)',
                    padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '0.85rem', fontFamily: 'var(--font)', textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (theme !== value) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                  onMouseLeave={e => { if (theme !== value) e.currentTarget.style.background = 'none'; }}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setOpen(!open)} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--text-h)', display: 'none',
      }} className="nav-mobile-btn">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute', top: '64px', left: 0, right: 0,
              background: 'var(--bg)', backdropFilter: 'blur(16px)',
              borderBottom: '1px solid var(--border)',
              padding: '1rem 2rem 1.5rem',
              display: 'flex', flexDirection: 'column', gap: '1rem',
            }}
          >
            {links.map(({ id, label }) => (
              <button key={id} onClick={() => handleNav(id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-h)', fontSize: '1rem', fontFamily: 'var(--font)',
                textAlign: 'left', padding: '0.25rem 0',
              }}>{label}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
          .theme-label { display: none; }
        }
      `}</style>

      {gamesOpen && <GamesModal onClose={() => setGamesOpen(false)} />}
    </motion.nav>
  );
}
