import React, { useState, useEffect } from 'react';
import './AlignRings.css';

const AlignRings = ({ onComplete }) => {
  const [angles, setAngles] = useState([120, 240, 60]);
  const [isWin, setIsWin] = useState(false);
  const [particles, setParticles] = useState([]);

  const rotateRing = (index) => {
    if (isWin) return;
    
    // Add rotation particles
    const newParticles = Array.from({ length: 5 }).map((_, i) => ({
      id: Math.random(),
      ring: index,
      angle: Math.random() * 360,
      life: 1
    }));
    setParticles(prev => [...prev, ...newParticles].slice(-20));

    setAngles(prev => {
      const newAngles = [...prev];
      newAngles[index] = (newAngles[index] + 45) % 360;
      return newAngles;
    });
  };

  useEffect(() => {
    const allAligned = angles.every(a => a === 0);
    if (allAligned && !isWin) {
      setIsWin(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000); // 3 seconds for win animation
    }
  }, [angles, isWin, onComplete]);

  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles(prev => prev.slice(5));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  return (
    <div className={`align-rings-container ${isWin ? 'win-shake' : ''}`}>
      <div className="astrolabe-wrapper">
        {/* Core center */}
        <div className={`astrolabe-core ${isWin ? 'core-active' : ''}`}></div>

        {/* Laser beam */}
        {isWin && <div className="laser-beam"></div>}

        {/* Rings */}
        {[0, 1, 2].map((ringIndex) => {
          const isAligned = angles[ringIndex] === 0;
          return (
            <div
              key={ringIndex}
              className={`ring ring-${ringIndex} ${isAligned ? 'ring-aligned' : ''}`}
              style={{ transform: `rotate(${angles[ringIndex]}deg) rotateX(60deg)` }}
              onClick={() => rotateRing(ringIndex)}
            >
              <div className="ring-inner">
                {/* Runes / Text */}
                <span className="rune rune-1">✦</span>
                <span className="rune rune-2">✧</span>
                <span className="rune rune-3">✦</span>
              </div>
              
              {/* Particles for this ring */}
              {particles.filter(p => p.ring === ringIndex).map(p => (
                <div 
                  key={p.id} 
                  className="ring-particle" 
                  style={{ transform: `rotate(${p.angle}deg) translateY(-50%)` }}
                ></div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="instructions">
        <h3>Align the Astrolabe</h3>
        <p>Click the rings to align them to the center.</p>
      </div>
    </div>
  );
};

export default AlignRings;
