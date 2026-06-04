import { useState, useEffect, useRef, useMemo } from 'react'
import './GravitySun.css'

export default function GravitySun({ onWin }) {
  const [progress, setProgress] = useState(0)
  const [won, setWon] = useState(false)
  const isPulling = useRef(false)
  const intervalRef = useRef(null)
  
  const [gravityWaves, setGravityWaves] = useState([])
  const waveTimer = useRef(null)

  // Generate 50 random stars
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * 40 + 35 // Percentage distance from center (35% to 75%)
      return {
        id: i,
        angle,
        initialDist: dist,
        size: Math.random() * 3 + 1.5,
        speed: Math.random() * 0.5 + 0.5
      }
    })
  }, [])

  const spawnWave = () => {
    const newWave = { id: Date.now() }
    setGravityWaves(prev => [...prev, newWave].slice(-5)) // Keep last 5
  }

  const handlePointerDown = (e) => {
    if (won) return
    e.preventDefault()
    isPulling.current = true
    
    if (!waveTimer.current) {
      spawnWave() // spawn immediately
      waveTimer.current = setInterval(spawnWave, 300)
    }

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(intervalRef.current)
            clearInterval(waveTimer.current)
            intervalRef.current = null
            waveTimer.current = null
            setWon(true)
            setTimeout(() => onWin(), 3500)
            return 100
          }
          return p + 1.2
        })
      }, 30)
    }
  }

  const handlePointerUp = () => {
    if (won) return
    isPulling.current = false
    
    if (waveTimer.current) {
      clearInterval(waveTimer.current)
      waveTimer.current = null
    }

    clearInterval(intervalRef.current)
    intervalRef.current = null
    
    // Stars drift back out slowly
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p <= 0 || isPulling.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          return Math.max(0, p)
        }
        return p - 0.5
      })
    }, 30)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (waveTimer.current) clearInterval(waveTimer.current)
    }
  }, [])

  return (
    <div className="minigame-sun">
      <p className="minigame-instruction">
        {won ? 'Mặt trời chân lý đã rực sáng!' : 'Nhấn giữ vùng trung tâm để hội tụ mọi tư tưởng vào Mặt trời Hồ Chí Minh'}
      </p>

      <div 
        className={`sun-container ${won ? 'is-won' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        {/* Gravity Waves */}
        {!won && gravityWaves.map(wave => (
          <div key={wave.id} className="gravity-wave" />
        ))}

        <div className="sun-core-wrapper">
          <div className="sun-core" style={{ 
            transform: won ? 'scale(1.5)' : `scale(${1 + (progress / 100) * 0.5})` 
          }} />
        </div>

        {/* Scattered Stars */}
        {!won && stars.map(star => {
          const pullRatio = progress / 100
          const currentDist = star.initialDist * (1 - pullRatio * star.speed)
          const x = 50 + currentDist * Math.cos(star.angle)
          const y = 50 + currentDist * Math.sin(star.angle)
          
          // Tail angle rotation based on angle of star + 180 (tail points outward)
          const tailAngle = star.angle * (180 / Math.PI)

          // dynamic box-shadow for tail
          const tailLength = 10 + pullRatio * 30
          const tailOpacity = 0.4 + pullRatio * 0.6

          return (
            <div 
              key={star.id}
              className="sun-star"
              style={{
                width: star.size * (1 + pullRatio * 0.5), // Scale up slightly
                height: star.size * (1 + pullRatio * 0.5),
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) rotate(${tailAngle}deg)`,
                opacity: pullRatio > 0.9 ? 0 : 1 - (pullRatio * 0.3), // fade out when near center
                boxShadow: `-${tailLength}px 0 10px rgba(255,165,0,${tailOpacity}), 0 0 5px #fff`
              }}
            />
          )
        })}

        {won && <div className="sun-supernova" />}
      </div>
      
      <div className="minigame-progress">
        <div 
          className="minigame-progress-fill" 
          style={{ width: `${progress}%`, background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} 
        />
      </div>
    </div>
  )
}
