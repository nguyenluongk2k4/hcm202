import { useState, useEffect, useRef } from 'react'
import './BreakChains.css'

const DIALS_CONFIG = [
  { letters: ['Đ', 'T', 'H', 'B', 'N'], target: 1 }, // T
  { letters: ['A', 'Ư', 'Ự', 'I', 'E'], target: 2 }, // Ự
  { letters: ['M', 'D', 'P', 'Q', 'C'], target: 1 }, // D
  { letters: ['A', 'E', 'O', 'I', 'U'], target: 2 }, // O
]

export default function BreakChains({ onWin }) {
  const [dials, setDials] = useState([0, 0, 0, 0])
  const [won, setWon] = useState(false)
  const [showEpicWin, setShowEpicWin] = useState(false)
  const wonRef = useRef(false)

  const handleShift = (dialIndex, dir) => {
    if (wonRef.current) return
    setDials(prev => {
      const next = [...prev]
      const len = DIALS_CONFIG[dialIndex].letters.length
      next[dialIndex] = (next[dialIndex] + dir + len) % len
      return next
    })
  }

  useEffect(() => {
    if (wonRef.current) return
    const isWin = dials.every((d, i) => d === DIALS_CONFIG[i].target)
    if (isWin) {
      wonRef.current = true
      setWon(true)
      
      // Delay to let the lock "snap" open before the epic explosion
      setTimeout(() => {
        setShowEpicWin(true)
        setTimeout(() => onWin(), 5500)
      }, 500)
    }
  }, [dials, onWin])

  // Progress based on correct letters (just for visual feedback)
  const correctCount = dials.filter((d, i) => d === DIALS_CONFIG[i].target).length
  const progress = won ? 100 : (correctCount / 4) * 100

  return (
    <div className="minigame-break">
      <p className="minigame-instruction">
        {won ? '✦ Tự do đã được giành lấy! ✦' : 'Xoay các trục chữ để giải mã phong ấn'}
      </p>

      <div className={`break-container ${won ? 'is-won' : ''}`}>
        
        {/* ── Background Chains ── */}
        <div className={`chain-wrapper ${showEpicWin ? 'is-shattered' : ''}`}>
          <div className="chain-link left-link" />
          <div className="chain-link right-link" />
        </div>

        {/* ── The Giant Combination Lock ── */}
        <div className={`padlock ${won ? 'is-unlocked' : ''} ${showEpicWin ? 'is-destroyed' : ''}`}>
          <div className="padlock-shackle">
            <div className="shackle-left" />
            <div className="shackle-right" />
            <div className="shackle-top" />
          </div>
          
          <div className="padlock-body">
            <div className="padlock-rivet tl" />
            <div className="padlock-rivet tr" />
            <div className="padlock-rivet bl" />
            <div className="padlock-rivet br" />
            
            <div className="dials-container">
              {dials.map((val, i) => {
                const config = DIALS_CONFIG[i]
                const isCorrect = val === config.target
                
                return (
                  <div key={i} className={`dial ${isCorrect ? 'is-correct' : ''}`}>
                    <button className="dial-btn up" onClick={() => handleShift(i, -1)}>▲</button>
                    <div className="dial-window">
                      <div 
                        className="dial-strip" 
                        style={{ transform: `translateY(${-val * 40}px)` }}
                      >
                        {config.letters.map((char, j) => (
                          <div key={j} className="dial-char">{char}</div>
                        ))}
                      </div>
                    </div>
                    <button className="dial-btn down" onClick={() => handleShift(i, 1)}>▼</button>
                  </div>
                )
              })}
            </div>
            <div className="padlock-keyhole" />
          </div>
        </div>

        {/* ── EPIC WIN PLOT TWIST ── */}
        {showEpicWin && (
          <div className="epic-win-overlay">
            <div className="epic-shockwave" />
            <div className="epic-sun-flare" />
            <div className="epic-rays" />
            <div className="epic-banner">
              <span className="text-glow-noble">ĐỘC LẬP</span><br/>
              <span className="text-solid-noble">TỰ DO</span>
            </div>
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={`spark-${i}`} className="epic-spark" style={{
                '--angle': `${Math.random() * 360}deg`,
                '--dist': `${120 + Math.random() * 350}px`,
                animationDelay: `${Math.random() * 0.5}s`,
                background: ['#fff', '#fde047', '#fbbf24', '#f87171'][Math.floor(Math.random() * 4)]
              }} />
            ))}
          </div>
        )}
      </div>

      <div className="minigame-progress">
        <div
          className="minigame-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
