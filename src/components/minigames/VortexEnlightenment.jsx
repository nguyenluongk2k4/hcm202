import { useMemo, useState } from 'react'
import './VortexEnlightenment.css'

const sources = [
  {
    id: 'yeu-nuoc',
    title: 'Chủ nghĩa yêu nước Việt Nam',
    short: 'Yêu nước',
    color: '#ffd45a',
    start: { x: 11, y: 27 },
    nodes: [
      { id: 'yeu-nuoc-1', x: 28, y: 24, correct: 90, label: 'Yêu nước thương dân' },
      { id: 'yeu-nuoc-2', x: 39, y: 36, correct: 0, label: 'Khát vọng độc lập', labelPosition: 'top' },
    ],
    segments: [
      'M 11 27 C 17 21, 22 20, 28 24',
      'M 28 24 C 33 25, 36 31, 39 36',
      'M 39 36 C 43 40, 46 45, 50 49',
    ],
  },
  {
    id: 'mac-lenin',
    title: 'Chủ nghĩa Mác - Lênin',
    short: 'Mác - Lênin',
    color: '#ff6f91',
    start: { x: 14, y: 78 },
    nodes: [
      { id: 'mac-lenin-1', x: 29, y: 70, correct: 270, label: 'Lý luận giải phóng', labelPosition: 'top' },
      { id: 'mac-lenin-2', x: 39, y: 62, correct: 180, label: 'Giải phóng con người' },
    ],
    segments: [
      'M 14 78 C 19 73, 24 72, 29 70',
      'M 29 70 C 33 69, 36 65, 39 62',
      'M 39 62 C 43 57, 46 53, 50 49',
    ],
  },
  {
    id: 'tinh-hoa',
    title: 'Tinh hoa văn hóa nhân loại',
    short: 'Tinh hoa',
    color: '#6ee7ff',
    start: { x: 89, y: 35 },
    nodes: [
      { id: 'tinh-hoa-1', x: 74, y: 32, correct: 180, label: 'Chọn lọc tinh hoa', labelPosition: 'top' },
      { id: 'tinh-hoa-2', x: 63, y: 40, correct: 90, label: 'Tự do - bình đẳng', labelPosition: 'top' },
    ],
    segments: [
      'M 89 35 C 84 30, 79 29, 74 32',
      'M 74 32 C 69 33, 66 36, 63 40',
      'M 63 40 C 59 43, 55 46, 50 49',
    ],
  },
]

const allNodes = sources.flatMap((source) =>
  source.nodes.map((node) => ({ ...node, sourceId: source.id })),
)

const finaleWords = ['Yêu nước', 'Mác - Lênin', 'Tinh hoa', 'Hội tụ', 'Giải phóng']

const finaleStatements = [
  'Từ lòng yêu nước Việt Nam',
  'qua tinh hoa văn hóa nhân loại',
  'đến ánh sáng Mác - Lênin',
]

function initialRotation(node, index) {
  return (node.correct + (index % 3 === 0 ? 180 : index % 3 === 1 ? 90 : 270)) % 360
}

function seededRatio(index, salt = 0) {
  const value = Math.sin(index * 41.37 + salt * 23.91) * 10000
  return value - Math.floor(value)
}

export default function VortexEnlightenment({ onWin, onSolved }) {
  const [rotations, setRotations] = useState(() =>
    Object.fromEntries(allNodes.map((node, index) => [node.id, initialRotation(node, index)])),
  )
  const [won, setWon] = useState(false)
  const [showFinale, setShowFinale] = useState(false)

  const stars = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => ({
        id: index,
        left: `${5 + seededRatio(index, 1) * 90}%`,
        top: `${5 + seededRatio(index, 3) * 84}%`,
        size: 1.4 + seededRatio(index, 6) * 4,
        delay: `${seededRatio(index, 9) * 5}s`,
        duration: `${4 + seededRatio(index, 12) * 7}s`,
      })),
    [],
  )

  const isNodeSolved = (node, nextRotations = rotations) => nextRotations[node.id] === node.correct

  const getFlowLevel = (source, nextRotations = rotations) => {
    let level = 0

    for (const node of source.nodes) {
      if (isNodeSolved(node, nextRotations)) {
        level += 1
      } else {
        break
      }
    }

    return level
  }

  const isSourceSolved = (source, nextRotations = rotations) =>
    getFlowLevel(source, nextRotations) === source.nodes.length

  const solvedCount = allNodes.filter((node) => isNodeSolved(node)).length
  const solvedSources = sources.filter((source) => isSourceSolved(source))
  const completedSources = solvedSources.length
  const coreColor = solvedSources[solvedSources.length - 1]?.color || '#6ee7ff'
  const progress = won ? 100 : (solvedCount / allNodes.length) * 100

  const rotateNode = (node) => {
    if (won || isNodeSolved(node)) return

    setRotations((current) => {
      const next = { ...current, [node.id]: (current[node.id] + 90) % 360 }
      const solvedAfterClick = allNodes.every((item) => next[item.id] === item.correct)

      if (solvedAfterClick) {
        onSolved?.()
        setWon(true)
        setTimeout(() => setShowFinale(true), 760)
        setTimeout(() => onWin(), 9200)
      }

      return next
    })
  }

  return (
    <div className={`minigame-vortex ${showFinale ? 'is-final-scene' : ''}`}>
      <p className="minigame-instruction">
        {won
          ? 'Ba dòng suối ánh sáng đã gặp nhau, làm sáng lõi Tư tưởng Hồ Chí Minh.'
          : 'Bấm xoay từng van để mở đường cho ba dòng suối ánh sáng chảy về trung tâm.'}
      </p>

      <div className={`origin-stage core-level-${completedSources} ${won ? 'is-won' : ''}`}>
        {stars.map((star) => (
          <span
            key={star.id}
            className="origin-star"
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

        <div className="origin-aurora" aria-hidden="true" />
        <div className="origin-map-lines" aria-hidden="true" />
        <div className="origin-horizon" aria-hidden="true" />

        <svg className="origin-flow-map" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            {sources.map((source) => (
              <linearGradient key={source.id} id={`originRiver-${source.id}`} x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor={source.color} stopOpacity="0.08" />
                <stop offset="45%" stopColor={source.color} stopOpacity="0.96" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>
            ))}
            <filter id="originRiverGlow">
              <feGaussianBlur stdDeviation="1.1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {sources.map((source) => (
            <g key={`${source.id}-bed`}>
              {source.segments.map((path, index) => (
                <path key={`${source.id}-bed-${index}`} className="origin-stream-bed" d={path} />
              ))}
            </g>
          ))}

          {sources.map((source) => {
            const flowLevel = getFlowLevel(source)

            return (
              <g key={`${source.id}-flow`} style={{ '--source-color': source.color }}>
                {source.segments.map((path, index) => {
                  const isActive = index <= flowLevel

                  return (
                    <g key={`${source.id}-segment-${index}`} className={isActive ? 'is-active' : ''}>
                      {isActive && <path className="origin-stream-glow" d={path} stroke={source.color} />}
                      <path
                        className={`origin-stream-current ${isActive ? 'is-active' : ''}`}
                        d={path}
                        stroke={`url(#originRiver-${source.id})`}
                      />
                      {isActive && (
                        <>
                          <circle className="origin-stream-drop" r="0.52" fill={source.color}>
                            <animateMotion dur="1.75s" repeatCount="indefinite" path={path} />
                          </circle>
                          <circle className="origin-stream-drop origin-stream-drop--late" r="0.36" fill="#ffffff">
                            <animateMotion dur="1.75s" begin="0.7s" repeatCount="indefinite" path={path} />
                          </circle>
                        </>
                      )}
                    </g>
                  )
                })}
              </g>
            )
          })}
        </svg>

        <div className="origin-core" style={{ '--core-primary': coreColor }} aria-hidden="true">
          <span className="origin-core-aura" />
          <span className="origin-core-rings" />
          <span className="origin-core-prism" />
          <strong>Tư tưởng<br />Hồ Chí Minh</strong>
          <span className="origin-core-progress">{completedSources}/3 dòng</span>
        </div>

        {sources.map((source) => {
          const flowLevel = getFlowLevel(source)
          const sourceSolved = isSourceSolved(source)
          const blockedNode = source.nodes[flowLevel]

          return (
            <div key={source.id} className="origin-source-group" style={{ '--source-color': source.color }}>
              <div
                className={`origin-source-well ${sourceSolved ? 'is-complete' : ''}`}
                style={{ left: `${source.start.x}%`, top: `${source.start.y}%` }}
              >
                <span />
                <b>{source.short}</b>
              </div>
              <div
                className="origin-source-title"
                style={{ left: `${source.start.x}%`, top: `${source.start.y + 10}%` }}
              >
                {source.title}
              </div>

              {blockedNode && (
                <span
                  className="origin-blocked-pulse"
                  style={{ left: `${blockedNode.x}%`, top: `${blockedNode.y}%` }}
                />
              )}

              {source.nodes.map((node) => {
                const nodeSolved = isNodeSolved(node)
                return (
                  <button
                    key={node.id}
                    type="button"
                    className={`origin-valve origin-valve--label-${node.labelPosition || 'bottom'} ${nodeSolved ? 'is-correct' : ''}`}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      '--source-color': source.color,
                      '--angle': `${rotations[node.id]}deg`,
                    }}
                    onClick={() => rotateNode(node)}
                    aria-label={`Xoay van ${node.label}`}
                  >
                    <span className="origin-valve-orbit" />
                    <span className="origin-valve-channel" />
                    <span className="origin-knowledge-chip">
                      <small>Mảnh kiến thức</small>
                      <b>{node.label}</b>
                    </span>
                  </button>
                )
              })}
            </div>
          )
        })}

        <div className="origin-guide">
          {sources.map((source) => (
            <span
              key={source.id}
              className={isSourceSolved(source) ? 'is-lit' : ''}
              style={{ '--source-color': source.color }}
            >
              {source.short}
            </span>
          ))}
        </div>

        <div className="origin-river-panel" aria-hidden="true">
          {sources.map((source, index) => (
            <span
              key={source.id}
              className={isSourceSolved(source) ? 'is-complete' : ''}
              style={{ '--source-color': source.color }}
            >
              <i />
              <b>{index + 1}</b>
              {source.title}
            </span>
          ))}
        </div>
      </div>

      <div className="origin-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      {showFinale && (
        <div className="origin-finale" aria-hidden="true">
          <div className="origin-finale-light" />
          <div className="origin-finale-vortex" />
          <div className="origin-finale-prism" />
          <div className="origin-finale-source-lines">
            {sources.map((source, index) => (
              <span key={source.id} style={{ '--source-color': source.color, '--index': index }} />
            ))}
          </div>
          <div className="origin-finale-orbits">
            {sources.map((source, index) => (
              <span key={source.id} style={{ '--index': index, '--source-color': source.color }}>
                {source.short}
              </span>
            ))}
          </div>
          <div className="origin-finale-words">
            {finaleWords.map((word, index) => (
              <i key={word} style={{ '--delay': `${index * 0.13}s` }}>
                {word}
              </i>
            ))}
          </div>
          <div className="origin-finale-statements">
            {finaleStatements.map((text, index) => (
              <strong key={text} style={{ '--delay': `${1.05 + index * 0.24}s` }}>
                {text}
              </strong>
            ))}
          </div>
          <div className="origin-message-card">
            <span>Hành tinh đã mở khóa</span>
            <h3>NGUỒN GỐC TƯ TƯỞNG</h3>
            <strong>Tư tưởng Hồ Chí Minh là sự kết hợp hài hòa giữa chủ nghĩa yêu nước Việt Nam, chủ nghĩa Mác - Lênin và tinh hoa văn hóa nhân loại.</strong>
            <p>Ba dòng suối hội tụ thành ánh sáng trung tâm: từ lòng yêu nước, qua tiếp thu có chọn lọc những giá trị tiến bộ, đến con đường giải phóng dân tộc, giải phóng giai cấp và giải phóng con người.</p>
          </div>
        </div>
      )}
    </div>
  )
}
