import { useEffect, useMemo, useRef, useState } from 'react'
import './BalanceScale.css'

const mandates = [
  { key: 'of-people',  title: 'Của dân',    left: 'Quyền lực',  right: 'Nhân dân'   },
  { key: 'by-people',  title: 'Do dân',     left: 'Đồng thuận', right: 'Hành động'  },
  { key: 'for-people', title: 'Vì dân',     left: 'Kỷ cương',   right: 'Phục vụ'    },
  { key: 'rule-law',   title: 'Pháp quyền', left: 'Công bằng',  right: 'Luật pháp'  },
  { key: 'democracy',  title: 'Dân chủ',    left: 'Tự do',      right: 'Trách nhiệm'},
]

function seededRatio(index, salt = 1) {
  const value = Math.sin(index * 76.371 + salt * 41.119) * 10000
  return value - Math.floor(value)
}

export default function BalanceScale({ onWin, onSolved }) {
  const [angle, setAngle]             = useState(0)
  const [seals, setSeals]             = useState([])
  const [error, setError]             = useState(false)
  const [hammerStrike, setHammerStrike] = useState(false)
  const [won, setWon]                 = useState(false)
  const [showFinale, setShowFinale]   = useState(false)
  const [readyGlow, setReadyGlow]     = useState(false)
  const angleRef = useRef(0)
  const wonRef   = useRef(false)
  const readyRef = useRef(false)

  const activeMandate = mandates[Math.min(seals.length, mandates.length - 1)]
  const isReady       = Math.abs(angle) <= 5
  const progress      = (seals.length / mandates.length) * 100

  const stars = useMemo(() =>
    Array.from({ length: 46 }).map((_, index) => ({
      id:       index,
      left:     4 + seededRatio(index, 1) * 92,
      top:      5 + seededRatio(index, 2) * 86,
      size:     1.2 + seededRatio(index, 3) * 3.6,
      delay:    seededRatio(index, 4) * 4,
      duration: 1.8 + seededRatio(index, 5) * 3,
      hue:      Math.round(seededRatio(index, 77) * 360),
    })), [])

  // Finale: chromatic sparks
  const finaleSparks = useMemo(() =>
    Array.from({ length: 44 }).map((_, index) => ({
      id:       index,
      angle:    seededRatio(index, 6) * 360,
      distance: 110 + seededRatio(index, 7) * 380,
      delay:    seededRatio(index, 8) * 0.7,
      duration: 2.2 + seededRatio(index, 9) * 2.5,
      size:     3 + seededRatio(index, 10) * 9,
      hue:      Math.round(seededRatio(index, 78) * 360),
    })), [])

  // Finale: light rays
  const lightRays = useMemo(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id:     i,
      angle:  i * 30,
      hue:    (i * 24) % 360,
      delay:  seededRatio(i, 80) * 0.8,
      length: 35 + seededRatio(i, 81) * 45,
    })), [])

  // Finale: color rings
  const colorRings = useMemo(() =>
    Array.from({ length: 5 }).map((_, i) => ({
      id:    i,
      hue:   i * 72,
      delay: i * 0.2,
      size:  6 + i * 12,
    })), [])

  // Finale: scales sparks
  const scaleOrbs = useMemo(() =>
    Array.from({ length: 8 }).map((_, i) => ({
      id:       i,
      x:        20 + seededRatio(i, 82) * 60,
      y:        20 + seededRatio(i, 83) * 60,
      size:     6 + seededRatio(i, 84) * 14,
      delay:    seededRatio(i, 85) * 1.2,
      duration: 3 + seededRatio(i, 86) * 2,
      hue:      Math.round(seededRatio(i, 87) * 360),
    })), [])

  useEffect(() => {
    angleRef.current = angle
    const nowReady = Math.abs(angle) <= 5
    if (nowReady !== readyRef.current) {
      readyRef.current = nowReady
      setReadyGlow(nowReady)
    }
  }, [angle])

  useEffect(() => {
    if (won) return undefined

    const start = performance.now()
    let frame = 0

    const tick = (now) => {
      const elapsed   = now - start
      // Cân lắc nhanh hơn, biên độ giảm dần khi seal được đóng
      const speed     = 0.00088 + seals.length * 0.00014
      const amplitude = 26 - seals.length * 3.2
      const nextAngle = Math.sin(elapsed * speed) * amplitude + Math.sin(elapsed * speed * 2.3) * 3

      angleRef.current = nextAngle
      setAngle(nextAngle)
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [seals.length, won])

  const complete = () => {
    wonRef.current = true
    onSolved?.()
    setWon(true)
    setAngle(0)
    window.setTimeout(() => setShowFinale(true), 720)
    window.setTimeout(onWin, 12000)
  }

  const handleStrike = () => {
    if (wonRef.current || hammerStrike) return

    setHammerStrike(true)
    window.setTimeout(() => setHammerStrike(false), 260)

    window.setTimeout(() => {
      if (Math.abs(angleRef.current) <= 5) {
        const nextSeals = [...seals, activeMandate.key]
        setSeals(nextSeals)
        if (nextSeals.length === mandates.length) complete()
      } else {
        setError(true)
        window.setTimeout(() => setError(false), 380)
      }
    }, 40)
  }

  return (
    <div className={`minigame-balance ${showFinale ? 'is-final-scene' : ''}`}>
      <p className="minigame-instruction">
        {won
          ? 'Năm nguyên tắc đã cân bằng — quyền lực sáng khi quay về phục vụ nhân dân.'
          : `Đóng dấu "${activeMandate.title}" khi kim cân vào vùng xanh giữa. (${seals.length}/${mandates.length})`}
      </p>

      <div className={`gov-stage ${error ? 'is-error' : ''} ${won ? 'is-won' : ''} ${readyGlow ? 'is-ready-glow' : ''}`}>
        <div className="gov-stage-aura" />
        <div className="gov-civic-grid" />

        {stars.map(star => (
          <i
            key={star.id}
            className="gov-star"
            style={{
              left:              `${star.left}%`,
              top:               `${star.top}%`,
              width:             `${star.size}px`,
              '--hue':           star.hue,
              animationDelay:    `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}

        {error && <div className="gov-error-flash" />}

        {/* Ready flash ring */}
        {isReady && !won && <div className="gov-ready-flash" />}

        {/* Balance meter */}
        <div className={`gov-balance-meter ${isReady ? 'is-ready' : ''}`}>
          <span>{isReady ? '✦ ZONE ✦' : 'Độ lệch'}</span>
          <strong>{Math.abs(angle).toFixed(1)}°</strong>
        </div>

        {/* Mandate progress row */}
        <div className="gov-mandate-row">
          {mandates.map((mandate, index) => (
            <span
              key={mandate.key}
              className={`${seals.includes(mandate.key) ? 'is-sealed' : ''} ${index === seals.length && !won ? 'is-active' : ''}`}
            >
              {mandate.title}
            </span>
          ))}
        </div>

        {/* Scale SVG */}
        <svg viewBox="0 0 460 460" className="gov-scale-svg">
          <defs>
            <linearGradient id="govGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#854d0e" />
              <stop offset="28%"  stopColor="#fef3c7" />
              <stop offset="56%"  stopColor="#facc15" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="govBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#dbeafe" />
              <stop offset="52%"  stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <radialGradient id="govSeal">
              <stop offset="0%"   stopColor="#ffffff" />
              <stop offset="42%"  stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
            <filter id="govGlow" filterUnits="userSpaceOnUse" x="-80" y="-80" width="620" height="620">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="govStrongGlow" filterUnits="userSpaceOnUse" x="-80" y="-80" width="620" height="620">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ready ring */}
          <circle
            cx="230" cy="170" r="112"
            className={`gov-ready-ring ${isReady ? 'is-ready' : ''}`}
            filter="url(#govStrongGlow)"
          />

          {/* Foundation */}
          <g className="gov-scale-foundation">
            <path d="M154 408 L306 408 L280 360 L180 360 Z" />
            <rect x="178" y="338" width="104" height="26" rx="8" />
            <rect x="216" y="176" width="28" height="164" rx="7" />
            <circle cx="230" cy="176" r="20" />
          </g>

          {/* Beam */}
          <g
            className="gov-scale-beam"
            transform={`translate(230, 176) rotate(${won ? 0 : angle})`}
            style={{ transition: won ? 'transform 620ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none' }}
          >
            <rect x="-150" y="-11" width="300" height="22" rx="11" />
            <circle cx="0" cy="0" r="24" />
            <circle cx="0" cy="0" r="8" />

             {/* Left pan */}
            <g transform="translate(-132, 0)">
              <g transform={`rotate(${won ? 0 : -angle})`} style={{ transition: won ? 'transform 620ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none' }}>
                <line x1="0" y1="0" x2="-44" y2="86" />
                <line x1="0" y1="0" x2="44" y2="86" />
                <ellipse cx="0" cy="86" rx="52" ry="14" className="gov-scale-plate-bg" />
                <path d="M-56 90 Q0 134 56 90 L44 82 Q0 118 -44 82 Z" />
                <ellipse cx="0" cy="86" rx="44" ry="10" className="gov-scale-plate-glow" />
                <text y="109">{activeMandate.left}</text>
              </g>
            </g>

            {/* Right pan */}
            <g transform="translate(132, 0)">
              <g transform={`rotate(${won ? 0 : -angle})`} style={{ transition: won ? 'transform 620ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none' }}>
                <line x1="0" y1="0" x2="-44" y2="86" />
                <line x1="0" y1="0" x2="44" y2="86" />
                <ellipse cx="0" cy="86" rx="52" ry="14" className="gov-scale-plate-bg" />
                <path d="M-56 90 Q0 134 56 90 L44 82 Q0 118 -44 82 Z" />
                <ellipse cx="0" cy="86" rx="44" ry="10" className="gov-scale-plate-glow" />
                <text y="109">{activeMandate.right}</text>
              </g>
            </g>
          </g>

          {/* Seals */}
          {seals.map((seal, index) => (
            <g key={seal} className="gov-seal-mark" transform={`translate(${142 + index * 44}, 318)`}>
              <circle r="18" />
              <path d="M-8 0 L-2 7 L10 -8" />
            </g>
          ))}

          {/* Gavel */}
          <g
            className={`gov-gavel ${hammerStrike ? 'is-striking' : ''} ${isReady ? 'is-ready' : ''}`}
            transform="translate(378, 396)"
            onPointerDown={(e) => { e.preventDefault(); handleStrike() }}
          >
            <g className="gov-gavel-body">
              <circle cx="-28" cy="-56" r="74" className="gov-gavel-hitbox" />
              <ellipse cx="-32" cy="7" rx="54" ry="15" />
              <g className="gov-gavel-head">
                <rect x="-8" y="-120" width="16" height="120" rx="8" />
                <path d="M-48 -148 H38 L46 -110 H-56 Z" />
                <rect x="-64" y="-142" width="18" height="30" rx="4" />
                <rect x="36"  y="-142" width="18" height="30" rx="4" />
              </g>
              <circle cx="-28" cy="-56" r="52" className="gov-gavel-ring" />
              {hammerStrike && (
                <g className="gov-strike-impact">
                  <circle cx="-32" cy="7" r="10" className="gov-strike-ring gov-strike-ring--1" />
                  <circle cx="-32" cy="7" r="30" className="gov-strike-ring gov-strike-ring--2" />
                  <circle cx="-32" cy="7" r="50" className="gov-strike-ring gov-strike-ring--3" />
                  <path d="M-32 -30 L-22 -10 L2 -4 L-14 8 L-6 30 L-32 18 L-58 30 L-50 8 L-66 -4 L-42 -10 Z" className="gov-strike-star" />
                </g>
              )}
            </g>
          </g>
        </svg>
      </div>

      {/* ══════════ CHROMATIC FINALE ══════════ */}
      {showFinale && (
        <div className="gov-finale" aria-live="polite">
          {/* L1: Dawn background */}
          <div className="gov-finale-dawn" />

          {/* L2: Chromatic shockwave rings */}
          {colorRings.map(ring => (
            <div
              key={ring.id}
              className="gov-finale-shockwave"
              style={{
                '--ring-hue':   ring.hue,
                '--ring-size':  `${ring.size}rem`,
                animationDelay: `${ring.delay}s`,
              }}
            />
          ))}

          {/* L3: Light rays */}
          <div className="gov-finale-rays">
            {lightRays.map(ray => (
              <i
                key={ray.id}
                style={{
                  '--ray-angle':  `${ray.angle}deg`,
                  '--ray-hue':    ray.hue,
                  '--ray-length': `${ray.length}vmax`,
                  '--ray-delay':  `${ray.delay}s`,
                  animationDelay: `${ray.delay}s`,
                }}
              />
            ))}
          </div>

          {/* L4: Balance hall pillars */}
          <div className="gov-finale-hall">
            <span /><span /><span /><span /><span />
          </div>

          {/* L5: 3D rings */}
          <div className="gov-finale-rings" />

          {/* L6: Floating orbs */}
          {scaleOrbs.map(orb => (
            <i
              key={orb.id}
              className="gov-finale-orb"
              style={{
                left:              `${orb.x}%`,
                top:               `${orb.y}%`,
                '--orb-size':      `${orb.size}px`,
                '--orb-hue':       orb.hue,
                '--duration':      `${orb.duration}s`,
                '--delay':         `${orb.delay}s`,
                animationDelay:    `${orb.delay}s`,
                animationDuration: `${orb.duration}s`,
              }}
            />
          ))}

          {/* L7: Chromatic sparks */}
          {finaleSparks.map(spark => (
            <i
              key={spark.id}
              className="gov-finale-spark"
              style={{
                '--spark-angle':    `${spark.angle}deg`,
                '--spark-distance': `${spark.distance}px`,
                '--spark-size':     `${spark.size}px`,
                '--spark-hue':      spark.hue,
                '--duration':       `${spark.duration}s`,
                '--delay':          `${spark.delay}s`,
                animationDelay:    `${spark.delay}s`,
                animationDuration: `${spark.duration}s`,
              }}
            />
          ))}

          {/* L8: Message card */}
          <div className="gov-message-card">
            <div className="gov-message-badge">
              <span className="gov-badge-dot" />
              <em>Nhà nước · Hành tinh đã mở khóa</em>
            </div>
            <h3>NHÀ NƯỚC<br />CỦA DÂN</h3>
            <blockquote>
              "Bao nhiêu lợi ích đều vì dân.<br />
              Bao nhiêu quyền hạn đều của <strong>dân</strong>."
            </blockquote>
            <p>
              Quyền lực không đứng trên nhân dân. Chính phủ là
              công bộc của dân — lắng nghe, dựa vào và hành động
              vì hạnh phúc của nhân dân.
            </p>
          </div>
        </div>
      )}

      <div className="minigame-progress">
        <div className="minigame-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
