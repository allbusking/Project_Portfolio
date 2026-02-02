import React, { useState, useRef, useEffect } from 'react';

const TechStack = () => {
  const [removedTechs, setRemovedTechs] = useState(new Set());
  const [poppingTechs, setPoppingTechs] = useState(new Set());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const bubbleRefs = useRef({});
  const headingRef = useRef(null);

  // 🎵 CHANGE YOUR SOUND HERE - Just paste your sound file URL
  const POP_SOUND_URL = '../Assets/Pop.mp3'; // Change this to your sound file path or URL

  useEffect(() => {
    // IntersectionObserver to trigger animation on scroll
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, observerOptions);

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculateMagneticOffset = (techName) => {
    const bubbleEl = bubbleRefs.current[techName];
    if (!bubbleEl || poppingTechs.has(techName)) return { x: 0, y: 0 };

    const rect = bubbleEl.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: 0, y: 0 };

    const bubbleCenterX = rect.left - containerRect.left + rect.width / 2;
    const bubbleCenterY = rect.top - containerRect.top + rect.height / 2;

    const dx = mousePos.x - bubbleCenterX;
    const dy = mousePos.y - bubbleCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxDistance = 150;
    const maxPush = 20;

    if (distance < maxDistance && distance > 0) {
      const force = (1 - distance / maxDistance) * maxPush;
      return {
        x: -(dx / distance) * force,
        y: -(dy / distance) * force
      };
    }

    return { x: 0, y: 0 };
  };

  const techStacks = [
    // Programming Languages (8)
    { name: 'python', color: 'from-blue-400/80 to-blue-600/80', icon: '' },
    { name: 'javascript', color: 'from-yellow-400/80 to-amber-500/80', icon: 'JS' },
    { name: 'typescript', color: 'from-blue-500/80 to-blue-700/80', icon: 'TS' },
    { name: 'C++', color: 'from-blue-500/80 to-blue-700/80', icon: 'C++' },
    { name: 'Java', color: 'from-orange-300/80 to-orange-500/80', icon: '' },
    { name: 'rust', color: 'from-orange-600/80 to-orange-800/80', icon: '' },
    { name: 'R', color: 'from-blue-300/80 to-blue-500/80', icon: 'R' },
    { name: 'bash script', color: 'from-slate-500/80 to-slate-700/80', icon: '' },
    
    // Frameworks & Libraries (10)
    { name: 'React', color: 'from-cyan-400/80 to-cyan-600/80', icon: '' },
    { name: 'Next', color: 'from-slate-700/80 to-slate-900/80', icon: '' },
    { name: 'Vue.js', color: 'from-emerald-400/80 to-emerald-600/80', icon: '' },
    { name: 'Flask', color: 'from-slate-500/80 to-slate-700/80', icon: '' },
    { name: 'Flutter', color: 'from-sky-400/80 to-blue-500/80', icon: '' },
    { name: 'threejs', color: 'from-slate-600/80 to-slate-800/80', icon: '' },
    { name: 'PyTorch', color: 'from-orange-400/80 to-orange-600/80', icon: '' },
    { name: 'TensorFlow', color: 'from-orange-400/80 to-orange-600/80', icon: '' },
    { name: 'Socket.io', color: 'from-slate-600/80 to-slate-800/80', icon: '' },
    { name: 'OpenGL', color: 'from-cyan-400/80 to-cyan-600/80', icon: '' },
    
    // Databases (5)
    { name: 'postgres', color: 'from-blue-500/80 to-blue-700/80', icon: '' },
    { name: 'MongoDB', color: 'from-emerald-400/80 to-emerald-600/80', icon: '' },
    { name: 'firebase', color: 'from-amber-400/80 to-amber-600/80', icon: '' },
    { name: 'redis', color: 'from-red-400/80 to-red-600/80', icon: '' },
    { name: 'mysql', color: 'from-blue-400/80 to-blue-600/80', icon: '' },
    
    // Cloud & DevOps (8)
    { name: 'docker', color: 'from-sky-400/80 to-blue-500/80', icon: '' },
    { name: 'kubernetes', color: 'from-blue-400/80 to-blue-600/80', icon: '' },
    { name: 'vercel', color: 'from-slate-700/80 to-slate-900/80', icon: '▲' },
    { name: 'git', color: 'from-orange-500/80 to-orange-700/80', icon: '' },
    { name: 'github', color: 'from-slate-600/80 to-slate-800/80', icon: '' },
    { name: 'nginx', color: 'from-emerald-400/80 to-emerald-600/80', icon: '' },
    { name: 'terraform', color: 'from-purple-400/80 to-purple-600/80', icon: '' },
    { name: 'grafana', color: 'from-orange-400/80 to-orange-600/80', icon: '' },
    
    // Design Tools (5)
    { name: 'figma', color: 'from-orange-400/80 to-orange-500/80', icon: '' },
    { name: 'blender', color: 'from-orange-400/80 to-orange-600/80', icon: '' },
    { name: 'Canva', color: 'from-cyan-300/80 to-cyan-400/80', icon: '' },
    { name: 'adobe photoshop', color: 'from-blue-500/80 to-blue-700/80', icon: '' },
    { name: 'adobe illustrator', color: 'from-orange-400/80 to-orange-600/80', icon: '' },
    
    // Data Science (4)
    { name: 'numpy', color: 'from-blue-400/80 to-blue-600/80', icon: '' },
    { name: 'pandas', color: 'from-blue-500/80 to-blue-700/80', icon: '' },
    { name: 'scikit-learn', color: 'from-orange-300/80 to-orange-500/80', icon: '' },
    { name: 'Plotly', color: 'from-blue-400/80 to-blue-600/80', icon: '' },
  ];

  const handleTechClick = (techName) => {
    // Play pop sound
    const popSound = new Audio('../Assets/Pop.mp3'); // Change this to your sound file path or URL
    popSound.volume = 0.3;
    popSound.play().catch(e => console.log('Audio play failed:', e));
    
    setPoppingTechs(prev => new Set([...prev, techName]));
    
    setTimeout(() => {
      setRemovedTechs(prev => new Set([...prev, techName]));
      setPoppingTechs(prev => {
        const newSet = new Set(prev);
        newSet.delete(techName);
        return newSet;
      });
    }, 900);
  };

  return (
    <div id="technologies" className="min-h-screen bg-black p-8 md:p-12 relative" style={{ scrollBehavior: 'smooth', scrollMarginTop: '100px' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/20 to-black pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={headingRef} className="text-center mb-16">
          <h1 
            className={`text-6xl md:text-7xl font-bold mb-4 tracking-tight transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
            }`}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
              Tech Stack
            </span>
          </h1>
          <p 
            className={`text-white/40 text-lg font-light tracking-wide transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
            }`}
            style={{ transitionDelay: isVisible ? '100ms' : '0ms' }}
          >
            Move your cursor • Watch them react • Tap to pop
          </p>
        </div>
        
        <div ref={containerRef} className="flex flex-wrap gap-2 justify-center items-center">
          {techStacks.map((tech) => {
            if (removedTechs.has(tech.name)) return null;
            
            const isPopping = poppingTechs.has(tech.name);
            const offset = calculateMagneticOffset(tech.name);
            
            return (
              <button
                key={tech.name}
                ref={el => bubbleRefs.current[tech.name] = el}
                onClick={() => handleTechClick(tech.name)}
                className={`
                  group relative
                  bg-gradient-to-br ${tech.color}
                  text-white/95 px-3 py-1.5 rounded-xl text-xs font-medium
                  cursor-pointer select-none
                  backdrop-blur-xl
                  border border-white/10
                  ${isPopping ? '' : 'hover:scale-105 hover:border-white/20 active:scale-95'}
                `}
                style={{
                  animation: isPopping ? 'liquidPop 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
                  transform: isPopping ? undefined : `translate(${offset.x}px, ${offset.y}px)`,
                  transition: isPopping ? 'none' : 'transform 0.3s ease-out, scale 0.3s ease-out',
                  boxShadow: isPopping 
                    ? 'none' 
                    : '0 8px 32px -8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                  willChange: isPopping ? 'transform, opacity' : 'transform'
                }}
              >
                <span className="relative z-10 flex items-center gap-1 font-medium tracking-wide">
                  {tech.icon && <span className="text-[10px] opacity-90">{tech.icon}</span>}
                  <span className="drop-shadow-sm">{tech.name}</span>
                </span>
                
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 via-white/5 to-transparent"></div>
                  <div className="absolute top-0.5 left-2 right-1/3 h-1.5 bg-white/40 rounded-full blur-sm opacity-60"></div>
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
                
                <div className={`absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/5 transition-all duration-500 pointer-events-none ${isPopping ? 'opacity-0' : ''}`}></div>
                
                {isPopping && (
                  <>
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="liquid-droplet"
                        style={{
                          '--angle': `${(i * 30)}deg`,
                          '--distance': `${40 + Math.random() * 30}px`,
                          '--size': `${3 + Math.random() * 4}px`,
                          '--delay': `${Math.random() * 0.1}s`
                        }}
                      ></div>
                    ))}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {removedTechs.size > 0 && (
          <div className="mt-16 text-center">
            <button
              onClick={() => {
                setRemovedTechs(new Set());
                setPoppingTechs(new Set());
              }}
              className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-500 hover:scale-105 active:scale-95"
              style={{
                boxShadow: '0 8px 32px -8px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <span className="relative z-10 tracking-wide">Reset Bubbles</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes liquidPop {
          0% {
            transform: scale(1);
            opacity: 1;
            filter: blur(0px);
          }
          20% {
            transform: scale(1.15);
            opacity: 1;
          }
          40% {
            transform: scale(1.25);
            opacity: 0.9;
          }
          60% {
            transform: scale(1.1);
            opacity: 0.6;
            filter: blur(1px);
          }
          80% {
            transform: scale(0.8);
            opacity: 0.3;
            filter: blur(2px);
          }
          100% {
            transform: scale(0);
            opacity: 0;
            filter: blur(4px);
          }
        }

        .liquid-droplet {
          position: absolute;
          width: var(--size);
          height: var(--size);
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.3));
          top: 50%;
          left: 50%;
          pointer-events: none;
          animation: dropletSplash 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: var(--delay);
          box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
        }

        @keyframes dropletSplash {
          0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(1);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--distance)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TechStack;