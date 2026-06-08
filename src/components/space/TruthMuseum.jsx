import { useEffect, useMemo, useRef, useState } from 'react'
import { planetPalette } from '../../data/cosmos'

function seededRatio(index, salt = 0) {
  const value = Math.sin(index * 44.71 + salt * 21.13) * 10000
  return value - Math.floor(value)
}

export default function TruthMuseum({
  visible,
  bookmarks,
  unlockedQuotes,
  onClose,
  onOpenQuote,
}) {
  const [bigBangActive, setBigBangActive] = useState(false)
  const [secretVisible, setSecretVisible] = useState(false)
  const hasTriggeredBigBang = useRef(false)

  const unlockedSet = useMemo(() => new Set(unlockedQuotes), [unlockedQuotes])
  const unlockedCount = bookmarks.filter((item) => unlockedSet.has(item.quote.id)).length
  const isComplete = bookmarks.length > 0 && unlockedCount === bookmarks.length

  useEffect(() => {
    if (!visible) {
      setBigBangActive(false)
      return undefined
    }

    if (!isComplete) return undefined

    if (hasTriggeredBigBang.current) {
      setBigBangActive(false)
      setSecretVisible(true)
      return undefined
    }

    hasTriggeredBigBang.current = true
    setBigBangActive(true)
    setSecretVisible(false)

    const secretTimer = window.setTimeout(() => setSecretVisible(true), 1500)
    const calmTimer = window.setTimeout(() => setBigBangActive(false), 4300)

    return () => {
      window.clearTimeout(secretTimer)
      window.clearTimeout(calmTimer)
      setBigBangActive(false)
    }
  }, [isComplete, visible])

  if (!visible) return null

  return (
    <div className={`truth-museum-overlay ${bigBangActive ? 'is-big-bang' : ''}`}>
      <div className="truth-museum-stars" aria-hidden="true">
        {Array.from({ length: 38 }).map((_, index) => (
          <i
            key={index}
            style={{
              left: `${seededRatio(index, 1) * 100}%`,
              top: `${seededRatio(index, 2) * 100}%`,
              '--spark-delay': `${seededRatio(index, 3) * 1.2}s`,
              '--spark-size': `${3 + seededRatio(index, 4) * 7}px`,
              '--spark-angle': `${seededRatio(index, 5) * 360}deg`,
            }}
          />
        ))}
      </div>

      <section className="truth-museum-shell" aria-label="Bảo Tàng Chân Lý">
        <div className="truth-museum-header">
          <div>
            <p className="eyebrow">Túi đồ / Bộ sưu tập</p>
            <h2>Bảo Tàng Chân Lý</h2>
          </div>
          <div className="truth-museum-actions">
            <span>{unlockedCount}/{bookmarks.length} bookmark</span>
            <button type="button" onClick={onClose} aria-label="Đóng bộ sưu tập">
              Đóng
            </button>
          </div>
        </div>

        <div className="truth-museum-orbit" aria-label="Các bookmark đã sưu tầm">
          {bookmarks.map((item, index) => {
            const unlocked = unlockedSet.has(item.quote.id)
            const palette = planetPalette[item.planet.color] || ['#ffffff', '#7edcff', '#25337a']

            return (
              <button
                key={item.quote.id}
                type="button"
                className={`truth-bookmark-card ${unlocked ? 'is-unlocked' : 'is-locked'}`}
                style={{
                  '--bookmark-index': index,
                  '--bookmark-primary': palette[1],
                  '--bookmark-secondary': palette[0],
                  '--float-delay': `${index * 0.18}s`,
                }}
                disabled={!unlocked}
                onClick={() => onOpenQuote(item.quote)}
              >
                <span className="truth-bookmark-glow" aria-hidden="true" />
                <small>{item.planet.signal}</small>
                <strong>{unlocked ? item.quote.text : 'Bookmark chưa mở'}</strong>
                <em>{item.planet.name}</em>
              </button>
            )
          })}
        </div>

        <div className={`truth-secret ${secretVisible ? 'is-visible' : ''} ${isComplete ? 'is-complete' : ''}`}>
          {isComplete ? (
            <>
              <span>Thông điệp bí mật</span>
              <p>
                Khi mười bookmark cùng phát sáng, chân lý không còn là điều để cất giữ:
                nó trở thành lời nhắc để học sâu, sống đẹp và hành động vì con người.
              </p>
            </>
          ) : (
            <>
              <span>Thông điệp cuối</span>
              <p>Sưu tầm đủ 10 bookmark để đánh thức Big Bang trong Bảo Tàng Chân Lý.</p>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
