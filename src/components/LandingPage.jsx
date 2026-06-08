import { useCallback, useEffect, useRef, useState } from 'react'

const travelIntroText = 'Giữa vũ trụ bao la, có những chân lý sáng ngời như những vì sao... Hãy bắt đầu hành trình tìm kiếm ánh sáng của bạn.'
const TYPE_INTERVAL = 42
const INTRO_REVEAL_DELAY = 860
const INTRO_EXIT_DELAY = 1500

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
  const [typedText, setTypedText] = useState('')
  const [introPhase, setIntroPhase] = useState('idle')
  const audioContextRef = useRef(null)

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null

    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext
    if (!AudioContextConstructor) return null

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextConstructor()
    }

    audioContextRef.current.resume?.()
    return audioContextRef.current
  }, [])

  const playTypingSound = useCallback((character) => {
    const audioContext = audioContextRef.current
    if (!audioContext || audioContext.state === 'closed' || character === ' ') return

    const now = audioContext.currentTime
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    const filter = audioContext.createBiquadFilter()

    oscillator.type = 'triangle'
    oscillator.frequency.value = 230 + Math.random() * 110
    filter.type = 'highpass'
    filter.frequency.value = 620

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(character === '.' ? 0.012 : 0.024, now + 0.006)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045)

    oscillator.connect(filter)
    filter.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start(now)
    oscillator.stop(now + 0.05)
  }, [])

  const handleExplore = () => {
    if (traveling) {
      return
    }

    setTraveling(true)
    setBurstKey((key) => key + 1)
    setTypedText('')
    setIntroPhase('typing')
    getAudioContext()
  }

  useEffect(() => {
    if (!traveling) return undefined

    let characterIndex = 0
    let revealTimer = null
    let exitTimer = null
    const typeTimer = window.setInterval(() => {
      characterIndex += 1
      const nextText = travelIntroText.slice(0, characterIndex)
      const nextCharacter = travelIntroText[characterIndex - 1]

      setTypedText(nextText)
      playTypingSound(nextCharacter)

      if (characterIndex >= travelIntroText.length) {
        window.clearInterval(typeTimer)

        revealTimer = window.setTimeout(() => setIntroPhase('opening'), INTRO_REVEAL_DELAY)
        exitTimer = window.setTimeout(onExplore, INTRO_REVEAL_DELAY + INTRO_EXIT_DELAY)
      }
    }, TYPE_INTERVAL)

    return () => {
      window.clearInterval(typeTimer)
      window.clearTimeout(revealTimer)
      window.clearTimeout(exitTimer)
    }
  }, [onExplore, playTypingSound, traveling])

  useEffect(() => {
    return () => {
      audioContextRef.current?.close?.()
    }
  }, [])

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

      <div
        className={`travel-cinematic ${traveling ? 'is-active' : ''} ${introPhase === 'opening' ? 'is-opening' : ''}`}
        aria-hidden={!traveling}
        aria-live="polite"
      >
        <div className="travel-typewriter-frame">
          <span className="travel-typewriter-label">Mở cổng ký ức</span>
          <p>
            {typedText}
            <span className="travel-typewriter-caret" aria-hidden="true" />
          </p>
          <div className="travel-typewriter-progress" aria-hidden="true">
            <span style={{ '--intro-progress': `${(typedText.length / travelIntroText.length) * 100}%` }} />
          </div>
        </div>
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
