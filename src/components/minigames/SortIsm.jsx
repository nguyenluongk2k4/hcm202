import { useMemo, useState } from 'react'
import './SortIsm.css'

// Dữ liệu grounding từ chương 1 giáo trình (chuong-1 / ch1.json)
const CARDS = [
  { id: 'saint-simon',   text: 'Saint-Simon',                                   zone: 'utopian'    },
  { id: 'fourier',       text: 'Fourier',                                       zone: 'utopian'    },
  { id: 'owen',          text: 'Owen',                                          zone: 'utopian'    },
  { id: 'utopian-dream', text: 'Mơ ước về xã hội công bằng, không bóc lột',     zone: 'utopian'    },
  { id: 'utopian-limit', text: 'Phê phán tư bản nhưng thiếu cơ sở khoa học',    zone: 'utopian'    },
  { id: 'marx',          text: 'C. Mác',                                        zone: 'scientific' },
  { id: 'engels',        text: 'Ph. Ăngghen',                                   zone: 'scientific' },
  { id: 'manifesto',     text: 'Tuyên ngôn của Đảng Cộng sản (1848)',           zone: 'scientific' },
  { id: 'surplus-value', text: 'Học thuyết giá trị thặng dư',                   zone: 'scientific' },
  { id: 'hist-mat',      text: 'Quy luật vận động của xã hội — chủ nghĩa duy vật lịch sử', zone: 'scientific' },
]

const ZONES = [
  { key: 'utopian',    title: 'CNXH không tưởng', sub: 'Phê phán tư bản, mơ ước công bằng' },
  { key: 'scientific', title: 'CNXH khoa học',    sub: 'Cơ sở khoa học, quy luật khách quan' },
]

function shuffledCards() {
  const pool = [...CARDS]
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

export default function SortIsm({ onSolved }) {
  const [order]                   = useState(shuffledCards)
  const [placed, setPlaced]       = useState({}) // cardId -> zone key
  const [selected, setSelected]   = useState(null)
  const [wrongIds, setWrongIds]   = useState([])
  const [errors, setErrors]       = useState(0)
  const [won, setWon]             = useState(false)

  const solvedCount = Object.keys(placed).length
  const progress    = (solvedCount / CARDS.length) * 100

  const poolCards = useMemo(() => order.filter(card => !placed[card.id]), [order, placed])

  const handleCardClick = (cardId) => {
    if (won) return
    // Thẻ đã đặt: click để trả về bàn
    if (placed[cardId]) {
      setPlaced(prev => {
        const next = { ...prev }
        delete next[cardId]
        return next
      })
      setSelected(prev => (prev === cardId ? null : prev))
      return
    }
    setSelected(prev => (prev === cardId ? null : cardId))
  }

  const handleZoneClick = (zoneKey) => {
    if (won || !selected) return
    const card = CARDS.find(c => c.id === selected)
    if (!card) return

    if (card.zone === zoneKey) {
      const nextPlaced = { ...placed, [card.id]: zoneKey }
      setPlaced(nextPlaced)
      setSelected(null)
      if (Object.keys(nextPlaced).length === CARDS.length) {
        setWon(true)
        onSolved?.()
      }
    } else {
      setErrors(prev => prev + 1)
      setWrongIds(prev => [...prev, card.id])
      setSelected(null)
      window.setTimeout(() => {
        setWrongIds(prev => prev.filter(id => id !== card.id))
      }, 480)
    }
  }

  return (
    <div className={`minigame-sortism ${won ? 'is-won' : ''}`}>
      <p className="minigame-instruction">
        {won
          ? 'Từ không tưởng đến khoa học — C. Mác và Ph. Ăngghen đã nâng CNXH thành khoa học.'
          : 'Chạm một thẻ, rồi chạm khu vực đúng: phân loại "không tưởng" hay "khoa học". Sai thẻ sẽ bật lại!'}
      </p>

      {!won && (
        <div className="si-stage">
          {/* Card pool */}
          <div className="si-pool">
            {poolCards.map(card => (
              <button
                key={card.id}
                type="button"
                className={`si-card ${selected === card.id ? 'is-selected' : ''} ${wrongIds.includes(card.id) ? 'is-wrong' : ''}`}
                onClick={() => handleCardClick(card.id)}
              >
                {card.text}
              </button>
            ))}
            {poolCards.length === 0 && (
              <p className="si-pool-empty">Tất cả thẻ đã được phân loại ✦</p>
            )}
          </div>

          {/* Zones */}
          <div className="si-zones">
            {ZONES.map(zone => (
              <button
                key={zone.key}
                type="button"
                className={`si-zone si-zone--${zone.key} ${selected ? 'is-awaiting' : ''}`}
                onClick={() => handleZoneClick(zone.key)}
              >
                <span className="si-zone-title">{zone.title}</span>
                <span className="si-zone-sub">{zone.sub}</span>
                <span className="si-zone-cards">
                  {order.filter(card => placed[card.id] === zone.key).map(card => (
                    <span
                      key={card.id}
                      className="si-zone-card"
                      onClick={(e) => { e.stopPropagation(); handleCardClick(card.id) }}
                      title="Chạm để trả thẻ về bàn"
                    >
                      {card.text}
                    </span>
                  ))}
                </span>
              </button>
            ))}
          </div>

          <div className="si-status">
            <span>Đã phân loại {solvedCount}/{CARDS.length}</span>
            <span className={errors > 0 ? 'si-errors is-active' : 'si-errors'}>
              Lỗi: {errors}
            </span>
          </div>
        </div>
      )}

      {/* Solved screen */}
      {won && (
        <div className="si-solved" aria-live="polite">
          <div className="si-solved-card">
            <div className="si-solved-badge">
              <span className="si-badge-dot" />
              <em>Chương 1 · Từ không tưởng đến khoa học</em>
            </div>
            <h3>PHÂN LOẠI HOÀN TẤT</h3>
            <blockquote>
              "CNXH khoa học là sự thể hiện về mặt lý luận<br />
              của <strong>phong trào vô sản</strong>."
            </blockquote>
            <p>
              C. Mác và Ph. Ăngghen kế thừa tinh hoa CNXH không tưởng,
              khắc phục hạn chế của nó, đưa chủ nghĩa xã hội từ không tưởng
              thành khoa học — đánh dấu bằng Tuyên ngôn của Đảng Cộng sản (1848).
            </p>
            <p className="si-solved-stats">Hoàn thành với {errors} lỗi.</p>
          </div>
        </div>
      )}

      <div className="minigame-progress">
        <div className="minigame-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
