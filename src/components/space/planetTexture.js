import * as THREE from 'three'

const textureThemes = {
  'doc-lap': { mode: 'radiant', colors: ['#fff4b8', '#f7b84d', '#8d5529'], streak: '#ffffff' },
  'dao-duc': { mode: 'ember', colors: ['#ffd0c4', '#ff715d', '#7a1a36'], streak: '#fff4b8' },
  'van-hoa': { mode: 'river', colors: ['#d2f3ff', '#668cff', '#25337a'], streak: '#d5ffe9' },
  'dai-doan-ket': { mode: 'web', colors: ['#ead9ff', '#9f62ff', '#2a1974'], streak: '#ffd17a' },
  'nha-nuoc': { mode: 'grid', colors: ['#d5ffe9', '#45d88f', '#125b5e'], streak: '#ffffff' },
  'nguon-goc': { mode: 'spiral', colors: ['#b9f7ff', '#21b8ff', '#123c76'], streak: '#fff4b8' },
  'phong-cach': { mode: 'paper', colors: ['#ffffff', '#a9c0dc', '#3d4e70'], streak: '#fff4b8' },
  'nhan-van': { mode: 'petal', colors: ['#ffe1ee', '#ff78ad', '#6b1b60'], streak: '#ffffff' },
  'quoc-te': { mode: 'orbit', colors: ['#b9f7ff', '#21b8ff', '#123c76'], streak: '#ead9ff' },
  'thanh-nien': { mode: 'pulse', colors: ['#ead9ff', '#9f62ff', '#2a1974'], streak: '#7edcff' },
  'thuc-hanh': { mode: 'grid', colors: ['#d5ffe9', '#45d88f', '#125b5e'], streak: '#ffd17a' },
}

function drawNoise(ctx, size, seed) {
  for (let i = 0; i < 1700; i += 1) {
    const x = Math.abs(Math.sin((i + seed) * 12.9898)) * size
    const y = Math.abs(Math.sin((i + seed) * 78.233)) * size
    const alpha = 0.035 + (Math.sin(i * 1.7 + seed) + 1) * 0.025
    ctx.fillStyle = `rgba(255,255,255,${alpha})`
    ctx.fillRect(x % size, y % size, 1.4, 1.4)
  }
}

function drawTheme(ctx, size, theme, seed) {
  ctx.globalCompositeOperation = 'screen'
  ctx.lineCap = 'round'

  if (theme.mode === 'web') {
    for (let i = 0; i < 16; i += 1) {
      ctx.strokeStyle = i % 2 ? 'rgba(255,209,122,0.24)' : 'rgba(255,255,255,0.18)'
      ctx.lineWidth = 1 + (i % 3)
      ctx.beginPath()
      ctx.moveTo(0, (i / 16) * size)
      ctx.bezierCurveTo(size * 0.3, size * 0.15 + i * 8, size * 0.66, size * 0.8 - i * 5, size, ((i + 2) / 16) * size)
      ctx.stroke()
    }
  }

  if (theme.mode === 'river') {
    for (let i = 0; i < 13; i += 1) {
      ctx.strokeStyle = i % 2 ? 'rgba(213,255,233,0.28)' : 'rgba(255,255,255,0.16)'
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(-20, i * 34)
      ctx.bezierCurveTo(size * 0.3, i * 26 + 80, size * 0.68, i * 36 - 90, size + 20, i * 31)
      ctx.stroke()
    }
  }

  if (theme.mode === 'ember' || theme.mode === 'radiant') {
    for (let i = 0; i < 28; i += 1) {
      const angle = (i / 28) * Math.PI * 2
      ctx.strokeStyle = `rgba(255,244,184,${theme.mode === 'radiant' ? 0.22 : 0.14})`
      ctx.lineWidth = theme.mode === 'radiant' ? 2 : 1.2
      ctx.beginPath()
      ctx.moveTo(size / 2, size / 2)
      ctx.lineTo(size / 2 + Math.cos(angle) * size * 0.72, size / 2 + Math.sin(angle) * size * 0.72)
      ctx.stroke()
    }
  }

  if (theme.mode === 'grid') {
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 1
    for (let i = 0; i < size; i += 32) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i + Math.sin(i + seed) * 32, size)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(size, i + Math.cos(i + seed) * 28)
      ctx.stroke()
    }
  }

  if (theme.mode === 'spiral' || theme.mode === 'orbit' || theme.mode === 'pulse') {
    for (let i = 0; i < 8; i += 1) {
      ctx.strokeStyle = i % 2 ? 'rgba(255,255,255,0.2)' : 'rgba(126,220,255,0.25)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(size / 2, size / 2, size * (0.18 + i * 0.045), size * (0.08 + i * 0.025), i * 0.28, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  if (theme.mode === 'paper' || theme.mode === 'petal') {
    for (let i = 0; i < 18; i += 1) {
      ctx.fillStyle = theme.mode === 'paper' ? 'rgba(255,244,184,0.12)' : 'rgba(255,255,255,0.13)'
      ctx.beginPath()
      ctx.ellipse(
        (Math.sin(i * 4.2 + seed) * 0.42 + 0.5) * size,
        (Math.cos(i * 3.1 + seed) * 0.42 + 0.5) * size,
        18 + (i % 4) * 7,
        5 + (i % 3) * 4,
        i * 0.6,
        0,
        Math.PI * 2,
      )
      ctx.fill()
    }
  }
}

export function createPlanetTexture(planet, fallbackPalette) {
  const theme = textureThemes[planet.id] ?? { mode: 'spiral', colors: fallbackPalette, streak: fallbackPalette[0] }
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const seed = planet.id.split('').reduce((total, char) => total + char.charCodeAt(0), 0)

  const gradient = ctx.createRadialGradient(size * 0.35, size * 0.28, size * 0.04, size * 0.5, size * 0.5, size * 0.78)
  gradient.addColorStop(0, theme.colors[0])
  gradient.addColorStop(0.42, theme.colors[1])
  gradient.addColorStop(1, theme.colors[2])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  drawTheme(ctx, size, theme, seed)
  drawNoise(ctx, size, seed)

  ctx.globalCompositeOperation = 'screen'
  for (let i = 0; i < 18; i += 1) {
    ctx.strokeStyle = `rgba(255,255,255,${0.08 + (i % 3) * 0.035})`
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(-20, i * 31)
    ctx.bezierCurveTo(size * 0.25, i * 23 + 80, size * 0.72, i * 39 - 70, size + 20, i * 29)
    ctx.stroke()
  }

  ctx.globalCompositeOperation = 'multiply'
  const shade = ctx.createLinearGradient(0, 0, size, size)
  shade.addColorStop(0, 'rgba(255,255,255,0.1)')
  shade.addColorStop(0.62, 'rgba(24,18,44,0.08)')
  shade.addColorStop(1, 'rgba(0,0,0,0.32)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 1)
  texture.anisotropy = 4

  return texture
}
