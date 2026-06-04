import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { planetPalette } from '../../data/cosmos'
import BookmarkMarker from './BookmarkMarker'
import OrbitPath from './OrbitPath'
import { createPlanetTexture } from './planetTexture'

export default function PlanetMesh({ planet, selected, unlockedQuotes, onSelect, onDoubleClick, onOpenQuote }) {
  const orbit = useRef()
  const planetGroup = useRef()
  const mesh = useRef()
  const glow = useRef()
  const satellites = useRef()
  const scanRing = useRef()
  const palette = planetPalette[planet.color]
  const texture = useMemo(() => {
    if (typeof document === 'undefined') {
      return null
    }

    return createPlanetTexture(planet, palette)
  }, [planet, palette])

  useFrame((state, delta) => {
    orbit.current.rotation.y = state.clock.elapsedTime * planet.orbitSpeed + planet.phase
    mesh.current.rotation.y += delta * planet.rotationSpeed
    mesh.current.rotation.x = planet.axialTilt
    glow.current.rotation.y -= delta * 0.2
    satellites.current.rotation.y += delta * (selected ? 1.1 : 0.55)
    satellites.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7 + planet.phase) * 0.18
    scanRing.current.rotation.z -= delta * 0.32
  })

  const selectPlanet = (event) => {
    event?.stopPropagation()
    const focusPosition = new THREE.Vector3()
    planetGroup.current.getWorldPosition(focusPosition)
    onSelect({ ...planet, focusPosition: focusPosition.toArray() })
  }

  const handleDoubleClick = (event) => {
    event?.stopPropagation()
    onDoubleClick?.(planet)
  }

  return (
    <group>
      <OrbitPath radius={planet.distance} />
      <group ref={orbit}>
        <group ref={planetGroup} position={[planet.distance, 0, 0]}>
          <mesh ref={mesh} onClick={selectPlanet} onDoubleClick={handleDoubleClick}>
            <sphereGeometry args={[planet.size, 48, 48]} />
            <meshStandardMaterial
              color={palette[1]}
              map={texture}
              emissive={palette[2]}
              emissiveIntensity={selected ? 0.58 : 0.24}
              roughness={0.46}
              metalness={0.16}
              transparent
              opacity={selected ? 1 : 0.78}
            />
          </mesh>
          <mesh ref={glow} scale={selected ? 1.38 : 1.2}>
            <sphereGeometry args={[planet.size, 32, 32]} />
            <meshBasicMaterial
              color={palette[0]}
              transparent
              opacity={selected ? 0.18 : 0.08}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <group ref={satellites}>
            <mesh position={[planet.size * 1.75, planet.size * 0.38, 0]}>
              <sphereGeometry args={[planet.size * 0.08, 12, 12]} />
              <meshBasicMaterial color={palette[0]} transparent opacity={0.9} />
            </mesh>
            <mesh position={[-planet.size * 1.48, -planet.size * 0.2, planet.size * 0.72]}>
              <sphereGeometry args={[planet.size * 0.055, 12, 12]} />
              <meshBasicMaterial color="#fff4b8" transparent opacity={0.82} />
            </mesh>
            <mesh rotation={[1.2, 0.2, 0]}>
              <torusGeometry args={[planet.size * 1.72, 0.01, 8, 96]} />
              <meshBasicMaterial color={palette[0]} transparent opacity={selected ? 0.4 : 0.16} />
            </mesh>
          </group>
          <mesh ref={scanRing} rotation={[1.35, 0, 0]} scale={selected ? 1 : 0.78}>
            <torusGeometry args={[planet.size * 2.05, 0.018, 10, 128]} />
            <meshBasicMaterial
              color={palette[0]}
              transparent
              opacity={selected ? 0.52 : 0}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {planet.id === 'thuc-tien' && (
            <mesh rotation={[0.9, 0, 0.2]}>
              <torusGeometry args={[planet.size * 1.55, 0.025, 12, 120]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.58} />
            </mesh>
          )}
          {planet.quotes?.map((quote, index) => (
            <BookmarkMarker
              key={quote.id}
              quote={quote}
              index={index}
              total={planet.quotes.length}
              planetSize={planet.size}
              unlocked={unlockedQuotes.includes(quote.id)}
              onOpen={() => onOpenQuote(quote, planet)}
            />
          ))}
          <Html position={[0, planet.size + 0.55, 0]} center distanceFactor={13} zIndexRange={[4, 0]}>
            <button className={`space-label ${selected ? 'is-selected' : ''}`} type="button" onClick={selectPlanet} onDoubleClick={handleDoubleClick}>
              <small>{planet.signal}</small>
              {planet.name}
            </button>
          </Html>
        </group>
      </group>
    </group>
  )
}
