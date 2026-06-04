import { useState, useRef } from 'react'
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



export default function LandingPage({ onExplore }) {
  const [burstKey, setBurstKey] = useState(0)
  const [traveling, setTraveling] = useState(false)

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
      className={`landing-page landing-page--memory ${traveling ? 'is-traveling' : ''}`}
      aria-labelledby="landing-title"
    >
      <div className="landing-fixed-visuals" aria-hidden="true">
        <div className="landing-wallpaper" />
        <div className="landing-nebula-ribbons" />
        {burstKey > 0 && <div key={burstKey} className="landing-click-burst" />}
      </div>

      <div className={`travel-cinematic ${traveling ? 'is-active' : ''}`} aria-hidden={!traveling} aria-live="polite">
        <div className="hologram-stage" aria-hidden="true">
          <div className="hologram-backlight" />
          <div className="hologram-beam" />
          <div className="hologram-aura" />
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
