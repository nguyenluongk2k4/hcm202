import { useMemo, useRef, useState } from 'react'
import './GravitySun.css'

const CENTER = { x: 50, y: 50 }

const fragments = [
  { id: 'tu-tuong', text: 'Tư tưởng', note: 'soi đường', start: { x: 16, y: 22 }, orbit: 18, angle: -130, color: '#7dd3fc', align: 'left' },
  { id: 'doc-lap', text: 'Độc lập', note: 'giá trị tối cao', start: { x: 84, y: 20 }, orbit: 18, angle: 44, color: '#93c5fd', align: 'right' },
  { id: 'dao-duc', text: 'Đạo đức', note: 'gốc của người', start: { x: 12, y: 72 }, orbit: 28, angle: -168, color: '#facc15', align: 'left' },
  { id: 'nhan-dan', text: 'Nhân dân', note: 'trung tâm', start: { x: 88, y: 72 }, orbit: 28, angle: 10, color: '#fde68a', align: 'right' },
  { id: 'phong-cach', text: 'Phong cách', note: 'nói đi đôi làm', start: { x: 28, y: 90 }, orbit: 38, angle: 126, color: '#fb923c', align: 'bottom' },
  { id: 'hanh-dong', text: 'Hành động', note: 'vận dụng hôm nay', start: { x: 72, y: 90 }, orbit: 38, angle: -44, color: '#fdba74', align: 'bottom' },
]

const finaleWords = ['Tư tưởng', 'Đạo đức', 'Phong cách', 'Độc lập', 'Nhân dân', 'Hành động']

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

export default function GravitySun({ onWin }) {
  const stageRef = useRef(null)
  const [cursor, setCursor] = useState(null)
  const [collected, setCollected] = useState([])
  const [flights, setFlights] = useState([])
  const [trail, setTrail] = useState([])
  const [won, setWon] = useState(false)
  const [showFinale, setShowFinale] = useState(false)

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
          setWon(true)
          setTimeout(() => setShowFinale(true), 900)
          setTimeout(() => onWin(), 9400)
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
    <div className={`minigame-sun ${showFinale ? 'is-final-scene' : ''}`}>
      <p className="minigame-instruction">
        {won
          ? 'Các giá trị đã hội tụ thành hệ mặt trời Hồ Chí Minh.'
          : 'Rê chuột hoặc chạm kéo vùng trọng lực qua các mảnh giá trị để hút chúng vào quỹ đạo.'}
      </p>

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

          {[18, 28, 38].map((radius) => (
            <circle
              key={radius}
              className={`sun-orbit-ring ${collected.length > 0 ? 'has-light' : ''}`}
              cx={CENTER.x}
              cy={CENTER.y}
              r={radius}
              stroke="url(#sunUnifiedOrbit)"
            />
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
          <strong>Hồ<br />Chí Minh</strong>
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
          <small>/ {fragments.length} giá trị</small>
        </div>
      </div>

      <div className="sun-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      {showFinale && (
        <div className="sun-finale" aria-hidden="true">
          <div className="sun-finale-star" />
          <div className="sun-finale-orbits">
            {['Tư tưởng', 'Đạo đức', 'Phong cách'].map((label, index) => (
              <span key={label} style={{ '--ring-color': ['#7dd3fc', '#facc15', '#fb923c'][index], '--index': index }}>
                {label}
              </span>
            ))}
          </div>
          <div className="sun-finale-words">
            {finaleWords.map((word, index) => (
              <i key={word} style={{ '--delay': `${index * 0.12}s` }}>
                {word}
              </i>
            ))}
          </div>
          <div className="sun-message-card">
            <span>Hành tinh trung tâm đã mở khóa</span>
            <h3>HỒ CHÍ MINH</h3>
            <strong>Tư tưởng, đạo đức và phong cách không đứng riêng lẻ; chúng tạo thành một hệ mặt trời định hướng hành động.</strong>
            <p>Khi các giá trị vào đúng quỹ đạo, ánh sáng trung tâm không chỉ để ngắm nhìn, mà để soi đường cho lựa chọn hôm nay.</p>
          </div>
        </div>
      )}
    </div>
  )
}
