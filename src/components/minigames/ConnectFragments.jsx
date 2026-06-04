import { useEffect, useRef, useState, useMemo } from 'react'
import './ConnectFragments.css'

const nodes = Array.from({ length: 5 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
  return { id: i, x: 170 + Math.cos(a) * 115, y: 170 + Math.sin(a) * 115 }
})
const targetEdges = ['0-2', '1-3', '1-4', '2-4', '0-3']

export default function ConnectFragments({ onWin }) {
  const [edges, setEdges] = useState([])
  const [drag, setDrag] = useState(null)
  const [won, setWon] = useState(false)
  const [winExplosion, setWinExplosion] = useState(false)
  const [edgeParticles, setEdgeParticles] = useState([])
  const svgRef = useRef(null)

  // Bg particles
  const bgParticles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 10,
    duration: Math.random() * 5 + 5
  })), [])

  const spawnEdgeParticles = (x, y) => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x, y,
      tx: (Math.random() - 0.5) * 120,
      ty: (Math.random() - 0.5) * 120
    }))
    setEdgeParticles(prev => [...prev, ...newParticles].slice(-45)) // Keep limit
  }

  useEffect(() => {
    if (!drag || won) return
    const move = (e) => {
      const rect = svgRef.current.getBoundingClientRect()
      setDrag((prev) => ({ ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top }))
    }
    const up = (e) => {
      const rect = svgRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const end = nodes.find((node) => node.id !== drag.start.id && Math.hypot(node.x - x, node.y - y) < 60)
      
      if (end) {
        const id = [drag.start.id, end.id].sort().join('-')
        if (targetEdges.includes(id) && !edges.includes(id)) {
          const next = [...edges, id]
          setEdges(next)
          spawnEdgeParticles((drag.start.x + end.x) / 2, (drag.start.y + end.y) / 2)
          
          if (next.length === targetEdges.length) {
            // Delay win effect slightly so user can clearly see the final line connecting
            setTimeout(() => {
              setWon(true)
              setWinExplosion(true)
            }, 600)
            setTimeout(onWin, 4500)
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
  }, [drag, edges, onWin, won])

  return (
    <div className="minigame-connect">
      {/* Background Particles */}
      {bgParticles.map(p => (
        <div key={p.id} className="bg-particle" style={{
          left: p.left, top: p.top, width: p.size, height: p.size,
          animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`
        }} />
      ))}

      <p className="minigame-instruction">{won ? 'Khối đại đoàn kết toàn dân tộc!' : 'Kéo các điểm sáng để tạo thành biểu tượng sao vàng'}</p>
      
      {/* Thêm khung viền viễn tưởng ảo diệu */}
      <div className={`connect-container ${won ? 'is-won' : ''}`}>
        
        {/* Khung viền sáng bên ngoài (CSS border/glow) */}
        <div className="connect-outer-glow" />

        {/* Edge connect sparks */}
        {edgeParticles.map(p => (
          <div key={p.id} className="edge-particle" style={{
            left: (p.x / 340) * 100 + '%', top: (p.y / 340) * 100 + '%',
            '--tx': `${p.tx}px`, '--ty': `${p.ty}px`
          }} />
        ))}

        {/* Win Explosion - Tăng số lượng và độ lan tỏa */}
        {winExplosion && Array.from({ length: 120 }).map((_, i) => {
          const angle = Math.random() * Math.PI * 2
          const dist = Math.random() * 250 + 50
          return (
            <div key={i} className="win-particle" style={{
              '--tx': `${Math.cos(angle) * dist}px`,
              '--ty': `${Math.sin(angle) * dist}px`,
              animationDelay: `${Math.random() * 0.3}s`
            }} />
          )
        })}

        {/* Revealed Star inside flash */}
        {won && (
          <div className="star-reveal">
            <svg viewBox="0 0 24 24" fill="#ffd700">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
        )}

        <svg ref={svgRef} viewBox="0 0 340 340" className="connect-svg">
          <defs>
            <linearGradient id="active-line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="50%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#ffaa00" />
            </linearGradient>
            <filter id="ultra-glow" filterUnits="userSpaceOnUse" x="-100" y="-100" width="540" height="540">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="mega-glow" filterUnits="userSpaceOnUse" x="-100" y="-100" width="540" height="540">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Vòng cung viền ma thuật (Magic Frame) */}
          <g className="magic-frame">
            <circle cx="170" cy="170" r="145" fill="none" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="1" strokeDasharray="10 5" />
            <circle cx="170" cy="170" r="155" fill="none" stroke="rgba(255, 215, 0, 0.15)" strokeWidth="6" />
            <circle cx="170" cy="170" r="162" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" strokeDasharray="1 10" />
          </g>

          {/* Đường tâm sao đứt nét dẫn đường */}
          {targetEdges.map((edge) => {
            const [a, b] = edge.split('-').map(Number)
            const n1 = nodes[a], n2 = nodes[b]
            return !edges.includes(edge) && <line key={`guide-${edge}`} x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} className="guide-line" />
          })}

          {/* Đường nối đã khóa - Hiệu ứng 2 lớp sáng chói */}
          {edges.map((edge) => {
            const [a, b] = edge.split('-').map(Number)
            const n1 = nodes[a], n2 = nodes[b]
            return (
              <g key={`locked-${edge}`}>
                <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} className="locked-line-bg" filter="url(#mega-glow)" />
                <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} className="locked-line" filter="url(#ultra-glow)" />
              </g>
            )
          })}

          {/* Đường đang kéo */}
          {drag && <line x1={drag.start.x} y1={drag.start.y} x2={drag.x} y2={drag.y} className="active-line" filter="url(#ultra-glow)" />}
          
          {/* Các điểm sáng (Nodes) */}
          {!won && nodes.map((node) => (
            <g 
              key={node.id} 
              className="connect-node-group" 
              transform={`translate(${node.x}, ${node.y})`}
              onPointerDown={() => setDrag({ start: node, x: node.x, y: node.y })}
            >
              {/* Vòng năng lượng bên ngoài */}
              <circle r="22" fill="none" stroke="rgba(255, 215, 0, 0.4)" strokeWidth="2" className="node-outer-ring" />
              <circle r="15" fill="none" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5" className="node-inner-ring" />
              {/* Vùng bấm (Hitbox) to để dễ kéo */}
              <circle r="30" fill="transparent" cursor="pointer" />
              {/* Hạt nhân */}
              <circle r="10" className="connect-node" filter="url(#ultra-glow)" />
            </g>
          ))}
        </svg>
      </div>
      <div className="minigame-progress"><div className="minigame-progress-fill" style={{ width: `${(edges.length / targetEdges.length) * 100}%` }} /></div>
    </div>
  )
}
