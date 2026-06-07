import { useMemo, useRef, useState } from 'react'
import './GlobalNetwork.css'

const VIETNAM = { x: 50, y: 52 }

const regions = [
  { id: 'asia', name: 'Châu Á', value: 'Láng giềng', x: 23, y: 30, color: '#f97316', align: 'left' },
  { id: 'europe', name: 'Châu Âu', value: 'Tri thức', x: 77, y: 25, color: '#60a5fa', align: 'right' },
  { id: 'africa', name: 'Châu Phi', value: 'Độc lập', x: 21, y: 73, color: '#facc15', align: 'left' },
  { id: 'america', name: 'Châu Mỹ', value: 'Hòa bình', x: 80, y: 70, color: '#4ade80', align: 'right' },
  { id: 'oceania', name: 'Đại dương', value: 'Hội nhập', x: 56, y: 86, color: '#22d3ee', align: 'bottom' },
  { id: 'progressive', name: 'Thế giới', value: 'Tiến bộ', x: 50, y: 14, color: '#c084fc', align: 'top' },
]

const finaleWords = ['Dân tộc', 'Thời đại', 'Hòa bình', 'Hợp tác', 'Bản lĩnh', 'Hội nhập']

function seededRatio(index, salt = 0) {
  const value = Math.sin(index * 29.43 + salt * 17.71) * 10000
  return value - Math.floor(value)
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function routePath(region) {
  const bendY = region.y < VIETNAM.y ? -7 : 7
  const bendX = region.x < VIETNAM.x ? -5 : region.x > VIETNAM.x ? 5 : 0
  const midX = (region.x + VIETNAM.x) / 2 + bendX
  const midY = (region.y + VIETNAM.y) / 2 + bendY
  return `M ${VIETNAM.x} ${VIETNAM.y} Q ${midX} ${midY} ${region.x} ${region.y}`
}

export default function GlobalNetwork({ onWin }) {
  const stageRef = useRef(null)
  const [linked, setLinked] = useState([])
  const [drawing, setDrawing] = useState(null)
  const [pulse, setPulse] = useState(null)
  const [won, setWon] = useState(false)
  const [showFinale, setShowFinale] = useState(false)

  const stars = useMemo(
    () =>
      Array.from({ length: 44 }, (_, index) => ({
        id: index,
        left: `${3 + seededRatio(index, 1) * 94}%`,
        top: `${4 + seededRatio(index, 4) * 88}%`,
        size: 1.2 + seededRatio(index, 7) * 3.6,
        delay: `${seededRatio(index, 10) * 5}s`,
        duration: `${3.5 + seededRatio(index, 14) * 6}s`,
      })),
    [],
  )

  const pointFromEvent = (event) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return VIETNAM
    return {
      x: Math.max(3, Math.min(97, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(4, Math.min(96, ((event.clientY - rect.top) / rect.height) * 100)),
    }
  }

  const startRoute = (event) => {
    if (won) return
    event.preventDefault()
    setDrawing(pointFromEvent(event))
  }

  const moveRoute = (event) => {
    if (!drawing) return
    setDrawing(pointFromEvent(event))
  }

  const endRoute = (event) => {
    if (!drawing) return
    const releasePoint = pointFromEvent(event)
    const target = regions.find((region) => !linked.includes(region.id) && distance(releasePoint, region) < 11.5)

    if (target) {
      const nextLinked = [...linked, target.id]
      setLinked(nextLinked)
      setPulse({ id: `${target.id}-${linked.length}`, ...target, color: target.color })
      setDrawing(null)

      if (nextLinked.length === regions.length) {
        setWon(true)
        setTimeout(() => setShowFinale(true), 820)
        setTimeout(() => onWin(), 10000)
      }
      return
    }

    setPulse({ id: `miss-${linked.length}-${Math.round(releasePoint.x)}-${Math.round(releasePoint.y)}`, ...releasePoint, color: '#e0f2fe', miss: true })
    setDrawing(null)
  }

  const progress = won ? 100 : (linked.length / regions.length) * 100

  return (
    <div className={`minigame-network ${showFinale ? 'is-final-scene' : ''}`}>
      <p className="minigame-instruction">
        {won
          ? 'Các tuyến kết nối đã mở: bản lĩnh dân tộc gặp sức mạnh thời đại.'
          : 'Kéo từ Việt Nam ra từng khu vực để mở mạng lưới đoàn kết quốc tế.'}
      </p>

      <div
        ref={stageRef}
        className={`network-stage ${won ? 'is-won' : ''}`}
        onPointerMove={moveRoute}
        onPointerUp={endRoute}
        onPointerCancel={() => setDrawing(null)}
      >
        {stars.map((star) => (
          <span
            key={star.id}
            className="network-star"
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
        <div className="network-nebula" aria-hidden="true" />

        <svg className="network-routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            {regions.map((region) => (
              <linearGradient key={region.id} id={`globalRoute-${region.id}`} x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="100%" stopColor={region.color} stopOpacity="0.92" />
              </linearGradient>
            ))}
            <filter id="networkBeamGlow">
              <feGaussianBlur stdDeviation="0.85" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Hologram Wireframe Globe */}
          <g className="network-hologram-globe">
            <circle cx="50" cy="52" r="39" className="network-globe-sphere" />
            <ellipse cx="50" cy="52" rx="39" ry="12" className="network-globe-lat" />
            <ellipse cx="50" cy="52" rx="39" ry="24" className="network-globe-lat" />
            <line x1="11" y1="52" x2="89" y2="52" className="network-globe-lat network-globe-equator" />
            <ellipse cx="50" cy="52" rx="12" ry="39" className="network-globe-lon network-globe-lon--1" />
            <ellipse cx="50" cy="52" rx="24" ry="39" className="network-globe-lon network-globe-lon--2" />
            <line x1="50" y1="13" x2="50" y2="91" className="network-globe-lon network-globe-prime" />
          </g>
          {regions.map((region) => {
            const active = linked.includes(region.id)
            return (
              <g key={region.id} className={active ? 'is-linked' : ''}>
                <path className="network-route-base" d={routePath(region)} />
                <path className="network-route-core" d={routePath(region)} stroke={`url(#globalRoute-${region.id})`} />
                {active && <path className="network-route-runner" d={routePath(region)} />}
              </g>
            )
          })}
          {drawing && (
            <path
              className="network-drawing-route"
              d={`M ${VIETNAM.x} ${VIETNAM.y} Q ${(VIETNAM.x + drawing.x) / 2} ${drawing.y - 8} ${drawing.x} ${drawing.y}`}
            />
          )}
        </svg>

        <button
          type="button"
          className="network-vietnam-core"
          style={{ left: `${VIETNAM.x}%`, top: `${VIETNAM.y}%` }}
          onPointerDown={startRoute}
        >
          <span className="network-core-planet" />
          <b>Việt Nam</b>
          <small>Bản lĩnh dân tộc</small>
        </button>

        {regions.map((region, index) => {
          const active = linked.includes(region.id)
          return (
            <div
              key={region.id}
              className={`network-station network-station--${region.align} ${active ? 'is-linked' : ''}`}
              style={{
                left: `${region.x}%`,
                top: `${region.y}%`,
                '--region-color': region.color,
                '--delay': `${index * 0.08}s`,
              }}
            >
              <span className="network-station-orb">
                {active && (
                  <>
                    <span className="station-radar-ring station-radar-ring--1" />
                    <span className="station-radar-ring station-radar-ring--2" />
                  </>
                )}
              </span>
              <b>{region.name}</b>
              <small>{region.value}</small>
            </div>
          )
        })}

        {pulse && (
          <span
            key={pulse.id}
            className={`network-pulse ${pulse.miss ? 'is-miss' : ''}`}
            style={{ left: `${pulse.x}%`, top: `${pulse.y}%`, '--pulse-color': pulse.color }}
          />
        )}

        <div className="network-status">
          <span>{linked.length}</span>
          <small>/ {regions.length} tuyến mở</small>
        </div>
      </div>

      <div className="network-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      {showFinale && (
        <div className="network-finale" aria-hidden="true">
          <div className="network-finale-globe" />
          <div className="network-finale-rings" />
          <div className="network-finale-words">
            {finaleWords.map((word, index) => (
              <span key={word} style={{ '--delay': `${index * 0.12}s` }}>
                {word}
              </span>
            ))}
          </div>
          <div className="network-finale-regions">
            {regions.map((region, index) => (
              <i key={region.id} style={{ '--index': index, '--region-color': region.color }}>
                {region.name}
              </i>
            ))}
          </div>
          <div className="network-message-card">
            <span>Hành tinh đã mở khóa</span>
            <h3>QUỐC TẾ VÀ THỜI ĐẠI</h3>
            <strong>Hội nhập không phải hòa tan, mà là đem bản lĩnh dân tộc bước vào dòng chảy chung của nhân loại.</strong>
            <p>Sức mạnh Việt Nam lớn hơn khi biết kết nối với hòa bình, tiến bộ, tri thức và tình đoàn kết quốc tế.</p>
          </div>
        </div>
      )}
    </div>
  )
}
