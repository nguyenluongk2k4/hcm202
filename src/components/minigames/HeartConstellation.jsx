import { useMemo, useRef, useState } from 'react'
import tuTuongNhanVanImg from '../../assets/tu_tuong_nhan_van.png'
import './HeartConstellation.css'

const heartNodes = [
  { "id": "p0", "label": "Tái sản xuất", "x": 50, "y": 84, "align": "bottom" },
  { "id": "p1", "label": "", "x": 50, "y": 83, "align": "bottom" },
  { "id": "p2", "label": "Nuôi dạy", "x": 51, "y": 80, "align": "bottom" },
  { "id": "p3", "label": "", "x": 54, "y": 76, "align": "bottom" },
  { "id": "p4", "label": "Giáo dục", "x": 59, "y": 71, "align": "right" },
  { "id": "p5", "label": "", "x": 65, "y": 65, "align": "right" },
  { "id": "p6", "label": "Kinh tế", "x": 72, "y": 60, "align": "right" },
  { "id": "p7", "label": "", "x": 78, "y": 53, "align": "right" },
  { "id": "p8", "label": "Tâm sinh lý", "x": 82, "y": 47, "align": "right" },
  { "id": "p9", "label": "", "x": 84, "y": 40, "align": "right" },
  { "id": "p10", "label": "Tế bào xã hội", "x": 82, "y": 33, "align": "right" },
  { "id": "p11", "label": "", "x": 78, "y": 27, "align": "right" },
  { "id": "p12", "label": "Tổ ấm", "x": 72, "y": 24, "align": "right" },
  { "id": "p13", "label": "", "x": 65, "y": 23, "align": "right" },
  { "id": "p14", "label": "Cầu nối", "x": 59, "y": 25, "align": "right" },
  { "id": "p15", "label": "", "x": 54, "y": 29, "align": "top" },
  { "id": "p16", "label": "Hôn nhân", "x": 51, "y": 33, "align": "top" },
  { "id": "p17", "label": "", "x": 50, "y": 36, "align": "top" },
  { "id": "p18", "label": "Huyết thống", "x": 50, "y": 38, "align": "top" },
  { "id": "p19", "label": "", "x": 50, "y": 36, "align": "top" },
  { "id": "p20", "label": "Yêu thương", "x": 49, "y": 33, "align": "top" },
  { "id": "p21", "label": "", "x": 46, "y": 29, "align": "top" },
  { "id": "p22", "label": "Hiếu thảo", "x": 41, "y": 25, "align": "left" },
  { "id": "p23", "label": "", "x": 35, "y": 23, "align": "left" },
  { "id": "p24", "label": "Trách nhiệm", "x": 28, "y": 24, "align": "left" },
  { "id": "p25", "label": "", "x": 22, "y": 27, "align": "left" },
  { "id": "p26", "label": "Hạnh phúc", "x": 18, "y": 33, "align": "left" },
  { "id": "p27", "label": "", "x": 16, "y": 40, "align": "left" },
  { "id": "p28", "label": "Bình đẳng", "x": 18, "y": 47, "align": "left" },
  { "id": "p29", "label": "", "x": 22, "y": 53, "align": "left" },
  { "id": "p30", "label": "Tiến bộ", "x": 28, "y": 60, "align": "left" },
  { "id": "p31", "label": "", "x": 35, "y": 65, "align": "left" },
  { "id": "p32", "label": "Gắn bó", "x": 41, "y": 71, "align": "left" },
  { "id": "p33", "label": "", "x": 46, "y": 76, "align": "bottom" },
  { "id": "p34", "label": "Tình cảm", "x": 49, "y": 80, "align": "bottom" },
  { "id": "p35", "label": "", "x": 50, "y": 83, "align": "bottom" }
]

const finaleWords = ['Yêu thương', 'Hiếu thảo', 'Bình đẳng', 'Tổ ấm', 'Hạnh phúc', 'Tiến bộ']
const humanityPhases = [
  { label: 'Tổ ấm', text: 'mang lại hạnh phúc cho mỗi thành viên', start: 0, end: 11 },
  { label: 'Tế bào', text: 'hạt nhân của xã hội', start: 12, end: 23 },
  { label: 'Cầu nối', text: 'giữa cá nhân với xã hội', start: 24, end: 35 },
]

const mainlandIds = heartNodes.map(n => n.id)
const polygonPoints = heartNodes.map(node => `${node.x},${node.y}`).join(' ')

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
          ? 'Ngọn lửa tình thân đã nối các giá trị thành một tổ ấm hạnh phúc.'
          : 'Rê chuột hoặc chạm kéo ngọn lửa qua các điểm sáng để vẽ chòm sao gia đình.'}
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

        {showFinale && (
          <div className="humanity-heart-quote">
            <blockquote>
              "...nhiều gia đình cộng lại mới thành xã hội, xã hội tốt thì gia đình càng tốt, gia đình tốt thì xã hội mới tốt. Hạt nhân của xã hội là gia đình."
            </blockquote>
            <cite>— Hồ Chí Minh —</cite>
          </div>
        )}
      </div>

      <div className="humanity-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      {showFinale && (
        <div className="humanity-finale" aria-hidden="true">
          <div className="humanity-finale-space" />
          
          <img 
            src={tuTuongNhanVanImg} 
            alt="Gia đình hạnh phúc" 
            className="humanity-finale-center-img" 
          />
          
          <div className="humanity-message-card">
            <span>Hành tinh đã mở khóa</span>
            <h3>GIA ĐÌNH TỔ ẤM</h3>
            <strong>"Hạt nhân của xã hội là gia đình"</strong>
            <p>
              Gia đình là tế bào của xã hội, là tổ ấm và là cầu nối giữa cá nhân với xã hội. Xây dựng gia đình noi gương mẫu: hạnh phúc, bình đẳng, tiến bộ.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
