import { useEffect, useMemo, useRef, useState } from 'react'
import './PolishGem.css'

const TOTAL_HITS = 9
const virtues = ['Cần', 'Kiệm', 'Liêm', 'Chính']
const dustWords = ['Ích kỷ', 'Lãng phí', 'Giả dối', 'Vô trách nhiệm']

function seededRatio(index, salt = 1) {
  const value = Math.sin(index * 88.217 + salt * 39.733) * 10000
  return value - Math.floor(value)
}

export default function PolishGem({ onWin }) {
  const [phase, setPhase] = useState('breaking')
  const [hits, setHits] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isShaking, setIsShaking] = useState(false)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [flarePos, setFlarePos] = useState({ x: -999, y: -999 })
  const [shards, setShards] = useState([])
  const [sparkles, setSparkles] = useState([])
  const [showFinale, setShowFinale] = useState(false)

  const canvasRef = useRef(null)
  const drawingRef = useRef(false)
  const lastPosRef = useRef(null)
  const wonRef = useRef(false)
  const shardSeqRef = useRef(0)
  const sparkleSeqRef = useRef(0)

  const ambientDust = useMemo(() => {
    return Array.from({ length: 34 }).map((_, index) => ({
      id: index,
      left: 6 + seededRatio(index, 1) * 88,
      top: 6 + seededRatio(index, 2) * 84,
      size: 2 + seededRatio(index, 3) * 5,
      delay: seededRatio(index, 4) * 4,
      duration: 3.6 + seededRatio(index, 5) * 4.5,
      drift: -28 + seededRatio(index, 6) * 56,
    }))
  }, [])

  const finaleSparks = useMemo(() => {
    return Array.from({ length: 44 }).map((_, index) => ({
      id: index,
      angle: seededRatio(index, 7) * 360,
      distance: 120 + seededRatio(index, 8) * 380,
      delay: seededRatio(index, 9) * 0.85,
      duration: 2.3 + seededRatio(index, 10) * 2.5,
      size: 3 + seededRatio(index, 11) * 7,
    }))
  }, [])

  const initDustCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 280, 280)
    ctx.globalCompositeOperation = 'source-over'

    const gradient = ctx.createRadialGradient(112, 92, 16, 140, 140, 150)
    gradient.addColorStop(0, 'rgba(105, 63, 20, 0.96)')
    gradient.addColorStop(0.58, 'rgba(41, 25, 12, 0.96)')
    gradient.addColorStop(1, 'rgba(6, 10, 18, 0.96)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(140, 140, 132, 0, Math.PI * 2)
    ctx.fill()

    for (let i = 0; i < 72; i += 1) {
      const x = 20 + seededRatio(i, 12) * 240
      const y = 20 + seededRatio(i, 13) * 240
      const radius = 6 + seededRatio(i, 14) * 24
      const alpha = 0.18 + seededRatio(i, 15) * 0.4

      ctx.fillStyle = i % 2 === 0 ? `rgba(0, 0, 0, ${alpha})` : `rgba(146, 64, 14, ${alpha})`
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.font = '700 15px Inter, Arial, sans-serif'
    ctx.textAlign = 'center'
    dustWords.forEach((word, index) => {
      const angle = (Math.PI * 2 * index) / dustWords.length - Math.PI / 2
      ctx.fillText(word, 140 + Math.cos(angle) * 72, 145 + Math.sin(angle) * 72)
    })
  }

  useEffect(() => {
    if (phase === 'polishing') {
      window.setTimeout(initDustCanvas, 40)
    }
  }, [phase])

  const addShards = (hitIndex) => {
    const burstId = shardSeqRef.current += 1
    const nextShards = Array.from({ length: 8 }).map((_, index) => {
      const angle = (index / 10) * Math.PI * 2 + seededRatio(index, hitIndex + 20) * 0.5
      const distance = 70 + seededRatio(index, hitIndex + 30) * 145

      return {
        id: `${burstId}-${hitIndex}-${index}`,
        dx: `${Math.cos(angle) * distance}px`,
        dy: `${Math.sin(angle) * distance}px`,
        rotate: `${-360 + seededRatio(index, hitIndex + 40) * 720}deg`,
        size: `${7 + seededRatio(index, hitIndex + 50) * 18}px`,
        duration: `${0.45 + seededRatio(index, hitIndex + 60) * 0.42}s`,
      }
    })

    setShards((current) => [...current.slice(-44), ...nextShards])
    window.setTimeout(() => {
      const ids = new Set(nextShards.map((shard) => shard.id))
      setShards((current) => current.filter((shard) => !ids.has(shard.id)))
    }, 1000)
  }

  const handleRockHit = () => {
    if (phase !== 'breaking') return

    const nextHits = hits + 1
    setHits(nextHits)
    setIsShaking(true)
    addShards(nextHits)

    window.setTimeout(() => setIsShaking(false), 220)

    if (nextHits >= TOTAL_HITS) {
      window.setTimeout(() => setPhase('polishing'), 520)
    }
  }

  const addSparkles = (x, y) => {
    const burstId = sparkleSeqRef.current += 1
    const newSparkles = Array.from({ length: 3 }).map((_, index) => {
      const angle = seededRatio(index, x + y + 70) * Math.PI * 2
      const distance = 50 + seededRatio(index, x + y + 90) * 120

      return {
        id: `${burstId}-${index}-${Math.round(x)}-${Math.round(y)}`,
        x: x - 140,
        y: y - 140,
        dx: `${Math.cos(angle) * distance}px`,
        dy: `${Math.sin(angle) * distance}px`,
        size: `${4 + seededRatio(index, x + y + 110) * 8}px`,
      }
    })

    setSparkles((current) => [...current.slice(-48), ...newSparkles])
    window.setTimeout(() => {
      const ids = new Set(newSparkles.map((sparkle) => sparkle.id))
      setSparkles((current) => current.filter((sparkle) => !ids.has(sparkle.id)))
    }, 780)
  }

  const complete = () => {
    if (wonRef.current) return

    wonRef.current = true
    setPhase('won')
    setProgress(100)
    window.setTimeout(() => setShowFinale(true), 720)
    window.setTimeout(onWin, 10200)
  }

  const updateProgress = (ctx) => {
    const imageData = ctx.getImageData(0, 0, 280, 280)
    let transparentCount = 0

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 120) transparentCount += 1
    }

    const nextProgress = Math.min(100, Math.round((transparentCount / (280 * 280)) * 100))
    setProgress(nextProgress)

    if (nextProgress >= 76) complete()
  }

  const eraseAt = (x, y) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 40

    if (lastPosRef.current) {
      ctx.beginPath()
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.arc(x, y, 22, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.globalCompositeOperation = 'source-over'
    lastPosRef.current = { x, y }
    setFlarePos({ x, y })
    addSparkles(x, y)
    updateProgress(ctx)
  }

  const getCanvasPoint = (event) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  const handlePointerDown = (event) => {
    if (phase !== 'polishing') return

    event.preventDefault()
    drawingRef.current = true
    lastPosRef.current = null
    setIsScrubbing(true)

    const point = getCanvasPoint(event)
    eraseAt(point.x, point.y)
  }

  const handlePointerMove = (event) => {
    if (!drawingRef.current || phase !== 'polishing') return

    const point = getCanvasPoint(event)
    eraseAt(point.x, point.y)
  }

  const handlePointerUp = () => {
    if (phase !== 'polishing') return

    drawingRef.current = false
    lastPosRef.current = null
    setIsScrubbing(false)
  }

  const visibleProgress = phase === 'breaking' ? (hits / TOTAL_HITS) * 100 : progress
  const glowIntensity = phase === 'breaking' ? hits / TOTAL_HITS : progress / 100

  return (
    <div className={`minigame-polish ${showFinale ? 'is-final-scene' : ''}`}>
      {ambientDust.map((dust) => (
        <i
          key={dust.id}
          className="ethics-ambient-dust"
          style={{
            left: `${dust.left}%`,
            top: `${dust.top}%`,
            width: `${dust.size}px`,
            '--drift': `${dust.drift}px`,
            animationDelay: `${dust.delay}s`,
            animationDuration: `${dust.duration}s`,
          }}
        />
      ))}

      <p className="minigame-instruction">
        {phase === 'breaking' && 'Đập vỡ lớp đá thô để lộ viên ngọc đạo đức bên trong.'}
        {phase === 'polishing' && 'Lau sạch bụi mờ để Cần - Kiệm - Liêm - Chính hiện ra.'}
        {phase === 'won' && 'Viên ngọc đã sáng: đạo đức phải được rèn trong từng hành động.'}
      </p>

      <div className={`ethics-stage ${phase === 'won' ? 'is-won' : ''}`}>
        <div className="ethics-stage-aura" />
        <div className="ethics-orbit-ring" />

        {phase === 'breaking' && (
          <>
            <button
              type="button"
              className={`ethics-rock ${isShaking ? 'is-shaking' : ''}`}
              onPointerDown={(event) => {
                event.preventDefault()
                handleRockHit()
              }}
              aria-label="Đập vỡ lớp đá thô"
            >
              <svg viewBox="0 0 240 240" aria-hidden="true">
                <defs>
                  <radialGradient id="ethicsRockGradient" cx="36%" cy="28%">
                    <stop offset="0%" stopColor="#a8a29e" />
                    <stop offset="58%" stopColor="#57534e" />
                    <stop offset="100%" stopColor="#1c1917" />
                  </radialGradient>
                  <radialGradient id="ethicsRockCore" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="48%" stopColor="#a7f3d0" />
                    <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                  </radialGradient>
                </defs>
                <polygon
                  points="120,12 191,43 220,122 180,207 120,224 52,196 16,120 42,44"
                  className="ethics-rock-body"
                />
                <circle cx="120" cy="122" r={18 + hits * 8} className="ethics-rock-core" opacity={0.12 + hits * 0.08} />
                {hits > 1 && <path d="M84 78 L102 112 L88 152" className="ethics-crack" />}
                {hits > 3 && <path d="M145 72 L132 116 L156 164" className="ethics-crack ethics-crack--gold" />}
                {hits > 5 && <path d="M72 144 L120 116 L172 148" className="ethics-crack ethics-crack--bright" />}
                {hits > 7 && <path d="M98 72 L120 116 L143 72 M120 116 L120 190" className="ethics-crack ethics-crack--white" />}
              </svg>
              <span>Đập lớp thô</span>
            </button>

            <div className="ethics-hit-track" aria-hidden="true">
              {Array.from({ length: TOTAL_HITS }).map((_, index) => (
                <span key={index} className={index < hits ? 'is-hit' : ''} />
              ))}
            </div>
          </>
        )}

        {(phase === 'polishing' || phase === 'won') && (
          <div className="ethics-gem-wrap" style={{ '--glow-intensity': glowIntensity }}>
            <svg viewBox="0 0 240 240" className="ethics-gem" aria-hidden="true">
              <defs>
                <radialGradient id="ethicsGemCore" cx="38%" cy="30%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="22%" stopColor="#d1fae5" />
                  <stop offset="58%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#064e3b" />
                </radialGradient>
                <linearGradient id="ethicsFacet" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.7)" />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                </linearGradient>
              </defs>
              <polygon points="120,18 205,70 205,154 120,224 35,154 35,70" className="ethics-gem-body" />
              <polygon points="120,18 205,70 120,118" className="ethics-gem-facet ethics-gem-facet--one" />
              <polygon points="120,18 35,70 120,118" className="ethics-gem-facet ethics-gem-facet--two" />
              <polygon points="120,224 205,154 120,118" className="ethics-gem-facet ethics-gem-facet--three" />
              <polygon points="120,224 35,154 120,118" className="ethics-gem-facet ethics-gem-facet--four" />
              <ellipse cx="91" cy="67" rx="31" ry="15" className="ethics-gem-shine" transform="rotate(-20 91 67)" />
            </svg>

            <div className="ethics-virtue-orbit" aria-hidden="true">
              {virtues.map((virtue, index) => (
                <span key={virtue} style={{ '--virtue-index': index }}>
                  {virtue}
                </span>
              ))}
            </div>

            {phase === 'polishing' && (
              <canvas
                ref={canvasRef}
                width={280}
                height={280}
                className="ethics-dust-canvas"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                style={{ touchAction: 'none' }}
              />
            )}

            {phase === 'polishing' && isScrubbing && (
              <div
                className="ethics-scrub-flare"
                style={{
                  left: `calc(50% - 140px + ${flarePos.x}px)`,
                  top: `calc(50% - 140px + ${flarePos.y}px)`,
                }}
              />
            )}
          </div>
        )}

        {shards.map((shard) => (
          <i
            key={shard.id}
            className="ethics-rock-shard"
            style={{
              '--dx': shard.dx,
              '--dy': shard.dy,
              '--rot': shard.rotate,
              '--size': shard.size,
              animationDuration: shard.duration,
            }}
          />
        ))}

        {sparkles.map((sparkle) => (
          <i
            key={sparkle.id}
            className="ethics-polish-sparkle"
            style={{
              left: `calc(50% + ${sparkle.x}px)`,
              top: `calc(50% + ${sparkle.y}px)`,
              '--dx': sparkle.dx,
              '--dy': sparkle.dy,
              '--spark-size': sparkle.size,
            }}
          />
        ))}
      </div>

      {showFinale && (
        <div className="ethics-finale" aria-live="polite">
          <div className="ethics-finale-aura" />
          <div className="ethics-finale-rings" />
          <div className="ethics-finale-pillars">
            {virtues.map((virtue) => (
              <span key={virtue}>{virtue}</span>
            ))}
          </div>
          {finaleSparks.map((spark) => (
            <i
              key={spark.id}
              className="ethics-finale-spark"
              style={{
                '--spark-angle': `${spark.angle}deg`,
                '--spark-distance': `${spark.distance}px`,
                '--spark-size': `${spark.size}px`,
                '--duration': `${spark.duration}s`,
                '--delay': `${spark.delay}s`,
                animationDelay: `${spark.delay}s`,
                animationDuration: `${spark.duration}s`,
              }}
            />
          ))}
          <div className="ethics-message-card">
            <small>Hành tinh đã mở khóa</small>
            <h3>ĐẠO ĐỨC CÁCH MẠNG</h3>
            <strong>Cần - Kiệm - Liêm - Chính không phải khẩu hiệu, mà là ánh sáng phải được mài mỗi ngày.</strong>
            <p>Ngọc càng mài càng sáng, người càng rèn càng vững: đạo đức đẹp nhất khi biến thành hành động.</p>
          </div>
        </div>
      )}

      <div className="minigame-progress">
        <div className="minigame-progress-fill" style={{ width: `${visibleProgress}%` }} />
      </div>
    </div>
  )
}
