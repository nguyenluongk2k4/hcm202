import { useMemo, useRef, useState, useEffect } from 'react'
import './GravitySun.css'
import finalImg from '../../assets/final.png'

const CENTER = { x: 50, y: 50 }

const fragments = [
  // Orbit 14
  { id: 'triet-hoc', text: 'Triết học', note: 'Mác - Lênin', start: { x: 6, y: 20 }, orbit: 14, angle: -135, color: '#7dd3fc', align: 'right' },
  { id: 'kinh-te', text: 'Kinh tế chính trị', note: 'Mác - Lênin', start: { x: 94, y: 20 }, orbit: 14, angle: -45, color: '#93c5fd', align: 'left' },
  { id: 'cnxh', text: 'CNXH khoa học', note: 'bộ phận hợp thành', start: { x: 6, y: 80 }, orbit: 14, angle: 135, color: '#facc15', align: 'right' },
  { id: 'ly-luan', text: 'Lý luận', note: 'soi đường', start: { x: 94, y: 80 }, orbit: 14, angle: 45, color: '#fde68a', align: 'left' },

  // Orbit 24
  { id: 'duy-vat', text: 'Duy vật', note: 'biện chứng', start: { x: 6, y: 50 }, orbit: 24, angle: -160, color: '#f87171', align: 'right' },
  { id: 'thang-du', text: 'Giá trị thặng dư', note: 'hòn đá tảng', start: { x: 94, y: 50 }, orbit: 24, angle: -20, color: '#2dd4bf', align: 'left' },
  { id: 'thuc-tien', text: 'Thực tiễn', note: 'tiêu chuẩn chân lý', start: { x: 50, y: 6 }, orbit: 24, angle: 160, color: '#fb923c', align: 'bottom' },
  { id: 'hanh-dong', text: 'Hành động', note: 'cách mạng', start: { x: 50, y: 94 }, orbit: 24, angle: 20, color: '#fdba74', align: 'top' },

  // Orbit 34
  { id: 'cong-nhan', text: 'Công nhân', note: 'sứ mệnh lịch sử', start: { x: 25, y: 6 }, orbit: 34, angle: 180, color: '#a78bfa', align: 'bottom' },
  { id: 'giai-phong', text: 'Giải phóng', note: 'con người', start: { x: 75, y: 6 }, orbit: 34, angle: 0, color: '#34d399', align: 'bottom' },
  { id: 'cong-san', text: 'Cộng sản', note: 'lý tưởng', start: { x: 25, y: 94 }, orbit: 34, angle: 90, color: '#f472b6', align: 'top' },
  { id: 'khoa-hoc', text: 'Khoa học', note: 'cách mạng', start: { x: 75, y: 94 }, orbit: 34, angle: -90, color: '#60a5fa', align: 'top' },
]

const finaleWords = ['Triết học', 'Kinh tế chính trị', 'CNXH khoa học', 'Lý luận', 'Thực tiễn', 'Giải phóng', 'Cộng sản']

function seededRatio(index, salt = 0) {
  const value = Math.sin(index * 37.29 + salt * 21.13) * 10000
  return value - Math.floor(value)
}

function polar(radius, angleDeg) {
  const angle = (angleDeg / 180) * Math.PI
  return {
    x: CENTER.x + radius * Math.cos(angle),
    y: CENTER.y + radius * Math.sin(angle),
  }
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function curvePath(from, to, bend = 10) {
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2
  const normalX = to.y - from.y
  const normalY = from.x - to.x
  const length = Math.max(1, Math.hypot(normalX, normalY))
  return `M ${from.x} ${from.y} Q ${midX + (normalX / length) * bend} ${midY + (normalY / length) * bend} ${to.x} ${to.y}`
}

export default function GravitySun({ onWin, onSolved }) {
  const stageRef = useRef(null)
  const [cursor, setCursor] = useState(null)
  const [collected, setCollected] = useState([])
  const [flights, setFlights] = useState([])
  const [trail, setTrail] = useState([])
  const [won, setWon] = useState(false)
  const [finalePhase, setFinalePhase] = useState(0)

  const stars = useMemo(
    () =>
      Array.from({ length: 58 }, (_, index) => ({
        id: index,
        left: `${4 + seededRatio(index, 1) * 92}%`,
        top: `${4 + seededRatio(index, 4) * 88}%`,
        size: 1.2 + seededRatio(index, 7) * 3.8,
        delay: `${seededRatio(index, 10) * 5}s`,
        duration: `${3.8 + seededRatio(index, 13) * 6}s`,
      })),
    [],
  )

  const pointFromEvent = (event) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return CENTER
    return {
      x: Math.max(4, Math.min(96, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(4, Math.min(96, ((event.clientY - rect.top) / rect.height) * 100)),
    }
  }

  const collectFragment = (fragment, point) => {
    if (collected.includes(fragment.id) || flights.some((flight) => flight.fragmentId === fragment.id) || won) return

    const target = polar(fragment.orbit, fragment.angle)
    const flightId = `${fragment.id}-${Date.now()}`
    setFlights((current) => [
      ...current,
      {
        id: flightId,
        fragmentId: fragment.id,
        text: fragment.text,
        color: fragment.color,
        from: point,
        to: target,
        path: curvePath(point, target, fragment.angle > 0 ? 13 : -13),
      },
    ])

    setTimeout(() => {
      setFlights((current) => current.filter((flight) => flight.id !== flightId))
      setCollected((current) => {
        if (current.includes(fragment.id)) return current
        const next = [...current, fragment.id]
        if (next.length === fragments.length) {
          onSolved?.()
          setWon(true)
          setTimeout(() => setFinalePhase(1), 2500)
          setTimeout(() => setFinalePhase(2), 7500)
          setTimeout(() => onWin(), 16000)
        }
        return next
      })
    }, 720)
  }

  const moveGravity = (event) => {
    if (won) return
    const point = pointFromEvent(event)
    setCursor(point)
    setTrail((items) => [...items.slice(-12), { id: `${Date.now()}-${items.length}`, ...point }])

    fragments.forEach((fragment) => {
      if (distance(point, fragment.start) < 13.5) {
        collectFragment(fragment, point)
      }
    })
  }

  const progress = won ? 100 : (collected.length / fragments.length) * 100

  return (
    <div className={`minigame-sun ${finalePhase > 0 ? 'is-final-scene' : ''}`}>
      <p className="minigame-instruction">
        {won
          ? 'Các bộ phận đã hội tụ thành hệ mặt trời chủ nghĩa Mác - Lênin.'
          : 'Rê chuột hoặc chạm kéo vùng trọng lực qua các mảnh lý luận để hút chúng vào quỹ đạo.'}
      </p>

      <div className={`sun-stage-shell ${won ? 'is-won is-pulsing' : ''}`}>
      <div
        ref={stageRef}
        className={`sun-stage ${won ? 'is-won' : ''}`}
        onPointerDown={moveGravity}
        onPointerMove={moveGravity}
      >
        {stars.map((star) => (
          <span
            key={star.id}
            className="sun-bg-star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
        <div className="sun-nebula" aria-hidden="true" />

        <svg className="sun-orbits" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="sunUnifiedOrbit" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.24" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0.66" />
            </linearGradient>
            <filter id="sunBeamGlow">
              <feGaussianBlur stdDeviation="0.9" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[14, 24, 34].map((radius) => (
            <g key={radius}>
              <circle
                className="sun-orbit-ring-base"
                cx={CENTER.x}
                cy={CENTER.y}
                r={radius}
              />
              <circle
                className={`sun-orbit-ring ${collected.length > 0 ? 'has-light' : ''}`}
                cx={CENTER.x}
                cy={CENTER.y}
                r={radius}
                stroke="url(#sunUnifiedOrbit)"
              />
            </g>
          ))}

          {trail.map((point, index) => {
            const next = trail[index + 1]
            if (!next) return null
            return (
              <path
                key={point.id}
                className="sun-gravity-trail"
                d={`M ${point.x} ${point.y} L ${next.x} ${next.y}`}
              />
            )
          })}

          {flights.map((flight) => (
            <path
              key={flight.id}
              className="sun-flight-path"
              d={flight.path}
              stroke={flight.color}
            />
          ))}
        </svg>

        <div className="sun-core">
          <span className="sun-core-aura" />
          <span className="sun-core-ball" />
          <strong>Mác<br />Lênin</strong>
        </div>

        {fragments.map((fragment, index) => {
          const locked = collected.includes(fragment.id)
          const flying = flights.some((flight) => flight.fragmentId === fragment.id)
          const position = locked ? polar(fragment.orbit, fragment.angle) : fragment.start
          return (
            <div
              key={fragment.id}
              className={`sun-fragment sun-fragment--${fragment.align} ${locked ? 'is-locked' : ''} ${flying ? 'is-flying' : ''}`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                '--fragment-color': fragment.color,
                '--orbit-delay': `${index * -0.24}s`,
              }}
            >
              <span className="sun-fragment-orb" />
              <b>{fragment.text}</b>
              {!locked && <small>{fragment.note}</small>}
            </div>
          )
        })}

        {flights.map((flight) => (
          <div
            key={`${flight.id}-token`}
            className="sun-flight-token"
            style={{
              '--flight-color': flight.color,
              '--from-x': `${flight.from.x}%`,
              '--from-y': `${flight.from.y}%`,
              '--to-x': `${flight.to.x}%`,
              '--to-y': `${flight.to.y}%`,
            }}
          >
            {flight.text}
          </div>
        ))}

        {cursor && !won && (
          <div className="sun-gravity-cursor" style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}>
            <span />
            <i />
          </div>
        )}

        <div className="sun-status">
          <span>{collected.length}</span>
          <small>/ {fragments.length} học thuyết</small>
        </div>
      </div>
      </div>

      <div className="sun-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      {finalePhase > 0 && (
        <div className={`sun-finale ${finalePhase === 2 ? 'is-phase-2' : ''}`} aria-hidden="true">
          <img src={finalImg} alt="Chủ nghĩa Mác - Lênin" className="sun-finale-image" />
          
          {finalePhase === 2 && (
            <>
              <div className="sun-finale-words">
                {finaleWords.map((word, index) => (
                  <i key={word} style={{ '--delay': `${index * 0.12}s` }}>
                    {word}
                  </i>
                ))}
              </div>
              <div className="sun-message-card">
                <span>Mặt trời lý luận đã mở khóa</span>
                <h3>MÁC - LÊNIN</h3>
                <strong>Triết học, kinh tế chính trị và chủ nghĩa xã hội khoa học gắn bó hữu cơ, tạo thành một hệ mặt trời lý luận thống nhất.</strong>
                <p>Khi các bộ phận vào đúng quỹ đạo, ánh sáng lý luận không chỉ để ngắm nhìn, mà để soi đường cho hành động cách mạng.</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
