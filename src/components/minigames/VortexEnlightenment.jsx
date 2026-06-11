import { useEffect, useMemo, useState } from 'react'
import originFinaleImage from '../../assets/nguon_goc_tu_tuong.png'
import './VortexEnlightenment.css'

const sources = [
  {
    id: 'yeu-nuoc',
    title: 'Chủ nghĩa yêu nước Việt Nam',
    short: 'Yêu nước',
    accent: '#f5c65b',
    path: 'M 16 34 C 27 26, 35 33, 48 48',
  },
  {
    id: 'mac-lenin',
    title: 'Chủ nghĩa Mác - Lênin',
    short: 'Mác - Lênin',
    accent: '#e45f62',
    path: 'M 17 76 C 31 70, 35 57, 48 50',
  },
  {
    id: 'tinh-hoa',
    title: 'Tinh hoa văn hóa nhân loại',
    short: 'Tinh hoa',
    accent: '#66d8f0',
    path: 'M 85 42 C 72 34, 64 41, 51 49',
  },
]

const fragments = [
  {
    id: 'ml-01',
    sourceId: 'mac-lenin',
    label: 'Con đường giải phóng dân tộc',
    note: 'Mảnh 01',
  },
  {
    id: 'vh-01',
    sourceId: 'tinh-hoa',
    label: 'Tự do, bình đẳng, bác ái',
    note: 'Mảnh 02',
  },
  {
    id: 'yn-01',
    sourceId: 'yeu-nuoc',
    label: 'Lòng yêu nước thương dân',
    note: 'Mảnh 03',
  },
  {
    id: 'yn-02',
    sourceId: 'yeu-nuoc',
    label: 'Khát vọng độc lập',
    note: 'Mảnh 04',
  },
  {
    id: 'ml-02',
    sourceId: 'mac-lenin',
    label: 'Giải phóng giai cấp, con người',
    note: 'Mảnh 05',
  },
  {
    id: 'vh-02',
    sourceId: 'tinh-hoa',
    label: 'Tiếp thu có chọn lọc',
    note: 'Mảnh 06',
  },
]

const fragmentLayout = {
  'ml-01': { left: 43, top: 30, rotate: -4 },
  'vh-01': { left: 59, top: 68, rotate: 3 },
  'yn-01': { left: 31, top: 61, rotate: -2 },
  'yn-02': { left: 46, top: 76, rotate: 2 },
  'ml-02': { left: 63, top: 46, rotate: -3 },
  'vh-02': { left: 72, top: 60, rotate: 4 },
}

const starField = Array.from({ length: 54 }, (_, index) => {
  const ratio = (salt) => {
    const value = Math.sin(index * 39.47 + salt * 17.13) * 10000
    return value - Math.floor(value)
  }

  return {
    id: index,
    left: `${4 + ratio(1) * 92}%`,
    top: `${4 + ratio(2) * 88}%`,
    size: `${1 + ratio(3) * 3.4}px`,
    delay: `${ratio(4) * 5.6}s`,
    duration: `${4.8 + ratio(5) * 6}s`,
  }
})

export default function VortexEnlightenment({ onWin, onSolved }) {
  const [activeFragmentId, setActiveFragmentId] = useState(null)
  const [placed, setPlaced] = useState({})
  const [wrongTargetId, setWrongTargetId] = useState(null)
  const [lastPlacedId, setLastPlacedId] = useState(null)
  const [dragState, setDragState] = useState(null)
  const [returningId, setReturningId] = useState(null)
  const [dropFeedback, setDropFeedback] = useState(null)
  const [won, setWon] = useState(false)
  const [finalePhase, setFinalePhase] = useState('idle')

  const placedIds = Object.keys(placed)
  const placedCount = placedIds.length
  const progress = Math.round((placedCount / fragments.length) * 100)

  const completedSources = useMemo(
    () =>
      sources.filter((source) =>
        fragments
          .filter((fragment) => fragment.sourceId === source.id)
          .every((fragment) => placed[fragment.id] === source.id),
      ),
    [placed],
  )

  const activeFragment = fragments.find((fragment) => fragment.id === activeFragmentId)

  useEffect(() => {
    if (!won) return undefined

    const imageTimer = window.setTimeout(() => setFinalePhase('image'), 3300)
    const textTimer = window.setTimeout(() => setFinalePhase('text'), 7350)
    const closeTimer = window.setTimeout(() => onWin(), 13000)

    return () => {
      window.clearTimeout(imageTimer)
      window.clearTimeout(textTimer)
      window.clearTimeout(closeTimer)
    }
  }, [onWin, won])

  const isSourceComplete = (sourceId, nextPlaced = placed) =>
    fragments
      .filter((fragment) => fragment.sourceId === sourceId)
      .every((fragment) => nextPlaced[fragment.id] === sourceId)

  const finishCorrectDrop = (fragment, sourceId) => {
    const nextPlaced = { ...placed, [fragment.id]: sourceId }
    setPlaced(nextPlaced)
    setLastPlacedId(fragment.id)
    setActiveFragmentId(null)
    setDropFeedback({ type: 'correct', sourceId })
    window.setTimeout(() => setLastPlacedId(null), 720)
    window.setTimeout(() => setDropFeedback(null), 860)

    if (Object.keys(nextPlaced).length === fragments.length) {
      onSolved?.()
      setFinalePhase('maps')
      setWon(true)
    }
  }

  const showWrongDrop = (sourceId, fragmentId) => {
    setWrongTargetId(sourceId)
    setReturningId(fragmentId)
    setDropFeedback({ type: 'wrong', sourceId })
    window.setTimeout(() => setWrongTargetId(null), 520)
    window.setTimeout(() => setReturningId(null), 520)
    window.setTimeout(() => setDropFeedback(null), 620)
  }

  const getDropSource = (clientX, clientY) => {
    for (const source of sources) {
      const element = document.querySelector(`[data-origin-source="${source.id}"]`)
      if (!element) continue

      const rect = element.getBoundingClientRect()
      const padding = 18
      const inside =
        clientX >= rect.left - padding &&
        clientX <= rect.right + padding &&
        clientY >= rect.top - padding &&
        clientY <= rect.bottom + padding

      if (inside) return source
    }

    return null
  }

  const placeFragment = (sourceId) => {
    if (won || !activeFragment) return

    if (activeFragment.sourceId !== sourceId) {
      showWrongDrop(sourceId, activeFragment.id)
      return
    }

    finishCorrectDrop(activeFragment, sourceId)
  }

  const selectFragment = (fragmentId) => {
    if (won || placed[fragmentId]) return
    setActiveFragmentId((current) => (current === fragmentId ? null : fragmentId))
  }

  const beginDrag = (event, fragment) => {
    if (won || placed[fragment.id]) return

    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setActiveFragmentId(fragment.id)
    setDragState({
      id: fragment.id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dx: 0,
      dy: 0,
    })
  }

  const moveDrag = (event) => {
    if (!dragState) return

    setDragState((current) => {
      if (!current || current.pointerId !== event.pointerId) return current

      return {
        ...current,
        dx: event.clientX - current.startX,
        dy: event.clientY - current.startY,
      }
    })
  }

  const endDrag = (event, fragment) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return

    const movedEnough = Math.abs(dragState.dx) + Math.abs(dragState.dy) > 8
    const target = getDropSource(event.clientX, event.clientY)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
    setDragState(null)

    if (!movedEnough) {
      selectFragment(fragment.id)
      return
    }

    if (!target) {
      setReturningId(fragment.id)
      window.setTimeout(() => setReturningId(null), 420)
      return
    }

    if (target.id !== fragment.sourceId) {
      showWrongDrop(target.id, fragment.id)
      return
    }

    finishCorrectDrop(fragment, target.id)
  }

  return (
    <div className={`minigame-vortex origin-lab ${won ? 'is-won' : ''}`}>
      <div className="origin-lab-copy">
        <span>Khởi nguyên</span>
        <p>
          Chọn một mảnh tri thức, rồi đặt vào đúng nguồn sáng để ba mạch tư tưởng hội tụ ở trung tâm.
        </p>
      </div>

      <section className="origin-lab-shell" aria-label="Ba nguồn gốc tư tưởng Hồ Chí Minh">
        <div className="origin-lab-stage">
          <div className="origin-stars" aria-hidden="true">
            {starField.map((star) => (
              <span
                key={star.id}
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
          </div>

          <div className="origin-stage-map" aria-hidden="true" />
          <div className="origin-stage-orbit" aria-hidden="true" />

          <svg className="origin-energy-map" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              {sources.map((source) => (
                <linearGradient key={source.id} id={`originLine-${source.id}`} x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor={source.accent} stopOpacity="0.08" />
                  <stop offset="52%" stopColor={source.accent} stopOpacity="0.92" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                </linearGradient>
              ))}
              <filter id="originLineGlow">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {sources.map((source) => {
              const complete = isSourceComplete(source.id)

              return (
                <g key={source.id} className={complete ? 'is-complete' : ''}>
                  <path className="origin-line-bed" d={source.path} />
                  <path
                    className="origin-line-current"
                    d={source.path}
                    stroke={`url(#originLine-${source.id})`}
                    style={{ '--source-color': source.accent }}
                  />
                  {complete && (
                    <>
                      <circle className="origin-line-spark" r="0.52" fill={source.accent}>
                        <animateMotion dur="1.8s" repeatCount="indefinite" path={source.path} />
                      </circle>
                      <circle className="origin-line-spark origin-line-spark--late" r="0.34" fill="#ffffff">
                        <animateMotion dur="1.8s" begin="0.72s" repeatCount="indefinite" path={source.path} />
                      </circle>
                    </>
                  )}
                </g>
              )
            })}
          </svg>

          <div className={`origin-core-vault is-level-${completedSources.length}`}>
            <div className="origin-core-inner">
              <span className="origin-core-halo" />
              <span className="origin-core-symbol">Tư tưởng<br />Hồ Chí Minh</span>
              <strong>{completedSources.length}/3</strong>
            </div>
          </div>

          <div className="origin-source-grid">
            {sources.map((source) => {
              const sourceFragments = fragments.filter((fragment) => fragment.sourceId === source.id)
              const complete = isSourceComplete(source.id)
              const capturedFragments = sourceFragments.filter((fragment) => placed[fragment.id] === source.id)
              const count = capturedFragments.length

              return (
                <button
                  key={source.id}
                  type="button"
                  data-origin-source={source.id}
                  className={`origin-source-card ${complete ? 'is-complete' : ''} ${
                    wrongTargetId === source.id ? 'is-wrong' : ''
                  } ${dropFeedback?.sourceId === source.id ? `is-${dropFeedback.type}-drop` : ''} ${
                    dragState ? 'is-drop-ready' : ''
                  }`}
                  style={{ '--source-color': source.accent }}
                  onClick={() => placeFragment(source.id)}
                  disabled={won}
                >
                  <span className="origin-source-ring" />
                  <span className="origin-source-meta">{source.short}</span>
                  <strong>{source.title}</strong>
                  <span className="origin-source-count">{count}/{sourceFragments.length} mảnh</span>
                  <span className="origin-source-slots">
                    {sourceFragments.map((fragment) => (
                      <i
                        key={fragment.id}
                        className={placed[fragment.id] === source.id ? 'is-filled' : ''}
                        title={fragment.label}
                      />
                    ))}
                  </span>
                  <span className="origin-source-captured" aria-hidden="true">
                    {capturedFragments.map((fragment) => (
                      <i
                        key={fragment.id}
                        className={lastPlacedId === fragment.id ? 'is-new' : ''}
                        title={fragment.label}
                      >
                        {fragment.label}
                      </i>
                    ))}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="origin-fragment-bank" aria-label="Mảnh tri thức">
            {fragments.map((fragment, index) => {
              const isPlaced = Boolean(placed[fragment.id])
              const isActive = activeFragmentId === fragment.id
              const layout = fragmentLayout[fragment.id]
              const isDragging = dragState?.id === fragment.id
              const dragTransform = isDragging
                ? `translate3d(calc(-50% + ${dragState.dx}px), calc(-50% + ${dragState.dy}px), 0) rotate(${layout.rotate + 1.5}deg) scale(1.04)`
                : undefined

              return (
                <button
                  key={fragment.id}
                  type="button"
                  className={`origin-fragment ${isActive ? 'is-active' : ''} ${isPlaced ? 'is-placed' : ''} ${
                    lastPlacedId === fragment.id ? 'is-fresh' : ''
                  } ${isDragging ? 'is-dragging' : ''} ${returningId === fragment.id ? 'is-returning' : ''
                  }`}
                  style={{
                    '--source-color': '#8fb6c8',
                    '--stagger': `${index * 0.045}s`,
                    '--chip-left': `${layout.left}%`,
                    '--chip-top': `${layout.top}%`,
                    '--chip-rotate': `${layout.rotate}deg`,
                    transform: dragTransform,
                  }}
                  onPointerDown={(event) => beginDrag(event, fragment)}
                  onPointerMove={moveDrag}
                  onPointerUp={(event) => endDrag(event, fragment)}
                  onPointerCancel={(event) => {
                    if (dragState?.pointerId === event.pointerId) {
                      setDragState(null)
                      setReturningId(fragment.id)
                      window.setTimeout(() => setReturningId(null), 420)
                    }
                  }}
                  disabled={won}
                >
                  <span>{fragment.note}</span>
                  <strong>{fragment.label}</strong>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <div className="origin-progress-rail" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      {won && (
        <div className={`origin-finale origin-finale--${finalePhase}`} role="status" aria-live="polite">
          <div className="origin-finale-map-light" aria-hidden="true" />
          <div className="origin-finale-image-shell">
            <div className="origin-finale-image-core">
              <img src={originFinaleImage} alt="" />
            </div>
          </div>
          <div className="origin-finale-text">
            <span>Khởi nguyên · Hành tinh đã mở khóa</span>
            <h3>NGUỒN GỐC TƯ TƯỞNG</h3>
            <blockquote>
              “Lúc đầu, chính chủ nghĩa yêu nước, chứ chưa phải chủ nghĩa cộng sản, đã đưa tôi tin theo Lênin.”
            </blockquote>
            <p>
              Từ lòng yêu nước Việt Nam, qua tinh hoa văn hóa nhân loại, đến ánh sáng Mác - Lênin, các nguồn mạch ấy
              hội tụ thành nền tảng tư tưởng Hồ Chí Minh.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
