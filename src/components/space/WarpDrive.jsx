import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

export default function WarpDrive({ active }) {
  const pointsRef = useRef()
  const materialRef = useRef()
  const [visible, setVisible] = useState(active)

  useEffect(() => {
    if (active) {
      setVisible(true)
      if (materialRef.current) materialRef.current.opacity = 1
    }
  }, [active])

  const particleCount = 400
  const particles = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100
      pos[i * 3 + 2] = (Math.random() - 0.5) * 150
    }
    return pos
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) return

    if (active) {
      // Move particles towards camera (positive Z direction)
      const positions = pointsRef.current.geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 2] += delta * 120 // Fast speed
        if (positions[i * 3 + 2] > 50) {
          positions[i * 3 + 2] = -100 // Reset far back
          positions[i * 3] = (Math.random() - 0.5) * 100
          positions[i * 3 + 1] = (Math.random() - 0.5) * 100
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    } else {
      // Fade out
      materialRef.current.opacity -= delta * 1.5
      if (materialRef.current.opacity <= 0) {
        setVisible(false)
      } else {
        // Still move slightly while fading
        const positions = pointsRef.current.geometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 2] += delta * 40
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true
      }
    }
  })

  // Create a stretched star texture
  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 16
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createLinearGradient(0, 0, 0, 128)
    gradient.addColorStop(0, 'rgba(255,255,255,0)')
    gradient.addColorStop(0.5, 'rgba(126,220,255,1)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 16, 128)
    return new THREE.CanvasTexture(canvas)
  }, [])

  if (!visible) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={2.5}
        map={texture}
        transparent
        opacity={active ? 1 : 0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
