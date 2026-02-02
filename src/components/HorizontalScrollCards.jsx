import { useEffect, useRef, useState } from 'react';

const HorizontalScrollCards = ({ 
  cardWidth = 350, // Width of each card
  cardHeight = 250, // Height of each card
  gap = 24, // Gap between cards
  speed = 1.5, // Scroll speed increased from 1 to 1.5
  pauseOnHover = true,
  className = ''
}) => {
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const row3Ref = useRef(null);
  const animationIdRef = useRef(null);
  const isPausedRef = useRef(false);
  const [flippedCards, setFlippedCards] = useState(new Set());

  // All project data
  const projects = [
    {
      id: 1,
      year: '2023-24',
      title: 'Portfolio Website {OLD}',
      description: 'My previous Portfolio Website, which is designed and developed myself using the basic web development technologies I learn. Features responsive design and smooth animations.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      image: 'Assets/1.jpg',
      gradient: 'from-blue-600 to-cyan-500',
      link: '#'
    },
    {
      id: 2,
      year: '2024',
      title: 'Ask Me Anything Anonymous',
      description: 'A Simple Backend application built on Next.js and took on to the production level using Vercel. Learnt a lot about authentication, database management, and deployment strategies.',
      tags: ['Next.js', 'Tailwind CSS', 'TypeScript', 'MongoDB'],
      image: 'Assets/2.jpg',
      gradient: 'from-purple-600 to-pink-500',
      link: '#'
    },
    {
      id: 3,
      year: '2024',
      title: 'Invasion Gaming Event',
      description: 'A gaming event landing page, built on React.js with Tailwind CSS. Features immersive animations and modern UI design patterns.',
      tags: ['React', 'Tailwind CSS'],
      image: 'Assets/3.jpg',
      gradient: 'from-orange-500 to-red-600',
      link: '#'
    },
    {
      id: 4,
      year: '2024',
      title: 's2apertre Open Source',
      description: 'Month long open source event by resourceio community. I was one of the frontend devs in this project, contributing to the UI/UX improvements and component library.',
      tags: ['React', 'JavaScript', 'Node.js', 'Express'],
      image: 'Assets/4.webp',
      gradient: 'from-green-500 to-teal-500',
      link: '#'
    },
    {
      id: 5,
      year: '2024',
      title: 'SIH-2024 Road Analysis',
      description: 'Masking Algorithm based on providing a detailed report on the differences of 2 road-construction images using computer vision and image processing techniques.',
      tags: ['Python', 'OpenCV', 'Flask'],
      image: 'Assets/5.jpg',
      gradient: 'from-yellow-500 to-orange-500',
      link: '#'
    },
    {
      id: 6,
      year: '2024',
      title: 'Customer Relationship Management',
      description: 'Freelance project, a CRM application that helps in managing customer relationships, built on MERN stack, with multiple different features including analytics dashboard and reporting.',
      tags: ['MongoDB', 'Express', 'React', 'Node.js'],
      image: 'Assets/6.jpg',
      gradient: 'from-indigo-600 to-blue-500',
      link: '#'
    }
  ];

  const experiences = [
    {
      id: 7,
      title: 'Devwrap 2024 (Best Beginner Team)',
      description: 'The first ever Web Dev offline hackathon experience, and we won the best beginner team. It was an incredible learning opportunity where we built innovative solutions under tight deadlines.',
      tags: ['SC-ECE AOT', 'Hackathon'],
      gradient: 'from-pink-600 to-rose-500',
      link: '#',
      year: '2024 - March',
      image: 'Assets/1.jpg'
    },
    {
      id: 8,
      title: 'UXopia 2024 (Winners)',
      description: 'The first ever UI/UX offline hackathon experience, the rare it sounds, the more it was a great experience. We designed user-centered interfaces and won first place.',
      tags: ['SC-CSBS AOT', 'UI/UX'],
      gradient: 'from-cyan-600 to-blue-500',
      link: '#',
      year: '2024 - April',
      image: 'Assets/2.jpg'
    },
    {
      id: 9,
      title: 'ClashDevs',
      description: 'Competitive coding and development event at TechFiesta AOT. Participated in challenging coding problems and collaborated with talented developers.',
      tags: ['TechFiesta AOT', 'Competition'],
      gradient: 'from-violet-600 to-purple-500',
      link: '#',
      year: '2024 - April',
      image: 'Assets/3.jpg'
    },
    {
      id: 10,
      title: 'E-Commerce Platform',
      description: 'Built a full-stack e-commerce platform with payment integration, product management, and user authentication. Implemented advanced features like wishlist, cart, and order tracking.',
      tags: ['React', 'Node.js', 'Stripe'],
      gradient: 'from-emerald-600 to-teal-500',
      link: '#',
      year: '2024',
      image: 'Assets/4.webp'
    },
    {
      id: 11,
      title: 'AI ChatBot Integration',
      description: 'Developed an intelligent chatbot using natural language processing. Integrated with multiple platforms and trained on custom datasets for accurate responses.',
      tags: ['Python', 'TensorFlow', 'NLP'],
      gradient: 'from-blue-600 to-indigo-500',
      link: '#',
      year: '2024',
      image: 'Assets/5.jpg'
    },
    {
      id: 12,
      title: 'Social Media Analytics Dashboard',
      description: 'Created a real-time analytics dashboard for social media metrics. Features include engagement tracking, sentiment analysis, and automated reporting.',
      tags: ['Vue.js', 'D3.js', 'Firebase'],
      gradient: 'from-fuchsia-600 to-pink-500',
      link: '#',
      year: '2024',
      image: 'Assets/6.jpg'
    }
  ];

  // Combine projects and experiences
  const allCards = [...projects, ...experiences];
  
  // No duplication - just use the cards as is
  const cards = allCards;

  useEffect(() => {
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    const row3 = row3Ref.current;

    if (!row1 || !row2 || !row3) return;

    let scrollPos1 = 0;
    let scrollPos2 = 0;
    let scrollPos3 = 0;

    const animate = () => {
      if (!isPausedRef.current) {
        // Row 1: Move left
        scrollPos1 -= speed * 0.5;
        if (Math.abs(scrollPos1) >= row1.scrollWidth / 2) {
          scrollPos1 = 0;
        }
        row1.style.transform = `translateX(${scrollPos1}px)`;

        // Row 2: Move right
        scrollPos2 += speed * 0.6;
        if (scrollPos2 >= 0) {
          scrollPos2 = -(row2.scrollWidth / 2);
        }
        row2.style.transform = `translateX(${scrollPos2}px)`;

        // Row 3: Move left (faster)
        scrollPos3 -= speed * 0.7;
        if (Math.abs(scrollPos3) >= row3.scrollWidth / 2) {
          scrollPos3 = 0;
        }
        row3.style.transform = `translateX(${scrollPos3}px)`;
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [speed]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      isPausedRef.current = true;
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      isPausedRef.current = false;
    }
  };

  // Distribute cards across 3 rows (4 cards per row = 12 total cards)
  const row1Cards = cards.filter((_, i) => i % 3 === 0);
  const row2Cards = cards.filter((_, i) => i % 3 === 1);
  const row3Cards = cards.filter((_, i) => i % 3 === 2);

  // Duplicate only for smooth infinite scroll
  const duplicateCards = (cardsArray) => [...cardsArray, ...cardsArray];

  const handleCardClick = (e, cardId) => {
    e.preventDefault();
    e.stopPropagation();
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleViewMoreClick = (e, link) => {
    e.stopPropagation(); // Prevent card flip
    if (link && link !== '#') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const renderCard = (card, index) => {
    const isFlipped = flippedCards.has(card.id);
    
    return (
      <div
        key={`${card.id}-${index}`}
        className="inline-block flex-shrink-0 group cursor-pointer"
        style={{ 
          width: `${cardWidth}px`, 
          height: `${cardHeight}px`,
          marginRight: `${gap}px`,
          perspective: '1000px'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => handleCardClick(e, card.id)}
      >
        <div 
          className="relative w-full h-full transition-transform duration-700 transform-style-3d"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* FRONT OF CARD */}
          <div 
            className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br ${card.gradient || 'from-gray-800 to-gray-900'} transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl`}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            
            {card.image && (
              <div className="relative w-full h-1/2 overflow-hidden">
                <img 
                  src={card.image} 
                  alt={card.title || 'Card'} 
                  className="w-full h-full object-cover opacity-80 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
            )}
            
            <div className={`relative p-5 flex flex-col justify-between ${card.image ? 'h-1/2' : 'h-full'}`}>
              <h3 className="text-white font-bold text-lg mb-3 line-clamp-1 group-hover:text-white/90 transition-colors leading-tight overflow-hidden text-ellipsis">
                {card.title || 'Untitled'}
              </h3>
              
              {card.tags && card.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {card.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-xs bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/30">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* BACK OF CARD */}
          <div 
            className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br ${card.gradient || 'from-gray-800 to-gray-900'} transform transition-all duration-300`}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            
            <div className="relative z-10 h-full w-full p-6 flex flex-col justify-between overflow-y-auto scrollbar-hide">
              <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
              
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-3 leading-tight whitespace-normal">
                  {card.title}
                </h3>
                
                <p className="text-white/90 text-sm leading-relaxed whitespace-normal break-words overflow-wrap-anywhere">
                  {card.description}
                </p>
              </div>
              
              <div className="flex-shrink-0 mt-4">
                {card.year && (
                  <p className="text-white/70 text-xs font-medium mb-3">
                    {card.year}
                  </p>
                )}
                
                <div className="flex items-center justify-between gap-2">
                  <p className="text-white/50 text-xs italic">
                    Click to flip back
                  </p>
                  
                  <button
                    onClick={(e) => handleViewMoreClick(e, card.link)}
                    className="text-white text-xs font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1 group flex-shrink-0"
                  >
                    View More
                    <svg 
                      className="w-3 h-3 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="projects" className={`relative w-full py-20 bg-black ${className}`}>
      
    
      {/* Scrolling cards container with reduced width and edge blur */}
      <div className="relative max-w-[75vw] mx-auto overflow-hidden">
        {/* Left edge blur/fade */}
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
        
        {/* Right edge blur/fade */}
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />
        
        <div className="space-y-8">
          {/* Row 1 - Moving Left */}
          <div className="relative overflow-hidden">
            <div
              ref={row1Ref}
              className="flex whitespace-nowrap"
              style={{ willChange: 'transform' }}
            >
              {duplicateCards(row1Cards).map((card, index) => renderCard(card, index))}
            </div>
          </div>

          {/* Row 2 - Moving Right */}
          <div className="relative overflow-hidden">
            <div
              ref={row2Ref}
              className="flex whitespace-nowrap"
              style={{ willChange: 'transform' }}
            >
              {duplicateCards(row2Cards).map((card, index) => renderCard(card, index))}
            </div>
          </div>

          {/* Row 3 - Moving Left */}
          <div className="relative overflow-hidden">
            <div
              ref={row3Ref}
              className="flex whitespace-nowrap"
              style={{ willChange: 'transform' }}
            >
              {/* {duplicateCards(row3Cards).map((card, index) => renderCard(card, index))} */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HorizontalScrollCards;