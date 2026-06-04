import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function CameraFocus({ selectedPlanet, controlsRef, isCompleted }) {
  const { camera } = useThree()
  const animation = useRef(null)
  const previousPlanetId = useRef(selectedPlanet?.id)
  const hasSnappedToFinale = useRef(false)

  useEffect(() => {
    let target, desiredPosition

    if (isCompleted && !hasSnappedToFinale.current) {
      // Focus on Grand Finale Image at [0, 6.88, 0] (Central Planet size is 1.72)
      hasSnappedToFinale.current = true
      target = new THREE.Vector3(0, 6.88, 0)
      desiredPosition = new THREE.Vector3(0, 6.88, 20)
      previousPlanetId.current = null // Force re-run when resetting
    } else {
      if (!selectedPlanet) return
      if (previousPlanetId.current === selectedPlanet.id) return
      previousPlanetId.current = selectedPlanet.id

      target = selectedPlanet.focusPosition
        ? new THREE.Vector3(...selectedPlanet.focusPosition)
        : new THREE.Vector3(0, 0, 0)
      const currentTarget = controlsRef.current?.target?.clone() ?? new THREE.Vector3(0, 0, 0)
      const viewDirection = camera.position.clone().sub(currentTarget).normalize()
      const distance = selectedPlanet.distance > 0 ? 11.5 : 18
      desiredPosition = target
        .clone()
        .add(viewDirection.multiplyScalar(distance))
        .add(new THREE.Vector3(0, selectedPlanet.distance > 0 ? 2.2 : 3.5, 0))
    }

    animation.current = {
      elapsed: 0,
      duration: 1.15,
      fromPosition: camera.position.clone(),
      toPosition: desiredPosition,
      fromTarget: controlsRef.current?.target?.clone() ?? new THREE.Vector3(0, 0, 0),
      toTarget: target,
    }
  }, [camera, controlsRef, selectedPlanet, isCompleted])

  useFrame((_, delta) => {
    if (!animation.current) {
      return
    }

    const item = animation.current
    item.elapsed += delta
    const raw = Math.min(item.elapsed / item.duration, 1)
    const eased = 1 - Math.pow(1 - raw, 3)

    camera.position.lerpVectors(item.fromPosition, item.toPosition, eased)
    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(item.fromTarget, item.toTarget, eased)
      controlsRef.current.update()
    }

    if (raw >= 1) {
      animation.current = null
    }
  })

  return null
}
