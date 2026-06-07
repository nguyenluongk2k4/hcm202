import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './ConnectFragments.css'

// Thêm 4 nodes mới để game khó hơn
const unityNodes = [
  { id: 0,  label: 'Mục tiêu',    x: 210, y: 45  },
  { id: 1,  label: 'Tin tưởng',   x: 265, y: 120 },
  { id: 2,  label: 'Tôn trọng',   x: 375, y: 195 },
  { id: 3,  label: 'Lắng nghe',   x: 310, y: 290 },
  { id: 4,  label: 'Chia sẻ',     x: 210, y: 370 },
  { id: 5,  label: 'Trách nhiệm', x: 110, y: 290 },
  { id: 6,  label: 'Hợp tác',     x: 45,  y: 195 },
  { id: 7,  label: 'Bao dung',    x: 155, y: 120 },
  { id: 8,  label: 'Nhân dân',    x: 210, y: 220, core: true },
  { id: 9,  label: 'Kỷ luật',     x: 275, y: 175 },
  { id: 10, label: 'Sáng tạo',    x: 255, y: 255 },
  { id: 11, label: 'Hi sinh',     x: 165, y: 255 },
  { id: 12, label: 'Nghĩa tình',  x: 145, y: 175 },
]

const targetEdges = [
  '0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '0-7', // octagon outer
  '0-8', '2-8', '4-8', '6-8',                              // core spokes
  '1-9', '2-9', '3-10', '4-10',                            // inner connectors (sorted)
  '5-11', '6-11', '7-12', '0-12',                          // more connectors (sorted)
]

const SNAP_RADIUS = 82

// Colors for each edge — rainbow palette
const EDGE_COLORS = [
  '#ff6b6b', '#ffa94d', '#ffd43b', '#a9e34b',
  '#69db7c', '#38d9a9', '#4dabf7', '#748ffc',
  '#da77f2', '#f783ac', '#ff8787', '#ffc078',
  '#ffe066', '#c0eb75', '#63e6be', '#74c0fc',
  '#9775fa', '#f783ac', '#ff6b6b', '#ffa94d',
]

const finaleWords = ['Chung sức', 'Đồng lòng', 'Nhân dân', 'Đại đoàn kết']

const lotusPetals = [
  { id: 'outer-left', angle: -62, scale: 1.08, size: 'L', grad: 'unityPetalOuter', drawOrder: 0 },
  { id: 'outer-mid-left', angle: -34, scale: 1.16, size: 'L', grad: 'unityPetalBlue', drawOrder: 1 },
  { id: 'outer-center', angle: 0, scale: 1.24, size: 'L', grad: 'unityPetalGold', drawOrder: 2 },
  { id: 'outer-mid-right', angle: 34, scale: 1.16, size: 'L', grad: 'unityPetalBlue', drawOrder: 3 },
  { id: 'outer-right', angle: 62, scale: 1.08, size: 'L', grad: 'unityPetalOuter', drawOrder: 4 },
  { id: 'middle-left', angle: -42, scale: 0.96, size: 'M', grad: 'unityPetalEmerald', drawOrder: 5 },
  { id: 'middle-cl', angle: -14, scale: 1.08, size: 'M', grad: 'unityPetalInner', drawOrder: 6 },
  { id: 'middle-cr', angle: 14, scale: 1.08, size: 'M', grad: 'unityPetalInner', drawOrder: 7 },
  { id: 'middle-right', angle: 42, scale: 0.96, size: 'M', grad: 'unityPetalEmerald', drawOrder: 8 },
  { id: 'inner-left', angle: -18, scale: 0.82, size: 'S', grad: 'unityPetalInner', drawOrder: 9 },
  { id: 'inner-center', angle: 0, scale: 0.92, size: 'S', grad: 'unityPetalGold', drawOrder: 10 },
  { id: 'inner-right', angle: 18, scale: 0.82, size: 'S', grad: 'unityPetalInner', drawOrder: 11 },
]

function getPathData(size) {
  if (size === 'L') return 'M0,0 C-50,-58 -31,-142 0,-174 C31,-142 50,-58 0,0'
  if (size === 'M') return 'M0,0 C-36,-44 -22,-112 0,-134 C22,-112 36,-44 0,0'
  return 'M0,0 C-25,-30 -16,-82 0,-98 C16,-82 25,-30 0,0'
}

function edgeId(a, b) {
  return [a, b].sort((x, y) => x - y).join('-')
}

function seededRatio(index, salt = 1) {
  const value = Math.sin(index * 82.917 + salt * 31.415) * 10000
  return value - Math.floor(value)
}

function curvedPath(start, end, strength = 0.12) {
  // Center is (210, 210)
  if (start.id === 8 || end.id === 8) {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const vx = midX - 210;
  const vy = midY - 210;
  const dist = Math.hypot(vx, vy);

  // Checks if both node ids are part of the outer perimeter
  const isOuter =
    start.id !== undefined &&
    end.id !== undefined &&
    ((start.id < 8 && end.id < 8) || (start.id === 0 && end.id === 7) || (start.id === 7 && end.id === 0));

  if (isOuter && dist > 0) {
    // If it is the bottom base of the lotus, curve inwards to represent the stem/base
    const isBottomBase =
      (start.id === 4 && (end.id === 5 || end.id === 3)) ||
      (end.id === 4 && (start.id === 5 || start.id === 3));

    const bend = 24;
    const directionSign = isBottomBase ? -1 : 1;
    const controlX = midX + (vx / dist) * bend * directionSign;
    const controlY = midY + (vy / dist) * bend * directionSign;
    return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
  }

  // Draw straight lines for inner geometric links
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
}

export default function ConnectFragments({ onWin }) {
  const [edges, setEdges]             = useState([])
  const [drag, setDrag]               = useState(null)
  const [won, setWon]                 = useState(false)
  const [showFinale, setShowFinale]   = useState(false)
  const [edgeParticles, setEdgeParticles] = useState([])
  const svgRef = useRef(null)
  const wonRef = useRef(false)
  const particleSeqRef = useRef(0)

  // Ambient particles with rainbow colors
  const ambientParticles = useMemo(() =>
    Array.from({ length: 40 }).map((_, index) => ({
      id:       index,
      left:     5 + seededRatio(index, 1) * 90,
      top:      8 + seededRatio(index, 2) * 84,
      size:     2.5 + seededRatio(index, 3) * 5,
      delay:    seededRatio(index, 4) * 5,
      duration: 4.5 + seededRatio(index, 5) * 5.5,
      drift:    -40 + seededRatio(index, 6) * 80,
      hue:      Math.round(seededRatio(index, 77) * 360),
    })), [])

  const progress = (edges.length / targetEdges.length) * 100

  const spawnEdgeParticles = (x, y, edgeIndex) => {
    const hue = (edgeIndex * 18) % 360
    const burstId = particleSeqRef.current += 1
    const particles = Array.from({ length: 12 }).map((_, index) => ({
      id:    `${burstId}-${edgeIndex}-${index}`,
      x, y,
      tx:    -96 + seededRatio(index, edgeIndex + 21) * 192,
      ty:    -96 + seededRatio(index, edgeIndex + 35) * 192,
      delay: seededRatio(index, edgeIndex + 49) * 0.22,
      hue:   (hue + seededRatio(index, edgeIndex + 60) * 60) % 360,
    }))
    setEdgeParticles(current => [...current, ...particles].slice(-60))
  }

  const complete = useCallback(() => {
    wonRef.current = true
    setWon(true)
    setShowFinale(true)
    window.setTimeout(onWin, 14000)
  }, [onWin])

  useEffect(() => {
    if (!drag || won) return undefined

    const move = (event) => {
      const rect = svgRef.current.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 420
      const y = ((event.clientY - rect.top) / rect.height) * 420

      // Find if there is a close valid target node within SNAP_RADIUS
      const availableTargets = unityNodes
        .filter(node => {
          if (node.id === drag.start.id) return false
          const id = edgeId(drag.start.id, node.id)
          return targetEdges.includes(id) && !edges.includes(id)
        })
        .map(node => ({ ...node, distance: Math.hypot(node.x - x, node.y - y) }))
        .sort((a, b) => a.distance - b.distance)

      const closest = availableTargets[0]
      if (closest && closest.distance < SNAP_RADIUS) {
        setDrag(current => ({
          ...current,
          x: closest.x,
          y: closest.y,
          snappedNodeId: closest.id
        }))
      } else {
        setDrag(current => ({
          ...current,
          x: x,
          y: y,
          snappedNodeId: null
        }))
      }
    }

    const up = () => {
      if (drag.snappedNodeId !== null && drag.snappedNodeId !== undefined) {
        const end = unityNodes.find(n => n.id === drag.snappedNodeId)
        if (end) {
          const id = edgeId(drag.start.id, end.id)
          if (targetEdges.includes(id) && !edges.includes(id)) {
            const next = [...edges, id]
            const edgeIndex = targetEdges.indexOf(id)
            setEdges(next)
            spawnEdgeParticles((drag.start.x + end.x) / 2, (drag.start.y + end.y) / 2, edgeIndex)
            if (next.length === targetEdges.length) {
              window.setTimeout(complete, 600)
            }
          }
        }
      }
      setDrag(null)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [complete, drag, edges, won])

  return (
    <div className={`minigame-connect ${showFinale ? 'is-final-scene' : ''}`}>
      {ambientParticles.map(particle => (
        <i
          key={particle.id}
          className="unity-ambient-particle"
          style={{
            left:              `${particle.left}%`,
            top:               `${particle.top}%`,
            width:             `${particle.size}px`,
            '--drift':         `${particle.drift}px`,
            '--hue':           particle.hue,
            animationDelay:    `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      <p className="minigame-instruction">
        {won
          ? 'Mạng lưới đoàn kết đã sáng lên — sức mạnh lớn nhất bắt đầu từ lòng dân.'
          : `Kéo nối các điểm sáng dựng mạng đại đoàn kết. (${edges.length}/${targetEdges.length})`}
      </p>

      <div className={`unity-stage ${won ? 'is-won' : ''}`}>
        <div className="unity-stage-aura" />
        <div className="unity-stage-ring" />
        <div className="unity-stage-ring unity-stage-ring--2" />

        {edgeParticles.map(particle => (
          <i
            key={particle.id}
            className="unity-edge-particle"
            style={{
              left:    `${(particle.x / 420) * 100}%`,
              top:     `${(particle.y / 420) * 100}%`,
              '--tx':  `${particle.tx}px`,
              '--ty':  `${particle.ty}px`,
              '--hue': particle.hue,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        <svg ref={svgRef} viewBox="0 0 420 420" className="unity-svg">
          <defs>
            <radialGradient id="unityCoreGradient">
              <stop offset="0%"   stopColor="#ffffff" />
              <stop offset="38%"  stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f97316" />
            </radialGradient>
            <linearGradient id="unityPetalOuter" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="58%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
            <linearGradient id="unityPetalBlue" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#172554" />
              <stop offset="46%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="unityPetalEmerald" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="48%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
            <linearGradient id="unityPetalInner" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="42%" stopColor="#a7f3d0" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="unityPetalGold" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="unityBoardLotusGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <filter id="unityGlow" filterUnits="userSpaceOnUse" x="-80" y="-80" width="580" height="580">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="unityStrongGlow" filterUnits="userSpaceOnUse" x="-80" y="-80" width="580" height="580">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glowing light lotus in the background, visible/blooming when won (rendered outside the board group so it persists) */}
          <g className={`unity-light-lotus ${won ? 'is-blooming' : ''}`}>
            {/* Radiant light rays behind the lotus */}
            <g className="lotus-rays">
              <line x1="210" y1="280" x2="210" y2="40" className="lotus-ray" />
              <line x1="210" y1="280" x2="120" y2="70" className="lotus-ray" />
              <line x1="210" y1="280" x2="300" y2="70" className="lotus-ray" />
              <line x1="210" y1="280" x2="50" y2="130" className="lotus-ray" />
              <line x1="210" y1="280" x2="370" y2="130" className="lotus-ray" />
            </g>

            {lotusPetals.map((petal) => (
              <path
                key={`finale-petal-${petal.id}`}
                d={getPathData(petal.size)}
                transform={`translate(210, 280) rotate(${petal.angle}) scale(${petal.scale})`}
                fill={`url(#${petal.grad})`}
                fillOpacity="0.95"
                stroke={`url(#${petal.grad})`}
                strokeWidth="1.5"
                className={`lotus-petal ${petal.id}`}
              />
            ))}
          </g>

          {/* Group wrapper to rotate and scale the entire lotus board when won */}
          <g className={`unity-lotus-flower-board ${won ? 'is-spinning-won' : ''}`}>
            <g className="unity-orbital-frame">
              {/* Single outer circle to frame the space without overlapping */}
              <circle cx="210" cy="210" r="196" />
            </g>

            {/* Network flower fill (glows up and fills when won, rotates and fades out with the board) */}
            {won && (
              <g className="unity-board-lotus-fill">
                {lotusPetals.map((petal) => (
                  <path
                    key={`board-fill-${petal.id}`}
                    d={getPathData(petal.size)}
                    transform={`translate(210, 280) rotate(${petal.angle}) scale(${petal.scale * 0.72})`}
                    fill={`url(#${petal.grad})`}
                    className="board-petal-fill"
                  />
                ))}
              </g>
            )}

            {/* Guide lines */}
            {targetEdges.map(edge => {
              if (edges.includes(edge)) return null
              const [a, b] = edge.split('-').map(Number)
              return <path key={`guide-${edge}`} d={curvedPath(unityNodes[a], unityNodes[b])} className="unity-guide-line" />
            })}

            {/* Locked edges — monochromatic light path */}
            {edges.map((edge) => {
              const [a, b] = edge.split('-').map(Number)
              const n1 = unityNodes[a]
              const n2 = unityNodes[b]
              return (
                <g key={`locked-${edge}`} className="unity-locked-edge">
                  <path d={curvedPath(n1, n2)} className="unity-locked-line-bg" filter="url(#unityStrongGlow)" />
                  <path d={curvedPath(n1, n2)} className="unity-locked-line" filter="url(#unityGlow)" />
                </g>
              )
            })}

            {/* Active drag line */}
            {drag && (
              <g>
                <path
                  d={curvedPath(drag.start, { x: drag.x, y: drag.y }, 0.08)}
                  className="unity-active-line-glow"
                  filter="url(#unityStrongGlow)"
                />
                <path
                  d={curvedPath(drag.start, { x: drag.x, y: drag.y }, 0.08)}
                  className="unity-active-line"
                  filter="url(#unityGlow)"
                />
              </g>
            )}

            {/* Nodes */}
            {unityNodes.map(node => {
              const nodeEdges = targetEdges.filter(edge => edge.split('-').map(Number).includes(node.id))
              const completedCount = nodeEdges.filter(edge => edges.includes(edge)).length
              const isLit = completedCount > 0 || node.core
              const completionRatio = nodeEdges.length > 0 ? completedCount / nodeEdges.length : 0
              const isSnapped = drag && drag.snappedNodeId === node.id

              return (
                <g
                  key={node.id}
                  className={`unity-node-group ${node.core ? 'is-core' : ''} ${isLit ? 'is-lit' : ''} ${completionRatio >= 1 ? 'is-full' : ''} ${isSnapped ? 'is-snapped' : ''}`}
                  transform={`translate(${node.x}, ${node.y})`}
                  onPointerDown={() => { if (!wonRef.current) setDrag({ start: node, x: node.x, y: node.y, snappedNodeId: null }) }}
                >
                  <circle r={node.core ? 36 : 26} className="unity-node-hitbox" />
                  <circle r={node.core ? 20 : 13} className="unity-node-halo" />
                  
                  {/* Concentric Telemetry Rings */}
                  {isLit && (
                    <>
                      <circle r={node.core ? 15 : 9} className="unity-node-telemetry-inner" />
                      <circle r={node.core ? 17 : 11} className="unity-node-telemetry-outer" />
                    </>
                  )}
                  
                  <circle r={node.core ? 10 : 5.5} className="unity-node-core" filter="url(#unityGlow)" />
                  <text y={node.core ? 28 : 20}>{node.label}</text>
                </g>
              )
            })}
          </g>
        </svg>

        <div className="unity-progress-notes">
          <span>{edges.length}/{targetEdges.length} liên kết</span>
          <strong>{Math.round(progress)}%</strong>
        </div>
      </div>

      {/* ══════════════ EPIC CHROMATIC FINALE ══════════════ */}
      {showFinale && (
        <div className="unity-finale" aria-live="polite">
          {/* L1: Dark → blur background */}
          <div className="unity-finale-bg" />

          {/* L10: Message card */}
          <div className="unity-message-card">
            <div className="unity-message-badge">
              <span className="unity-badge-dot" />
              <em>Đại đoàn kết · Hành tinh đã mở khóa</em>
            </div>
            <h3>ĐẠI<br />ĐOÀN KẾT</h3>
            <blockquote>
              "Đoàn kết, đoàn kết, đại đoàn kết.<br />
              Thành công, thành công, <strong>đại thành công</strong>."
            </blockquote>
            <p>
              Một điểm sáng thì đẹp. Muôn điểm sáng chung hướng
              thì thành sức mạnh dân tộc không gì lay chuyển được.
            </p>
          </div>
        </div>
      )}

      <div className="minigame-progress">
        <div className="minigame-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
