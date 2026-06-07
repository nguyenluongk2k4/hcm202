import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

function createBookmarkShape() {
  const shape = new THREE.Shape()
  const width = 0.36
  const height = 0.54
  const notch = 0.1

  shape.moveTo(-width / 2, height / 2)
  shape.lineTo(width / 2, height / 2)
  shape.lineTo(width / 2, -height / 2)
  shape.lineTo(0, -height / 2 + notch)
  shape.lineTo(-width / 2, -height / 2)
  shape.lineTo(-width / 2, height / 2)

  return shape
}

function StardustBurst({ color, onComplete }) {
  const points = useRef()
  const material = useRef()
  
  // Create a soft circle texture for particles
  const particleTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])
  
  const [particles] = useState(() => {
    const count = 72
    const positions = new Float32Array(count * 3)
    const velocities = []
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.1
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1
      
      const phi = Math.acos(-1 + (2 * i) / count)
      const theta = Math.sqrt(count * Math.PI) * phi
      
      const speed = Math.random() * 0.65 + 0.45
      const vx = Math.cos(theta) * Math.sin(phi) * speed
      const vy = Math.sin(theta) * Math.sin(phi) * speed
      const vz = Math.cos(phi) * speed
      
      velocities.push(new THREE.Vector3(vx, vy, vz))
    }
    return { positions, velocities, count }
  })
  
  useFrame((state, delta) => {
    if (!points.current || !material.current) return
    const positions = points.current.geometry.attributes.position.array
    for (let i = 0; i < particles.count; i++) {
      positions[i * 3] += particles.velocities[i].x * delta * 0.9
      positions[i * 3 + 1] += particles.velocities[i].y * delta * 0.9
      positions[i * 3 + 2] += particles.velocities[i].z * delta * 0.9
    }
    points.current.geometry.attributes.position.needsUpdate = true
    
    material.current.opacity -= delta * 0.6
    if (material.current.opacity <= 0) {
      onComplete()
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        size={0.34}
        color={color}
        map={particleTexture}
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={false}
      />
    </points>
  )
}


export default function BookmarkMarker({ quote, index, total, planetSize, unlocked, onOpen }) {
  const marker = useRef()
  const card = useRef()
  const gem = useRef()
  const [bursts, setBursts] = useState([])
  const shape = useMemo(() => createBookmarkShape(), [])
  const angle = useMemo(() => (index / Math.max(total, 1)) * Math.PI * 2 + 0.58, [index, total])
  const radius = planetSize * 2.15 + 0.42
  const position = [
    Math.cos(angle) * radius,
    Math.sin(index * 1.73) * planetSize * 0.44 + planetSize * 0.44,
    Math.sin(angle) * radius,
  ]
  const mainColor = unlocked ? '#fff4b8' : '#9ee8ff'
  const glowColor = unlocked ? '#ffb347' : '#32c7ff'

  useFrame((state) => {
    const t = state.clock.elapsedTime
    marker.current.rotation.y = t * 0.55 + index * 0.6
    marker.current.rotation.z = Math.sin(t * 1.25 + index) * 0.12
    marker.current.position.y = position[1] + Math.sin(t * 1.7 + index * 0.8) * 0.1
    card.current.rotation.x = Math.sin(t * 1.1 + index) * 0.08
    gem.current.scale.setScalar(1 + Math.sin(t * 2.4 + index) * 0.12)
  })

  const openQuote = (event) => {
    event.stopPropagation()
    onOpen(quote)
    setBursts((current) => [...current, Date.now() + Math.random()])
  }

  return (
    <group ref={marker} position={position}>
      <mesh ref={card} onClick={openQuote}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial
          color={mainColor}
          emissive={glowColor}
          emissiveIntensity={unlocked ? 0.92 : 0.74}
          roughness={0.28}
          metalness={0.18}
          side={THREE.DoubleSide}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh position={[0, 0.05, 0.022]} onClick={openQuote}>
        <circleGeometry args={[0.085, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.46} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={gem} position={[0, 0.05, 0.035]} onClick={openQuote}>
        <octahedronGeometry args={[0.06, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={glowColor}
          emissiveIntensity={1.6}
          roughness={0.18}
          metalness={0.35}
        />
      </mesh>
      <mesh scale={1.3}>
        <ringGeometry args={[0.31, 0.34, 64]} />
        <meshBasicMaterial color={glowColor} transparent opacity={unlocked ? 0.34 : 0.24} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh scale={2.1}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial color={glowColor} transparent opacity={unlocked ? 0.13 : 0.08} blending={THREE.AdditiveBlending} />
      </mesh>
      <Html position={[0, 0.45, 0]} center distanceFactor={10} zIndexRange={[4, 0]}>
        <button
          className={`bookmark-label bookmark-label--card ${unlocked ? 'is-unlocked' : ''}`}
          type="button"
          aria-label={`Mở bookmark ${quote.id}`}
          onClick={onOpen.bind(null, quote)}
        >
          <span />
        </button>
      </Html>
      {/* Invisible Hitbox for easier clicking */}
      <mesh visible={false} onClick={openQuote}>
        <sphereGeometry args={[0.8, 16, 16]} />
      </mesh>
      {bursts.map((id) => (
        <StardustBurst
          key={id}
          color={glowColor}
          onComplete={() => setBursts((current) => current.filter((b) => b !== id))}
        />
      ))}
    </group>
  )
}
