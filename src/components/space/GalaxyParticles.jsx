import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { seededRandom } from './random'

export default function GalaxyParticles() {
  const nearStars = useRef()
  const farMist = useRef()

  const { nearPositions, nearColors, farPositions, farColors } = useMemo(() => {
    const nearCount = 14000
    const farCount = 22000
    const nearPositionsArray = new Float32Array(nearCount * 3)
    const nearColorsArray = new Float32Array(nearCount * 3)
    const farPositionsArray = new Float32Array(farCount * 3)
    const farColorsArray = new Float32Array(farCount * 3)
    const cyan = new THREE.Color('#7edcff')
    const gold = new THREE.Color('#ffd17a')
    const violet = new THREE.Color('#c7b7ff')
    const white = new THREE.Color('#ffffff')

    for (let i = 0; i < nearCount; i += 1) {
      const i3 = i * 3
      const theta = seededRandom(i + 11) * Math.PI * 2
      const phi = Math.acos(2 * seededRandom(i + 23) - 1)
      const radius = 8 + Math.pow(seededRandom(i + 37), 0.72) * 34
      const clusterWave = Math.sin(theta * 3 + radius * 0.18) * 2.2

      nearPositionsArray[i3] = Math.sin(phi) * Math.cos(theta) * radius
      nearPositionsArray[i3 + 1] = Math.cos(phi) * radius * 0.72 + clusterWave
      nearPositionsArray[i3 + 2] = Math.sin(phi) * Math.sin(theta) * radius

      const mixed = white.clone().lerp(seededRandom(i + 51) > 0.55 ? cyan : gold, seededRandom(i + 67) * 0.55)
      nearColorsArray[i3] = mixed.r
      nearColorsArray[i3 + 1] = mixed.g
      nearColorsArray[i3 + 2] = mixed.b
    }

    for (let i = 0; i < farCount; i += 1) {
      const i3 = i * 3
      const theta = seededRandom(i + 101) * Math.PI * 2
      const phi = Math.acos(2 * seededRandom(i + 113) - 1)
      const radius = 28 + Math.pow(seededRandom(i + 127), 0.55) * 58
      const drift = Math.sin(theta * 4.2 + phi * 2.6) * 4

      farPositionsArray[i3] = Math.sin(phi) * Math.cos(theta) * radius
      farPositionsArray[i3 + 1] = Math.cos(phi) * radius + drift
      farPositionsArray[i3 + 2] = Math.sin(phi) * Math.sin(theta) * radius

      const mixed = violet.clone().lerp(cyan, seededRandom(i + 139) * 0.55)
      farColorsArray[i3] = mixed.r
      farColorsArray[i3 + 1] = mixed.g
      farColorsArray[i3 + 2] = mixed.b
    }

    return {
      nearPositions: nearPositionsArray,
      nearColors: nearColorsArray,
      farPositions: farPositionsArray,
      farColors: farColorsArray,
    }
  }, [])

  useFrame((_, delta) => {
    nearStars.current.rotation.y += delta * 0.012
    nearStars.current.rotation.x += delta * 0.004
    farMist.current.rotation.y -= delta * 0.006
    farMist.current.rotation.z += delta * 0.003
  })

  return (
    <group>
      <points ref={farMist}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={farPositions.length / 3} array={farPositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={farColors.length / 3} array={farColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.38}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points ref={nearStars}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={nearPositions.length / 3} array={nearPositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={nearColors.length / 3} array={nearColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.075}
          vertexColors
          transparent
          opacity={0.72}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
