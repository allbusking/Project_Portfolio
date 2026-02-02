import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Instagram, Mail, ExternalLink } from 'lucide-react';
import TiltedCard from './components/TiltedCard';
import SplitText from './components/SliptText';
import Lanyard from './components/Lanyard';
import HorizontalScrollCards from './components/HorizontalScrollCards';
import ExperienceCarousel from './components/ExperienceCarousel';
import Aurora from './components/Aurora';
import GitHubStats from './components/GithubStats';
import TechStack from './components/TechStack';

export default function App() {
  const [activeNav, setActiveNav] = useState('about');
  const [visibleSections, setVisibleSections] = useState({});
  const [stackProgress, setStackProgress] = useState(0);
  const projectsSectionRef = useRef(null);
  const wheelAccumulator = useRef(0);
  const isInStackingZone = useRef(false);
 



  // Handle scroll locking and card stacking
  useEffect(() => {
    let ticking = false;

    const handleWheel = (e) => {
      if (!projectsSectionRef.current) return;

      const section = projectsSectionRef.current;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // Define the zone where cards should be centered and stacking happens
      // More restrictive - cards must be truly centered
      const isInZone = rect.top <= vh * 0.1 && rect.bottom >= vh * 0.9;

      if (isInZone) {
        isInStackingZone.current = true;
        e.preventDefault();

        // Accumulate wheel movement
        wheelAccumulator.current += e.deltaY;

        // Each card needs about 400 units of scroll (increased for slower stacking)
        const scrollPerCard = 400;
        const totalScroll = scrollPerCard * 5;

        // Clamp the accumulator
        wheelAccumulator.current = Math.max(0, Math.min(totalScroll, wheelAccumulator.current));

        // Calculate progress (0 to 5)
        const progress = (wheelAccumulator.current / scrollPerCard);

        if (!ticking) {
          window.requestAnimationFrame(() => {
            setStackProgress(progress);
            ticking = false;
          });
          ticking = true;
        }

        // Check if we should exit the stacking zone
        if (wheelAccumulator.current >= totalScroll && e.deltaY > 0) {
          // Finished stacking, allow scroll down
          isInStackingZone.current = false;
          wheelAccumulator.current = totalScroll;
          window.scrollBy({ top: 100, behavior: 'auto' });
        } else if (wheelAccumulator.current <= 0 && e.deltaY < 0) {
          // Finished unstacking, allow scroll up
          isInStackingZone.current = false;
          wheelAccumulator.current = 0;
          window.scrollBy({ top: -100, behavior: 'auto' });
        }
      } else {
        isInStackingZone.current = false;

        // Reset progress based on position
        if (rect.bottom < vh * 0.9) {
          // Section is above - all cards should be stacked
          wheelAccumulator.current = 400 * 5;
          setStackProgress(5);
        } else {
          // Section is below - no cards stacked
          wheelAccumulator.current = 0;
          setStackProgress(0);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        setVisibleSections(prev => ({
          ...prev,
          [entry.target.id]: entry.isIntersecting
        }));
      });
    }, observerOptions);

    const sections = ['technologies', 'projects', 'github-activity', 'experience'];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'technologies', 'projects', 'experience'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveNav(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCardTransform = (cardIndex) => {
    if (cardIndex === 5) {
      return 'translateY(0px)';
    }

    const reverseIndex = 4 - cardIndex;
    const cardStartProgress = reverseIndex;
    const cardEndProgress = reverseIndex + 1;

    let cardProgress = (stackProgress - cardStartProgress) / (cardEndProgress - cardStartProgress);
    cardProgress = Math.max(0, Math.min(1, cardProgress));

    const easeProgress = cardProgress < 0.5
      ? 4 * cardProgress * cardProgress * cardProgress
      : 1 - Math.pow(-2 * cardProgress + 2, 3) / 2;

    const startY = 1000;
    const currentY = startY - (easeProgress * startY);

    return `translateY(${currentY}px)`;
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }

        @keyframes float-wave {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .tech-icon { animation: float-wave 3s ease-in-out infinite; }
        .tech-icon:nth-child(1) { animation-delay: 0s; }
        .tech-icon:nth-child(2) { animation-delay: 0.2s; }
        .tech-icon:nth-child(3) { animation-delay: 0.4s; }
        .tech-icon:nth-child(4) { animation-delay: 0.6s; }
        .tech-icon:nth-child(5) { animation-delay: 0.8s; }
        .tech-icon:nth-child(6) { animation-delay: 1s; }
        .tech-icon:nth-child(7) { animation-delay: 1.2s; }

        .project-card-wrapper {
          position: sticky;
          top: 150px;
          height: 600px;
          margin-bottom: -590px;
        }

        .project-card-wrapper:last-child {
          margin-bottom: 0;
        }

        .project-card {
          transition: none;
        }

        .project-card-wrapper:nth-child(1) { z-index: 6; }
        .project-card-wrapper:nth-child(2) { z-index: 5; }
        .project-card-wrapper:nth-child(3) { z-index: 4; }
        .project-card-wrapper:nth-child(4) { z-index: 3; }
        .project-card-wrapper:nth-child(5) { z-index: 2; }
        .project-card-wrapper:nth-child(6) { z-index: 1; }
      `}</style>

      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-bold cursor-pointer">AG</div>
            <div className="flex items-center space-x-8 text-sm">
              {['About', 'Technologies', 'Projects', 'Experience'].map((item) => (
                <button key={item} onClick={() => scrollToSection(item.toLowerCase())}
                  className={`transition-colors ${activeNav === item.toLowerCase() ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                  {item}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://github.com/onnoi10" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              <a href="https://www.linkedin.com/in/anway-ghatak-774980283" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="mailto:anwayghatak@gmail.com" className="text-gray-400 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
              <button onClick={() => scrollToSection('footer')} className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">Contact Me</button>
            </div>
          </div>
        </div>
      </nav>


            

     <section id="about" className="relative min-h-screen flex items-center px-6 pt-20 pb-10">
  {/* Aurora Background - Positioned Absolutely */}
  <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
    <Aurora 
      colorStops={['#4B0082', '#FF6B00', '#C084FC']}
      amplitude={1.0}
      blend={0.5}
    />
  </div>
  
  {/* Content - Positioned Relatively with higher z-index */}
  <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
    <div className="space-y-6">
      <SplitText loop={true}/>
      
      <p className="text-2xl font-bold bg-gradient-to-r from-gray-300 to-gray-800 bg-clip-text text-transparent">
        Mechanical Engineer
      </p>
      <p className="text-gray-400 leading-relaxed max-w-xl">
      I'm a Mechanical Engineering undergraduate at the Academy of Technology, graduating in 2028, with a balanced interest in design, building, and understanding machines as complete systems. I work extensively with CAD modeling and enjoy translating concepts into practical, buildable solutions.
      </p>
      <button className="px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
        <a href="https://drive.google.com/file/d/1VUAemsftJFN9JfYGvZVjv7FGUjoOZI7U/view?usp=share_link" 
           target="_blank" 
           rel="noopener noreferrer">
          Download Resume
        </a>
      </button>
    </div>
    <div className="relative">
      <div className="relative w-full aspect-square max-w-md mx-auto">
        <TiltedCard />
      </div>
    </div>
  </div>
</section>


<TechStack/>

         <section id="projects" className="relative px-6 mt-12" ref={projectsSectionRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-semibold mb-4 transition-all duration-1000 ${visibleSections['projects'] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>Projects</h2>
            <p className={`text-gray-400 text-lg transition-all duration-1000 ${visibleSections['projects'] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
              A showcase of my recent work and contributions
            </p>
          </div>
          </div>
            </section>
      <HorizontalScrollCards/>




<section id="github-activity" className="relative px-6 py-16 mt-12">
  <div className="max-w-5xl mx-auto">
    <div className="bg-gray-900/50 rounded-3xl border border-gray-800 p-12">
      <h2 className={`text-4xl font-semibold text-center mb-12 transition-all duration-1000 ${visibleSections['github-activity'] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        GitHub Activity
      </h2>

      {/* Replace all the static content with: */}
      <GitHubStats isVisible={visibleSections['github-activity']} />

      {/* Contribution Graph */}
      <div className={`mt-12 transition-all duration-1000 ${visibleSections['github-activity'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <h3 className="text-center text-xl mb-6">Contribution Graph</h3>
        <div className="bg-gray-800/50 rounded-lg overflow-hidden">
          <img 
            src={`https://ghchart.rshah.org/ec4899/your-github-username`}
            alt="GitHub Contribution Graph"
            className="w-full"
            style={{ filter: 'brightness(0.9)' }}
          />
        </div>
      </div>
    </div>
  </div>
</section>





      <section id="experience" className="relative px-6 pt-25 mt-38">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-5xl font-semibold text-center mb-12 transition-all duration-1000 ${visibleSections['experience'] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>Experience and Achievements</h2>

      </div>
      </section>
      
      <ExperienceCarousel/>

      <div className="line w-full h-0.5 bg-gray-800"></div>
      {/* <div className="Heading h-auto w-auto flex justify-center text-3xl"></div> */}
      <Lanyard />
      <div className="line w-full h-0.5 bg-gray-800"></div>



       

      <section id="footer" className="relative py-20 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h2 className="text-5xl font-semibold mb-12 animate-fade-in">Get in Touch</h2>

            <div className="flex justify-center space-x-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <a href="https://github.com/onnoi10" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110">
                <Github className="w-8 h-8" />
              </a>
              <a href="https://linkedin.com/in/anway-ghatak-774980283" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-110">
                <Linkedin className="w-8 h-8" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-all duration-300 transform hover:scale-110">
                <Instagram className="w-8 h-8" />
              </a>
              <a href="mailto:office.snj.2005@gmail.com" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110">
                <Mail className="w-8 h-8" />
              </a>
            </div>

            <a href="mailto:office.snj.2005@gmail.com" className="inline-block text-xl text-gray-300 hover:text-white transition-colors duration-300 underline underline-offset-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            anwayghatak@gmail.com
            </a>

            <p className="text-gray-500 text-sm mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              © 2024 Anway Ghatak. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}