import { useMemo, useRef, useState } from 'react'
import './TypeToAct.css'

// Câu dài hơn, 10 tiles thay vì 7
const targetTiles = [
  { id: 'noi',       text: 'Nói',       note: 'lời hứa' },
  { id: 'thi',       text: 'thì',       note: 'gắn với' },
  { id: 'phai',      text: 'phải',      note: 'trách nhiệm' },
  { id: 'lam',       text: 'làm',       note: 'hành động' },
  { id: 'lam-duoc',  text: 'được',      note: 'kết quả' },
  { id: 'kiem-tra',  text: 'kiểm tra',  note: 'theo sát' },
  { id: 'den-noi',   text: 'đến nơi',   note: 'không qua loa' },
  { id: 'den-chon',  text: 'đến chốn',  note: 'làm cho xong' },
  { id: 'nhu-da',    text: 'như đã',    note: 'cam kết' },
  { id: 'hua',       text: 'hứa',       note: 'lời thề' },
]

// Pool xáo trộn
const shuffledTiles = [
  targetTiles[3], targetTiles[0], targetTiles[6], targetTiles[2],
  targetTiles[8], targetTiles[5], targetTiles[9], targetTiles[1],
  targetTiles[7], targetTiles[4],
]

const deskSignals = ['Giản dị', 'Khoa học', 'Gần dân', 'Nêu gương', 'Thực tiễn', 'Nhất quán']
const pledgeSteps = [
  { label: 'Cam kết', range: [0, 3] },
  { label: 'Hành động', range: [4, 7] },
  { label: 'Kiểm chứng', range: [8, 9] },
]

function seededRatio(index, salt = 0) {
  const value = Math.sin(index * 38.61 + salt * 17.23) * 10000
  return value - Math.floor(value)
}

export default function TypeToAct({ onWin }) {
  const [slots, setSlots]           = useState(Array(targetTiles.length).fill(null))
  const [pool, setPool]             = useState([...shuffledTiles])
  const [errorState, setErrorState] = useState(false)
  const [won, setWon]               = useState(false)
  const [showFinale, setShowFinale] = useState(false)
  const [stampTrail, setStampTrail] = useState([])
  const [correctSlots, setCorrectSlots] = useState([])
  const [lastPlaced, setLastPlaced] = useState(null)
  const stampIdRef = useRef(0)

  const ambientMarks = useMemo(
    () =>
      Array.from({ length: 22 }, (_, index) => ({
        id:       index,
        left:     `${6 + seededRatio(index, 1) * 88}%`,
        top:      `${6 + seededRatio(index, 4) * 86}%`,
        size:     1.5 + seededRatio(index, 8) * 3.5,
        delay:    `${seededRatio(index, 11) * 5}s`,
        duration: `${4 + seededRatio(index, 15) * 6}s`,
      })),
    [],
  )

  // Keep finale particles selective so this scene stays smooth.
  const finaleSparks = useMemo(() =>
    Array.from({ length: 28 }).map((_, i) => ({
      id:       i,
      angle:    seededRatio(i, 20) * 360,
      dist:     70 + seededRatio(i, 21) * 260,
      delay:    seededRatio(i, 22) * 1.0,
      duration: 1.8 + seededRatio(i, 23) * 1.8,
      size:     3 + seededRatio(i, 24) * 6,
    })),
  [])

  // Finale ink trails
  const finaleInkLines = useMemo(() =>
    Array.from({ length: 6 }).map((_, i) => ({
      id:    i,
      top:   `${20 + seededRatio(i, 30) * 60}%`,
      delay: `${seededRatio(i, 31) * 0.6}s`,
      width: `${50 + seededRatio(i, 32) * 50}%`,
      left:  seededRatio(i, 33) > 0.5 ? '0' : 'auto',
      right: seededRatio(i, 33) > 0.5 ? 'auto' : '0',
    })),
  [])

  const handlePoolClick = (index) => {
    if (won || errorState) return
    const item = pool[index]
    if (!item) return

    const firstEmptySlot = slots.findIndex((slot) => slot === null)
    if (firstEmptySlot === -1) return

    const nextSlots = [...slots]
    nextSlots[firstEmptySlot] = item

    const nextPool = [...pool]
    nextPool[index] = null

    setSlots(nextSlots)
    setPool(nextPool)
    setLastPlaced(firstEmptySlot)
    setTimeout(() => setLastPlaced(null), 400)

    setStampTrail((trail) => [
      ...trail.slice(-6),
      {
        id:   `${item.id}-${stampIdRef.current += 1}`,
        left: `${8 + firstEmptySlot * 9.2}%`,
        top:  `${42 + (firstEmptySlot % 2) * 12}%`,
      },
    ])

    if (nextSlots.every(Boolean)) {
      const correctMap = nextSlots.map((slot, slotIndex) => slot.id === targetTiles[slotIndex].id)
      const isCorrect  = correctMap.every(Boolean)
      if (isCorrect) {
        setCorrectSlots(nextSlots.map((_, i) => i))
        handleWin()
      } else {
        // Highlight wrong slots briefly before reset
        setCorrectSlots(correctMap.map((ok, i) => ok ? i : -1).filter(i => i >= 0))
        triggerError()
      }
    }
  }

  const handleSlotClick = (index) => {
    if (won || errorState) return
    const item = slots[index]
    if (!item) return

    const nextSlots = [...slots]
    nextSlots[index] = null

    const originalIndex = shuffledTiles.findIndex((tile) => tile.id === item.id)
    const nextPool = [...pool]
    nextPool[originalIndex] = item

    setSlots(nextSlots)
    setPool(nextPool)
    setCorrectSlots([])
  }

  const triggerError = () => {
    setErrorState(true)
    setTimeout(() => {
      setErrorState(false)
      setSlots(Array(targetTiles.length).fill(null))
      setPool([...shuffledTiles])
      setStampTrail([])
      setCorrectSlots([])
    }, 700)
  }

  const handleWin = () => {
    setWon(true)
    setTimeout(() => setShowFinale(true), 560)
    setTimeout(() => onWin(), 10000)
  }

  const progress = won ? 100 : (slots.filter(Boolean).length / targetTiles.length) * 100
  const filledCount = slots.filter(Boolean).length

  return (
    <div className={`minigame-type ${showFinale ? 'is-final-scene' : ''}`}>
      <p className="minigame-instruction">
        {won
          ? 'Con đường từ lời nói đến việc làm đã hoàn chỉnh.'
            : errorState
              ? 'Thứ tự chưa đúng — hãy thử lại từ đầu!'
            : 'Xếp 10 mảnh câu thành một quy trình: cam kết rõ, hành động thật, kiểm tra đến cùng.'}
      </p>

      <div className={`style-board ${errorState ? 'is-error' : ''} ${won ? 'is-won' : ''}`}>
        {/* Ambient dust particles */}
        {ambientMarks.map((mark) => (
          <span
            key={mark.id}
            className="style-ambient-mark"
            style={{
              left:              mark.left,
              top:               mark.top,
              width:             mark.size,
              height:            mark.size,
              animationDelay:    mark.delay,
              animationDuration: mark.duration,
            }}
          />
        ))}

        {/* Desk lamp */}
        <div className="style-lamp" aria-hidden="true">
          <span className="style-lamp-head" />
          <span className="style-lamp-beam" />
          <span className="style-lamp-stem" />
          <span className="style-lamp-base" />
        </div>

        {/* Word-to-action progress map */}
        <div className="style-work-map" aria-hidden="true">
          <strong>Lời nói</strong>
          <span className="style-map-line">
            {targetTiles.map((tile, index) => (
              <i key={tile.id} className={slots[index] ? 'is-lit' : ''} />
            ))}
          </span>
          <strong>Việc làm</strong>
        </div>

        <div className="style-principle-rail" aria-hidden="true">
          {pledgeSteps.map((step, index) => {
            const [start, end] = step.range
            const isActive = filledCount > start && filledCount <= end + 1
            const isDone = filledCount > end
            return (
              <span
                key={step.label}
                className={`${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
                style={{ '--rail-index': index }}
              >
                <i />
                <b>{step.label}</b>
              </span>
            )
          })}
        </div>

        {/* SLOT AREA */}
        <div className="style-slots" aria-label="Khu vực xếp câu">
          {slots.map((item, index) => (
            <button
              key={`slot-${index}`}
              type="button"
              className={`style-slot ${item ? 'has-item' : ''} ${correctSlots.includes(index) ? 'is-correct' : ''} ${lastPlaced === index ? 'is-just-placed' : ''}`}
              onClick={() => handleSlotClick(index)}
            >
              {item ? (
                <span className="style-tile in-slot">
                  <b>{item.text}</b>
                  <small>{item.note}</small>
                </span>
              ) : (
                <span className="style-slot-index">{index + 1}</span>
              )}
            </button>
          ))}
        </div>

        <div className="style-desk-divider" aria-hidden="true">
          <span />
        </div>

        {/* POOL AREA */}
        <div className="style-pool" aria-label="Các mảnh chữ">
          {pool.map((item, index) => (
            <div key={`pool-${index}`} className="style-pool-space">
              {item && (
                <button type="button" className="style-tile in-pool" onClick={() => handlePoolClick(index)}>
                  <b>{item.text}</b>
                  <small>{item.note}</small>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Desk signals / principles */}
        <div className="style-note-row" aria-hidden="true">
          {deskSignals.map((signal) => (
            <span key={signal}>{signal}</span>
          ))}
        </div>

        {/* Stamp trail */}
        {stampTrail.map((stamp) => (
          <span key={stamp.id} className="style-action-stamp" style={{ left: stamp.left, top: stamp.top }}>
            Đã làm
          </span>
        ))}

        {/* Win activation overlay */}
        {won && (
          <div className="style-activation" aria-hidden="true">
            <span className="style-ink-line" />
            <span className="style-ink-line" />
            <span className="style-ink-line" />
            <strong>Nói đi đôi với làm</strong>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="style-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      {/* ════════════════ EPIC FINALE ════════════════ */}
      {showFinale && (
        <div className="style-finale" aria-live="polite">
          {/* Layer 1: Sweeping background rays */}
          <div className="style-finale-rays">
            {Array.from({ length: 10 }).map((_, i) => (
              <i
                key={i}
                style={{
                  '--ray-angle': `${i * 36}deg`,
                  '--ray-delay': `${seededRatio(i, 40) * 0.5}s`,
                }}
              />
            ))}
          </div>

          {/* Layer 2: Road perspective */}
          <div className="style-finale-road" />

          {/* Layer 3: Sun */}
          <div className="style-finale-sun" />

          {/* Layer 4: Ink lines sweeping across */}
          <div className="style-finale-inks">
            {finaleInkLines.map((line) => (
              <span
                key={line.id}
                style={{
                  top:            line.top,
                  left:           line.left,
                  right:          line.right,
                  '--ink-width':  line.width,
                  animationDelay: line.delay,
                }}
              />
            ))}
          </div>

          {/* Layer 5: Floating tile notebook — the full sentence */}
          <div className="style-finale-notebook">
            {targetTiles.map((tile, index) => (
              <span key={tile.id} style={{ '--delay': `${index * 0.09}s` }}>
                {tile.text}
              </span>
            ))}
          </div>

          {/* Layer 6: Desk signals rising */}
          <div className="style-finale-signals">
            {deskSignals.map((signal, index) => (
              <i key={signal} style={{ '--index': index, '--signal-top': `${58 + (index % 2) * 10}%` }}>
                {signal}
              </i>
            ))}
          </div>

          {/* Layer 7: Sparks */}
          {finaleSparks.map((spark) => (
            <i
              key={spark.id}
              className="style-finale-spark"
              style={{
                '--angle':      `${spark.angle}deg`,
                '--dist':       `${spark.dist}px`,
                '--spark-size': `${spark.size}px`,
                animationDelay:    `${spark.delay}s`,
                animationDuration: `${spark.duration}s`,
              }}
            />
          ))}

          {/* Layer 8: Message card */}
          <div className="style-message-card">
            <div className="style-message-badge">
              <span className="style-message-badge-dot" />
              <em>Phong cách · Hành tinh đã mở khóa</em>
            </div>
            <h3>PHONG CÁCH<br />HỒ CHÍ MINH</h3>
            <blockquote>
              "Lời nói chỉ thật sự có trọng lượng<br />
              khi nó bước ra thành <strong>việc làm</strong>."
            </blockquote>
            <p>
              Giản dị không phải là ít đi — mà là làm đúng điều cần làm,
              đến nơi đến chốn, như đã hứa, để người khác có thể <em>tin</em>.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
