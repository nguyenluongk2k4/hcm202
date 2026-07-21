import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

export default function GrandFinale({ quotes, planetSize }) {
  const lineRef = useRef()
  const imageGroupRef = useRef()
  const haloRef = useRef()
  const [opacity, setOpacity] = useState(0)
  
  const total = quotes?.length || 1
  const radius = planetSize * 2.15 + 0.42
  const topPoint = useMemo(() => new THREE.Vector3(0, planetSize * 4, 0), [planetSize])
  const quoteHighlights = useMemo(() => (quotes || []).slice(0, 4), [quotes])

  useEffect(() => {
    let frame
    const animate = () => {
      setOpacity(prev => {
        if (prev < 1) {
          frame = requestAnimationFrame(animate)
          return prev + 0.015
        }
        return 1
      })
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (lineRef.current) {
      const points = []
      quotes.forEach((_, index) => {
        const angle = (index / Math.max(total, 1)) * Math.PI * 2 + 0.58
        const baseY = Math.sin(index * 1.73) * planetSize * 0.44 + planetSize * 0.44
        const startPoint = new THREE.Vector3(
          Math.cos(angle) * radius,
          baseY + Math.sin(t * 1.7 + index * 0.8) * 0.1,
          Math.sin(angle) * radius
        )
        points.push(startPoint, topPoint)
      })
      lineRef.current.geometry.setFromPoints(points)
    }

    if (imageGroupRef.current) {
      imageGroupRef.current.position.y = topPoint.y + Math.sin(t * 1.5) * 0.2
    }
    
    if (haloRef.current) {
      haloRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.05)
    }
  })

  return (
    <group>
      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#ffdf8a" transparent opacity={opacity * 0.34} linewidth={2} />
      </lineSegments>

      <group ref={imageGroupRef} position={topPoint}>
        <mesh position={[0, 0, -0.2]}>
          <circleGeometry args={[3.8, 48]} />
          <meshBasicMaterial color="#ffdf8a" transparent opacity={opacity * 0.24} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={haloRef} position={[0, 0, -0.1]}>
          <circleGeometry args={[2.8, 48]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.42} blending={THREE.AdditiveBlending} />
        </mesh>
        
        <Html transform center distanceFactor={12} zIndexRange={[5, 0]}>
          <div style={{
            opacity: opacity,
            transform: `scale(${0.6 + opacity * 0.4})`,
            transition: 'opacity 0.1s, transform 0.1s',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            width: 'min(34rem, 84vw)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              inset: '-4rem -5rem',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.34), rgba(255,223,138,0.18) 32%, transparent 68%)',
              filter: 'blur(0.5rem)',
              zIndex: -1,
            }} />
            <div
              style={{
                width: 'min(18rem, 62vw)',
                padding: '1.6rem 1rem',
                borderRadius: '1rem',
                border: '2px solid rgba(255, 223, 138, 0.6)',
                boxShadow: '0 0 52px rgba(255, 223, 138, 0.72), 0 0 110px rgba(255, 255, 255, 0.22)',
                background: 'linear-gradient(160deg, rgba(122, 26, 54, 0.85), rgba(5, 10, 22, 0.9))',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2.6rem', lineHeight: 1 }}>☭</div>
              <div style={{
                marginTop: '0.6rem',
                fontSize: 'clamp(1rem, 2.4vw, 1.35rem)',
                fontWeight: 900,
                letterSpacing: '0.08em',
                color: '#fff4b8',
              }}>
                CHỦ NGHĨA XÃ HỘI KHOA HỌC
              </div>
              <div style={{
                marginTop: '0.35rem',
                fontSize: 'clamp(0.72rem, 1.5vw, 0.85rem)',
                color: 'rgba(255, 250, 232, 0.85)',
              }}>
                Hoàn thành toàn bộ hành trình 7 chương
              </div>
            </div>
            <div style={{
              display: 'grid',
              gap: '0.52rem',
              width: '100%',
            }}>
              {quoteHighlights.map((quote, index) => (
                <span
                  key={quote.id}
                  style={{
                    display: 'block',
                    padding: '0.58rem 0.78rem',
                    border: '1px solid rgba(255, 244, 184, 0.28)',
                    borderRadius: '8px',
                    color: 'rgba(255, 250, 232, 0.94)',
                    background: 'linear-gradient(90deg, rgba(255, 223, 138, 0.14), rgba(126, 220, 255, 0.08)), rgba(5, 10, 22, 0.62)',
                    boxShadow: '0 0 22px rgba(255, 223, 138, 0.16)',
                    fontSize: 'clamp(0.72rem, 1.45vw, 0.92rem)',
                    fontWeight: 850,
                    lineHeight: 1.32,
                    opacity,
                    transform: `translateY(${(1 - opacity) * (16 + index * 4)}px)`,
                    transition: `opacity 220ms ease ${index * 90}ms, transform 360ms ease ${index * 90}ms`,
                  }}
                >
                  {quote.text}
                </span>
              ))}
            </div>
          </div>
        </Html>
      </group>
    </group>
  )
}
