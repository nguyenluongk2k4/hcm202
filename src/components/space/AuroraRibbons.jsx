import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'

const ribbonConfigs = [
  { color: '#7edcff', opacity: 0.42, y: 5.4, z: -12, phase: 0.2, speed: 0.012 },
  { color: '#ffd17a', opacity: 0.34, y: -2.8, z: -7, phase: 1.8, speed: -0.01 },
  { color: '#ff8fbf', opacity: 0.28, y: 8.2, z: 7, phase: 3.1, speed: 0.008 },
]

export default function AuroraRibbons() {
  const group = useRef()

  const ribbons = useMemo(() => {
    return ribbonConfigs.map((config) => {
      return Array.from({ length: 96 }, (_, index) => {
        const t = index / 95
        const x = -38 + t * 76
        const wave = Math.sin(t * Math.PI * 4 + config.phase)
        const lift = Math.cos(t * Math.PI * 2 + config.phase) * 2.2

        return [x, config.y + wave * 2.8 + lift, config.z + Math.sin(t * Math.PI * 3 + config.phase) * 8]
      })
    })
  }, [])

  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.01
    group.current.rotation.z += delta * 0.003
  })

  return (
    <group ref={group}>
      {ribbons.map((points, index) => (
        <Line
          key={ribbonConfigs[index].color}
          points={points}
          color={ribbonConfigs[index].color}
          transparent
          opacity={ribbonConfigs[index].opacity}
          lineWidth={1.6}
        />
      ))}
    </group>
  )
}
