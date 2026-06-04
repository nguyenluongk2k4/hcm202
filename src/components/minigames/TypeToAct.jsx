import { useEffect, useState } from 'react'
import './TypeToAct.css'

const TARGET_QUOTE = [
  { id: 'w1', text: 'NÓI', order: 0 },
  { id: 'w2', text: 'ĐI',  order: 1 },
  { id: 'w3', text: 'ĐÔI', order: 2 },
  { id: 'w4', text: 'VỚI', order: 3 },
  { id: 'w5', text: 'LÀM', order: 4 },
]

// Fixed shuffle for predictability
const SHUFFLED_QUOTE = [
  TARGET_QUOTE[3], // VỚI
  TARGET_QUOTE[0], // NÓI
  TARGET_QUOTE[4], // LÀM
  TARGET_QUOTE[1], // ĐI
  TARGET_QUOTE[2], // ĐÔI
]

/* ─── Ambient background dots ────────────────────────────── */
const AMBIENT_DOTS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left:     `${Math.random() * 100}%`,
  top:      `${Math.random() * 100}%`,
  size:     2 + Math.random() * 3,
  color:    ['#7edcff', '#fff', '#fbbf24', '#4ade80'][Math.floor(Math.random() * 4)],
  duration: 3 + Math.random() * 5,
  delay:    Math.random() * 4,
}))

export default function TypeToAct({ onWin }) {
  const [slots, setSlots] = useState([null, null, null, null, null])
  const [pool, setPool] = useState([...SHUFFLED_QUOTE])
  
  const [errorState, setErrorState] = useState(false)
  const [won, setWon] = useState(false)
  
  /* Plot twist states */
  const [showWinEffect, setShowWinEffect] = useState(false)

  const handlePoolClick = (index) => {
    if (won || errorState) return
    const item = pool[index]
    if (!item) return

    const firstEmptySlot = slots.findIndex(s => s === null)
    if (firstEmptySlot === -1) return

    const newSlots = [...slots]
    newSlots[firstEmptySlot] = item
    
    const newPool = [...pool]
    newPool[index] = null
    
    setSlots(newSlots)
    setPool(newPool)
    
    // Check win condition
    if (newSlots.every(s => s !== null)) {
      const isCorrect = newSlots.every((s, i) => s.order === i)
      if (isCorrect) {
        handleWin()
      } else {
        triggerError()
      }
    }
  }

  const handleSlotClick = (index) => {
    if (won || errorState) return
    const item = slots[index]
    if (!item) return

    const newSlots = [...slots]
    newSlots[index] = null

    const origIndex = SHUFFLED_QUOTE.findIndex(p => p.id === item.id)
    const newPool = [...pool]
    newPool[origIndex] = item

    setSlots(newSlots)
    setPool(newPool)
  }

  const triggerError = () => {
    setErrorState(true)
    setTimeout(() => {
      setErrorState(false)
    }, 500)
  }

  const handleWin = () => {
    setWon(true)
    setShowWinEffect(true)
    // Epic plot twist duration: 5 seconds before calling onWin
    setTimeout(() => onWin(), 5500)
  }

  const progress = won ? 100 : (slots.filter(s => s !== null).length / 5) * 100

  return (
    <div className="minigame-puzzle">
      <p className="minigame-instruction">
        {won ? '⬡ TƯ TƯỞNG ĐÃ ĐƯỢC THÔNG SUỐT!' : 'Sắp xếp các mảnh chữ thành câu nói hoàn chỉnh'}
      </p>

      <div className={`puzzle-board${errorState ? ' is-error' : ''}${won ? ' is-won' : ''}`}>
        
        {/* ── Ambient dots ── */}
        {AMBIENT_DOTS.map(d => (
          <div
            key={d.id}
            className="ambient-dot"
            style={{
              left: d.left, top: d.top, width: d.size, height: d.size,
              background: d.color, boxShadow: `0 0 4px ${d.color}`,
              animationDuration: `${d.duration}s`, animationDelay: `${d.delay}s`,
            }}
          />
        ))}

        {/* ── PLOT TWIST: EPIC WIN EFFECT ── */}
        {showWinEffect && (
          <>
            <div className="win-epic-flash" />
            <div className="win-shockwave" />
            <div className="win-rays" />
            <div className="win-banner-epic">
              <span className="text-glow">TƯ TƯỞNG</span><br/>
              <span className="text-solid">VĨ ĐẠI</span>
            </div>
            {/* Pháo sáng hạt vàng */}
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={`spark-${i}`} className="win-spark" style={{
                '--angle': `${Math.random() * 360}deg`,
                '--dist': `${150 + Math.random() * 250}px`,
                animationDelay: `${Math.random() * 0.4}s`
              }} />
            ))}
          </>
        )}

        {/* ── SLOTS (Khu vực đích) ── */}
        <div className="puzzle-slots">
          {slots.map((item, index) => (
            <div 
              key={`slot-${index}`} 
              className={`puzzle-slot ${item ? 'has-item' : ''}`}
              onClick={() => handleSlotClick(index)}
            >
              {item && (
                <div className="puzzle-piece in-slot">
                  {item.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Bờ tường/Vách ngăn ảo ── */}
        <div className="puzzle-divider">
          <div className="puzzle-divider-line" />
        </div>

        {/* ── POOL (Khu vực nguồn) ── */}
        <div className="puzzle-pool">
          {pool.map((item, index) => (
            <div key={`pool-slot-${index}`} className="puzzle-pool-slot">
              {item && (
                <div 
                  className="puzzle-piece in-pool"
                  onClick={() => handlePoolClick(index)}
                >
                  {item.text}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* ── Progress bar ── */}
      <div className="minigame-progress">
        <div
          className="minigame-progress-fill"
          style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}
        />
      </div>
    </div>
  )
}
