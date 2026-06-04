import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './HeartConstellation.css'

/* ── Heart node geometry (original logic preserved) ─────────── */
const makeNodes = () =>
  Array.from({ length: 12 }, (_, i) => {
    const t = (i / 12) * Math.PI * 2
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y =
      13 * Math.cos(t) -
      5  * Math.cos(2 * t) -
      2  * Math.cos(3 * t) -
          Math.cos(4 * t)
    return { id: i, x: 160 + x * 8, y: 150 - y * 8 }
  })

/* ── Ambient background stars (static) ──────────────────────── */
const AMBIENT_STARS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x:   (i * 37 + 11) % 94 + 3,   // deterministic spread
  y:   (i * 61 + 7)  % 92 + 3,
  size: 1 + (i % 3),
  op:   0.3 + (i % 5) * 0.1,
  dur:  2 + (i % 4) * 0.7,
  delay: (i % 6) * 0.5,
}))

/* ── Colors for node particles ───────────────────────────────── */
const PARTICLE_COLORS = ['#fff', '#7dd3fc', '#38bdf8', '#fde047', '#fbbf24', '#e0f2fe']

/* ── Falling stardust config ─────────────────────────────────── */
const STARDUST_COLORS = ['#7dd3fc', '#fde047', '#fbbf24', '#38bdf8', '#ffffff', '#bae6fd']

export default function HeartConstellation({ onWin }) {
  const nodes = useMemo(makeNodes, [])

  /* ── Core game state ─────────────────────────────────────── */
  const [lit,           setLit]           = useState([])
  const [won,           setWon]           = useState(false)

  /* ── Visual state ────────────────────────────────────────── */
  const [flamePos,      setFlamePos]      = useState({ x: -200, y: -200 })
  const [trailParticles, setTrailParticles] = useState([])
  const [nodeParticles,  setNodeParticles]  = useState([])
  const [fallingHearts,  setFallingHearts]  = useState([])
  const [showEpicWin,    setShowEpicWin]    = useState(false)

  const containerRef  = useRef(null)
  const trailIdRef    = useRef(0)
  const nodePartIdRef = useRef(0)
  const heartIdRef    = useRef(0)
  const wonRef        = useRef(false)

  /* ── Collision distance < 30px to light up node ─────────── */
  const getContainerPos = useCallback((clientX, clientY) => {
    if (!containerRef.current) return { x: clientX, y: clientY }
    const rect = containerRef.current.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width)  * 320,
      y: ((clientY - rect.top)  / rect.height) * 320,
    }
  }, [])

  /* ── Light up a node ─────────────────────────────────────── */
  const lightNode = useCallback((nodeId, nodeX, nodeY) => {
    if (wonRef.current) return
    setLit(prev => {
      if (prev.includes(nodeId)) return prev
      const next = [...prev, nodeId]

      /* Spawn 12 mini star particles radially from this node */
      const svgRect  = containerRef.current?.getBoundingClientRect()
      const scaleX   = svgRect ? svgRect.width  / 320 : 1
      const scaleY   = svgRect ? svgRect.height / 320 : 1
      const clientX  = (svgRect?.left || 0) + nodeX * scaleX
      const clientY  = (svgRect?.top  || 0) + nodeY * scaleY

      const newParts = Array.from({ length: 12 }, (_, k) => {
        const angle = (k / 12) * Math.PI * 2
        const dist  = 30 + Math.random() * 30
        const id    = nodePartIdRef.current++
        return {
          id,
          x: clientX,
          y: clientY,
          tx: Math.cos(angle) * dist,
          ty: Math.sin(angle) * dist,
          color: PARTICLE_COLORS[k % PARTICLE_COLORS.length],
          size: 3 + Math.random() * 3,
          dur:  0.5 + Math.random() * 0.4,
        }
      })
      setNodeParticles(prev2 => [...prev2, ...newParts])
      const ids = newParts.map(p => p.id)
      setTimeout(() => setNodeParticles(prev2 => prev2.filter(p => !ids.includes(p.id))), 1000)

      /* Win check */
      if (next.length === nodes.length) {
        wonRef.current = true
        setWon(true)
        setShowEpicWin(true)

        /* Spawn 30 falling stardust particles */
        const dust = Array.from({ length: 40 }, (_, k) => ({
          id:    heartIdRef.current++,
          left:  5 + Math.random() * 90,
          top:   -5 - Math.random() * 10,
          color: STARDUST_COLORS[k % STARDUST_COLORS.length],
          size:  12 + Math.random() * 16,
          dur:   2.5 + Math.random() * 2,
          delay: Math.random() * 1.5,
          rot:   (Math.random() - 0.5) * 180,
        }))
        setFallingHearts(dust)
        
        // Epic plot twist duration: 5.5s
        setTimeout(onWin, 5500)
      }

      return next
    })
  }, [nodes, onWin])

  /* ── Mouse move: update flame, trail, collision ──────────── */
  const handleMouseMove = useCallback((e) => {
    setFlamePos({ x: e.clientX, y: e.clientY })

    /* Trail: 3 particles per move */
    const now = Date.now()
    const newTrail = Array.from({ length: 3 }, (_, k) => {
      const id = trailIdRef.current++
      return {
        id,
        x:    e.clientX + (Math.random() - .5) * 8,
        y:    e.clientY + (Math.random() - .5) * 8,
        size: 3 + Math.random() * 5,
      }
    })
    setTrailParticles(prev => [...prev, ...newTrail])
    const trailIds = newTrail.map(p => p.id)
    setTimeout(() => setTrailParticles(prev => prev.filter(p => !trailIds.includes(p.id))), 320)

    /* Collision check */
    if (wonRef.current || !containerRef.current) return
    const svgPos = getContainerPos(e.clientX, e.clientY)
    nodes.forEach(node => {
      const dx = svgPos.x - node.x
      const dy = svgPos.y - node.y
      if (Math.sqrt(dx * dx + dy * dy) < 30) {
        lightNode(node.id, node.x, node.y)
      }
    })
  }, [nodes, lightNode, getContainerPos])

  /* ── Cleanup ─────────────────────────────────────────────── */
  useEffect(() => () => { wonRef.current = false }, [])

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="minigame-heart" onMouseMove={handleMouseMove}>
      <p className="minigame-instruction">
        {won
          ? '✦ Tình yêu thương bao la đã kết nối tất cả ✦'
          : 'Di chuột qua các điểm sáng để kết nối chòm sao nhân văn'}
      </p>

      {/* Flame cursor */}
      <div className="flame-cursor" style={{ left: flamePos.x, top: flamePos.y }}>
        <div className="flame-outer" />
        <div className="flame-mid"   />
        <div className="flame-core"  />
      </div>

      {/* Trail particles */}
      {trailParticles.map(p => (
        <div
          key={p.id}
          className="trail-particle"
          style={{
            left:   p.x,
            top:    p.y,
            width:  `${p.size}px`,
            height: `${p.size}px`,
          }}
        />
      ))}

      {/* Node burst particles */}
      {nodeParticles.map(p => (
        <div
          key={p.id}
          className="node-particle"
          style={{
            position: 'fixed',
            left:   p.x,
            top:    p.y,
            width:  `${p.size}px`,
            height: `${p.size}px`,
            '--color': p.color,
            '--tx':    `${p.tx}px`,
            '--ty':    `${p.ty}px`,
            '--dur':   `${p.dur}s`,
          }}
        />
      ))}

      {/* Falling stardust on win */}
      {fallingHearts.map(h => (
        <div
          key={h.id}
          className="falling-stardust"
          style={{
            left:     `${h.left}%`,
            top:      `${h.top}%`,
            '--color': h.color,
            '--sz':   `${h.size}px`,
            '--dur':  `${h.dur}s`,
            '--delay': `${h.delay}s`,
            '--rot':  `${h.rot}deg`,
            fontSize: `${h.size}px`,
          }}
        >
          ✦
        </div>
      ))}

      {/* Main container */}
      <div
        ref={containerRef}
        className={`heart-container ${won ? 'is-won' : ''}`}
      >
        {/* Ambient background stars */}
        {AMBIENT_STARS.map(star => (
          <div
            key={star.id}
            className="ambient-star"
            style={{
              left:   `${star.x}%`,
              top:    `${star.y}%`,
              width:  `${star.size}px`,
              height: `${star.size}px`,
              '--star-op': star.op,
              '--dur':     `${star.dur}s`,
              '--delay':   `${star.delay}s`,
            }}
          />
        ))}

        {/* ── PLOT TWIST: EPIC WIN EFFECT ── */}
        {showEpicWin && (
          <div className="epic-win-overlay">
            <div className="epic-shockwave" />
            <div className="epic-sun-flare" />
            <div className="epic-rays" />
            <div className="epic-banner">
              <span className="text-glow-noble">NHÂN VĂN</span><br/>
              <span className="text-solid-noble">CAO CẢ</span>
            </div>
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={`spark-${i}`} className="epic-spark" style={{
                '--angle': `${Math.random() * 360}deg`,
                '--dist': `${120 + Math.random() * 350}px`,
                animationDelay: `${Math.random() * 0.5}s`,
                background: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
              }} />
            ))}
          </div>
        )}

        {/* Star count display */}
        <div className="heart-star-count">✦ {lit.length}/{nodes.length}</div>

        {/* SVG heart constellation */}
        <svg viewBox="0 0 320 320" className="heart-svg">
          {/* Gradient for lines */}
          <defs>
            <linearGradient id="heartLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#38bdf8" />
              <stop offset="50%"  stopColor="#fde047" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Connecting lines between consecutive lit nodes */}
          {nodes.map((node, i) => {
            const next = nodes[(i + 1) % nodes.length]
            return lit.includes(node.id) && lit.includes(next.id) ? (
              <line
                key={`line-${node.id}`}
                x1={node.x} y1={node.y}
                x2={next.x} y2={next.y}
              />
            ) : null
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const isLit = lit.includes(node.id)
            return (
              <circle
                key={node.id}
                cx={node.x}
                cy={node.y}
                r={isLit ? 8 : 4}
                className={`heart-node ${isLit ? 'node-lit' : ''}`}
                style={isLit ? {} : {
                  animationDelay: `${node.id * 0.23}s`,
                  animationDuration: `${2.4 + node.id * 0.15}s`,
                }}
              />
            )
          })}
        </svg>
      </div>

      {/* Progress bar */}
      <div className="minigame-progress">
        <div
          className="minigame-progress-fill"
          style={{ width: `${(lit.length / nodes.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
