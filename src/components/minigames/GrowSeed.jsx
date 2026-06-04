import { useState, useEffect, useRef, useMemo } from 'react'
import './GrowSeed.css'

function easeOutBack(x) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

// Lược bỏ bớt cánh thừa, tập trung vào dáng điệu thanh thoát, kiêu sa của 12 cánh sen.
// Trình tự vẽ tuần tự từ ngoài vào trong một cách cực kỳ mượt mà.
const lotusPetals = [
  // Lớp ngoài (Back)
  { id: 'l1-1', angle: -65, scale: 1.1, size: 'L', grad: 'grad-outer', drawOrder: 0 },
  { id: 'l1-2', angle: -35, scale: 1.15, size: 'L', grad: 'grad-mid', drawOrder: 1 },
  { id: 'l1-3', angle: 0, scale: 1.25, size: 'L', grad: 'grad-outer', drawOrder: 2 },
  { id: 'l1-4', angle: 35, scale: 1.15, size: 'L', grad: 'grad-mid', drawOrder: 3 },
  { id: 'l1-5', angle: 65, scale: 1.1, size: 'L', grad: 'grad-outer', drawOrder: 4 },
  
  // Lớp giữa (Middle)
  { id: 'l2-1', angle: -45, scale: 0.95, size: 'M', grad: 'grad-mid', drawOrder: 5 },
  { id: 'l2-2', angle: -15, scale: 1.05, size: 'M', grad: 'grad-inner', drawOrder: 6 },
  { id: 'l2-3', angle: 15, scale: 1.05, size: 'M', grad: 'grad-inner', drawOrder: 7 },
  { id: 'l2-4', angle: 45, scale: 0.95, size: 'M', grad: 'grad-mid', drawOrder: 8 },
  
  // Lớp trong (Bud)
  { id: 'l3-1', angle: -20, scale: 0.8, size: 'S', grad: 'grad-inner', drawOrder: 9 },
  { id: 'l3-2', angle: 0, scale: 0.9, size: 'S', grad: 'grad-gold', drawOrder: 10 },
  { id: 'l3-3', angle: 20, scale: 0.8, size: 'S', grad: 'grad-inner', drawOrder: 11 },
]

// Hình dáng giọt nước thuôn nhọn thanh tú, mang phong cách nghệ thuật ma thuật
const getPathData = (size) => {
  if (size === 'L') return "M0,0 C-50,-60 -30,-140 0,-170 C30,-140 50,-60 0,0"
  if (size === 'M') return "M0,0 C-35,-45 -20,-110 0,-130 C20,-110 35,-45 0,0"
  if (size === 'S') return "M0,0 C-25,-30 -15,-80 0,-95 C15,-80 25,-30 0,0"
  return "M0,0 C-50,-60 -30,-140 0,-170 C30,-140 50,-60 0,0"
}

export default function GrowSeed({ onWin }) {
  const [progress, setProgress] = useState(0)
  const [won, setWon] = useState(false)
  const [fireflies, setFireflies] = useState([])
  const [leaves, setLeaves] = useState([])
  
  const isGrowing = useRef(false)
  const intervalRef = useRef(null)

  const sparkles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 150;
      return {
        id: i,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius - 50,
        delay: Math.random() * 2,
        duration: 0.8 + Math.random() * 1.5,
        scale: 0.5 + Math.random() * 2,
      }
    })
  }, [])

  const handlePointerDown = (e) => {
    if (won) return
    e.preventDefault()
    isGrowing.current = true
    
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
            setWon(true)
            setTimeout(() => onWin(), 5000)
            return 100
          }
          return p + 0.18 
        })
      }, 30)
    }
  }

  const handlePointerUp = () => {
    if (won) return
    isGrowing.current = false
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  useEffect(() => {
    const decayInterval = setInterval(() => {
      if (!isGrowing.current && progress > 0 && progress < 100) {
        setProgress((p) => Math.max(0, p - 0.25))
      }
    }, 50)
    return () => clearInterval(decayInterval)
  }, [progress])

  useEffect(() => {
    if (progress > 20 && fireflies.length === 0) {
      const f = Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        x: Math.random() * 360,
        y: Math.random() * 360,
        delay: Math.random() * 2,
        speed: 1 + Math.random() * 2,
        size: 2 + Math.random() * 4
      }))
      setFireflies(f)
    } else if (progress <= 5 && fireflies.length > 0) {
      setFireflies([]) 
    }
    
    if (won && leaves.length === 0) {
      const l = Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: Math.random() * 360,
        y: 360 + Math.random() * 80,
        delay: Math.random() * 2.5,
        sway: Math.random() * 60 - 30,
        scale: 0.4 + Math.random() * 1.0
      }))
      setLeaves(l)
    }
  }, [progress, won, fireflies.length, leaves.length])

  // 0 -> 70: Drawing multi-colored glowing paths
  // 70 -> 100: Blooming explosion
  const drawPhase = Math.min(1, progress / 70)
  const bloomPhase = Math.max(0, (progress - 70) / 30)
  const bounce = Math.max(0, easeOutBack(bloomPhase))

  return (
    <div className="minigame-grow-tree">
      <p className="minigame-instruction">
        {won ? 'Tuyệt tác Đóa Sen Thần Kỳ đã bừng sáng!' : 'Nhấn giữ để thắp sáng từng nét ma thuật'}
      </p>

      <div 
        className={`tree-container ${won ? 'is-won' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: 'none', background: 'linear-gradient(180deg, #09090b 0%, #1e1b4b 50%, #2e1065 100%)' }}
      >
        <div className="tree-sky-bg" style={{ opacity: 0.3 }} />
        <div className="tree-moon" style={{ background: 'radial-gradient(circle at 30% 30%, #fff 0%, #f9a8d4 40%, #c026d3 100%)', boxShadow: '0 0 40px rgba(192, 38, 211, 0.4)' }} />
        
        {isGrowing.current && !won && <div className="tree-energy-ray" />}

        <svg className="tree-canvas" viewBox="0 0 360 360">
          <ellipse cx="180" cy="320" rx="140" ry="25" fill="url(#waterGlow)" opacity={(progress / 100) * 0.8} />
          
          <defs>
            <radialGradient id="waterGlow">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#c026d3" stopOpacity="0" />
            </radialGradient>
            
            <filter id="neonGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <filter id="strongGlow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Màu Gradient cực kỳ rực rỡ và lôi cuốn, chuyển sắc từ Tím -> Hồng -> Vàng */}
            <linearGradient id="grad-outer" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#4c1d95" />
              <stop offset="60%" stopColor="#c026d3" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
            <linearGradient id="grad-mid" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#701a75" />
              <stop offset="50%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#f9a8d4" />
            </linearGradient>
            <linearGradient id="grad-inner" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#be185d" />
              <stop offset="40%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>
            <linearGradient id="grad-gold" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>

          {/* Vụ nổ ánh sáng trung tâm khi vừa bắt đầu bung nở */}
          {bloomPhase > 0 && bloomPhase < 0.9 && (
            <circle 
              cx="180" cy="270" 
              r={bloomPhase * 350} 
              fill="url(#grad-gold)" 
              opacity={(1 - bloomPhase / 0.9) * 0.4} 
              filter="url(#strongGlow)" 
              style={{ mixBlendMode: 'screen' }}
            />
          )}

          <g transform="translate(180, 310)">
            {lotusPetals.map((petal) => {
              const N = lotusPetals.length
              const duration = 0.2 // Mỗi nét vẽ chiếm 20%
              const stagger = (1 - duration) / (N - 1)
              const startDraw = petal.drawOrder * stagger
              const endDraw = startDraw + duration
              
              let localDrawProgress = 0
              if (drawPhase >= endDraw) localDrawProgress = 1
              else if (drawPhase <= startDraw) localDrawProgress = 0
              else localDrawProgress = (drawPhase - startDraw) / (endDraw - startDraw)

              const strokeOffset = 100 - (localDrawProgress * 100)
              
              // Cánh hoa lan tỏa sẵn từ đầu để người dùng thưởng thức trọn vẹn nét vẽ 
              // Bung rộng hơn nữa khi nở ra.
              const currentAngle = petal.angle * (0.8 + 0.2 * bounce)
              const currentScale = petal.scale * (0.8 + 0.2 * bounce)
              
              // Fill Opacity: Lúc đang vẽ là 0. Khi vẽ xong 1 nét, nó mờ nhẹ (20%) để không bị trống. Nở thì sáng bừng 90%
              const fillOpacity = localDrawProgress === 1 ? (0.2 + bloomPhase * 0.7) : 0
              
              const isDrawingRightNow = localDrawProgress > 0 && localDrawProgress < 1
              
              // Stroke Opacity mờ đi khi hoa nở, tạo hiệu ứng mềm mại hòa quyện
              const strokeOpacity = drawPhase > 0 ? (1 - bloomPhase * 0.8) : 0

              return (
                <g key={petal.id} transform={`rotate(${currentAngle}) scale(${currentScale})`} style={{ transformOrigin: '0px 0px' }}>
                  {/* Cánh hoa (Fill & Stroke) */}
                  <path 
                    className="petal-advanced"
                    d={getPathData(petal.size)}
                    fill={`url(#${petal.grad})`}
                    fillOpacity={fillOpacity}
                    stroke={`url(#${petal.grad})`}  // <-- QUAN TRỌNG: Nét vẽ mang màu sắc cầu vồng cực đẹp thay vì màu trắng trơn
                    strokeWidth={isDrawingRightNow ? 4 : 2} 
                    strokeOpacity={strokeOpacity}
                    strokeLinecap="round"
                    pathLength="100"
                    strokeDasharray="100"
                    strokeDashoffset={strokeOffset}
                    filter={isDrawingRightNow || bloomPhase > 0 ? 'url(#neonGlow)' : 'none'}
                    style={{ mixBlendMode: bloomPhase > 0 ? 'lighten' : 'normal' }} // Hiệu ứng pha màu thần kỳ khi bung nở
                  />
                  
                  {/* Đốm sáng rực rỡ chạy dọc theo đầu cọ (Pen tip) */}
                  {isDrawingRightNow && (
                    <path 
                      d={getPathData(petal.size)}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="6"
                      strokeLinecap="round"
                      pathLength="100"
                      strokeDasharray="1 100"
                      strokeDashoffset={strokeOffset}
                      filter="url(#strongGlow)"
                    />
                  )}
                </g>
              )
            })}
            
            {/* Lõi hoa thần kỳ chói lọi */}
            {bloomPhase > 0 && (
              <circle 
                cx="0" cy="-30" 
                r={25 * bounce} 
                fill="#ffffff" 
                filter="url(#strongGlow)"
                opacity={Math.min(1, bloomPhase * 2)}
              />
            )}
            
            {bloomPhase > 0 && (
              <circle 
                cx="0" cy="-30" 
                r={50 * bounce} 
                fill="url(#grad-gold)" 
                filter="url(#neonGlow)"
                opacity={Math.min(0.8, bloomPhase * 2)}
                style={{ mixBlendMode: 'screen' }}
              />
            )}

            {/* Hàng loạt ngôi sao cực kỳ lấp lánh chớp tắt */}
            {bloomPhase > 0 && sparkles.map(sp => (
              <g 
                key={sp.id} 
                transform={`translate(${sp.x}, ${sp.y}) scale(${sp.scale * Math.min(1, bloomPhase * 3)})`} 
              >
                <g
                  className="sparkle-star"
                  style={{
                    animationDelay: `${sp.delay}s`,
                    animationDuration: `${sp.duration}s`
                  }}
                >
                  <path d="M0,-12 Q0,0 12,0 Q0,0 0,12 Q0,0 -12,0 Q0,0 0,-12" fill="#ffffff" filter="url(#strongGlow)" />
                </g>
              </g>
            ))}
          </g>
        </svg>

        {fireflies.map(f => (
          <div 
            key={f.id} 
            className="tree-firefly"
            style={{
              left: `${f.x}px`,
              top: `${f.y}px`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              background: '#fde047',
              boxShadow: '0 0 12px 3px #eab308',
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.speed * 3}s`
            }}
          />
        ))}

        {won && leaves.map(l => (
          <div 
            key={l.id} 
            className="tree-falling-leaf"
            style={{
              left: `${l.x}px`,
              top: `${l.y}px`,
              transform: `scale(${l.scale})`,
              background: 'linear-gradient(135deg, #fbcfe8 0%, #db2777 100%)',
              animationDelay: `${l.delay}s`,
              '--sway': `${l.sway}px`
            }}
          />
        ))}

        <div className="tree-ground-texture" />
      </div>
      
      <div className="minigame-progress">
        <div 
          className="minigame-progress-fill" 
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #c026d3, #f472b6, #fde047)', boxShadow: '0 0 15px #f472b6' }} 
        />
      </div>
    </div>
  )
}
