import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const veils = [
  { position: [-12, 7, -18], scale: [13, 7, 1], color: '#2cb9ff', opacity: 0.13, speed: 0.018 },
  { position: [15, -4, -22], scale: [16, 8, 1], color: '#ff8a5c', opacity: 0.12, speed: -0.014 },
  { position: [-18, -7, 12], scale: [11, 5, 1], color: '#b56cff', opacity: 0.11, speed: 0.016 },
  { position: [18, 8, 8], scale: [10, 6, 1], color: '#fff1a6', opacity: 0.08, speed: -0.012 },
]

export default function NebulaVeils() {
  const group = useRef()

  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.012
    group.current.rotation.z += delta * 0.004
  })

  return (
    <group ref={group}>
      {veils.map((veil) => (
        <mesh key={veil.color + veil.position.join('-')} position={veil.position} scale={veil.scale}>
          <circleGeometry args={[1, 72]} />
          <meshBasicMaterial
            color={veil.color}
            transparent
            opacity={veil.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}
