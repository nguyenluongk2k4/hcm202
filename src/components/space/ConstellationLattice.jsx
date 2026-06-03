import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { seededRandom } from './random'

export default function ConstellationLattice() {
  const group = useRef()

  const clusters = useMemo(() => {
    return Array.from({ length: 7 }, (_, clusterIndex) => {
      const baseAngle = (clusterIndex / 7) * Math.PI * 2
      const baseRadius = 12 + clusterIndex * 2.7
      const baseY = -5 + seededRandom(clusterIndex + 30) * 12
      const points = Array.from({ length: 5 }, (_, pointIndex) => {
        const angle = baseAngle + (pointIndex - 2) * 0.14
        const radius = baseRadius + seededRandom(clusterIndex * 10 + pointIndex) * 3
        return [
          Math.cos(angle) * radius,
          baseY + (seededRandom(clusterIndex * 13 + pointIndex + 9) - 0.5) * 5,
          Math.sin(angle) * radius,
        ]
      })

      return points
    })
  }, [])

  useFrame((_, delta) => {
    group.current.rotation.y -= delta * 0.01
  })

  return (
    <group ref={group}>
      {clusters.map((points, clusterIndex) => (
        <group key={clusterIndex}>
          <Line points={points} color={clusterIndex % 2 === 0 ? '#7edcff' : '#ffd17a'} transparent opacity={0.34} lineWidth={1} />
          {points.map((point, pointIndex) => (
            <mesh key={`${clusterIndex}-${pointIndex}`} position={point}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.86} blending={THREE.AdditiveBlending} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
