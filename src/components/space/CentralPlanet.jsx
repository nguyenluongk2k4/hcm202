import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { planetPalette } from '../../data/cosmos'
import BookmarkMarker from './BookmarkMarker'
import ConstellationDrawing from './ConstellationDrawing'
import GrandFinale from './GrandFinale'
import { createPlanetTexture } from './planetTexture'

export default function CentralPlanet({ planet, unlockedQuotes, onClick, onDoubleClick, onOpenQuote, isCompleted }) {
  const core = useRef()
  const halo = useRef()
  const texture = useMemo(() => {
    if (typeof document === 'undefined') {
      return null
    }

    return createPlanetTexture(planet, planetPalette[planet.color])
  }, [planet])

  useFrame((_, delta) => {
    core.current.rotation.y += delta * 0.22
    halo.current.rotation.z -= delta * 0.08
  })

  return (
    <group>
      <mesh ref={halo}>
        <torusGeometry args={[2.35, 0.025, 16, 180]} />
        <meshBasicMaterial color="#ffcf73" transparent opacity={0.62} />
      </mesh>
      <mesh rotation={[0.45, 0, -0.2]}>
        <torusGeometry args={[2.7, 0.018, 16, 180]} />
        <meshBasicMaterial color="#82ddff" transparent opacity={0.36} />
      </mesh>
      <mesh ref={core} onClick={onClick} onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick?.(planet); }}>
        <sphereGeometry args={[1.72, 64, 64]} />
        <meshStandardMaterial
          color="#f0a45e"
          map={texture}
          emissive="#9b3f7f"
          emissiveIntensity={0.35}
          roughness={0.42}
          metalness={0.12}
        />
      </mesh>
      <mesh scale={1.13}>
        <sphereGeometry args={[1.72, 64, 64]} />
        <meshBasicMaterial color="#ff7fa6" transparent opacity={0.12} blending={THREE.AdditiveBlending} />
      </mesh>
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
      <ConstellationDrawing 
        quotes={planet.quotes} 
        unlockedQuotes={unlockedQuotes} 
        planetSize={planet.size} 
      />
      {isCompleted && (
        <GrandFinale 
          quotes={planet.quotes} 
          planetSize={planet.size} 
        />
      )}
      <Html position={[0, 2.35, 0]} center distanceFactor={10} zIndexRange={[4, 0]}>
        <button className="space-label primary-label" type="button" onClick={onClick} onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick?.(planet); }}>
          <small>{planet.signal}</small>
          {planet.name}
        </button>
      </Html>
      <pointLight intensity={22} distance={38} color="#ffd08a" />
    </group>
  )
}
