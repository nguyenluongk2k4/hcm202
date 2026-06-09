import { useEffect, useMemo, useRef, useState } from 'react'
import './GrowSeed.css'
import lotusSvg from '../../assets/lotus_svg.svg'
import lotusPng from '../../assets/lotus.png'
import LotusPaths from './LotusPaths'

const cultureStages = [
  {
    key: 'seed',
    label: 'Gieo hạt',
    value: 'Niềm tin',
    prompt: 'Đánh thức hạt giống niềm tin ở trung tâm khu vườn.',
    threshold: 8,
    x: 50,
    y: 85,
    color: '#fde047',
  },
  {
    key: 'language',
    label: 'Giữ tiếng nói',
    value: 'Tiếng nói',
    prompt: 'Kết nối tiếng nói chung để ký ức không bị đứt đoạn.',
    threshold: 18,
    x: 12,
    y: 72,
    color: '#7dd3fc',
  },
  {
    key: 'knowledge',
    label: 'Tưới tri thức',
    value: 'Tri thức',
    prompt: 'Dẫn dòng tri thức xuống rễ cây để văn hóa có nền tảng.',
    threshold: 29,
    x: 88,
    y: 72,
    color: '#38bdf8',
  },
  {
    key: 'ethics',
    label: 'Thắp đạo đức',
    value: 'Đạo đức',
    prompt: 'Thắp ngọn đèn đạo đức để tri thức không đi lệch hướng.',
    threshold: 40,
    x: 6,
    y: 52,
    color: '#34d399',
  },
  {
    key: 'discipline',
    label: 'Rèn kỷ luật',
    value: 'Kỷ luật',
    prompt: 'Khóa nhịp kỷ luật để hành động không chỉ là cảm hứng nhất thời.',
    threshold: 51,
    x: 94,
    y: 52,
    color: '#a7f3d0',
  },
  {
    key: 'ideal',
    label: 'Gọi lý tưởng',
    value: 'Lý tưởng',
    prompt: 'Đưa lý tưởng lên cao để mọi lựa chọn có phương hướng.',
    threshold: 62,
    x: 12,
    y: 34,
    color: '#fef08a',
  },
  {
    key: 'human',
    label: 'Trồng người',
    value: 'Con người',
    prompt: 'Đánh thức mầm người toàn diện: biết học, biết sống, biết cống hiến.',
    threshold: 73,
    x: 88,
    y: 34,
    color: '#ffffff',
  },
  {
    key: 'beauty',
    label: 'Vun cái đẹp',
    value: 'Cái đẹp',
    prompt: 'Vun cái đẹp trong cách nghĩ, cách nói và cách đối xử.',
    threshold: 83,
    x: 6,
    y: 17,
    color: '#f0abfc',
  },
  {
    key: 'heritage',
    label: 'Truyền di sản',
    value: 'Di sản',
    prompt: 'Trao di sản cho thế hệ kế tiếp bằng một đường sáng bền bỉ.',
    threshold: 92,
    x: 94,
    y: 17,
    color: '#93c5fd',
  },
  {
    key: 'future',
    label: 'Mở tương lai',
    value: 'Tương lai',
    prompt: 'Khép mạch sáng cuối cùng để khu vườn văn hóa mở ra tương lai.',
    threshold: 98,
    x: 50,
    y: 9,
    color: '#fef3c7',
  },
]

const cultureLinks = [
  ['seed', 'language'],
  ['seed', 'knowledge'],
  ['language', 'ethics'],
  ['knowledge', 'discipline'],
  ['ethics', 'ideal'],
  ['discipline', 'human'],
  ['ideal', 'human'],
  ['ideal', 'beauty'],
  ['human', 'heritage'],
  ['beauty', 'future'],
  ['heritage', 'future'],
  ['language', 'knowledge'],
  ['ethics', 'discipline'],
]



const finaleWords = ['Niềm tin', 'Tri thức', 'Đạo đức', 'Lý tưởng', 'Cái đẹp', 'Di sản']
const quoteLetters = 'TRỒNG NGƯỜI - GIEO CẢ TƯƠNG LAI'.split('')
const growthToolDefaults = {
  rain: { x: 18, y: 18 },
  sun: { x: 82, y: 48 },
}
const growthToolTargets = {
  rain: { x: 50, y: 73, radius: 25 },
  sun: { x: 50, y: 48, radius: 34 },
}

function easeOutBack(x) {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

function getPathData(size) {
  if (size === 'L') return 'M0,0 C-50,-58 -31,-142 0,-174 C31,-142 50,-58 0,0'
  if (size === 'M') return 'M0,0 C-36,-44 -22,-112 0,-134 C22,-112 36,-44 0,0'
  return 'M0,0 C-25,-30 -16,-82 0,-98 C16,-82 25,-30 0,0'
}

function seededRatio(index, salt = 1) {
  const value = Math.sin(index * 91.173 + salt * 37.719) * 10000
  return value - Math.floor(value)
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getGrowthResource(tool, position) {
  const target = growthToolTargets[tool]
  const dx = position.x - target.x
  const dy = position.y - target.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance <= target.radius ? tool : null
}

function getGlyphIcon(key) {
  if (key === 'seed') return 'M12 28 C4 16 12 7 24 4 C27 17 22 25 12 28 Z'
  if (key === 'language') return 'M7 15 C12 8 20 8 24 15 C28 8 36 8 41 15 V37 C35 32 29 32 24 38 C19 32 13 32 7 37 Z M14 18 H20 M28 18 H35 M14 25 H20 M28 25 H35'
  if (key === 'knowledge') return 'M6 9 H18 C22 9 24 11 24 15 V33 C24 30 21 29 18 29 H6 Z M24 15 C24 11 27 9 31 9 H42 V29 H30 C27 29 24 30 24 33 Z'
  if (key === 'ethics') return 'M24 5 C31 13 36 20 36 29 C36 37 31 43 24 43 C17 43 12 37 12 29 C12 20 17 13 24 5 Z M24 15 C21 20 19 25 19 29 C19 33 21 36 24 36 C27 36 29 33 29 29 C29 25 27 20 24 15 Z'
  if (key === 'discipline') return 'M13 8 H35 L40 16 V38 L35 43 H13 L8 38 V16 Z M16 17 H32 M16 25 H32 M16 33 H27'
  if (key === 'ideal') return 'M24 3 L30 17 L45 18 L33 28 L37 43 L24 35 L11 43 L15 28 L3 18 L18 17 Z'
  if (key === 'human') return 'M24 8 C29 8 33 12 33 17 C33 22 29 26 24 26 C19 26 15 22 15 17 C15 12 19 8 24 8 Z M10 42 C13 32 18 29 24 29 C30 29 35 32 38 42'
  if (key === 'beauty') return 'M24 6 C32 6 40 14 40 22 C40 33 24 44 24 44 C24 44 8 33 8 22 C8 14 16 6 24 6 Z M24 14 C20 14 16 18 16 22 C16 28 24 37 24 37 C24 37 32 28 32 22 C32 18 28 14 24 14 Z'
  if (key === 'heritage') return 'M8 40 L8 18 L24 8 L40 18 L40 40 Z M16 40 L16 28 L24 24 L32 28 L32 40 Z M20 18 C20 14 24 11 28 14 C32 17 30 24 24 24 C18 24 16 21 20 18 Z'
  return 'M24 4 L29 17 L43 18 L32 27 L36 42 L24 34 L12 42 L16 27 L5 18 L19 17 Z M24 14 V34 M14 23 H38'
}

function getCurvePath(start, end) {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const curve = Math.max(6, Math.min(16, Math.abs(dx) * 0.18 + Math.abs(dy) * 0.12))
  const cx1 = start.x + dx * 0.38
  const cy1 = start.y + dy * 0.18 - curve
  const cx2 = start.x + dx * 0.62
  const cy2 = start.y + dy * 0.82 + curve
  return `M ${start.x} ${start.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${end.x} ${end.y}`
}

export default function GrowSeed({ onWin, onSolved }) {
  const [progress, setProgress] = useState(0)
  const [unlocked, setUnlocked] = useState([])
  const [isPressing, setIsPressing] = useState(false)
  const [won, setWon] = useState(false)
  const [pulse, setPulse] = useState(null)
  const [glyphParticles, setGlyphParticles] = useState([])
  const [shockwave, setShockwave] = useState(false)
  const [finalePhase, setFinalePhase] = useState(0)
  const [toolPositions, setToolPositions] = useState(growthToolDefaults)
  const [activeTool, setActiveTool] = useState(null)
  const [activeResource, setActiveResource] = useState(null)

  const intervalRef = useRef(null)
  const gardenRef = useRef(null)
  const activeResourceRef = useRef(null)
  const unlockedRef = useRef([])
  const wonRef = useRef(false)

  const stageByKey = useMemo(() => {
    return cultureStages.reduce((map, stage) => ({ ...map, [stage.key]: stage }), {})
  }, [])

  const activeStage = cultureStages.find(
    (stage) => progress >= stage.threshold && !unlocked.includes(stage.key)
  )
  const activeIndex = activeStage ? cultureStages.findIndex((stage) => stage.key === activeStage.key) : -1
  const drawPhase = Math.min(1, progress / 100)
  const bloomPhase = Math.max(0, (progress - 82) / 18)
  const bloom = easeOutBack(bloomPhase)

  const floatingLights = useMemo(() => {
    return Array.from({ length: 92 }).map((_, index) => ({
      id: index,
      left: 4 + seededRatio(index, 1) * 92,
      top: 6 + seededRatio(index, 2) * 82,
      size: 2 + seededRatio(index, 3) * 5,
      delay: seededRatio(index, 4) * 3.8,
      duration: 3.8 + seededRatio(index, 5) * 4.7,
      drift: -34 + seededRatio(index, 6) * 68,
    }))
  }, [])

  const finalePetals = useMemo(() => {
    return Array.from({ length: 148 }).map((_, index) => ({
      id: index,
      left: seededRatio(index, 7) * 100,
      delay: seededRatio(index, 8) * 4.6,
      duration: 4.5 + seededRatio(index, 9) * 4.4,
      sway: -140 + seededRatio(index, 10) * 280,
      scale: 0.45 + seededRatio(index, 11) * 1.35,
      rotate: seededRatio(index, 12) * 360,
      color: Math.floor(seededRatio(index, 13) * 4),
    }))
  }, [])

  const finaleRays = useMemo(() => {
    return Array.from({ length: 36 }).map((_, index) => ({
      id: index,
      angle: index * 10,
      delay: seededRatio(index, 20) * 0.8,
      length: 58 + seededRatio(index, 21) * 52,
    }))
  }, [])

  const finaleOrbs = useMemo(() => {
    return Array.from({ length: 42 }).map((_, index) => ({
      id: index,
      angle: seededRatio(index, 30) * 360,
      dist: 90 + seededRatio(index, 31) * 320,
      delay: seededRatio(index, 32) * 1.35,
      duration: 2.6 + seededRatio(index, 33) * 2.2,
      size: 4 + seededRatio(index, 34) * 11,
    }))
  }, [])

  const matureSeeds = useMemo(() => {
    return Array.from({ length: 46 }).map((_, index) => ({
      id: index,
      angle: seededRatio(index, 41) * 360,
      dist: 42 + seededRatio(index, 42) * 220,
      delay: seededRatio(index, 43) * 1.25,
      duration: 2.2 + seededRatio(index, 44) * 1.8,
      size: 3 + seededRatio(index, 45) * 7,
    }))
  }, [])

  const stopGrowing = () => {
    setIsPressing(false)
    setActiveResource(null)
    activeResourceRef.current = null
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  const startGrowing = () => {
    if (won || activeStage || !activeResourceRef.current) return
    if (intervalRef.current) return

    intervalRef.current = setInterval(() => {
      if (!activeResourceRef.current) return
      setProgress((current) => {
        const step = activeResourceRef.current === 'rain' ? 0.34 : 0.31
        const nextStage = cultureStages.find(
          (stage) =>
            current < stage.threshold &&
            current + step >= stage.threshold &&
            !unlockedRef.current.includes(stage.key)
        )
        if (nextStage) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          setIsPressing(false)
          setActiveResource(null)
          activeResourceRef.current = null
          setPulse(nextStage.key)
          return nextStage.threshold
        }
        if (current >= 100) return 100
        return Math.min(100, current + step)
      })
    }, 28)
  }

  const updateToolPosition = (tool, event) => {
    if (!gardenRef.current) return

    const rect = gardenRef.current.getBoundingClientRect()
    const position = {
      x: clamp(((event.clientX - rect.left) / rect.width) * 100, 8, 92),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100, 14, 88),
    }
    const resource = getGrowthResource(tool, position)

    setToolPositions((current) => ({ ...current, [tool]: position }))

    if (resource && !activeStage && !won) {
      activeResourceRef.current = resource
      setActiveResource(resource)
      setIsPressing(true)
      startGrowing()
    } else {
      stopGrowing()
    }
  }

  const startToolDrag = (tool, event) => {
    if (won) return
    event.preventDefault()
    event.stopPropagation()
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {
      // Some browsers can drop pointer capture during fast drags.
    }
    setActiveTool(tool)
    updateToolPosition(tool, event)
  }

  const moveToolDrag = (tool, event) => {
    if (activeTool !== tool) return
    event.preventDefault()
    event.stopPropagation()
    updateToolPosition(tool, event)
  }

  const endToolDrag = (event) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      event.currentTarget.releasePointerCapture?.(event.pointerId)
    } catch {
      // Capture may already be released if the pointer leaves the control.
    }
    setActiveTool(null)
    stopGrowing()
  }

  const spawnGlyphParticles = (stage) => {
    const newParticles = Array.from({ length: 26 }).map((_, i) => ({
      id: `${stage.key}-${Date.now()}-${i}`,
      angle: (i / 26) * 360 + seededRatio(i, 50) * 20,
      dist: 44 + seededRatio(i, 51) * 92,
      duration: 0.62 + seededRatio(i, 52) * 0.62,
      size: 3 + seededRatio(i, 53) * 8,
      originX: stage.x,
      originY: stage.y,
      color: stage.color,
    }))
    setGlyphParticles((prev) => [...prev.slice(-80), ...newParticles])
    window.setTimeout(() => {
      const ids = new Set(newParticles.map((p) => p.id))
      setGlyphParticles((prev) => prev.filter((p) => !ids.has(p.id)))
    }, 1700)
  }

  const unlockStage = (stage) => {
    if (!activeStage || activeStage.key !== stage.key || won) return
    spawnGlyphParticles(stage)
    setUnlocked((items) => [...items, stage.key])
    setPulse(stage.key)
    window.setTimeout(() => setPulse(null), 920)
  }

  const isLinkLit = (from, to) => unlocked.includes(from) && unlocked.includes(to)
  const isLinkActive = (from, to) => {
    if (!activeStage) return false
    const otherKey = from === activeStage.key ? to : from
    return (from === activeStage.key || to === activeStage.key) && unlocked.includes(otherKey)
  }

  useEffect(() => {
    unlockedRef.current = unlocked
  }, [unlocked])

  useEffect(() => {
    if (!isPressing && !activeStage && progress > 0 && progress < 100) {
      const decay = window.setInterval(() => {
        setProgress((current) => Math.max(0, current - 0.075))
      }, 70)
      return () => window.clearInterval(decay)
    }
    return undefined
  }, [activeStage, isPressing, progress])

  useEffect(() => {
    if (progress >= 100 && !wonRef.current) {
      wonRef.current = true
      onSolved?.()
      stopGrowing()
      setWon(true)
      window.setTimeout(() => setShockwave(true), 180)
      window.setTimeout(() => setShockwave(false), 1300)
      window.setTimeout(() => setFinalePhase(2), 740)
      window.setTimeout(onWin, 11800)
    }
  }, [onSolved, onWin, progress])

  useEffect(() => {
    return () => { clearInterval(intervalRef.current) }
  }, [])

  return (
    <div className={`minigame-grow-tree ${won ? 'is-final' : ''}`}>
      <div className="culture-topline">
        <p className="minigame-instruction">
          {won
            ? 'Khu vườn đã nở: văn hóa trở thành ánh sáng sống trong từng con người.'
            : activeStage
              ? activeStage.prompt
              : 'Kéo mây mưa xuống vùng rễ hoặc kéo mặt trời lên tán cây để vun trồng. Khi biểu tượng bừng sáng, chạm vào nó để nối mạch văn hóa.'}
        </p>

        <div className="culture-stage-counter" aria-label="Tiến trình vun trồng">
          {cultureStages.map((stage, index) => (
            <span
              key={stage.key}
              className={`${unlocked.includes(stage.key) ? 'is-lit' : ''} ${activeStage?.key === stage.key ? 'is-active' : ''}`}
              style={{ '--stage-color': stage.color }}
            >
              {index + 1}
            </span>
          ))}
        </div>
      </div>

      <div
        ref={gardenRef}
        className={`culture-garden ${isPressing ? 'is-growing' : ''} ${activeResource ? `is-${activeResource}` : ''} ${activeStage ? 'has-stage' : ''} ${won ? 'is-won' : ''} ${shockwave ? 'is-shockwave' : ''}`}
        style={{
          '--progress': `${progress}%`,
          '--rain-x': `${toolPositions.rain.x}%`,
          '--rain-y': `${toolPositions.rain.y}%`,
          '--sun-x': `${toolPositions.sun.x}%`,
          '--sun-y': `${toolPositions.sun.y}%`,
          touchAction: 'none',
        }}
      >
        <div className="culture-sky" />
        <div className="culture-aurora culture-aurora--left" />
        <div className="culture-aurora culture-aurora--right" />
        <div className="culture-moon"><span>Văn hóa</span></div>
        <div className="culture-orbit-ring" />
        <div className="culture-orbit-ring culture-orbit-ring--inner" />
        <div className="culture-water" />
        <div className={`culture-drop-zone culture-drop-zone--rain ${activeResource === 'rain' ? 'is-active' : ''}`} aria-hidden="true" />
        <div className={`culture-drop-zone culture-drop-zone--sun ${activeResource === 'sun' ? 'is-active' : ''}`} aria-hidden="true" />

        <div className={`culture-rain-shower ${activeResource === 'rain' ? 'is-active' : ''}`} aria-hidden="true">
          <span /><span /><span /><span /><span /><span />
        </div>
        <div className={`culture-sunbeam ${activeResource === 'sun' ? 'is-active' : ''}`} aria-hidden="true" />

        <button
          type="button"
          className={`culture-drag-tool culture-drag-tool--rain ${activeTool === 'rain' ? 'is-dragging' : ''} ${activeResource === 'rain' ? 'is-feeding' : ''}`}
          style={{ left: `${toolPositions.rain.x}%`, top: `${toolPositions.rain.y}%` }}
          aria-label="Kéo mây mưa tới vùng rễ cây"
          onPointerDown={(event) => startToolDrag('rain', event)}
          onPointerMove={(event) => moveToolDrag('rain', event)}
          onPointerUp={endToolDrag}
          onPointerCancel={endToolDrag}
        >
          <span className="culture-cloud-shape" aria-hidden="true">
            <i /><i /><i />
          </span>
          <span className="culture-cloud-drops" aria-hidden="true">
            <i /><i /><i />
          </span>
        </button>

        <button
          type="button"
          className={`culture-drag-tool culture-drag-tool--sun ${activeTool === 'sun' ? 'is-dragging' : ''} ${activeResource === 'sun' ? 'is-feeding' : ''}`}
          style={{ left: `${toolPositions.sun.x}%`, top: `${toolPositions.sun.y}%` }}
          aria-label="Kéo mặt trời tới tán cây"
          onPointerDown={(event) => startToolDrag('sun', event)}
          onPointerMove={(event) => moveToolDrag('sun', event)}
          onPointerUp={endToolDrag}
          onPointerCancel={endToolDrag}
        >
          <span className="culture-sun-rays" aria-hidden="true">
            <i /><i /><i /><i /><i /><i /><i /><i />
          </span>
          <span className="culture-sun-core" aria-hidden="true" />
        </button>

        {floatingLights.map((light) => (
          <i
            key={light.id}
            className="culture-firefly"
            style={{
              left: `${light.left}%`,
              top: `${light.top}%`,
              width: `${light.size}px`,
              '--drift': `${light.drift}px`,
              animationDelay: `${light.delay}s`,
              animationDuration: `${light.duration}s`,
            }}
          />
        ))}

        <svg className="culture-link-map" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="cultureLineGlow">
              <feGaussianBlur stdDeviation="1.1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {cultureLinks.map(([from, to], index) => {
            const start = stageByKey[from]
            const end = stageByKey[to]
            const lit = isLinkLit(from, to)
            const active = isLinkActive(from, to)
            return (
              <g key={`${from}-${to}`} className={`${lit ? 'is-lit' : ''} ${active ? 'is-active' : ''}`}>
                <path className="culture-link-shadow" d={getCurvePath(start, end)} pathLength="100" />
                <path
                  className="culture-link-core"
                  d={getCurvePath(start, end)}
                  pathLength="100"
                  style={{
                    '--link-delay': `${index * 0.08}s`,
                    '--link-color-a': start.color,
                    '--link-color-b': end.color,
                  }}
                />
                {(lit || active) && (
                  <path
                    className="culture-link-runner"
                    d={getCurvePath(start, end)}
                    pathLength="100"
                    style={{
                      '--link-delay': `${index * 0.09}s`,
                      '--link-color-a': start.color,
                      '--link-color-b': end.color,
                    }}
                  />
                )}
              </g>
            )
          })}
        </svg>

        {isPressing && !activeStage && !won && (
          <>
            <div className="culture-energy-column" />
            <div className="culture-hand-ripple" />
            <div className="culture-energy-rings">
              <span /><span /><span /><span />
            </div>
          </>
        )}

        {cultureStages.map((stage, index) => {
          const isUnlocked = unlocked.includes(stage.key)
          const isActive = activeStage?.key === stage.key
          return (
            <button
              key={stage.key}
              type="button"
              className={`culture-glyph ${isUnlocked ? 'is-unlocked' : ''} ${isActive ? 'is-active' : ''} ${pulse === stage.key ? 'is-pulsing' : ''}`}
              style={{
                left: `${stage.x}%`,
                top: `${stage.y}%`,
                '--glyph-color': stage.color,
                '--glyph-index': index,
              }}
              onPointerDown={(event) => {
                event.stopPropagation()
                unlockStage(stage)
              }}
              disabled={!isActive}
              aria-label={stage.prompt}
            >
              <span className="culture-glyph-halo" />
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d={getGlyphIcon(stage.key)} />
              </svg>
              <strong>{stage.value}</strong>
            </button>
          )
        })}

        {glyphParticles.map((p) => (
          <i
            key={p.id}
            className="culture-glyph-particle"
            style={{
              left: `${p.originX}%`,
              top: `${p.originY}%`,
              '--p-angle': `${p.angle}deg`,
              '--p-dist': `${p.dist}px`,
              '--p-size': `${p.size}px`,
              '--p-color': p.color,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}

        {won && (
          <div className="culture-mature-seeds" aria-hidden="true">
            {matureSeeds.map((seed) => (
              <i
                key={seed.id}
                style={{
                  '--seed-angle': `${seed.angle}deg`,
                  '--seed-dist': `${seed.dist}px`,
                  '--seed-size': `${seed.size}px`,
                  animationDelay: `${seed.delay}s`,
                  animationDuration: `${seed.duration}s`,
                }}
              />
            ))}
          </div>
        )}

        <svg className={`culture-tree-canvas ${isPressing ? 'is-springing' : ''} ${won ? 'is-mature' : ''}`} viewBox="0 0 520 440" aria-hidden="true">
          <defs>
            <radialGradient id="cultureWaterGlow">
              <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.92" />
              <stop offset="42%" stopColor="#38bdf8" stopOpacity="0.46" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="cultureStem" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#134e4a" />
              <stop offset="42%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
            <linearGradient id="culturePetalOuter" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="58%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
            <linearGradient id="culturePetalBlue" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#172554" />
              <stop offset="46%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="culturePetalEmerald" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="48%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
            <linearGradient id="culturePetalInner" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="42%" stopColor="#a7f3d0" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="culturePetalGold" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <filter id="cultureGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="cultureStrongGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="cultureUltraGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="18" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse cx="260" cy="392" rx="190" ry="36" fill="url(#cultureWaterGlow)" opacity={0.2 + progress / 120} />

          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            <g
              key={index}
              className="culture-floating-page"
              style={{
                '--page-delay': `${index * 0.2}s`,
                opacity: progress > 20 + index * 8 ? 1 : 0,
              }}
              transform={`translate(${122 + index * 44} ${272 - index * 22}) rotate(${-18 + index * 6})`}
            >
              <rect x="-17" y="-12" width="34" height="24" rx="3" fill="#f8fafc" opacity="0.84" />
              <path d="M-10 -4 H10 M-10 3 H6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" opacity="0.66" />
            </g>
          ))}

          <g>
            <LotusPaths drawPhase={drawPhase} won={won} bloomPhase={bloomPhase} />

          </g>
        </svg>

        {bloomPhase > 0 && (
          <img 
            src={lotusPng} 
            alt=""
            className={won ? 'culture-lotus-png is-won-glow' : 'culture-lotus-png'}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) scale(${0.85 + bloomPhase * 0.15})`,
              width: '85%',
              height: '85%',
              objectFit: 'contain',
              opacity: Math.min(1, bloomPhase * 1.5),
              mixBlendMode: 'screen',
              transition: 'all 2s ease-out',
              pointerEvents: 'none',
              zIndex: 20
            }}
          />
        )}

        <div className="culture-stage-list">
          {cultureStages.map((stage) => (
            <span
              key={stage.key}
              className={
                unlocked.includes(stage.key)
                  ? 'is-done'
                  : activeStage?.key === stage.key
                    ? 'is-now'
                    : ''
              }
              style={{ '--stage-color': stage.color }}
            >
              {stage.label}
            </span>
          ))}
        </div>

        {activeStage && (
          <div className="culture-focus-callout" style={{ '--stage-color': activeStage.color }}>
            <small>Mốc {activeIndex + 1}/10</small>
            <strong>{activeStage.label}</strong>
          </div>
        )}

        {won && finalePhase >= 2 && (
          <div className="culture-finale" aria-live="polite">

            <div className="culture-message-card">
              <div className="culture-message-badge">
                <span className="culture-message-badge-dot" />
                <small>Văn hóa - Hành tinh đã mở khóa</small>
              </div>
              <h3>
                {quoteLetters.map((letter, index) => (
                  <span
                    key={`${letter}-${index}`}
                    style={{ animationDelay: `${4.8 + index * 0.042}s` }}
                  >
                    {letter === ' ' ? '\u00a0' : letter}
                  </span>
                ))}
              </h3>
              <blockquote className="culture-message-quote">
                "Vì lợi ích mười năm thì phải trồng cây,<br />
                vì lợi ích trăm năm thì phải <em>trồng người</em>."
              </blockquote>
              <p>
                Văn hóa không đứng yên trong sách vở. Nó đi qua tiếng nói, tri thức,
                đạo đức và lý tưởng, rồi nở thành cách mỗi người sống đẹp hơn hôm nay.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="culture-progress-shell">
        <div className="culture-progress-label">
          <span>
            {won
              ? 'Vườn người bừng sáng'
              : activeStage
                ? 'Chạm biểu tượng đang gọi sáng'
                : 'Năng lượng vun trồng'}
          </span>
          <strong>{Math.round(progress)}%</strong>
        </div>
        <div className="minigame-progress">
          <div className="minigame-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
