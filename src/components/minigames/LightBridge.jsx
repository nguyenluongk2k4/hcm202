import React, { useState, useEffect, useRef } from 'react';
import './LightBridge.css';

const LightBridge = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const requestRef = useRef();

  const handlePointerDown = () => {
    if (!isWin) setIsHolding(true);
  };

  const handlePointerUp = () => {
    setIsHolding(false);
  };

  const animate = () => {
    if (isHolding && progress < 100 && !isWin) {
      setProgress(p => {
        const next = Math.min(p + 0.8, 100);
        if (next >= 100) {
          setIsWin(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 3000);
        }
        return next;
      });
      
      // Add falling sparkles
      if (Math.random() > 0.5) {
        setSparkles(prev => [...prev, {
          id: Math.random(),
          left: Math.random() > 0.5 ? progress/2 : 100 - progress/2,
          delay: 0
        }].slice(-30));
      }
    } else if (!isHolding && progress > 0 && !isWin) {
      setProgress(p => Math.max(p - 1.5, 0));
    }
    
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isHolding, progress, isWin]);

  useEffect(() => {
    if (sparkles.length > 0) {
      const timer = setTimeout(() => {
        setSparkles(prev => prev.slice(5));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [sparkles]);

  const bridgeWidth = `${progress / 2}%`;

  return (
    <div 
      className={`light-bridge-container ${isWin ? 'bridge-win' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="space-background">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`
          }}></div>
        ))}
      </div>

      <div className="bridge-nodes-wrapper">
        <div className={`node node-left ${isHolding ? 'node-active' : ''}`}></div>
        <div className={`node node-right ${isHolding ? 'node-active' : ''}`}></div>

        <div className="bridge-path left-path" style={{ width: bridgeWidth }}></div>
        <div className="bridge-path right-path" style={{ width: bridgeWidth }}></div>

        {isWin && <div className="center-spark"></div>}
        {isWin && <div className="rainbow-shockwave"></div>}

        {sparkles.map(s => (
          <div 
            key={s.id} 
            className="sparkle-drop"
            style={{ 
              left: `${s.left}%`,
              top: '50%'
            }}
          ></div>
        ))}
      </div>

      <div className="bridge-instructions">
        <h3>Light Bridge</h3>
        <p>{isWin ? 'Connection Established!' : 'Hold to connect the energy bridge'}</p>
      </div>
    </div>
  );
};

export default LightBridge;
