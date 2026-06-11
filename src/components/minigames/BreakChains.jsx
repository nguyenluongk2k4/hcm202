import { memo, useMemo, useRef, useState } from 'react'
import banDoVn from '../../assets/ban_do_VN.png'
import './BreakChains.css'

const DIALS_CONFIG = [
  { letters: ['G', 'M', 'Đ', 'H', 'N', 'T'], target: 2, clue: 'Quyền' },
  { letters: ['A', 'Ô', 'Ộ', 'Ơ', 'U', 'Ê'], target: 2, clue: 'Sống' },
  { letters: ['M', 'C', 'K', 'Q', 'B', 'T'], target: 1, clue: 'Chính' },
  { letters: ['B', 'T', 'L', 'N', 'H', 'V'], target: 2, clue: 'Đáng' },
  { letters: ['E', 'A', 'Ậ', 'Ư', 'Ê', 'Ô'], target: 2, clue: 'Tự' },
  { letters: ['K', 'C', 'D', 'P', 'R', 'S'], target: 3, clue: 'Do' },
  { letters: ['S', 'B', 'N', 'O', 'T', 'M'], target: 4, clue: 'Bình' },
  { letters: ['I', 'A', 'E', 'Ự', 'O', 'M'], target: 3, clue: 'Đẳng' },
  { letters: ['V', 'C', 'D', 'H', 'T', 'L'], target: 2, clue: 'Bác' },
  { letters: ['U', 'O', 'Q', 'M', 'S', 'V'], target: 1, clue: 'Ái' },
]

const colorTokens  = ['#ffffff', '#fef08a', '#38bdf8', '#fb7185', '#fbbf24', '#a5f3fc']

function seededRatio(index, salt = 1) {
  const value = Math.sin(index * 78.233 + salt * 29.911) * 10000
  return value - Math.floor(value)
}

function isSolved(values) {
  return values.every((v, i) => v === DIALS_CONFIG[i].target)
}

const Dial = memo(({ index, value, lastDial, flashDial, onDialPointerDown }) => {
  const config = DIALS_CONFIG[index]
  const isCorrect = value === config.target

  return (
    <div
      className={[
        'dial',
        isCorrect ? 'is-correct' : '',
        lastDial === index ? 'is-spinning' : '',
        flashDial === index ? 'is-flash' : '',
      ].join(' ')}
    >
      <button
        className="dial-btn up"
        type="button"
        onPointerDown={() => onDialPointerDown(index, -1)}
        aria-label={`Lùi trục ${index + 1}`}
      >
        ▲
      </button>
      <div className="dial-window">
        {isCorrect && <div className="dial-correct-glow" />}
        <div
          className="dial-strip"
          style={{ transform: `rotateX(${value * 60}deg)` }}
        >
          {config.letters.map((char, charIdx) => (
            <div
              key={char}
              className={`dial-char ${value === charIdx ? 'is-active' : ''}`}
              style={{ transform: `rotateX(${-charIdx * 60}deg) translateZ(86px)` }}
            >
              {char}
            </div>
          ))}
        </div>
      </div>
      <button
        className="dial-btn down"
        type="button"
        onPointerDown={() => onDialPointerDown(index, 1)}
        aria-label={`Tiến trục ${index + 1}`}
      >
        ▼
      </button>
      <span className="dial-clue">{config.clue}</span>
    </div>
  )
})

export default function BreakChains({ onWin, onSolved }) {
  const [dials, setDials]         = useState(() => Array(DIALS_CONFIG.length).fill(0))
  const [won, setWon]             = useState(false)
  const [showFinale, setShowFinale] = useState(false)
  const [lastDial, setLastDial]   = useState(null)
  const [flashDial, setFlashDial] = useState(null)
  const wonRef = useRef(false)

  const sparks = useMemo(() =>
    Array.from({ length: 24 }).map((_, i) => ({
      id:       i,
      angle:    seededRatio(i, 1) * 360,
      dist:     110 + seededRatio(i, 2) * 420,
      delay:    seededRatio(i, 3) * 0.7,
      duration: 2.1 + seededRatio(i, 4) * 1.8,
      size:     3 + seededRatio(i, 5) * 7,
      color:    colorTokens[Math.floor(seededRatio(i, 6) * colorTokens.length)],
    })), [])

  const shards = useMemo(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id:       i,
      left:     seededRatio(i, 7) * 100,
      top:      10 + seededRatio(i, 8) * 68,
      angle:    -180 + seededRatio(i, 9) * 360,
      fall:     100 + seededRatio(i, 10) * 260,
      delay:    seededRatio(i, 11) * 1.0,
      duration: 2.3 + seededRatio(i, 12) * 2.2,
      scale:    0.5 + seededRatio(i, 13) * 1.1,
    })), [])

  const correctCount = dials.filter((v, i) => v === DIALS_CONFIG[i].target).length
  const progress     = won ? 100 : (correctCount / DIALS_CONFIG.length) * 100
  const phrase       = dials.map((v, i) => DIALS_CONFIG[i].letters[v]).join('')

  const complete = () => {
    wonRef.current = true
    onSolved?.()
    setWon(true)
    window.setTimeout(() => setShowFinale(true), 2500)
    window.setTimeout(onWin, 25000)
  }

  const handleShift = (dialIndex, direction) => {
    if (wonRef.current) return

    setFlashDial(dialIndex)
    window.setTimeout(() => setFlashDial(null), 80)

    setDials((current) => {
      const next   = [...current]
      const length = DIALS_CONFIG[dialIndex].letters.length
      next[dialIndex] = (next[dialIndex] + direction + length) % length

      setLastDial(dialIndex)
      window.setTimeout(() => setLastDial(null), 150)

      if (isSolved(next)) complete()
      return next
    })
  }

  const handleDialPointerDown = (dialIndex, direction) => {
    if (wonRef.current) return
    handleShift(dialIndex, direction)

    const interval = setInterval(() => {
      if (wonRef.current) { clearInterval(interval); return }
      handleShift(dialIndex, direction)
    }, 150)

    const stop = () => {
      clearInterval(interval)
    }
    window.addEventListener('pointerup', stop, { once: true })
    window.addEventListener('pointercancel', stop, { once: true })
  }

  return (
    <div className={`minigame-break ${won ? 'is-won' : ''} ${showFinale ? 'is-final-scene' : ''}`}>
      <h2 className="minigame-instruction">
        {won
          ? 'Khóa đã vỡ — độc lập không dừng ở cánh cửa mở, mà dẫn tới tự do và hạnh phúc.'
          : `Xoay ${DIALS_CONFIG.length} trục mật mã để tìm từ khóa ĐỘC LẬP TỰ DO. (${dials.filter((v, i) => v === DIALS_CONFIG[i].target).length}/${DIALS_CONFIG.length} đúng)`}
      </h2>

      <div className={`break-container ${won ? 'is-won' : ''} ${showFinale ? 'show-finale' : ''}`}>
        <div className="freedom-sky" />
        <div className="freedom-scanlines" />
        <div className="freedom-orbit freedom-orbit--one" aria-hidden="true" />
        <div className="freedom-orbit freedom-orbit--two" aria-hidden="true" />
        <div className="freedom-orbit freedom-orbit--three" aria-hidden="true" />
        <div className="freedom-light-bridge" aria-hidden="true">
          <span /><span /><span />
        </div>

        <div className="barrier-wall barrier-wall--left" />
        <div className="barrier-wall barrier-wall--right" />

        <div className={`chain-wrapper ${showFinale ? 'is-shattered' : ''} progress-level-${correctCount}`}>
          <div className="chain-strand chain-strand--one" />
          <div className="chain-strand chain-strand--two" />
          <div className="chain-link left-link" />
          <div className="chain-link middle-link" />
          <div className="chain-link right-link" />
        </div>

        <div className={`padlock ${won ? 'is-unlocked' : ''} ${showFinale ? 'is-destroyed' : ''}`}>
          <div className="padlock-aura" />
          <div className="padlock-shackle">
            <div className="shackle-left" />
            <div className="shackle-right" />
            <div className="shackle-top" />
          </div>

          <div className="padlock-body">
            <div className="padlock-rivet tl" /><div className="padlock-rivet tr" />
            <div className="padlock-rivet bl" /><div className="padlock-rivet br" />

            <div className="dial-readout" aria-label="Mật mã hiện tại">
              {phrase}
              <span className="dial-readout-glow" />
            </div>

            <div className="dials-container">
              {dials.map((value, index) => (
                <Dial
                  key={index}
                  index={index}
                  value={value}
                  lastDial={lastDial}
                  flashDial={flashDial}
                  onDialPointerDown={handleDialPointerDown}
                />
              ))}
            </div>

            <div className="padlock-keyhole" />
          </div>
        </div>

        <div className="freedom-checkpoints" aria-hidden="true">
          {DIALS_CONFIG.map((config, index) => (
            <span
              key={index}
              className={dials[index] === config.target ? 'is-lit' : ''}
            />
          ))}
        </div>

        {showFinale && (
          <div className="epic-win-overlay" aria-live="polite">
            <div className="epic-horizon" />

            <img src={banDoVn} className="epic-vietnam-map" alt="Bản đồ Việt Nam" />

            {shards.map((shard) => (
              <i
                key={shard.id}
                className="epic-shard"
                style={{
                  left:              `${shard.left}%`,
                  top:               `${shard.top}%`,
                  '--shard-angle':   `${shard.angle}deg`,
                  '--shard-fall':    `${shard.fall}px`,
                  '--shard-scale':   shard.scale,
                  animationDelay:    `${shard.delay}s`,
                  animationDuration: `${shard.duration}s`,
                }}
              />
            ))}

            {sparks.map((spark) => (
              <i
                key={spark.id}
                className="epic-spark"
                style={{
                  '--angle':      `${spark.angle}deg`,
                  '--dist':       `${spark.dist}px`,
                  '--spark-size': `${spark.size}px`,
                  color:             spark.color,
                  background:        spark.color,
                  animationDelay:    `${spark.delay}s`,
                  animationDuration: `${spark.duration}s`,
                }}
              />
            ))}

            <div className="epic-banner">
              <div className="epic-banner-badge">
                <span className="epic-banner-dot" />
                <small>Độc lập · Hành tinh đã mở khóa</small>
              </div>
              <strong>ĐỘC LẬP</strong>
              <span className="epic-banner-sub">TỰ DO — HẠNH PHÚC</span>
              <blockquote>
                "Nước Việt Nam có quyền hưởng tự do và độc lập,<br />
                và sự thật đã trở thành <em>một nước tự do độc lập</em>."
              </blockquote>
              <p>
                Độc lập không phải tấm bản đồ — đó là con đường mỗi thế hệ phải
                tự bước, tự giữ, và trao lại cho người tiếp theo.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="minigame-progress">
        <div className="minigame-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
