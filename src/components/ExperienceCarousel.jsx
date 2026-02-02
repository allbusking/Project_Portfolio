import React, { useState, useEffect } from 'react';

const ExperienceCarousel = () => {
  const experiences = [
    {
      title: 'Devwrap 2024 (Best Beginner Team)',
      organization: 'SC-ECE AOT',
      description: 'The first ever Web Dev offline hackathon experience, and we won the best beginner team.',
      date: '2024 - March',
      gradient: 'from-blue-300 via-indigo-300 to-purple-400'
    },
    {
      title: 'UXopia 2024 (Winners)',
      organization: 'SC-CSBS AOT',
      description: 'The first ever UI/UX offline hackathon experience, the rare it sounds, the more it was a great experience.',
      date: '2024 - April',
      gradient: 'from-rose-300 via-pink-300 to-fuchsia-400'
    },
    {
      title: 'ClashDevs',
      organization: 'TechFiesta AOT',
      description: 'An intense 24-hour coding competition where teams built innovative solutions. Collaborated with talented developers and learned cutting-edge technologies.',
      date: '2024 - April',
      gradient: 'from-amber-300 via-orange-300 to-red-400'
    },
    {
      title: 'HackTheCode 2024 (Runner Up)',
      organization: 'Tech Community',
      description: 'Competed against 50+ teams in a national level hackathon. Built an AI-powered application that impressed the judges.',
      date: '2024 - May',
      gradient: 'from-emerald-300 via-teal-300 to-cyan-400'
    },
    {
      title: 'WebWizards Championship',
      organization: 'Digital Innovation Hub',
      description: 'Showcased advanced web development skills in a timed challenge. Created a fully responsive web application in just 6 hours.',
      date: '2024 - June',
      gradient: 'from-sky-300 via-blue-300 to-indigo-400'
    },
    {
      title: 'DesignSprint 2024 (Best Design)',
      organization: 'Creative Tech Society',
      description: 'Won the best design award for creating an innovative user experience for a mobile application prototype.',
      date: '2024 - July',
      gradient: 'from-violet-300 via-purple-300 to-pink-400'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setActiveIndex(current => (current + 1) % experiences.length);
          return 0;
        }
        return prev + 0.5;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPaused, experiences.length]);

  const handleCardClick = (index) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
      setProgress(0);
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 500);
    }
  };

  const getCardStyle = (index) => {
    const diff = index - activeIndex;
    const totalCards = experiences.length;
    
    let position = diff;
    if (Math.abs(diff) > totalCards / 2) {
      position = diff > 0 ? diff - totalCards : diff + totalCards;
    }

    if (position === 0) {
      return {
        transform: 'translateX(0%) scale(1) rotateY(0deg)',
        zIndex: 50,
        opacity: 1,
        filter: 'blur(0px)'
      };
    } else if (position === -1) {
      return {
        transform: 'translateX(-85%) scale(0.85) rotateY(25deg)',
        zIndex: 30,
        opacity: 0.7,
        filter: 'blur(1px)'
      };
    } else if (position === 1) {
      return {
        transform: 'translateX(85%) scale(0.85) rotateY(-25deg)',
        zIndex: 30,
        opacity: 0.7,
        filter: 'blur(1px)'
      };
    } else {
      return {
        transform: `translateX(${position * 100}%) scale(0.7) rotateY(${position > 0 ? -35 : 35}deg)`,
        zIndex: 10,
        opacity: 0,
        filter: 'blur(2px)',
        pointerEvents: 'none'
      };
    }
  };

  // WhatsApp-style doodle patterns
  const DoodlePattern = () => (
    <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
      {/* Stars */}
      <path d="M50 30 L52 36 L58 36 L53 40 L55 46 L50 42 L45 46 L47 40 L42 36 L48 36 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M380 80 L382 86 L388 86 L383 90 L385 96 L380 92 L375 96 L377 90 L372 86 L378 86 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      
      {/* Circles */}
      <circle cx="100" cy="500" r="15" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="350" cy="450" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="70" cy="150" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
      
      {/* Squiggly lines */}
      <path d="M 300 50 Q 310 45, 320 50 T 340 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M 150 520 Q 160 515, 170 520 T 190 520" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      
      {/* Triangle */}
      <path d="M 380 500 L 395 530 L 365 530 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M 120 100 L 135 130 L 105 130 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
      
      {/* Dots pattern */}
      <circle cx="200" cy="80" r="3" fill="currentColor"/>
      <circle cx="210" cy="85" r="3" fill="currentColor"/>
      <circle cx="220" cy="80" r="3" fill="currentColor"/>
      
      <circle cx="280" cy="500" r="3" fill="currentColor"/>
      <circle cx="290" cy="505" r="3" fill="currentColor"/>
      <circle cx="300" cy="500" r="3" fill="currentColor"/>
      
      {/* Plus signs */}
      <path d="M 30 400 L 30 415 M 22.5 407.5 L 37.5 407.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M 360 200 L 360 215 M 352.5 207.5 L 367.5 207.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      
      {/* Hearts */}
      <path d="M 250 180 C 245 175, 235 175, 235 185 C 235 190, 250 200, 250 200 C 250 200, 265 190, 265 185 C 265 175, 255 175, 250 180 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      
      {/* Arrows */}
      <path d="M 90 350 L 110 350 M 105 345 L 110 350 L 105 355" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Spiral */}
      <path d="M 150 250 Q 155 245, 160 250 Q 165 260, 155 265 Q 140 270, 140 255 Q 140 240, 155 240" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      
      {/* Lightning bolt */}
      <path d="M 320 350 L 315 365 L 323 365 L 318 380 L 330 362 L 322 362 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      
      {/* Music note */}
      <path d="M 80 480 L 80 450 L 95 445 L 95 475 M 80 480 Q 75 485, 80 490 Q 85 485, 80 480" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="relative w-full max-w-6xl h-[700px]" style={{ perspective: '2000px' }}>
        {experiences.map((exp, index) => {
          const style = getCardStyle(index);
          const isActive = index === activeIndex;
          
          return (
            <div
              key={index}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[600px] rounded-3xl cursor-pointer transition-all duration-700 ease-out`}
              style={style}
              onClick={() => handleCardClick(index)}
            >
              <div className={`w-full h-full rounded-3xl bg-gradient-to-br ${exp.gradient} p-8 flex flex-col justify-between shadow-2xl border border-black/10 relative overflow-hidden`}>
                {/* WhatsApp-style Doodles */}
                <div className="absolute inset-0 text-gray-800 opacity-30">
                  <DoodlePattern />
                </div>

                {/* Progress Bar - Only visible on active card */}
                {isActive && (
                  <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden mb-6 relative z-10">
                    <div 
                      className="h-full bg-black/70 rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1 flex flex-col justify-center relative z-10">
                  <h2 className="text-gray-900 text-3xl font-bold mb-4 leading-tight">
                    {exp.title}
                  </h2>
                  <p className="text-gray-800 text-lg leading-relaxed mb-6">
                    {exp.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="relative z-10">
                  <h3 className="text-gray-900 text-2xl font-bold mb-1">
                    {exp.organization}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {exp.date}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExperienceCarousel;