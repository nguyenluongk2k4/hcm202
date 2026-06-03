import { useState } from 'react'
import hoChiMinhImage from '../assets/HoChiMinhImage.jpg'
const previewQuotes = [
  'Không có gì quý hơn độc lập, tự do.',
  'Đoàn kết, đoàn kết, đại đoàn kết.',
  'Vì lợi ích trăm năm thì phải trồng người.',
]

const journeySteps = [
  {
    label: 'Chạm',
    title: 'Chọn một hành tinh ký ức',
    text: 'Mỗi hành tinh là một chủ đề lớn: độc lập, đoàn kết, đạo đức, văn hóa, thanh niên và vận dụng.',
  },
  {
    label: 'Mở',
    title: 'Tìm bookmark đang phát sáng',
    text: 'Bookmark là các câu nói kinh điển được đặt như những mảnh ký ức bay quanh chủ đề.',
  },
  {
    label: 'Lưu',
    title: 'Ghi vào sổ tay ký ức',
    text: 'Mỗi câu nói đi kèm ý nghĩa và câu hỏi liên hệ để người học biến kiến thức thành suy nghĩ cá nhân.',
  },
]

const starTopics = ['Độc lập', 'Nhân dân', 'Đạo đức', 'Văn hóa', 'Tuổi trẻ', 'Vận dụng']

const memoryShards = [
  'Tín hiệu độc lập - tự do',
  'Bookmark đang phát sáng',
  'Quỹ đạo tư tưởng Hồ Chí Minh',
  'Sổ tay ký ức đã sẵn sàng',
]

const hologramGlyphs = [
  { label: 'Độc lập', x: '12.8rem', y: '-7.2rem' },
  { label: 'Tự do', x: '13.4rem', y: '4.2rem' },
  { label: 'Nhân dân', x: '-10.6rem', y: '6.8rem' },
  { label: 'Đoàn kết', x: '-11.8rem', y: '-4.4rem' },
]

export default function LandingPage({ onExplore }) {
  const [pointer, setPointer] = useState({ x: 50, y: 50 })
  const [pressed, setPressed] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const [traveling, setTraveling] = useState(false)

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    setPointer({ x, y })
  }

  const handleExplore = () => {
    if (traveling) {
      return
    }

    setTraveling(true)
    setBurstKey((key) => key + 1)
    window.setTimeout(onExplore, 5000)
  }

  return (
    <section
      className={`landing-page landing-page--memory ${pressed ? 'is-pressed' : ''} ${traveling ? 'is-traveling' : ''}`}
      style={{
        '--pointer-x': `${pointer.x}%`,
        '--pointer-y': `${pointer.y}%`,
      }}
      aria-labelledby="landing-title"
      onPointerMove={handlePointerMove}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      <div className="landing-fixed-visuals" aria-hidden="true">
        <div className="landing-wallpaper" />
        <div className="landing-nebula-ribbons" />
        <div className="landing-star-shower">
          {Array.from({ length: 16 }).map((_, index) => (
            <span
              key={index}
              style={{
                '--shoot-left': `${(index * 17) % 100}%`,
                '--shoot-top': `${(index * 23) % 86}%`,
                '--shoot-delay': `${(index % 11) * 0.42}s`,
                '--shoot-duration': `${3.6 + (index % 5) * 0.38}s`,
              }}
            />
          ))}
        </div>
        <div className="landing-bling-field">
          {Array.from({ length: 12 }).map((_, index) => (
            <span
              key={index}
              style={{
                '--bling-left': `${8 + ((index * 19) % 84)}%`,
                '--bling-top': `${10 + ((index * 29) % 76)}%`,
                '--bling-delay': `${(index % 9) * 0.26}s`,
                '--bling-size': `${0.32 + (index % 4) * 0.1}rem`,
              }}
            />
          ))}
        </div>
        <div className="landing-memory-shards">
          {memoryShards.map((shard) => (
            <span key={shard}>{shard}</span>
          ))}
        </div>
        <div className="landing-cursor-light" />
        {burstKey > 0 && <div key={burstKey} className="landing-click-burst" />}
        <div className="landing-stars" />
        <div className="memory-portal">
          <div className="portal-halo" />
          <div className="portal-core" />
          <div className="portal-ring portal-ring--one" />
          <div className="portal-ring portal-ring--two" />
          <div className="portal-ring portal-ring--three" />
          <div className="portal-orbit portal-orbit--one">
            <span />
          </div>
          <div className="portal-orbit portal-orbit--two">
            <span />
          </div>
          <div className="portal-orbit portal-orbit--three">
            <span />
          </div>
        </div>
        <div className="memory-constellation">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className={`travel-cinematic ${traveling ? 'is-active' : ''}`} aria-hidden={!traveling} aria-live="polite">
        <div className="hologram-stage" aria-hidden="true">
          <div className="hologram-backlight" />
          <div className="hologram-beam" />
          <div className="hologram-aura" />
          <div className="hologram-sparkles">
            {Array.from({ length: 20 }).map((_, index) => {
              const x = ((index * 37) % 64) - 32
              const y = ((index * 29) % 48) - 24
              const size = 0.18 + (index % 3) * 0.07
              const delay = 0.12 + (index % 8) * 0.07

              return (
                <span
                  key={index}
                  style={{
                    '--spark-x': `${x}rem`,
                    '--spark-y': `${y}rem`,
                    '--spark-size': `${size}rem`,
                    '--spark-delay': `${delay}s`,
                    '--spark-rotate': `${index * 23}deg`,
                  }}
                />
              )
            })}
          </div>
          <div className="hologram-glyphs">
            {hologramGlyphs.map((glyph, index) => (
              <span
                key={glyph.label}
                style={{
                  '--glyph-x': glyph.x,
                  '--glyph-y': glyph.y,
                  '--glyph-delay': `${0.18 + index * 0.08}s`,
                }}
              >
                {glyph.label}
              </span>
            ))}
          </div>
          <div className="hologram-rings" />
          <img className="hologram-photo" src={hoChiMinhImage} alt="" loading="eager" decoding="sync" fetchPriority="high" />
        </div>
        <p>Không có gì quý hơn độc lập, tự do.</p>
      </div>

      <div className="landing-explore-only">
        <div className="landing-type-lockup">
          <span className="landing-overline">Bản đồ ký ức tương tác</span>
          <h1 className="landing-slogan" id="landing-title">
            Vũ Trụ Kí Ức
            <span>du hành qua tư tưởng Hồ Chí Minh.</span>
          </h1>
          <div className="quote-preview-strip" aria-label="Bookmark nổi bật">
            {previewQuotes.map((quote) => (
              <article key={quote}>
                <span />
                <p>{quote}</p>
              </article>
            ))}
          </div>
          <button className="primary-action landing-hero-action" type="button" onClick={handleExplore} disabled={traveling}>
            <span className="landing-action-icon" aria-hidden="true" />
            {traveling ? 'Đang mở cổng ký ức' : 'Bắt đầu du hành'}
          </button>
        </div>
      </div>

      <section className="landing-scroll-section landing-scroll-section--journey" aria-label="Luồng trải nghiệm">
        <div className="landing-section-heading">
          <span>Trải nghiệm</span>
          <h2>Không chỉ đọc, mà mở khóa từng mảnh ký ức.</h2>
        </div>
        <div className="journey-grid">
          {journeySteps.map((step) => (
            <article key={step.label}>
              <strong>{step.label}</strong>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-scroll-section landing-scroll-section--map" aria-label="Chòm sao chủ đề">
        <div className="topic-orbital-map">
          <div className="topic-map-core">Hồ Chí Minh</div>
          {starTopics.map((topic, index) => (
            <span key={topic} style={{ '--topic-index': index }}>
              {topic}
            </span>
          ))}
        </div>
        <div className="landing-section-heading">
          <span>Chòm sao chủ đề</span>
          <h2>Mỗi giá trị là một điểm sáng, nối lại thành bản đồ tư tưởng.</h2>
          <p>
            Phần này tạo cảm giác “bảo tàng vũ trụ” trước khi người học bước vào không gian 3D. Nó cũng giúp người xem
            hiểu app có nhiều điểm tương tác, không chỉ một màn hình hero.
          </p>
        </div>
      </section>

      <section className="landing-scroll-section landing-scroll-section--cta" aria-label="Bắt đầu khám phá">
        <div className="memory-vault">
          <span />
          <span />
          <span />
          <div>
            <p>Sổ tay ký ức đang chờ được lấp đầy.</p>
            <button className="primary-action" type="button" onClick={handleExplore} disabled={traveling}>
              Vào bản đồ sao
            </button>
          </div>
        </div>
      </section>
    </section>
  )
}
