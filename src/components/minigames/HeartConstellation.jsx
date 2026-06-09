import { useMemo, useRef, useState } from 'react'
import senVangNeon from '../../assets/sen_vang_neon.png'
import './HeartConstellation.css'

const heartNodes = [
  // EAST COAST
  { id: 'p0', label: 'Tôn trọng', x: 33, y: 10, align: 'left' },
  { id: 'p1', label: 'Lắng nghe', x: 42, y: 5, align: 'top' },
  { id: 'p2', label: '', x: 50, y: 7, align: 'top' },
  { id: 'p3', label: 'Chia sẻ', x: 55, y: 13, align: 'right' },
  { id: 'p4', label: '', x: 53, y: 19, align: 'right' },
  { id: 'p5', label: 'Bảo vệ', x: 49, y: 24, align: 'right' },
  { id: 'p6', label: '', x: 46, y: 30, align: 'right' },
  { id: 'p7', label: 'Nâng đỡ', x: 44, y: 36, align: 'right' },
  { id: 'p8', label: '', x: 46, y: 42, align: 'right' },
  { id: 'p9', label: 'Trách nhiệm', x: 49, y: 47, align: 'right' },
  { id: 'p10', label: '', x: 53, y: 51, align: 'right' },
  { id: 'p11', label: 'Con người', x: 56, y: 54, align: 'right' },
  { id: 'p12', label: '', x: 59, y: 58, align: 'right' },
  { id: 'p13', label: 'Tử tế', x: 62, y: 63, align: 'right' },
  { id: 'p14', label: '', x: 65, y: 68, align: 'right' },
  { id: 'p15', label: 'Chăm lo', x: 68, y: 73, align: 'right' },
  { id: 'p16', label: '', x: 64, y: 78, align: 'right' },
  { id: 'p17', label: 'Đồng cảm', x: 60, y: 82, align: 'right' },
  { id: 'p18', label: '', x: 55, y: 86, align: 'right' },
  { id: 'p19', label: 'Nhân ái', x: 50, y: 89, align: 'bottom' },
  { id: 'p20', label: '', x: 45, y: 93, align: 'bottom' },
  { id: 'p21', label: 'Đoàn kết', x: 40, y: 96, align: 'bottom' },

  // WEST COAST
  { id: 'p22', label: '', x: 35, y: 90, align: 'left' },
  { id: 'p23', label: 'Vị tha', x: 38, y: 86, align: 'left' },
  { id: 'p24', label: '', x: 45, y: 82, align: 'left' },
  { id: 'p25', label: 'Khoan dung', x: 49, y: 76, align: 'left' },
  { id: 'p26', label: '', x: 52, y: 69, align: 'left' },
  { id: 'p27', label: 'Gắn bó', x: 50, y: 60, align: 'left' },
  { id: 'p28', label: '', x: 48, y: 55, align: 'left' },
  { id: 'p29', label: 'Yêu thương', x: 44, y: 50, align: 'left' },
  { id: 'p30', label: '', x: 41, y: 45, align: 'left' },
  { id: 'p31', label: 'Hòa bình', x: 38, y: 40, align: 'left' },
  { id: 'p32', label: '', x: 35, y: 35, align: 'left' },
  { id: 'p33', label: 'Tự hào', x: 33, y: 30, align: 'left' },
  { id: 'p34', label: '', x: 29, y: 23, align: 'left' },
  { id: 'p35', label: 'Kiên cường', x: 25, y: 15, align: 'left' },

  // ISLANDS
  { id: 'hoang-sa', label: 'Hoàng Sa', x: 78, y: 52, align: 'top' },
  { id: 'truong-sa', label: 'Trường Sa', x: 85, y: 80, align: 'bottom' },
]

const finaleWords = ['Người tốt', 'Việc tốt', 'Nhân ái', 'Tôn trọng', 'Chăm lo', 'Nâng đỡ']
const humanityPhases = [
  { label: 'Nhìn thấy', text: 'không vô cảm', start: 0, end: 3 },
  { label: 'Cảm thông', text: 'biết đặt mình vào người khác', start: 4, end: 7 },
  { label: 'Hành động', text: 'biến yêu thương thành việc tốt', start: 8, end: 11 },
]




const mainlandIds = Array.from({length: 36}, (_, i) => `p${i}`)
const polygonPoints = mainlandIds.map(id => {
  const node = heartNodes.find(n => n.id === id)
  return `${node.x},${node.y}`
}).join(' ')

function seededRatio(index, salt = 0) {
  const value = Math.sin(index * 33.73 + salt * 19.17) * 10000
  return value - Math.floor(value)
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function straightPath(from, to) {
  return `M ${from.x} ${from.y} L ${to.x} ${to.y}`
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
      setTimeout(() => onWin(), 25000)
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

          <polygon 
            points={polygonPoints} 
            className={`humanity-vietnam-surface ${showFinale ? 'is-won' : ''}`}
          />

          {mainlandIds.map((nodeId, index) => {
            const nextId = mainlandIds[(index + 1) % mainlandIds.length]
            const node = heartNodes.find(n => n.id === nodeId)
            const next = heartNodes.find(n => n.id === nextId)
            const active = lit.includes(node.id) && lit.includes(next.id)
            return (
              <g key={node.id} className={active ? 'is-lit' : ''}>
                <path className="humanity-orbit-beam humanity-orbit-beam--base" d={straightPath(node, next)} />
                <path className="humanity-orbit-beam humanity-orbit-beam--core" d={straightPath(node, next)} />
                {active && <path className="humanity-orbit-beam humanity-orbit-beam--runner" d={straightPath(node, next)} />}
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
          <div className="humanity-finale-space" />
          
          <img 
            src={senVangNeon} 
            alt="Đóa sen vàng" 
            className="humanity-finale-flower-img" 
          />
          
          <div className="humanity-message-card">
            <span>Hành tinh đã mở khóa</span>
            <h3>TƯ TƯỞNG NHÂN VĂN</h3>
            <strong>"Mỗi người tốt, mỗi việc tốt là một bông hoa đẹp"</strong>
            <p>
              Yêu thương con người không dừng ở cảm xúc: nó trở thành hành động. Mỗi việc tốt bạn làm sẽ tạo thêm một điểm sáng, đan kết lại thành một đóa hoa vũ trụ trường tồn.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
