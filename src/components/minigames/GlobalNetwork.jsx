import { useState, useRef, useEffect, useCallback } from 'react'
import './GlobalNetwork.css'

/* ---- Data ---- */
const ORB_DATA = [
  { id: 'asia',    label: 'Châu Á',   flag: '🌏', cls: 'orb-asia',    initX: 15, initY: 22, color: '#ef4444', orbitDelay: '0s'   },
  { id: 'europe',  label: 'Châu Âu',  flag: '🌍', cls: 'orb-europe',  initX: 82, initY: 20, color: '#3b82f6', orbitDelay: '0.4s' },
  { id: 'africa',  label: 'Châu Phi', flag: '🌍', cls: 'orb-africa',  initX: 18, initY: 78, color: '#eab308', orbitDelay: '0.9s' },
  { id: 'america', label: 'Châu Mỹ',  flag: '🌎', cls: 'orb-america', initX: 80, initY: 78, color: '#22c55e', orbitDelay: '1.3s' },
  { id: 'oceania', label: 'Đại Dương',flag: '🌏', cls: 'orb-oceania', initX: 50, initY: 12, color: '#a855f7', orbitDelay: '1.8s' },
]

/* ---- Star generation ---- */
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  dur: `${2 + Math.random() * 4}s`,
  delay: `${Math.random() * 5}s`,
}))

/* ---- Ambient particles ---- */
const AMBIENT = Array.from({ length: 30 }, (_, i) => {
  const angle = (i / 30) * Math.PI * 2
  const radius = 90 + Math.random() * 40
  return {
    id: i,
    startX: Math.cos(angle) * radius,
    startY: Math.sin(angle) * radius,
    px: `${(Math.random() - 0.5) * 40}px`,
    py: `${(Math.random() - 0.5) * 40}px`,
    dur: `${3 + Math.random() * 3}s`,
    delay: `${Math.random() * 4}s`,
    color: ORB_DATA[i % ORB_DATA.length].color,
  }
})

/* ---- Win stars ---- */
const WIN_STARS = Array.from({ length: 80 }, (_, i) => {
  const angle = (i / 80) * Math.PI * 2
  const dist = 60 + Math.random() * 140
  return {
    id: i,
    dx: `${Math.cos(angle) * dist}px`,
    dy: `${Math.sin(angle) * dist}px`,
    dur: `${0.8 + Math.random() * 0.8}s`,
    delay: `${Math.random() * 0.4}s`,
    color: ORB_DATA[i % ORB_DATA.length].color,
    left: `${40 + Math.random() * 20}%`,
    top:  `${40 + Math.random() * 20}%`,
  }
})

const CORE_CENTER = { x: 50, y: 50 } // percent
const ABSORB_THRESHOLD = 12 // percent distance

export default function GlobalNetwork({ onWin }) {
  const containerRef = useRef(null)
  const [positions, setPositions] = useState(() =>
    Object.fromEntries(ORB_DATA.map(o => [o.id, { x: o.initX, y: o.initY }]))
  )
  const [absorbed, setAbsorbed] = useState([])
  const [dragging, setDragging] = useState(null) // id of currently dragged orb
  const [absorbEffect, setAbsorbEffect] = useState(null) // { id, color }
  const [isCoreAbsorbing, setIsCoreAbsorbing] = useState(false)
  const [won, setWon] = useState(false)
  const dragRef = useRef(null) // { id, offsetX, offsetY }

  /* ---- Drag helpers ---- */
  const getPct = useCallback((clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return { x: 50, y: 50 }
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    }
  }, [])

  const checkAbsorb = useCallback((id, x, y, currentAbsorbed) => {
    const dx = x - CORE_CENTER.x
    const dy = y - CORE_CENTER.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < ABSORB_THRESHOLD && !currentAbsorbed.includes(id)) {
      return true
    }
    return false
  }, [])

  const doAbsorb = useCallback((id, color) => {
    setAbsorbEffect({ id: Date.now(), color })
    setIsCoreAbsorbing(true)
    setTimeout(() => setIsCoreAbsorbing(false), 600)

    setAbsorbed(prev => {
      const next = [...prev, id]
      if (next.length === ORB_DATA.length) {
        setWon(true)
        setTimeout(onWin, 3000)
      }
      return next
    })
  }, [onWin])

  /* ---- Mouse events ---- */
  const handleMouseDown = useCallback((e, id) => {
    if (absorbed.includes(id) || won) return
    e.preventDefault()
    dragRef.current = { id }
    setDragging(id)
  }, [absorbed, won])

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragRef.current) return
      const { id } = dragRef.current
      const { x, y } = getPct(e.clientX, e.clientY)
      setPositions(prev => ({ ...prev, [id]: { x, y } }))
    }
    const onMouseUp = (e) => {
      if (!dragRef.current) return
      const { id } = dragRef.current
      const { x, y } = getPct(e.clientX, e.clientY)
      dragRef.current = null
      setDragging(null)
      const orbColor = ORB_DATA.find(o => o.id === id)?.color
      setAbsorbed(prev => {
        if (checkAbsorb(id, x, y, prev)) {
          doAbsorb(id, orbColor)
        }
        return prev
      })
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [getPct, checkAbsorb, doAbsorb])

  /* ---- Touch events ---- */
  const handleTouchStart = useCallback((e, id) => {
    if (absorbed.includes(id) || won) return
    e.preventDefault()
    dragRef.current = { id }
    setDragging(id)
  }, [absorbed, won])

  useEffect(() => {
    const onTouchMove = (e) => {
      if (!dragRef.current) return
      e.preventDefault()
      const touch = e.touches[0]
      const { id } = dragRef.current
      const { x, y } = getPct(touch.clientX, touch.clientY)
      setPositions(prev => ({ ...prev, [id]: { x, y } }))
    }
    const onTouchEnd = (e) => {
      if (!dragRef.current) return
      const { id } = dragRef.current
      const touch = e.changedTouches[0]
      const { x, y } = getPct(touch.clientX, touch.clientY)
      dragRef.current = null
      setDragging(null)
      const orbColor = ORB_DATA.find(o => o.id === id)?.color
      setAbsorbed(prev => {
        if (checkAbsorb(id, x, y, prev)) {
          doAbsorb(id, orbColor)
        }
        return prev
      })
    }
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [getPct, checkAbsorb, doAbsorb])

  const progress = absorbed.length / ORB_DATA.length
  const milestones = [0.2, 0.4, 0.6, 0.8, 1.0]

  return (
    <div className="minigame-network">
      <p className="minigame-instruction">
        {won
          ? '🌐 Mạng lưới quốc tế đã kết nối!'
          : 'Kéo các châu lục vào lõi trung tâm để kết nối toàn cầu'}
      </p>

      <div
        ref={containerRef}
        className={`network-container${won ? ' is-won' : ''}`}
      >
        {/* Star field */}
        <div className="network-stars">
          {STARS.map(s => (
            <div
              key={s.id}
              className="network-star"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                '--dur': s.dur,
                '--delay': s.delay,
              }}
            />
          ))}
        </div>

        {/* Ambient particles */}
        {AMBIENT.map(p => (
          <div
            key={p.id}
            className="ambient-particle"
            style={{
              left: `calc(50% + ${p.startX}px)`,
              top:  `calc(50% + ${p.startY}px)`,
              '--px': p.px,
              '--py': p.py,
              '--p-dur': p.dur,
              '--p-delay': p.delay,
              background: p.color,
              boxShadow: `0 0 6px ${p.color}`,
            }}
          />
        ))}

        {/* SVG connection lines from absorbed orbs to core */}
        <svg className="network-connections" viewBox="0 0 460 420" preserveAspectRatio="none">
          {absorbed.map(id => {
            const pos = positions[id]
            const orbDef = ORB_DATA.find(o => o.id === id)
            const cx = (CORE_CENTER.x / 100) * 460
            const cy = (CORE_CENTER.y / 100) * 420
            const ox = (pos.x / 100) * 460
            const oy = (pos.y / 100) * 420
            // Snap to core center
            return (
              <line
                key={id}
                className="connection-line"
                x1={cx} y1={cy}
                x2={cx} y2={cy}
                stroke={orbDef?.color || '#38bdf8'}
                strokeWidth="1.5"
                strokeOpacity="0.7"
              />
            )
          })}
          {/* active drag guide lines */}
          {ORB_DATA.filter(o => !absorbed.includes(o.id)).map(orb => {
            const pos = positions[orb.id]
            const cx = (CORE_CENTER.x / 100) * 460
            const cy = (CORE_CENTER.y / 100) * 420
            const ox = (pos.x / 100) * 460
            const oy = (pos.y / 100) * 420
            const dx = ox - cx; const dy = oy - cy
            const dist = Math.sqrt(dx*dx + dy*dy)
            if (dist > 100) return null
            return (
              <line
                key={orb.id}
                className="connection-line"
                x1={cx} y1={cy} x2={ox} y2={oy}
                stroke={orb.color}
                strokeWidth="1"
                strokeOpacity={0.3 + (1 - dist/100) * 0.4}
              />
            )
          })}
        </svg>

        {/* Core */}
        <div className={`network-core${isCoreAbsorbing ? ' is-absorbing' : ''}`}>
          <div className="core-ring core-ring-1" />
          <div className="core-ring core-ring-2" />
          <div className="core-ring core-ring-3" />
          <div className="network-core-inner">VN</div>
        </div>

        {/* Absorption shockwave */}
        {absorbEffect && (
          <div
            key={absorbEffect.id}
            className="absorb-shockwave"
            style={{
              left: '50%',
              top:  '50%',
              width: 80,
              height: 80,
              border: `3px solid ${absorbEffect.color}`,
              boxShadow: `0 0 20px ${absorbEffect.color}`,
            }}
          />
        )}

        {/* Orbs */}
        {ORB_DATA.map(orb => {
          const pos = positions[orb.id]
          const isAbsorbed = absorbed.includes(orb.id)
          const isDragging = dragging === orb.id
          return (
            <div
              key={orb.id}
              className={`network-orb ${orb.cls}${isAbsorbed ? ' is-absorbed' : ''}${isDragging ? ' is-dragging' : ''}`}
              style={{
                left: isAbsorbed ? '50%' : `${pos.x}%`,
                top:  isAbsorbed ? '50%' : `${pos.y}%`,
                '--orbit-delay': orb.orbitDelay,
              }}
              onMouseDown={e => handleMouseDown(e, orb.id)}
              onTouchStart={e => handleTouchStart(e, orb.id)}
            >
              <div className="orb-light">
                <div className="orb-ring" />
                {orb.flag}
              </div>
              <span className="orb-label">{orb.label}</span>
            </div>
          )
        })}

        {/* Win overlay */}
        {won && (
          <>
            {WIN_STARS.map(s => (
              <div
                key={s.id}
                className="win-star-particle"
                style={{
                  left: s.left,
                  top: s.top,
                  background: s.color,
                  boxShadow: `0 0 6px ${s.color}`,
                  '--dx': s.dx,
                  '--dy': s.dy,
                  '--ws-dur': s.dur,
                  '--ws-delay': s.delay,
                }}
              />
            ))}
            <div className="win-globe-wrap">
              <div className="win-globe" />
              <div className="win-text">🌐 Thế giới hòa bình</div>
            </div>
          </>
        )}
      </div>

      {/* Progress bar */}
      <div className="minigame-progress" style={{ position: 'relative' }}>
        <div
          className="minigame-progress-fill"
          style={{ width: `${progress * 100}%` }}
        />
        {milestones.map((m, i) => (
          <div
            key={i}
            className={`progress-milestone${progress >= m ? ' is-lit' : ''}`}
            style={{ left: `${m * 100}%` }}
          />
        ))}
      </div>
    </div>
  )
}
