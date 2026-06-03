import { OrbitControls, Stars } from '@react-three/drei'
import { useRef } from 'react'
import { planets } from '../../data/cosmos'
import AuroraRibbons from './AuroraRibbons'
import CameraFocus from './CameraFocus'
import CentralPlanet from './CentralPlanet'
import ConstellationLattice from './ConstellationLattice'
import GalaxyParticles from './GalaxyParticles'
import MemoryComets from './MemoryComets'
import NebulaVeils from './NebulaVeils'
import PlanetMesh from './PlanetMesh'
import HolographicArchive from './HolographicArchive'
import WarpDrive from './WarpDrive'

export default function Scene({ selectedPlanet, setSelectedPlanet, unlockedQuotes, onOpenQuote, isWarping, archiveVisible, setArchiveVisible, unlockedQuoteItems, isCompleted }) {
  const controlsRef = useRef()
  const centralPlanet = planets[0]
  const orbitPlanets = planets.filter((planet) => planet.distance > 0)

  return (
    <>
      <color attach="background" args={['#02040b']} />
      <fog attach="fog" args={['#030612', 12, 58]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[7, 9, 6]} intensity={1.6} color="#d9edff" />
      <Stars radius={100} depth={64} count={5200} factor={5} saturation={0.35} fade speed={0.8} />
      <Stars radius={48} depth={26} count={1200} factor={2.2} saturation={0.8} fade speed={1.2} />
      <NebulaVeils />
      <GalaxyParticles />
      <AuroraRibbons />
      <ConstellationLattice />
      <MemoryComets />
      <WarpDrive active={isWarping} />
      
      <HolographicArchive 
        visible={archiveVisible} 
        unlockedQuotes={unlockedQuoteItems} 
        onClose={() => setArchiveVisible(false)} 
        openQuote={onOpenQuote} 
      />
      
      <CameraFocus 
        selectedPlanet={selectedPlanet} 
        controlsRef={controlsRef} 
        archiveVisible={archiveVisible} 
        isCompleted={isCompleted}
      />
      <CentralPlanet
        planet={centralPlanet}
        unlockedQuotes={unlockedQuotes}
        onClick={() => setSelectedPlanet({ ...centralPlanet, focusPosition: [0, 0, 0] })}
        onOpenQuote={onOpenQuote}
        isCompleted={isCompleted}
      />
      {orbitPlanets.map((planet) => (
        <PlanetMesh
          key={planet.id}
          planet={planet}
          selected={selectedPlanet.id === planet.id}
          unlockedQuotes={unlockedQuotes}
          onSelect={setSelectedPlanet}
          onOpenQuote={onOpenQuote}
        />
      ))}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.065}
        minDistance={8}
        maxDistance={46}
        maxPolarAngle={Math.PI * 0.82}
        minPolarAngle={Math.PI * 0.12}
      />
    </>
  )
}
