import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X, Sun, Moon, Gamepad2, Globe, ChevronDown } from 'lucide-react';
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
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'light', label: 'Light', icon: Sun },
];

const navIds = ['about', 'skills', 'projects', 'experience', 'education', 'certificates', 'contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  const language = i18n.language;
  const links = navIds.map(id => ({ id, label: t(`nav.${id}`) }));

  // Hide navbar on scroll down, show on scroll up
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = lastScrollY.current;
    if (latest > prev && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
    // Clear active section when at the top (hero area)
    if (latest < 300) {
      setActiveSection('');
    }
    lastScrollY.current = latest;
  });

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers = [];
    navIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (themeOpen || languageOpen) {
        if (!e.target.closest('.navbar-dropdown-zone')) {
          setThemeOpen(false);
          setLanguageOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [themeOpen, languageOpen]);

  const handleNav = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setLanguageOpen(false);
  };

  return (
    <>
      <motion.nav
        className="navbar"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className={`navbar-inner ${scrolled ? 'navbar-scrolled' : ''}`}>
          {/* Logo */}
          <motion.a
            href="#"
            className="navbar-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="navbar-logo-mark">
              <img
                src="/azzamIcon.png"
                alt="Azzam logo"
                className="navbar-logo-icon"
              />
            </div>
            <div className="navbar-logo-text">
              <span className="navbar-logo-name">Azzam</span>
              <span className="navbar-logo-tag">Developer</span>
            </div>
          </motion.a>

          {/* Desktop Navigation Links */}
          <ul className="navbar-links">
            {links.map(({ id, label }) => (
              <li key={id}>
                <button
                  onClick={() => handleNav(id)}
                  className={`navbar-link ${activeSection === id ? 'navbar-link-active' : ''}`}
                >
                  {label}
                  {activeSection === id && (
                    <motion.span
                      className="navbar-link-indicator"
                      layoutId="navIndicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Action Buttons */}
          <div className="navbar-actions">
            {/* Games button */}
            <motion.button
              className="navbar-action-btn"
              onClick={() => setGamesOpen(true)}
              aria-label="Open games"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Gamepad2 size={16} />
              <span className="navbar-action-label">{t('nav.games')}</span>
            </motion.button>

            {/* Language dropdown */}
            <div className="navbar-dropdown-zone">
              <motion.button
                className={`navbar-action-btn ${languageOpen ? 'navbar-action-btn-active' : ''}`}
                onClick={() => { setLanguageOpen(!languageOpen); setThemeOpen(false); }}
                aria-label="Switch language"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe size={16} />
                <span className="navbar-action-label">{LANGUAGES[language]?.flag ?? ''}</span>
                <ChevronDown size={12} className={`navbar-chevron ${languageOpen ? 'navbar-chevron-open' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {languageOpen && (
                  <motion.div
                    className="navbar-dropdown"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    {Object.values(LANGUAGES).map(({ code, name, flag }) => (
                      <button
                        key={code}
                        onClick={() => changeLanguage(code)}
                        className={`navbar-dropdown-item ${language === code ? 'navbar-dropdown-item-active' : ''}`}
                      >
                        <span className="navbar-dropdown-flag">{flag}</span>
                        <span>{name}</span>
                        {language === code && (
                          <motion.span
                            className="navbar-dropdown-check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            ✓
                          </motion.span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme dropdown */}
            <div className="navbar-dropdown-zone">
              <motion.button
                className={`navbar-action-btn ${themeOpen ? 'navbar-action-btn-active' : ''}`}
                onClick={() => { setThemeOpen(!themeOpen); setLanguageOpen(false); }}
                aria-label="Switch theme"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {(() => { const Icon = themeOptions.find(o => o.value === theme)?.icon || Palette; return <Icon size={16} />; })()}
                <span className="navbar-action-label">{themeOptions.find(o => o.value === theme)?.label}</span>
                <ChevronDown size={12} className={`navbar-chevron ${themeOpen ? 'navbar-chevron-open' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {themeOpen && (
                  <motion.div
                    className="navbar-dropdown"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    {themeOptions.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => { setTheme(value); setThemeOpen(false); }}
                        className={`navbar-dropdown-item ${theme === value ? 'navbar-dropdown-item-active' : ''}`}
                      >
                        <Icon size={15} />
                        <span>{label}</span>
                        {theme === value && (
                          <motion.span
                            className="navbar-dropdown-check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            ✓
                          </motion.span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <motion.button
              className="navbar-mobile-toggle"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={22} />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={22} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="navbar-mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="navbar-mobile-menu"
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            >
              <div className="navbar-mobile-menu-inner">
                {links.map(({ id, label }, index) => (
                  <motion.button
                    key={id}
                    onClick={() => handleNav(id)}
                    className={`navbar-mobile-link ${activeSection === id ? 'navbar-mobile-link-active' : ''}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.3 }}
                  >
                    <span className="navbar-mobile-link-number">0{index + 1}</span>
                    <span className="navbar-mobile-link-text">{label}</span>
                    {activeSection === id && <span className="navbar-mobile-link-dot" />}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {gamesOpen && <GamesModal onClose={() => setGamesOpen(false)} />}

      <style>{navbarStyles}</style>
    </>
  );
}

const navbarStyles = `
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 12px 24px;
    pointer-events: none;
  }

  .navbar-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 24px;
    border-radius: 16px;
    background: transparent;
    border: 1px solid transparent;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    pointer-events: auto;
  }

  .navbar-scrolled {
    background: color-mix(in srgb, var(--bg-secondary) 80%, transparent);
    backdrop-filter: blur(20px) saturate(1.5);
    -webkit-backdrop-filter: blur(20px) saturate(1.5);
    border-color: var(--border);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .navbar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    cursor: pointer;
  }

  .navbar-logo-mark {
    position: relative;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--accent) 10%, var(--bg-card));
    border: 1.5px solid color-mix(in srgb, var(--accent) 25%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 0 2px 8px color-mix(in srgb, var(--accent) 15%, transparent);
  }

  .navbar-logo:hover .navbar-logo-mark {
    border-color: var(--accent);
    box-shadow: 0 4px 16px var(--accent-glow), inset 0 0 12px color-mix(in srgb, var(--accent) 8%, transparent);
    transform: rotate(-3deg);
  }

  .navbar-logo-icon {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
    transition: filter 0.3s, transform 0.3s;
  }

  .navbar-logo:hover .navbar-logo-icon {
    transform: scale(1.1);
  }

  /* Theme-specific icon styling */
  [data-theme="default"] .navbar-logo-icon {
    filter: brightness(1.1) drop-shadow(0 0 4px rgba(124, 58, 237, 0.4));
  }

  [data-theme="dark"] .navbar-logo-icon {
    filter: brightness(1.2) drop-shadow(0 0 4px rgba(56, 189, 248, 0.4));
  }

  [data-theme="light"] .navbar-logo-icon {
    filter: brightness(0.95) drop-shadow(0 0 3px rgba(124, 58, 237, 0.2));
  }

  .navbar-logo-text {
    display: flex;
    flex-direction: column;
    gap: 0;
    line-height: 1;
  }

  .navbar-logo-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: var(--text-h);
    transition: color 0.3s;
  }

  .navbar-logo:hover .navbar-logo-name {
    color: var(--accent);
  }

  .navbar-logo-tag {
    font-family: var(--mono);
    font-size: 0.6rem;
    font-weight: 500;
    color: var(--accent);
    opacity: 0.7;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: opacity 0.3s;
  }

  .navbar-logo:hover .navbar-logo-tag {
    opacity: 1;
  }

  .navbar-links {
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .navbar-link {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text);
    font-size: 0.875rem;
    font-family: var(--font);
    font-weight: 500;
    padding: 8px 14px;
    border-radius: 8px;
    transition: color 0.25s, background 0.25s;
    letter-spacing: 0.01em;
  }

  .navbar-link:hover {
    color: var(--text-h);
    background: color-mix(in srgb, var(--accent) 8%, transparent);
  }

  .navbar-link-active {
    color: var(--accent) !important;
  }

  .navbar-link-indicator {
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 3px;
    background: var(--accent);
    border-radius: 3px;
    box-shadow: 0 0 8px var(--accent-glow);
  }

  .navbar-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .navbar-action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    color: var(--text);
    padding: 7px 12px;
    font-size: 0.8rem;
    font-family: var(--font);
    font-weight: 500;
    transition: all 0.25s;
    white-space: nowrap;
  }

  .navbar-action-btn:hover {
    color: var(--accent);
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 6%, transparent);
    box-shadow: 0 0 12px var(--accent-glow);
  }

  .navbar-action-btn-active {
    color: var(--accent);
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 8%, transparent);
  }

  .navbar-action-label {
    font-size: 0.78rem;
  }

  .navbar-chevron {
    transition: transform 0.25s;
    opacity: 0.6;
  }

  .navbar-chevron-open {
    transform: rotate(180deg);
  }

  .navbar-dropdown-zone {
    position: relative;
  }

  .navbar-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    min-width: 160px;
    background: color-mix(in srgb, var(--bg-card) 95%, transparent);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 6px;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    z-index: 1001;
  }

  .navbar-dropdown-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text);
    padding: 10px 12px;
    font-size: 0.85rem;
    font-family: var(--font);
    font-weight: 450;
    border-radius: 8px;
    transition: all 0.2s;
    text-align: left;
  }

  .navbar-dropdown-item:hover {
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    color: var(--text-h);
  }

  .navbar-dropdown-item-active {
    color: var(--accent) !important;
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    font-weight: 600;
  }

  .navbar-dropdown-flag {
    font-size: 1.1rem;
  }

  .navbar-dropdown-check {
    margin-left: auto;
    color: var(--accent);
    font-size: 0.8rem;
    font-weight: 700;
  }

  /* Mobile Toggle */
  .navbar-mobile-toggle {
    display: none;
    background: none;
    border: 1px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    color: var(--text-h);
    padding: 7px;
    transition: all 0.25s;
  }

  .navbar-mobile-toggle:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .navbar-mobile-toggle span {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Mobile Backdrop */
  .navbar-mobile-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 998;
  }

  /* Mobile Menu */
  .navbar-mobile-menu {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(320px, 80vw);
    background: color-mix(in srgb, var(--bg) 97%, transparent);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-left: 1px solid var(--border);
    z-index: 999;
    overflow-y: auto;
  }

  .navbar-mobile-menu-inner {
    display: flex;
    flex-direction: column;
    padding: 100px 32px 32px;
    gap: 4px;
  }

  .navbar-mobile-link {
    display: flex;
    align-items: center;
    gap: 16px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text);
    padding: 16px 12px;
    font-size: 1rem;
    font-family: var(--font);
    font-weight: 500;
    border-radius: 12px;
    transition: all 0.25s;
    text-align: left;
    position: relative;
  }

  .navbar-mobile-link:hover {
    background: color-mix(in srgb, var(--accent) 8%, transparent);
    color: var(--text-h);
  }

  .navbar-mobile-link-active {
    color: var(--accent) !important;
    background: color-mix(in srgb, var(--accent) 10%, transparent);
  }

  .navbar-mobile-link-number {
    font-size: 0.72rem;
    font-family: var(--mono);
    color: var(--accent);
    opacity: 0.6;
    font-weight: 600;
  }

  .navbar-mobile-link-text {
    font-size: 1.1rem;
    letter-spacing: -0.01em;
  }

  .navbar-mobile-link-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    margin-left: auto;
    box-shadow: 0 0 8px var(--accent-glow);
  }

  /* Responsive */
  @media (max-width: 900px) {
    .navbar-links {
      display: none !important;
    }
    .navbar-mobile-toggle {
      display: flex !important;
    }
    .navbar-action-label {
      display: none;
    }
    .navbar-chevron {
      display: none;
    }
    .navbar-action-btn {
      padding: 7px 9px;
    }
  }

  @media (max-width: 480px) {
    .navbar {
      padding: 8px 12px;
    }
    .navbar-inner {
      padding: 8px 16px;
      border-radius: 12px;
    }
    .navbar-actions {
      gap: 4px;
    }
    .navbar-logo-tag {
      display: none;
    }
    .navbar-logo-name {
      font-size: 1rem;
    }
  }
`;
