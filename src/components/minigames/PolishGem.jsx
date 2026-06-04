import { useState, useRef, useEffect, useCallback } from 'react'
import './PolishGem.css'

export default function PolishGem({ onWin }) {
  const [phase, setPhase] = useState('breaking') // 'breaking' | 'polishing' | 'won'
  const [hits, setHits] = useState(0)
  const [shards, setShards] = useState([])
  const [isShaking, setIsShaking] = useState(false)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [flarePos, setFlarePos] = useState({ x: -999, y: -999 })
  
  const canvasRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [sparkles, setSparkles] = useState([])
  const isDrawing = useRef(false)
  const lastPos = useRef(null)

  const TOTAL_HITS = 15

  // Initialize the dirt canvas
  useEffect(() => {
    if (phase !== 'polishing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    // Fill with dark brown/mud dirt
    ctx.fillStyle = '#2a1a08'
    ctx.beginPath()
    ctx.arc(120, 120, 120, 0, Math.PI * 2)
    ctx.fill()
    // Add texture using random blobs
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * 240
      const y = Math.random() * 240
      const r = Math.random() * 20 + 5
      const dark = Math.random() > 0.5
      ctx.fillStyle = dark ? 'rgba(0,0,0,0.5)' : 'rgba(80,40,10,0.4)'
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [phase])

  const spawnShards = useCallback(() => {
    const newShards = Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5
      const dist = Math.random() * 130 + 60
      return {
        id: Date.now() + i,
        dx: Math.cos(angle) * dist + 'px',
        dy: Math.sin(angle) * dist + 'px',
        rot: (Math.random() - 0.5) * 720 + 'deg',
        size: Math.random() * 14 + 6 + 'px',
        dur: Math.random() * 0.4 + 0.4 + 's',
        opacity: Math.random() * 0.5 + 0.5
      }
    })
    setShards(prev => [...prev.slice(-40), ...newShards])
    setTimeout(() => {
      const ids = newShards.map(s => s.id)
      setShards(prev => prev.filter(s => !ids.includes(s.id)))
    }, 1000)
  }, [])

  const handleRockClick = () => {
    if (phase !== 'breaking') return
    const nextHits = hits + 1
    setHits(nextHits)
    spawnShards()
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 300)

    if (nextHits >= TOTAL_HITS) {
      setTimeout(() => setPhase('polishing'), 600)
    }
  }

  const spawnSparkle = (x, y) => {
    const count = Math.floor(Math.random() * 3) + 2
    const newSparks = Array.from({ length: count }, (_, i) => {
      const id = Date.now() + Math.random() + i
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * 120 + 50
      return {
        id,
        x: x - 120,
        y: y - 120,
        dx: Math.cos(angle) * dist + 'px',
        dy: Math.sin(angle) * dist + 'px',
        size: Math.random() * 8 + 4 + 'px'
      }
    })
    setSparkles(prev => [...prev.slice(-40), ...newSparks])
    setTimeout(() => {
      const idsToRemove = newSparks.map(s => s.id)
      setSparkles(prev => prev.filter(s => !idsToRemove.includes(s.id)))
    }, 800)
  }

  const erase = (x, y) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    if (lastPos.current) {
      ctx.beginPath()
      ctx.moveTo(lastPos.current.x, lastPos.current.y)
      ctx.lineTo(x, y)
      ctx.strokeStyle = 'rgba(0,0,0,1)'
      ctx.lineWidth = 28
      ctx.lineCap = 'round'
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.arc(x, y, 18, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,0,0,1)'
      ctx.fill()
    }
    ctx.globalCompositeOperation = 'source-over'
    lastPos.current = { x, y }
    spawnSparkle(x, y)

    // Calculate progress
    const imageData = ctx.getImageData(0, 0, 240, 240)
    let transparentCount = 0
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 128) transparentCount++
    }
    const pct = Math.round((transparentCount / (240 * 240)) * 100)
    setProgress(Math.min(100, pct))
  }

  const checkWin = () => {
    if (progress >= 80 && phase === 'polishing') {
      setPhase('won')
      setTimeout(() => onWin(), 3500)
    }
  }

  const handlePointerDown = (e) => {
    if (phase !== 'polishing') return
    isDrawing.current = true
    setIsScrubbing(true)
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = canvasRef.current.width / rect.width
    const scaleY = canvasRef.current.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    setFlarePos({ x, y })
    lastPos.current = null
    erase(x, y)
  }

  const handlePointerMove = (e) => {
    if (!isDrawing.current || phase !== 'polishing') return
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = canvasRef.current.width / rect.width
    const scaleY = canvasRef.current.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    if (isScrubbing) setFlarePos({ x, y })
    erase(x, y)
    if (Math.random() < 0.25) checkWin()
  }

  const handlePointerUp = () => {
    if (phase !== 'polishing') return
    isDrawing.current = false
    setIsScrubbing(false)
    lastPos.current = null
    checkWin()
  }

  const glowIntensity = progress / 100

  return (
    <div className="minigame-polish">
      <p className="minigame-instruction" style={{ color: '#a7f3d0' }}>
        {phase === 'breaking' && 'Đập vỡ lớp đá để lộ ngọc bên trong!'}
        {phase === 'polishing' && 'Chà xát để lau sạch lớp bụi trần gian'}
        {phase === 'won' && '✨ Ngọc sáng rực — Đức hạnh tỏa sáng! ✨'}
      </p>

      <div className={`polish-container ${phase === 'won' ? 'is-won' : ''}`}>

        {/* Phase 1: Rock Breaking */}
        {(phase === 'breaking') && (
          <>
            <div
              className={`rock-wrapper ${isShaking ? 'rock-shake' : ''}`}
              onClick={handleRockClick}
              style={{ cursor: 'crosshair' }}
            >
              <svg viewBox="0 0 200 200" className="rock-svg">
                <defs>
                  <radialGradient id="rock-grad" cx="35%" cy="30%">
                    <stop offset="0%" stopColor="#78716c"/>
                    <stop offset="60%" stopColor="#44403c"/>
                    <stop offset="100%" stopColor="#1c1917"/>
                  </radialGradient>
                  <filter id="rock-rough">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed={hits} result="noise"/>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
                  </filter>
                </defs>
                <polygon
                  points="100,12 165,40 188,110 155,175 100,188 45,175 12,110 35,40"
                  fill="url(#rock-grad)" filter="url(#rock-rough)"
                  stroke="#292524" strokeWidth="2"
                />
                {/* Crack progression */}
                {hits > 2 && <path d="M 75 70 L 90 95 L 80 130" fill="none" stroke="#ff6600" strokeWidth="2" opacity="0.7"/>}
                {hits > 5 && <path d="M 120 65 L 110 100 L 130 140" fill="none" stroke="#ff8800" strokeWidth="2.5" opacity="0.8"/>}
                {hits > 9 && <path d="M 85 85 L 100 105 L 115 85" fill="none" stroke="#ffcc00" strokeWidth="2" opacity="0.9"/>}
                {hits > 12 && <path d="M 60 120 L 100 100 L 140 120" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="1"/>}
              </svg>
            </div>
            {/* Rock Shards */}
            <div className="rock-shards">
              {shards.map(s => (
                <div
                  key={s.id}
                  className="rock-shard"
                  style={{
                    '--dx': s.dx,
                    '--dy': s.dy,
                    '--rot': s.rot,
                    '--size': s.size,
                    '--dur': s.dur,
                    opacity: s.opacity
                  }}
                />
              ))}
            </div>
            {/* Hit progress indicator */}
            <div style={{
              position: 'absolute', bottom: '-45px', left: '50%', transform: 'translateX(-50%)',
              color: '#a7f3d0', fontSize: '0.85rem', letterSpacing: '0.1em'
            }}>
              {Array.from({ length: TOTAL_HITS }, (_, i) => (
                <span key={i} style={{ opacity: i < hits ? 1 : 0.2, margin: '0 1px', fontSize: '0.6rem' }}>⬡</span>
              ))}
            </div>
          </>
        )}

        {/* Phase 2 & Won: Gem */}
        {(phase === 'polishing' || phase === 'won') && (
          <>
            {/* Gem SVG */}
            <div className="gem-svg-wrapper" style={{ '--glow-intensity': glowIntensity }}>
              <svg viewBox="0 0 200 200" className="gem-svg">
                <defs>
                  <radialGradient id="gem-core" cx="38%" cy="32%">
                    <stop offset="0%" stopColor="#ffffff"/>
                    <stop offset="20%" stopColor="#a7f3d0"/>
                    <stop offset="55%" stopColor="#059669"/>
                    <stop offset="100%" stopColor="#064e3b"/>
                  </radialGradient>
                  <radialGradient id="gem-shine" cx="60%" cy="25%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.9)"/>
                    <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                  </radialGradient>
                </defs>
                {/* Gem body */}
                <polygon
                  points="100,15 175,65 175,135 100,185 25,135 25,65"
                  fill="url(#gem-core)"
                />
                {/* Inner facets */}
                <polygon points="100,15 175,65 100,100" fill="rgba(167,243,208,0.25)"/>
                <polygon points="100,15 25,65 100,100" fill="rgba(255,255,255,0.15)"/>
                <polygon points="100,185 175,135 100,100" fill="rgba(6,78,59,0.5)"/>
                <polygon points="100,185 25,135 100,100" fill="rgba(5,150,105,0.3)"/>
                {/* Shine highlight */}
                <ellipse cx="80" cy="60" rx="28" ry="16" fill="url(#gem-shine)" opacity="0.7" transform="rotate(-20 80 60)"/>
                <ellipse cx="68" cy="52" rx="10" ry="6" fill="rgba(255,255,255,0.9)" opacity="0.8" transform="rotate(-20 68 52)"/>
              </svg>
            </div>

            {/* Light Rays — visible and growing as progress increases */}
            <div
              className="gem-win-rays"
              style={{
                opacity: phase === 'won' ? 1 : Math.pow(progress / 100, 1.5),
                transition: 'opacity 0.3s'
              }}
            />

            {/* Dirt Layer */}
            {phase === 'polishing' && (
              <canvas
                ref={canvasRef}
                width={240}
                height={240}
                className="dust-canvas"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                style={{ touchAction: 'none' }}
              />
            )}

            {/* Scrub flare at cursor */}
            {phase === 'polishing' && isScrubbing && (
              <div
                className="scrub-flare"
                style={{
                  left: `calc(50% - 120px + ${flarePos.x}px)`,
                  top: `calc(50% - 120px + ${flarePos.y}px)`,
                }}
              />
            )}
          </>
        )}

        {/* Win Text */}
        <div className="polish-content-beautiful">
          <h3>Ngọc Sáng</h3>
          <p>"Ngọc càng mài càng sáng, người càng rèn càng tài."</p>
        </div>

        {/* Sparkles */}
        {sparkles.map(s => (
          <div
            key={s.id}
            className="polish-sparkle"
            style={{
              left: `calc(50% + ${s.x}px)`,
              top: `calc(50% + ${s.y}px)`,
              '--dx': s.dx,
              '--dy': s.dy,
              '--spark-size': s.size
            }}
          />
        ))}
      </div>

      <div className="minigame-progress">
        <div
          className="minigame-progress-fill"
          style={{ width: phase === 'breaking' ? `${(hits / TOTAL_HITS) * 100}%` : `${progress}%` }}
        />
      </div>
    </div>
  )
}
