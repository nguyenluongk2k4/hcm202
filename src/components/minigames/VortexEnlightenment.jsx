import { useState, useEffect, useRef } from 'react'
import './VortexEnlightenment.css'

// 3x3 Grid Layout:
// 0: Origin 1 (Mác-Lênin)   1: Pipe (Distraction)   2: Origin 2 (Nhân loại)
// 3: Pipe (L-shape)         4: CORE                 5: Pipe (L-shape)
// 6: Origin 3 (Truyền thống)7: Pipe (L-shape)         8: Pipe (Distraction)

const INITIAL_GRID = [
  { id: 0, type: 'origin', label: 'Chủ nghĩa\\nMác-Lênin', color: '#ef4444' }, // Red
  { id: 1, type: 'pipe', shape: 'I', rot: 1 },
  { id: 2, type: 'origin', label: 'Tinh hoa\\nNhân loại', color: '#3b82f6' }, // Blue
  { id: 3, type: 'pipe', shape: 'L', rot: 1 },
  { id: 4, type: 'core', label: 'Tư tưởng\\nHồ Chí Minh' },
  { id: 5, type: 'pipe', shape: 'L', rot: 2 },
  { id: 6, type: 'origin', label: 'Truyền thống\\nDân tộc', color: '#f59e0b' }, // Yellow
  { id: 7, type: 'pipe', shape: 'L', rot: 0 },
  { id: 8, type: 'pipe', shape: 'I', rot: 0 },
]

export default function VortexEnlightenment({ onWin }) {
  const [grid, setGrid] = useState(INITIAL_GRID)
  const [won, setWon] = useState(false)
  const [showEpicWin, setShowEpicWin] = useState(false)
  const wonRef = useRef(false)

  // Derived state to check which pipes are correctly aligned
  const isPath1Connected = grid[3].rot === 0 // Top to Right
  const isPath2Connected = grid[5].rot === 3 // Top to Left
  const isPath3Connected = grid[7].rot === 3 // Left to Top

  const handleRotate = (index) => {
    if (wonRef.current) return
    if (grid[index].type !== 'pipe') return

    setGrid(prev => {
      const next = [...prev]
      next[index] = { ...next[index], rot: (next[index].rot + 1) % 4 }
      return next
    })
  }

  useEffect(() => {
    if (wonRef.current) return
    if (isPath1Connected && isPath2Connected && isPath3Connected) {
      wonRef.current = true
      setWon(true)
      setTimeout(() => {
        setShowEpicWin(true)
        setTimeout(onWin, 5500)
      }, 600)
    }
  }, [isPath1Connected, isPath2Connected, isPath3Connected, onWin])

  const renderPipeShape = (cell, isPowered, color) => {
    const strokeColor = isPowered ? color : '#334155'
    const glow = isPowered ? `drop-shadow(0 0 8px ${color})` : 'none'
    
    if (cell.shape === 'I') {
      return (
        <svg viewBox="0 0 100 100" className="pipe-svg" style={{ filter: glow }}>
          <line x1="50" y1="0" x2="50" y2="100" stroke={strokeColor} strokeWidth="16" strokeLinecap="round" />
        </svg>
      )
    } else if (cell.shape === 'L') {
      return (
        <svg viewBox="0 0 100 100" className="pipe-svg" style={{ filter: glow }}>
          <path d="M 50 0 L 50 50 L 100 50" fill="none" stroke={strokeColor} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
    return null
  }

  return (
    <div className="minigame-vortex">
      <p className="minigame-instruction">
        {won ? '✦ Tinh hoa hội tụ, chân lý sáng ngời ✦' : 'Click xoay các khối dẫn truyền để hội tụ 3 nguồn tư tưởng'}
      </p>

      <div className={`vortex-container ${won ? 'is-won' : ''}`}>
        
        {/* The 3x3 Grid */}
        <div className="laser-grid">
          {grid.map((cell, i) => {
            if (cell.type === 'origin') {
              return (
                <div key={i} className="grid-cell origin-cell" style={{ '--accent': cell.color }}>
                  <div className="origin-orb" />
                  <span className="origin-label">{cell.label}</span>
                  {/* Laser emitter stub */}
                  <div className={`emitter-stub emit-${i === 0 || i === 2 ? 'down' : 'right'}`} />
                </div>
              )
            }
            
            if (cell.type === 'core') {
              const allConnected = won
              return (
                <div key={i} className={`grid-cell core-cell ${allConnected ? 'core-active' : ''}`}>
                  <div className="core-crystal" />
                  <span className="core-label">{cell.label}</span>
                </div>
              )
            }

            // Pipes
            let isPowered = false
            let powerColor = '#ffffff'
            
            if (i === 3 && isPath1Connected) { isPowered = true; powerColor = '#ef4444' }
            if (i === 5 && isPath2Connected) { isPowered = true; powerColor = '#3b82f6' }
            if (i === 7 && isPath3Connected) { isPowered = true; powerColor = '#f59e0b' }

            return (
              <div 
                key={i} 
                className={`grid-cell pipe-cell ${isPowered ? 'is-powered' : ''}`}
                onClick={() => handleRotate(i)}
              >
                <div 
                  className="pipe-rotator" 
                  style={{ transform: `rotate(${cell.rot * 90}deg)` }}
                >
                  {renderPipeShape(cell, isPowered, powerColor)}
                </div>
              </div>
            )
          })}
        </div>

        {/* Epic Win Supernova Overlay */}
        {showEpicWin && (
          <div className="epic-win-overlay">
            <div className="epic-shockwave" />
            <div className="epic-sun-flare" />
            <div className="epic-rays" />
            <div className="epic-banner">
              <span className="text-glow-noble">HỘI TỤ</span><br/>
              <span className="text-solid-noble">TINH HOA</span>
            </div>
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={`spark-${i}`} className="epic-spark" style={{
                '--angle': `${Math.random() * 360}deg`,
                '--dist': `${120 + Math.random() * 350}px`,
                animationDelay: `${Math.random() * 0.5}s`,
                background: ['#fff', '#fde047', '#3b82f6', '#ef4444'][Math.floor(Math.random() * 4)]
              }} />
            ))}
          </div>
        )}
      </div>

      <div className="minigame-progress">
        <div
          className="minigame-progress-fill"
          style={{ width: `${( (isPath1Connected ? 33 : 0) + (isPath2Connected ? 33 : 0) + (isPath3Connected ? 34 : 0) )}%` }}
        />
      </div>
    </div>
  )
}
