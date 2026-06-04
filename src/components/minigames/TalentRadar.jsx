import React, { useState, useEffect } from 'react';
import './TalentRadar.css';

const TalentRadar = ({ onComplete }) => {
  const [talents, setTalents] = useState([]);
  const [foundCount, setFoundCount] = useState(0);
  const [isWin, setIsWin] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate 3 random talents within radius 120
    const newTalents = Array.from({ length: 3 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 100 + 20; // 20 to 120
      return {
        id: i,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        found: false
      };
    });
    setTalents(newTalents);
  }, []);

  const handleRadarClick = (e) => {
    if (isWin) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left - rect.width / 2;
    const clickY = e.clientY - rect.top - rect.height / 2;

    let foundAny = false;
    const updatedTalents = talents.map(t => {
      if (t.found) return t;
      const dist = Math.sqrt(Math.pow(t.x - clickX, 2) + Math.pow(t.y - clickY, 2));
      if (dist < 30) {
        foundAny = true;
        // Generate burst particles
        const newParticles = Array.from({ length: 8 }).map((_, i) => ({
          id: Math.random(),
          x: t.x,
          y: t.y,
          angle: (i * 45) * (Math.PI / 180)
        }));
        setParticles(prev => [...prev, ...newParticles]);
        return { ...t, found: true };
      }
      return t;
    });

    if (foundAny) {
      setTalents(updatedTalents);
      const newlyFound = updatedTalents.filter(t => t.found).length;
      setFoundCount(newlyFound);
      if (newlyFound === talents.length) {
        setIsWin(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 3000);
      }
    }
  };

  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles([]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  return (
    <div className="talent-radar-container">
      <div className={`radar-screen ${isWin ? 'radar-win' : ''}`} onClick={handleRadarClick}>
        <div className="radar-grid"></div>
        <div className="radar-sweep"></div>
        
        {/* Talents */}
        {talents.map(t => (
          <div
            key={t.id}
            className={`talent-blip ${t.found ? 'talent-found' : ''}`}
            style={{ 
              left: `calc(50% + ${t.x}px)`, 
              top: `calc(50% + ${t.y}px)` 
            }}
          >
            {!t.found && <div className="blip-ripple"></div>}
          </div>
        ))}

        {/* Burst Particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="burst-particle"
            style={{
              left: `calc(50% + ${p.x}px)`,
              top: `calc(50% + ${p.y}px)`,
              '--angle': `${p.angle}rad`
            }}
          ></div>
        ))}

        {/* Shockwave on win */}
        {isWin && <div className="win-shockwave"></div>}
      </div>
      
      <div className="radar-status">
        <h3>Talent Radar</h3>
        <p>Detected: {foundCount} / {talents.length}</p>
      </div>
    </div>
  );
};

export default TalentRadar;
