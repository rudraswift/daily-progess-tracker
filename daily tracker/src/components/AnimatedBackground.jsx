import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const AnimatedBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    // We will build a grid of animated dots
    const fragment = document.createDocumentFragment();
    const grid = [14, 14]; // rows, cols based on screen approx relative
    const col = getComputedStyle(document.body).getPropertyValue('--color-primary').trim() || '#FF4B4B';
    
    // Fill the screen with grid elements
    const elementCount = grid[0] * grid[1];
    
    // Clear any existing children before appending new ones to prevent duplication on strict mode
    containerEl.innerHTML = '';

    for (let i = 0; i < elementCount; i++) {
      const el = document.createElement('div');
      el.classList.add('anime-grid-el');
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = col;
      el.style.opacity = '0.05';
      el.style.margin = '20px'; // Spacing
      fragment.appendChild(el);
    }
    
    containerEl.appendChild(fragment);

    // Stagger animation mimicking Anime.js landing
    const tl = anime.timeline({
      loop: true,
      direction: 'alternate',
    });

    tl.add({
      targets: '.anime-grid-el',
      scale: [
        {value: .1, easing: 'easeOutSine', duration: 500},
        {value: 1, easing: 'easeInOutQuad', duration: 1200}
      ],
      delay: anime.stagger(200, {grid: grid, from: 'center'}),
      opacity: [
        {value: 0.05, duration: 500},
        {value: 0.15, duration: 1200}
      ]
    });

    return () => {
      // Cleanup
      tl.pause();
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden flex flex-wrap justify-center content-center z-0"
      style={{
         perspective: '1000px',
      }}
    >
      {/* Container for the grid */}
      <div 
        ref={containerRef} 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: 'calc(14 * 64px)', 
          justifyContent: 'center'
        }}
      ></div>
    </div>
  );
};

export default AnimatedBackground;
