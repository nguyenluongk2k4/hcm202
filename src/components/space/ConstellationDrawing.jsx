import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export default function ConstellationDrawing({ quotes, unlockedQuotes, planetSize }) {
  const lineRef = useRef()
  
  // Filter only unlocked quotes and determine their indices in the original array
  const unlockedNodes = useMemo(() => {
    if (!quotes) return []
    return quotes.map((quote, index) => ({ quote, index }))
                 .filter(({ quote }) => unlockedQuotes.includes(quote.id))
  }, [quotes, unlockedQuotes])

  const total = quotes?.length || 1
  const radius = planetSize * 2.15 + 0.42

  useFrame((state) => {
    if (!lineRef.current || unlockedNodes.length < 2) return
    const t = state.clock.elapsedTime

    const points = unlockedNodes.map(({ index }) => {
      const angle = (index / Math.max(total, 1)) * Math.PI * 2 + 0.58
      const baseY = Math.sin(index * 1.73) * planetSize * 0.44 + planetSize * 0.44
      
      return new THREE.Vector3(
        Math.cos(angle) * radius,
        baseY + Math.sin(t * 1.7 + index * 0.8) * 0.1,
        Math.sin(angle) * radius
      )
    })

    // Update line geometry
    lineRef.current.geometry.setFromPoints(points)
  })

  if (unlockedNodes.length < 2) return null

  // We use a raw Three.js line to easily update geometry every frame without recreating Drei's Line
  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#ffcf73" transparent opacity={0.6} linewidth={2} />
    </line>
  )
}
