import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import hoChiMinhImage from '../../assets/HoChiMinhImage.jpg'

export default function GrandFinale({ quotes, planetSize }) {
  const lineRef = useRef()
  const imageGroupRef = useRef()
  const haloRef = useRef()
  const [opacity, setOpacity] = useState(0)
  
  const total = quotes?.length || 1
  const radius = planetSize * 2.15 + 0.42
  const topPoint = useMemo(() => new THREE.Vector3(0, planetSize * 4, 0), [planetSize])

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
        <lineBasicMaterial color="#ffdf8a" transparent opacity={opacity * 0.6} linewidth={2} />
      </lineSegments>

      <group ref={imageGroupRef} position={topPoint}>
        <mesh position={[0, 0, -0.2]}>
          <circleGeometry args={[3.2, 32]} />
          <meshBasicMaterial color="#ffdf8a" transparent opacity={opacity * 0.4} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={haloRef} position={[0, 0, -0.1]}>
          <circleGeometry args={[2.5, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.6} blending={THREE.AdditiveBlending} />
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
            gap: '1.5rem',
            width: '28rem'
          }}>
            <img 
              src={hoChiMinhImage} 
              alt="Bác Hồ" 
              style={{
                width: '18rem',
                borderRadius: '1rem',
                border: '2px solid rgba(255, 223, 138, 0.6)',
                boxShadow: '0 0 60px rgba(255, 223, 138, 0.8)'
              }}
            />
          </div>
        </Html>
      </group>
    </group>
  )
}
