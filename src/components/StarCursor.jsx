import { useEffect, useRef } from 'react'

export default function StarCursor() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    let particles = []
    let mouse = { x: -100, y: -100 }
    let smoothMouse = { x: -100, y: -100 } // For smooth interpolation
    let lastMouse = { x: -100, y: -100 }

    const onResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      if (smoothMouse.x === -100) {
        smoothMouse.x = mouse.x
        smoothMouse.y = mouse.y
        lastMouse.x = mouse.x
        lastMouse.y = mouse.y
      }
    }

    const spawnParticles = (x, y, dx, dy, distance) => {
      const steps = Math.min(Math.floor(distance / 3), 12) 
      const colors = ['#ffffff', '#9ee8ff', '#ffcf73', '#ffffff']
      
      for (let i = 0; i < steps; i++) {
        // Particles drift slightly opposite to movement to create a tail
        const tailVx = -dx * 0.05
        const tailVy = -dy * 0.05
        
        particles.push({
          x: x - dx * (i / steps) + (Math.random() - 0.5) * 6,
          y: y - dy * (i / steps) + (Math.random() - 0.5) * 6,
          life: 1,
          size: Math.random() * 3 + 1,
          vx: tailVx + (Math.random() - 0.5) * 1.5,
          vy: tailVy + (Math.random() - 0.5) * 1.5 + 0.5, 
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)

    let animationFrameId
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      if (mouse.x !== -100) {
        // Lerp smooth mouse
        const dx = mouse.x - smoothMouse.x
        const dy = mouse.y - smoothMouse.y
        smoothMouse.x += dx * 0.35 // Higher value = snappier, lower = smoother
        smoothMouse.y += dy * 0.35
        
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 0.5) {
          spawnParticles(smoothMouse.x, smoothMouse.y, smoothMouse.x - lastMouse.x, smoothMouse.y - lastMouse.y, dist)
        }
        
        lastMouse.x = smoothMouse.x
        lastMouse.y = smoothMouse.y

        // Draw main cursor (star shape)
        ctx.save()
        ctx.translate(smoothMouse.x, smoothMouse.y)
        
        // Glow
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 24)
        glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
        glow.addColorStop(0.2, 'rgba(158, 232, 255, 0.5)')
        glow.addColorStop(1, 'rgba(158, 232, 255, 0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(0, 0, 24, 0, Math.PI * 2)
        ctx.fill()
        
        // Star core (4-point lens flare)
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.moveTo(0, -10)
        ctx.quadraticCurveTo(2, -2, 10, 0)
        ctx.quadraticCurveTo(2, 2, 0, 10)
        ctx.quadraticCurveTo(-2, 2, -10, 0)
        ctx.quadraticCurveTo(-2, -2, 0, -10)
        ctx.closePath()
        ctx.fill()
        
        ctx.restore()
      }

      // Update and draw trail
      ctx.globalCompositeOperation = 'screen'
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.life -= 0.02
        p.x += p.vx
        p.y += p.vy
        
        if (p.life > 0) {
          const pGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * p.life)
          pGlow.addColorStop(0, p.color)
          pGlow.addColorStop(1, 'rgba(0,0,0,0)')
          
          ctx.globalAlpha = p.life
          ctx.fillStyle = pGlow
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalCompositeOperation = 'source-over'
      
      // Remove dead particles
      particles = particles.filter(p => p.life > 0)
      ctx.globalAlpha = 1

      animationFrameId = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999
      }}
    />
  )
}
