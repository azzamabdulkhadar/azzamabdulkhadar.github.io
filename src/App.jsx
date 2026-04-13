import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Education />
          <Contact />
        </main>
        <Footer />
        <ChatBot />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
