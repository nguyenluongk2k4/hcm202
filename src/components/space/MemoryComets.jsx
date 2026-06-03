import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const cometConfigs = [
  { radius: 8.8, height: 4.8, speed: 0.18, color: '#fff4b8', phase: 0.4 },
  { radius: 15.6, height: -3.6, speed: -0.11, color: '#7edcff', phase: 2.4 },
  { radius: 23.5, height: 7.2, speed: 0.075, color: '#ff9d7a', phase: 4.1 },
]

export default function MemoryComets() {
  const refs = useRef([])

  const trails = useMemo(() => {
    return cometConfigs.map((config) => {
      return Array.from({ length: 24 }, (_, index) => {
        const offset = index * 0.045
        const angle = config.phase - offset
        return [
          Math.cos(angle) * config.radius,
          config.height - index * 0.018,
          Math.sin(angle) * config.radius,
        ]
      })
    })
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    cometConfigs.forEach((config, index) => {
      const angle = config.phase + time * config.speed
      const comet = refs.current[index]
      if (!comet) {
        return
      }

      comet.position.set(Math.cos(angle) * config.radius, config.height + Math.sin(time * 0.8 + index) * 0.45, Math.sin(angle) * config.radius)
    })
  })

  return (
    <group>
      {cometConfigs.map((config, index) => (
        <group key={config.color}>
          <Line points={trails[index]} color={config.color} transparent opacity={0.38} lineWidth={1.2} />
          <mesh ref={(node) => { refs.current[index] = node }}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color={config.color} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
