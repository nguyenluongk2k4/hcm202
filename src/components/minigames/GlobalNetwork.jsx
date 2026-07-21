import { useRef, useState } from 'react'
import conThuyenImg from '../../assets/con_thuyen.png'
import './GlobalNetwork.css'

const VIETNAM = { x: 800, y: 450 }

const nodeData = [
  { id: 'dan-toc-54', title: '54 dân tộc anh em', subtitle: 'Đa dân tộc, đa tôn giáo', colorHex: '#f5c86a', x: 500, y: 220, align: 'left', icon: 'compass' },
  { id: 'cuong-linh', title: 'Cương lĩnh dân tộc', subtitle: 'V.I. Lênin', colorHex: '#51d6a7', x: 500, y: 450, align: 'left', icon: 'star' },
  { id: 'doan-ket', title: 'Đoàn kết dân tộc', subtitle: 'Bình đẳng, tự quyết', colorHex: '#65d7ee', x: 500, y: 680, align: 'left', icon: 'wave' },
  { id: 'tin-nguong', title: 'Tự do tín ngưỡng', subtitle: 'Theo hoặc không theo tôn giáo', colorHex: '#a890ff', x: 1100, y: 220, align: 'right', icon: 'compass' },
  { id: 'chong-me-tin', title: 'Chống mê tín dị đoan', subtitle: 'Chống lợi dụng tôn giáo', colorHex: '#f59a62', x: 1100, y: 450, align: 'right', icon: 'star' },
  { id: 'dong-hanh', title: 'Tôn giáo đồng hành', subtitle: 'Gắn bó cùng dân tộc', colorHex: '#ef7fb4', x: 1100, y: 680, align: 'right', icon: 'globe' },
]

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

const Icons = {
  compass: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  wave: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 7.5 0" />
      <path d="M2 18c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 7.5 0" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
}

const CenterCore = ({ onPointerDown }) => (
  <div
    className="center-core-wrapper"
    style={{ left: `${(VIETNAM.x / 1600) * 100}%`, top: `${(VIETNAM.y / 900) * 100}%` }}
    onPointerDown={onPointerDown}
  >
    <div className="center-core">
      <div className="core-hologram" />
      <div className="core-text">
        <b>Việt Nam</b>
      </div>
    </div>
  </div>
)

const MissionNode = ({ node, isActive }) => (
  <div
    className={`mission-node mission-node--${node.align} ${isActive ? 'is-active' : ''}`}
    style={{
      left: `${(node.x / 1600) * 100}%`,
      top: `${(node.y / 900) * 100}%`,
      '--region-color': node.colorHex,
    }}
  >
    <div className="mission-card">
      <div className="mission-card-icon">{Icons[node.icon]}</div>
      <div className="mission-card-text">
        <b>{node.title}</b>
        <small>{node.subtitle}</small>
      </div>
      <div className="mission-card-dots">
        <span className="dot active" />
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
    <div className="mission-orb-wrapper">
      <div className="mission-orb" />
    </div>
  </div>
)

const ProgressPill = ({ current, total }) => {
  const progress = (current / total) * 100
  return (
    <div className="progress-pill-wrapper">
      <div className="progress-pill">
        <span>{current}/{total}</span>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}

export default function GlobalNetwork({ onWin, onSolved }) {
  const stageRef = useRef(null)
  const [linked, setLinked] = useState([])
  const [drawing, setDrawing] = useState(null)
  const [stageState, setStageState] = useState('playing')

  const pointFromEvent = (event) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return VIETNAM
    return {
      x: Math.max(0, Math.min(1600, ((event.clientX - rect.left) / rect.width) * 1600)),
      y: Math.max(0, Math.min(900, ((event.clientY - rect.top) / rect.height) * 900)),
    }
  }

  const startRoute = (event) => {
    if (stageState !== 'playing') return
    event.preventDefault()
    setDrawing(pointFromEvent(event))
  }

  const moveRoute = (event) => {
    if (!drawing || stageState !== 'playing') return
    setDrawing(pointFromEvent(event))
  }

  const endRoute = (event) => {
    if (!drawing || stageState !== 'playing') return
    const releasePoint = pointFromEvent(event)
    const target = nodeData.find((r) => !linked.includes(r.id) && distance(releasePoint, r) < 150)

    if (target) {
      const nextLinked = [...linked, target.id]
      setLinked(nextLinked)
      setDrawing(null)

      if (nextLinked.length === nodeData.length) {
        handleWinSequence()
      }
    } else {
      setDrawing(null)
    }
  }

  const handleWinSequence = () => {
    onSolved?.()
    setStageState('flashing')
    setTimeout(() => {
      setStageState('collapsing')
    }, 2000)
    setTimeout(() => {
      setStageState('finale')
    }, 3500)
    setTimeout(() => {
      onWin?.()
    }, 15000)
  }

  const isFlashing = stageState === 'flashing'
  const isCollapsing = stageState === 'collapsing' || stageState === 'finale'
  const isFinale = stageState === 'finale'

  return (
    <div className={`minigame-network ${isFinale ? 'is-final-scene' : ''}`}>
      <div className="mission-map-frame">
        <div className="stardust" />

        <div
          className={`network-nodes-layer ${isFlashing ? 'is-flashing' : ''} ${isCollapsing ? 'is-collapsing' : ''}`}
          ref={stageRef}
          onPointerMove={moveRoute}
          onPointerUp={endRoute}
          onPointerLeave={endRoute}
          onPointerCancel={() => setDrawing(null)}
        >
          <div className="game-instructions">
            Kéo thả từ Việt Nam để kết nối với các nội dung dân tộc và tôn giáo
          </div>

          <svg className="connection-overlay" viewBox="0 0 1600 900">
            <defs>
              {nodeData.map((node) => (
                <marker id={`chevron-${node.id}`} key={`marker-${node.id}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                  <path d="M2,2 L8,5 L2,8" fill="none" stroke={node.colorHex} strokeWidth="1.5" />
                </marker>
              ))}
              {nodeData.map((node) => (
                <linearGradient id={`grad-${node.id}`} key={`grad-${node.id}`} gradientUnits="userSpaceOnUse" x1={VIETNAM.x} y1={VIETNAM.y} x2={node.x} y2={node.y}>
                  <stop offset="0%" stopColor="#65d7ee" />
                  <stop offset="100%" stopColor={node.colorHex} />
                </linearGradient>
              ))}
            </defs>

            {nodeData.map((node) => {
              const isActive = linked.includes(node.id)
              const dPath = `M ${VIETNAM.x} ${VIETNAM.y} L ${node.x} ${node.y}`
              const midX = (VIETNAM.x + node.x) / 2
              const midY = (VIETNAM.y + node.y) / 2
              const dPath1 = `M ${VIETNAM.x} ${VIETNAM.y} L ${midX} ${midY}`
              const dPath2 = `M ${midX} ${midY} L ${node.x} ${node.y}`

              return (
                <g key={`route-${node.id}`}>
                  <path className="conn-line" d={dPath} />
                  {isActive && (
                    <>
                      <path
                        className="conn-line is-active"
                        d={dPath1}
                        style={{ stroke: `url(#grad-${node.id})` }}
                        markerEnd={`url(#chevron-${node.id})`}
                      />
                      <path
                        className="conn-line is-active"
                        d={dPath2}
                        style={{ stroke: `url(#grad-${node.id})` }}
                      />
                      <circle r="4" className="particle-flow" fill="#ffffff" filter="drop-shadow(0 0 10px #fff)">
                        <animateMotion dur="2.5s" repeatCount="indefinite" path={dPath} />
                      </circle>
                    </>
                  )}
                </g>
              )
            })}
            {drawing && (
              <path
                className="conn-line is-active"
                d={`M ${VIETNAM.x} ${VIETNAM.y} L ${drawing.x} ${drawing.y}`}
                style={{ stroke: '#65d7ee' }}
              />
            )}
          </svg>

          <CenterCore onPointerDown={startRoute} />

          {nodeData.map((node) => (
            <MissionNode
              key={node.id}
              node={node}
              isActive={linked.includes(node.id)}
            />
          ))}

          <ProgressPill current={linked.length} total={nodeData.length} />
        </div>

        <div className={`network-epic-finale ${isFinale ? 'is-visible' : ''}`}>
          <div className="epic-bg" />
          <img src={conThuyenImg} alt="Đoàn kết dân tộc và tôn giáo" className="epic-image" />
          <div className="epic-overlay" />
          <div className="epic-content">
            <span className="epic-eyebrow">Hành tinh đã mở khóa</span>
            <h2 className="epic-title">DÂN TỘC & TÔN GIÁO</h2>
            <p className="epic-quote">
              "Các dân tộc hoàn toàn bình đẳng, các dân tộc được quyền tự quyết, liên hiệp công nhân tất cả các dân tộc lại."
            </p>
            <p className="epic-desc">
              Việt Nam là quốc gia đa dân tộc, đa tôn giáo trên nền tảng cộng đồng quốc gia - dân tộc thống nhất. Đoàn kết dân tộc và tôn trọng tự do tín ngưỡng là sức mạnh, đồng thời kiên quyết chống mê tín dị đoan và mọi hành động lợi dụng tôn giáo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
