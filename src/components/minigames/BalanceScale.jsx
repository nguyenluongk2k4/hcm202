import { useEffect, useRef, useState, useMemo } from 'react'
import './BalanceScale.css'

const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 4,
  duration: 1.5 + Math.random() * 2.5,
}))

export default function BalanceScale({ onWin }) {
  const [angle, setAngle]               = useState(0)
  const [won, setWon]                   = useState(false)
  const [error, setError]               = useState(false)
  const [isNearBalance, setIsNearBalance] = useState(false)
  const [hammerStrike, setHammerStrike] = useState(false)
  const [showWinEffect, setShowWinEffect] = useState(false)

  const angleRef = useRef(0)
  angleRef.current = angle

  /* ── Core oscillation ──────────────────────────────────── */
  useEffect(() => {
    if (won) return undefined
    const start = Date.now()
    let frame
    const tick = () => {
      const t   = Date.now() - start
      // Oscillate between -45 and 45 degrees
      const raw = Math.sin(t * 0.0018) * 45
      setAngle(raw)
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [won])

  /* ── Near-balance detection ────────────────────────────── */
  useEffect(() => {
    setIsNearBalance(Math.abs(angle) < 5)
  }, [angle])

  /* ── Strike handler ────────────────────────────────────── */
  const handleStrike = () => {
    if (won || hammerStrike) return
    
    // Animate hammer
    setHammerStrike(true)
    setTimeout(() => setHammerStrike(false), 250)

    // Check hit at the moment of impact (delay 100ms for visual sync)
    setTimeout(() => {
      if (Math.abs(angleRef.current) < 5) {
        setWon(true)
        setAngle(0) // snap to perfect balance
        setShowWinEffect(true)
        setTimeout(() => onWin(), 5000) // Delay to watch the epic plot twist
      } else {
        setError(true)
        setTimeout(() => setError(false), 400)
      }
    }, 100)
  }

  const progress = won ? 100 : Math.max(0, 50 - Math.abs(angle) / 45 * 50)

  return (
    <div className="minigame-balance">
      <p className="minigame-instruction">
        {won
          ? '⚖ QUYỀN LỰC THUỘC VỀ NHÂN DÂN!'
          : 'Gõ búa khi cán cân ở trạng thái cân bằng hoàn hảo nhất'}
      </p>

      <div className={`balance-container${won ? ' is-won' : ''}${error ? ' is-error' : ''}`}>
        
        {error && <div className="error-flash" />}

        {STARS.map(s => (
          <div
            key={s.id}
            className="balance-star"
            style={{
              left: s.left, top: s.top, width: s.size, height: s.size,
              animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
            }}
          />
        ))}

        <div className={`angle-display${isNearBalance ? ' is-ready' : ''}`}>
          ĐỘ LỆCH: {Math.abs(angle).toFixed(1)}°
        </div>

        {showWinEffect && (
          <>
            <div className="win-epic-flash" />
            <div className="win-shockwave" />
            <div className="win-rays" />
            <div className="win-banner-epic">
              <span className="text-glow">CÔNG LÝ</span><br/>
              <span className="text-solid">THỰC THI</span>
            </div>
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={`spark-${i}`} className="win-spark" style={{
                '--angle': `${Math.random() * 360}deg`,
                '--dist': `${100 + Math.random() * 200}px`,
                animationDelay: `${Math.random() * 0.5}s`
              }} />
            ))}
          </>
        )}

        <svg viewBox="0 0 400 450" className="balance-svg">
          <defs>
            <linearGradient id="gold-pillar" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="30%" stopColor="#fde68a" />
              <stop offset="70%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="gold-beam" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="wood-handle" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="50%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <filter id="epic-glow" filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="soft-glow" filterUnits="userSpaceOnUse" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {isNearBalance && !won && (
             <circle cx="200" cy="150" r="120" fill="rgba(74, 222, 128, 0.15)" filter="url(#epic-glow)" className="balance-aura" />
          )}
          {won && (
             <circle cx="200" cy="150" r="180" fill="rgba(251, 191, 36, 0.3)" filter="url(#epic-glow)" className="win-aura" />
          )}

          {/* ITEM GAME STYLE SCALE */}
          <g className={won ? "scale-group win-glow" : "scale-group"}>
            {/* Chân đế cán cân (Base) */}
            <path d="M 130 400 L 270 400 L 250 350 L 150 350 Z" fill="url(#gold-pillar)" stroke="#3f1f07" strokeWidth="4" strokeLinejoin="round" />
            <rect x="160" y="330" width="80" height="20" fill="url(#gold-pillar)" stroke="#3f1f07" strokeWidth="4" rx="6" />
            
            {/* Trụ cán cân (Pillar) */}
            <rect x="188" y="150" width="24" height="180" fill="url(#gold-pillar)" stroke="#3f1f07" strokeWidth="4" rx="5" />
            
            {/* Trục chính */}
            <circle cx="200" cy="150" r="14" fill="url(#gold-pillar)" stroke="#3f1f07" strokeWidth="4" />
            <circle cx="200" cy="150" r="6" fill="#fde68a" />

            {/* Đòn bẩy và 2 Đĩa cân (Beam & Pans) */}
            <g transform={`translate(200, 150) rotate(${angle})`} style={{ transition: won ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none' }}>
              {/* Thanh đòn bẩy */}
              <rect x="-130" y="-10" width="260" height="20" fill="url(#gold-beam)" stroke="#3f1f07" strokeWidth="4" rx="10" />
              <circle cx="0" cy="0" r="20" fill="url(#gold-pillar)" stroke="#3f1f07" strokeWidth="4" />
              <circle cx="0" cy="0" r="8" fill="#fde68a" />

              {/* Móc treo trái và phải */}
              <circle cx="-120" cy="0" r="8" fill="#3f1f07" />
              <circle cx="120" cy="0" r="8" fill="#3f1f07" />

              {/* Đĩa cân bên trái */}
              <g transform="translate(-120, 0)">
                <g transform={`rotate(${-angle})`} style={{ transition: won ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none' }}>
                  {/* Dây xích (Drawn as thick dark lines for item game style) */}
                  <line x1="0" y1="0" x2="-35" y2="80" stroke="#3f1f07" strokeWidth="3" />
                  <line x1="0" y1="0" x2="35" y2="80" stroke="#3f1f07" strokeWidth="3" />
                  <line x1="0" y1="0" x2="-35" y2="80" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="0" y1="0" x2="35" y2="80" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
                  
                  {/* Lòng đĩa */}
                  <path d="M -45 80 Q 0 120 45 80 L 35 75 Q 0 110 -35 75 Z" fill="url(#gold-beam)" stroke="#3f1f07" strokeWidth="4" strokeLinejoin="round" />
                  <path d="M -40 80 Q 0 115 40 80" fill="none" stroke="#fde68a" strokeWidth="2" />
                </g>
              </g>

              {/* Đĩa cân bên phải */}
              <g transform="translate(120, 0)">
                <g transform={`rotate(${-angle})`} style={{ transition: won ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none' }}>
                  <line x1="0" y1="0" x2="-35" y2="80" stroke="#3f1f07" strokeWidth="3" />
                  <line x1="0" y1="0" x2="35" y2="80" stroke="#3f1f07" strokeWidth="3" />
                  <line x1="0" y1="0" x2="-35" y2="80" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="0" y1="0" x2="35" y2="80" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
                  
                  <path d="M -45 80 Q 0 120 45 80 L 35 75 Q 0 110 -35 75 Z" fill="url(#gold-beam)" stroke="#3f1f07" strokeWidth="4" strokeLinejoin="round" />
                  <path d="M -40 80 Q 0 115 40 80" fill="none" stroke="#fde68a" strokeWidth="2" />
                </g>
              </g>
            </g>
          </g>

          {/* ITEM GAME STYLE GAVEL (BÚA) - Thu nhỏ lại và gõ có hiệu ứng */}
          <g 
            className={`gavel-interactive ${hammerStrike ? 'is-striking' : ''}`} 
            transform="translate(320, 390)" 
            onClick={handleStrike}
            cursor="pointer"
          >
            {/* Vùng bấm vô hình (Hitbox to) để dễ click */}
            <circle cx="0" cy="-50" r="90" fill="transparent" />

            {/* Đế gõ (Sound Block) */}
            <path d="M -35 0 L 35 0 L 45 15 L -45 15 Z" fill="url(#wood-handle)" stroke="#3f1f07" strokeWidth="4" strokeLinejoin="round" />
            <path d="M -30 2 L 30 2" stroke="#fde68a" strokeWidth="1" opacity="0.3" />

            {/* Tay cầm và đầu búa xoay bằng CSS */}
            <g className="gavel-head-wrapper">
              {/* Scale down 0.7 để búa bé lại */}
              <g transform="scale(0.7)">
                {/* Tay cầm (Handle) */}
                <rect x="-8" y="-120" width="16" height="120" fill="url(#wood-handle)" stroke="#3f1f07" strokeWidth="4" rx="8" />
                <rect x="-10" y="-30" width="20" height="10" fill="url(#gold-beam)" stroke="#3f1f07" strokeWidth="4" rx="3" />
                
                {/* Đầu búa (Head) */}
                <path d="M -35 -140 L 35 -140 L 40 -100 L -40 -100 Z" fill="url(#wood-handle)" stroke="#3f1f07" strokeWidth="4" strokeLinejoin="round" />
                {/* Đai vàng bọc 2 đầu búa */}
                <rect x="-45" y="-135" width="12" height="30" fill="url(#gold-beam)" stroke="#3f1f07" strokeWidth="4" rx="3" />
                <rect x="33" y="-135" width="12" height="30" fill="url(#gold-beam)" stroke="#3f1f07" strokeWidth="4" rx="3" />
                {/* Highlight */}
                <path d="M -25 -135 L 25 -135" stroke="#fde68a" strokeWidth="2" opacity="0.5" />
              </g>
            </g>
            
            {/* Vòng sáng quanh búa báo hiệu (nhấp nháy mời bấm) */}
            {!won && (
              <circle cx="0" cy="-40" r="50" fill="none" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="2" strokeDasharray="6 6" className="gavel-hint-ring" />
            )}

            {/* Hiệu ứng tia lửa nổ lúc gõ trúng */}
            {hammerStrike && (
              <g className="strike-impact">
                <circle cx="-15" cy="-5" r="25" fill="#fde68a" filter="url(#epic-glow)" />
                <path d="M -15 -35 L -10 -15 L 10 -10 L -5 0 L 5 20 L -15 10 L -35 20 L -25 0 L -40 -10 L -20 -15 Z" fill="#fff" />
              </g>
            )}
          </g>
        </svg>

      </div>

      {/* ── Progress bar ── */}
      <div className="minigame-progress">
        <div
          className="minigame-progress-fill"
          style={{ width: `${progress}%`, transition: won ? 'width 0.5s ease' : 'none' }}
        />
      </div>
    </div>
  )
}
