import { useMemo, useRef, useState } from 'react'
import './HeartConstellation.css'

const heartNodes = [
  { id: 'ton-trong', label: 'Tôn trọng', x: 50, y: 27, align: 'top' },
  { id: 'lang-nghe', label: 'Lắng nghe', x: 62, y: 18, align: 'right' },
  { id: 'chia-se', label: 'Chia sẻ', x: 76, y: 24, align: 'right' },
  { id: 'bao-ve', label: 'Bảo vệ', x: 84, y: 40, align: 'right' },
  { id: 'nang-do', label: 'Nâng đỡ', x: 79, y: 58, align: 'right' },
  { id: 'trach-nhiem', label: 'Trách nhiệm', x: 66, y: 73, align: 'bottom' },
  { id: 'con-nguoi', label: 'Con người', x: 50, y: 88, align: 'bottom' },
  { id: 'tu-te', label: 'Tử tế', x: 34, y: 73, align: 'bottom' },
  { id: 'cham-lo', label: 'Chăm lo', x: 21, y: 58, align: 'left' },
  { id: 'dong-cam', label: 'Đồng cảm', x: 16, y: 40, align: 'left' },
  { id: 'tin-tuong', label: 'Tin tưởng', x: 24, y: 24, align: 'left' },
  { id: 'doan-ket', label: 'Đoàn kết', x: 38, y: 18, align: 'left' },
]

const finaleWords = ['Người tốt', 'Việc tốt', 'Nhân ái', 'Tôn trọng', 'Chăm lo', 'Nâng đỡ']
const humanityPhases = [
  { label: 'Nhìn thấy', text: 'không vô cảm', start: 0, end: 3 },
  { label: 'Cảm thông', text: 'biết đặt mình vào người khác', start: 4, end: 7 },
  { label: 'Hành động', text: 'biến yêu thương thành việc tốt', start: 8, end: 11 },
]

const harmonyLinks = [
  ['ton-trong', 'con-nguoi'],
  ['lang-nghe', 'cham-lo'],
  ['chia-se', 'nang-do'],
  ['bao-ve', 'trach-nhiem'],
  ['dong-cam', 'tu-te'],
  ['tin-tuong', 'doan-ket'],
]

const heartAuraPath = 'M 50 27 C 59 8 80 12 86 31 C 93 53 73 69 50 90 C 27 69 7 53 14 31 C 20 12 41 8 50 27'

function seededRatio(index, salt = 0) {
  const value = Math.sin(index * 33.73 + salt * 19.17) * 10000
  return value - Math.floor(value)
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function curvedPath(from, to) {
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2
  const bend = from.x < 50 && to.x < 50 ? -3 : from.x > 50 && to.x > 50 ? 3 : 0
  return `M ${from.x} ${from.y} Q ${midX + bend} ${midY - 2} ${to.x} ${to.y}`
}

export default function HeartConstellation({ onWin, onSolved }) {
  const stageRef = useRef(null)
  const burstIdRef = useRef(0)
  const trailIdRef = useRef(0)
  const [lit, setLit] = useState([])
  const [flame, setFlame] = useState(null)
  const [trail, setTrail] = useState([])
  const [bursts, setBursts] = useState([])
  const [won, setWon] = useState(false)
  const [showFinale, setShowFinale] = useState(false)

  const backgroundStars = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: `${4 + seededRatio(index, 1) * 92}%`,
        top: `${5 + seededRatio(index, 3) * 86}%`,
        size: 1.5 + seededRatio(index, 5) * 4,
        delay: `${seededRatio(index, 8) * 5}s`,
        duration: `${4 + seededRatio(index, 11) * 6}s`,
      })),
    [],
  )

  const pointFromEvent = (event) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return { x: 50, y: 50 }
    return {
      x: Math.max(4, Math.min(96, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(5, Math.min(95, ((event.clientY - rect.top) / rect.height) * 100)),
    }
  }

  const lightNearbyNodes = (point) => {
    if (won) return

    const hit = heartNodes.find((node) => !lit.includes(node.id) && distance(point, node) < 8.5)
    if (!hit) return

    const nextLit = [...lit, hit.id]
    setLit(nextLit)
    setBursts((items) => [...items.slice(-5), { id: `${hit.id}-${burstIdRef.current += 1}`, x: hit.x, y: hit.y }])

    if (nextLit.length === heartNodes.length) {
      onSolved?.()
      setWon(true)
      setTimeout(() => setShowFinale(true), 820)
      setTimeout(() => onWin(), 10000)
    }
  }

  const moveFlame = (event) => {
    const point = pointFromEvent(event)
    setFlame(point)
    setTrail((items) => [...items.slice(-10), { id: `trail-${trailIdRef.current += 1}`, ...point }])
    lightNearbyNodes(point)
  }

  const progress = won ? 100 : (lit.length / heartNodes.length) * 100
  const nodeById = useMemo(
    () => heartNodes.reduce((map, node) => ({ ...map, [node.id]: node }), {}),
    [],
  )

  return (
    <div className={`minigame-heart ${showFinale ? 'is-final-scene' : ''}`}>
      <p className="minigame-instruction">
        {won
          ? 'Ngọn lửa nhân ái đã nối những việc tốt thành một trái tim chung.'
          : 'Rê chuột hoặc chạm kéo ngọn lửa qua các điểm sáng để vẽ chòm sao nhân văn.'}
      </p>

      <div
        ref={stageRef}
        className={`humanity-stage ${won ? 'is-won' : ''}`}
        onPointerDown={moveFlame}
        onPointerMove={moveFlame}
      >
        {backgroundStars.map((star) => (
          <span
            key={star.id}
            className="humanity-star"
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
        <div className="humanity-nebula" aria-hidden="true" />

        <div className="humanity-center">
          <span className="humanity-heart-aura" />
          <span className="humanity-heart-core" />
          <strong>Con người<br />là trung tâm</strong>
        </div>

        <div className="humanity-stellar-compass" aria-hidden="true">
          {humanityPhases.map((phase) => {
            const phaseLit = lit.length > phase.start
            const done = lit.length > phase.end
            return (
              <span key={phase.label} className={`${phaseLit ? 'is-active' : ''} ${done ? 'is-done' : ''}`}>
                <i />
                <b>{phase.label}</b>
                <small>{phase.text}</small>
              </span>
            )
          })}
        </div>

        <svg className="humanity-starmap" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="humanityLine" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="48%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>
            <filter id="humanityBeamGlow">
              <feGaussianBlur stdDeviation="0.9" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path className="humanity-heart-silhouette humanity-heart-silhouette--glow" d={heartAuraPath} />
          <path className="humanity-heart-silhouette humanity-heart-silhouette--line" d={heartAuraPath} />
          {heartNodes.map((node, index) => {
            const next = heartNodes[(index + 1) % heartNodes.length]
            const active = lit.includes(node.id) && lit.includes(next.id)
            return (
              <g key={node.id} className={active ? 'is-lit' : ''}>
                <path className="humanity-orbit-beam humanity-orbit-beam--base" d={curvedPath(node, next)} />
                <path className="humanity-orbit-beam humanity-orbit-beam--core" d={curvedPath(node, next)} />
                {active && <path className="humanity-orbit-beam humanity-orbit-beam--runner" d={curvedPath(node, next)} />}
              </g>
            )
          })}
          {harmonyLinks.map(([fromId, toId]) => {
            const from = nodeById[fromId]
            const to = nodeById[toId]
            const active = lit.includes(fromId) && lit.includes(toId)
            return (
              <g key={`${fromId}-${toId}`} className={active ? 'is-lit' : ''}>
                <path className="humanity-cross-beam humanity-cross-beam--base" d={curvedPath(from, to)} />
                {active && <path className="humanity-cross-beam humanity-cross-beam--runner" d={curvedPath(from, to)} />}
              </g>
            )
          })}
          {trail.map((point, index) => {
            const next = trail[index + 1]
            if (!next) return null
            return (
              <path
                key={point.id}
                className="humanity-comet-trail"
                d={`M ${point.x} ${point.y} L ${next.x} ${next.y}`}
              />
            )
          })}
        </svg>

        {heartNodes.map((node, index) => {
          const active = lit.includes(node.id)
          return (
            <div
              key={node.id}
              className={`humanity-star-node humanity-star-node--${node.align} ${active ? 'is-lit' : ''}`}
              style={{ left: `${node.x}%`, top: `${node.y}%`, '--delay': `${index * 0.08}s` }}
            >
              <span className="humanity-star-core" />
              <b>{node.label}</b>
            </div>
          )
        })}

        {bursts.map((burst) => (
          <span key={burst.id} className="humanity-burst" style={{ left: `${burst.x}%`, top: `${burst.y}%` }}>
            {Array.from({ length: 7 }).map((_, index) => (
              <i key={index} style={{ '--index': index }} />
            ))}
          </span>
        ))}

        {flame && (
          <div className="humanity-flame" style={{ left: `${flame.x}%`, top: `${flame.y}%` }}>
            <span />
            <i />
          </div>
        )}

        <div className="humanity-petal-counter">
          <span>{lit.length}</span>
          <small>/ {heartNodes.length} điểm sáng</small>
        </div>
      </div>

      <div className="humanity-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      {showFinale && (
        <div className="humanity-finale" aria-hidden="true">
          <div className="humanity-finale-garden" />
          <div className="humanity-finale-heart" />
          <svg className="humanity-finale-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {heartNodes.map((node, index) => {
              const next = heartNodes[(index + 1) % heartNodes.length]
              return <path key={node.id} d={curvedPath(node, next)} style={{ animationDelay: `${0.2 + index * 0.045}s` }} />
            })}
            {harmonyLinks.map(([fromId, toId], index) => (
              <path
                key={`${fromId}-${toId}`}
                d={curvedPath(nodeById[fromId], nodeById[toId])}
                style={{ animationDelay: `${0.72 + index * 0.06}s` }}
              />
            ))}
          </svg>
          <div className="humanity-finale-petals">
            {Array.from({ length: 22 }).map((_, index) => (
              <i
                key={index}
                style={{
                  '--left': `${4 + seededRatio(index, 21) * 92}%`,
                  '--delay': `${seededRatio(index, 24) * 1.6}s`,
                  '--duration': `${3.8 + seededRatio(index, 27) * 3.4}s`,
                  '--size': `${10 + seededRatio(index, 30) * 16}px`,
                }}
              />
            ))}
          </div>
          <div className="humanity-finale-words">
            {finaleWords.map((word, index) => (
              <span key={word} style={{ '--delay': `${index * 0.12}s` }}>
                {word}
              </span>
            ))}
          </div>
          <div className="humanity-message-card">
            <span>Hành tinh đã mở khóa</span>
            <h3>TƯ TƯỞNG NHÂN VĂN</h3>
            <strong>Mỗi người tốt, mỗi việc tốt là một bông hoa đẹp trong khu vườn chung của xã hội.</strong>
            <p>Yêu thương con người không dừng ở cảm xúc: nó trở thành tôn trọng, chăm lo, nâng đỡ và trách nhiệm với cộng đồng.</p>
          </div>
        </div>
      )}
    </div>
  )
}
