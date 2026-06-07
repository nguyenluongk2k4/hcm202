import { useMemo, useRef, useState } from 'react'
import './VortexEnlightenment.css'

const CORE = { x: 50, y: 44 }

const sources = [
  {
    id: 'yeu-nuoc',
    title: 'Chủ nghĩa yêu nước Việt Nam',
    short: 'Yêu nước',
    color: '#f8c24d',
    start: { x: 11, y: 56 },
    filters: [
      { id: 'ca-nhan', label: 'Danh vọng cá nhân', x: 29, y: 32 },
      { id: 'thuong-dan', label: 'Yêu nước thương dân', x: 29, y: 48 },
      { id: 'dung-ngoai', label: 'Đứng ngoài thời cuộc', x: 29, y: 64 },
    ],
    correct: 'thuong-dan',
  },
  {
    id: 'tinh-hoa',
    title: 'Tinh hoa văn hóa nhân loại',
    short: 'Tinh hoa',
    color: '#67e8f9',
    start: { x: 89, y: 56 },
    filters: [
      { id: 'sao-chep', label: 'Sao chép nguyên xi', x: 71, y: 32 },
      { id: 'chon-loc', label: 'Chọn lọc giá trị tiến bộ', x: 71, y: 48 },
      { id: 'dong-kin', label: 'Khép kín tri thức', x: 71, y: 64 },
    ],
    correct: 'chon-loc',
  },
  {
    id: 'mac-lenin',
    title: 'Chủ nghĩa Mác - Lênin',
    short: 'Mác - Lênin',
    color: '#fb7185',
    start: { x: 50, y: 88 },
    filters: [
      { id: 'ly-luan', label: 'Lý luận giải phóng', x: 36, y: 71 },
      { id: 'khau-hieu', label: 'Học thuộc khẩu hiệu', x: 50, y: 74 },
      { id: 'tach-roi', label: 'Tách khỏi thực tiễn', x: 64, y: 71 },
    ],
    correct: 'ly-luan',
  },
]

const finaleWords = ['Yêu nước', 'Chọn lọc', 'Lý luận', 'Thực tiễn', 'Giải phóng']

const finaleStatements = [
  'Từ lòng yêu nước',
  'qua chọn lọc tinh hoa',
  'đến lý luận giải phóng',
]

function seededRatio(index, salt = 0) {
  const value = Math.sin(index * 41.37 + salt * 23.91) * 10000
  return value - Math.floor(value)
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function beamPath(start, mid, end = CORE) {
  const c1x = (start.x + mid.x) / 2
  const c1y = start.y - 7
  const c2x = (mid.x + end.x) / 2
  const c2y = mid.y - 4
  return `M ${start.x} ${start.y} Q ${c1x} ${c1y} ${mid.x} ${mid.y} Q ${c2x} ${c2y} ${end.x} ${end.y}`
}

export default function VortexEnlightenment({ onWin }) {
  const stageRef = useRef(null)
  const missIdRef = useRef(0)
  const lockIdRef = useRef(0)
  const [locked, setLocked] = useState([])
  const [dragging, setDragging] = useState(null)
  const [miss, setMiss] = useState(null)
  const [lockBursts, setLockBursts] = useState([])
  const [won, setWon] = useState(false)
  const [showFinale, setShowFinale] = useState(false)

  const stars = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        id: index,
        left: `${5 + seededRatio(index, 1) * 90}%`,
        top: `${4 + seededRatio(index, 3) * 88}%`,
        size: 1.5 + seededRatio(index, 6) * 4,
        delay: `${seededRatio(index, 9) * 5}s`,
        duration: `${4 + seededRatio(index, 12) * 7}s`,
      })),
    [],
  )

  const pointFromEvent = (event) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return { x: 50, y: 50 }
    return {
      x: Math.max(4, Math.min(96, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(6, Math.min(94, ((event.clientY - rect.top) / rect.height) * 100)),
    }
  }

  const getNearestGate = (source, point) => {
    const nearest = source.filters
      .map((filter) => ({ ...filter, distance: distance(point, filter) }))
      .sort((a, b) => a.distance - b.distance)[0]

    if (!nearest || nearest.distance > 14) return null
    return {
      id: nearest.id,
      isCorrect: nearest.id === source.correct,
      point: nearest,
    }
  }

  const startDrag = (event, index) => {
    if (won || locked.includes(sources[index].id)) return
    event.preventDefault()
    setDragging({ index, point: pointFromEvent(event), candidate: null })
  }

  const moveDrag = (event) => {
    if (!dragging) return
    const point = pointFromEvent(event)
    setDragging((current) => {
      if (!current) return current
      const source = sources[current.index]
      return { ...current, point, candidate: getNearestGate(source, point) }
    })
  }

  const endDrag = (event) => {
    if (!dragging) return

    const source = sources[dragging.index]
    const releasePoint = pointFromEvent(event)
    const correctGate = source.filters.find((filter) => filter.id === source.correct)
    const nearestGate = getNearestGate(source, releasePoint)
    const passedCorrectGate = correctGate && nearestGate?.isCorrect

    if (passedCorrectGate) {
      const nextLocked = [...locked, source.id]
      const burst = {
        id: `${source.id}-${lockIdRef.current += 1}`,
        sourceId: source.id,
        color: source.color,
        x: correctGate.x,
        y: correctGate.y,
      }
      setLocked(nextLocked)
      setLockBursts((items) => [...items.slice(-5), burst])
      setDragging(null)
      setTimeout(() => {
        setLockBursts((items) => items.filter((item) => item.id !== burst.id))
      }, 1300)

      if (nextLocked.length === sources.length) {
        setWon(true)
        setTimeout(() => setShowFinale(true), 760)
        setTimeout(() => onWin(), 9200)
      }
      return
    }

    setMiss({
      id: `${source.id}-${missIdRef.current += 1}`,
      sourceId: source.id,
      point: nearestGate?.point || releasePoint,
      gateId: nearestGate?.id || null,
    })
    setDragging(null)
  }

  const progress = won ? 100 : (locked.length / sources.length) * 100

  return (
    <div className={`minigame-vortex ${showFinale ? 'is-final-scene' : ''}`}>
      <p className="minigame-instruction">
        {won
          ? 'Ba nguồn sáng đã đi qua chọn lọc và hội tụ thành con đường tư tưởng.'
          : 'Kéo từng lõi sáng qua bộ lọc đúng để hội tụ vào lăng kính trung tâm.'}
      </p>

      <div
        ref={stageRef}
        className={`origin-stage ${won ? 'is-won' : ''}`}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={() => setDragging(null)}
      >
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
        <div className="origin-nebula" aria-hidden="true" />
        <div className="origin-depth-grid" aria-hidden="true" />
        <div className="origin-prism-floor" aria-hidden="true" />
        <div className="origin-scan-sweep" aria-hidden="true" />

        <svg className="origin-beams" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            {sources.map((source) => (
              <linearGradient key={source.id} id={`originDragBeam-${source.id}`} x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor={source.color} stopOpacity="0" />
                <stop offset="45%" stopColor={source.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.92" />
              </linearGradient>
            ))}
            <filter id="originBeamGlow">
              <feGaussianBlur stdDeviation="0.9" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {sources.map((source, sourceIndex) => (
            <g key={`${source.id}-filter-rays`} className="origin-filter-rays">
              {source.filters.map((filter) => {
                const isCorrect = filter.id === source.correct
                const isLocked = locked.includes(source.id)
                const isCandidate = dragging?.index === sourceIndex && dragging?.candidate?.id === filter.id
                return (
                  <path
                    key={filter.id}
                    className={`${isCorrect ? 'is-correct-route' : 'is-decoy-route'} ${isLocked && isCorrect ? 'is-locked-route' : ''} ${isCandidate ? 'is-candidate-route' : ''}`}
                    d={beamPath(source.start, filter)}
                    stroke={`url(#originDragBeam-${source.id})`}
                  />
                )
              })}
            </g>
          ))}

          {sources.map((source) => {
            const lockedGate = source.filters.find((filter) => filter.id === source.correct)
            const isLocked = locked.includes(source.id)
            return (
              <path
                key={source.id}
                className={`origin-beam ${isLocked ? 'is-locked' : ''}`}
                d={beamPath(source.start, lockedGate)}
                stroke={`url(#originDragBeam-${source.id})`}
              />
            )
          })}

          {dragging && (
            <path
              className="origin-drag-beam"
              d={`M ${sources[dragging.index].start.x} ${sources[dragging.index].start.y} Q ${(sources[dragging.index].start.x + dragging.point.x) / 2} ${dragging.point.y - 10} ${dragging.point.x} ${dragging.point.y}`}
              stroke={`url(#originDragBeam-${sources[dragging.index].id})`}
            />
          )}
        </svg>

        <div className="origin-core" aria-hidden="true">
          <span className="origin-core-aura" />
          <span className="origin-core-rays">
            <i /><i /><i />
          </span>
          <span className="origin-core-prism" />
          <strong>Tư tưởng<br />Hồ Chí Minh</strong>
        </div>

        {sources.map((source, sourceIndex) => {
          const isLocked = locked.includes(source.id)
          return (
            <div key={source.id} className="origin-source-group" style={{ '--source-color': source.color }}>
              <button
                type="button"
                className={`origin-source-orb ${isLocked ? 'is-locked' : ''} ${dragging?.index === sourceIndex ? 'is-dragging' : ''}`}
                style={{ left: `${source.start.x}%`, top: `${source.start.y}%` }}
                onPointerDown={(event) => startDrag(event, sourceIndex)}
              >
                <span />
                <b>{source.short}</b>
              </button>

              <div className="origin-source-title" style={{ left: `${source.start.x}%`, top: `${source.start.y + 10}%` }}>
                {source.title}
              </div>

              {source.filters.map((filter) => {
                const isCorrect = filter.id === source.correct
                const isCandidate = dragging?.index === sourceIndex && dragging?.candidate?.id === filter.id
                const missedThisGate = miss?.sourceId === source.id && miss?.gateId === filter.id
                return (
                  <div
                    key={filter.id}
                    className={[
                      'origin-filter-gate',
                      isLocked && isCorrect ? 'is-active' : '',
                      isCandidate ? 'is-candidate' : '',
                      isCandidate && isCorrect ? 'is-correct-candidate' : '',
                      isCandidate && !isCorrect ? 'is-wrong-candidate' : '',
                      missedThisGate ? 'is-rejected' : '',
                    ].join(' ')}
                    style={{ left: `${filter.x}%`, top: `${filter.y}%` }}
                  >
                    <i />
                    <span>{filter.label}</span>
                  </div>
                )
              })}
            </div>
          )
        })}

        {dragging && (
          <div
            className="origin-drag-orb"
            style={{
              left: `${dragging.point.x}%`,
              top: `${dragging.point.y}%`,
              '--source-color': sources[dragging.index].color,
            }}
          />
        )}

        {miss && (
          <span
            key={miss.id}
            className="origin-miss-pulse"
            style={{
              left: `${miss.point.x}%`,
              top: `${miss.point.y}%`,
              '--source-color': sources.find((source) => source.id === miss.sourceId)?.color,
            }}
          />
        )}

        {lockBursts.map((burst) => (
          <span
            key={burst.id}
            className="origin-lock-burst"
            style={{ left: `${burst.x}%`, top: `${burst.y}%`, '--source-color': burst.color }}
          >
            <i /><i /><i /><i /><i /><i />
          </span>
        ))}

        <div className="origin-guide">
          {sources.map((source) => (
            <span key={source.id} className={locked.includes(source.id) ? 'is-lit' : ''}>
              {source.short}
            </span>
          ))}
        </div>
        <div className="origin-ritual-panel" aria-hidden="true">
          {sources.map((source, index) => (
            <span
              key={source.id}
              className={locked.includes(source.id) ? 'is-complete' : dragging?.index === index ? 'is-active' : ''}
              style={{ '--source-color': source.color }}
            >
              <i />
              <b>{index + 1}</b>
              {source.short}
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
            <strong>Tư tưởng lớn không sinh ra từ một tia sáng đơn lẻ, mà từ khả năng chọn lọc và biến tri thức thành con đường cứu nước.</strong>
            <p>Từ lòng yêu nước, tiếp thu tinh hoa nhân loại và lý luận cách mạng, ánh sáng đúng nhất là ánh sáng soi được hành động vì con người.</p>
          </div>
        </div>
      )}
    </div>
  )
}
