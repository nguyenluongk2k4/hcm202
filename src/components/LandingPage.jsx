import { useCallback, useEffect, useRef, useState } from 'react'

const travelIntroText = 'Giữa vũ trụ tri thức bao la, chủ nghĩa xã hội khoa học là chòm sao dẫn đường... Hãy bắt đầu hành trình chinh phục 7 chương lý luận.'
const TYPE_INTERVAL = 42
const INTRO_REVEAL_DELAY = 860
const INTRO_EXIT_DELAY = 1500

const previewQuotes = [
  'Các nhà triết học chỉ giải thích thế giới, song vấn đề là cải biến thế giới. — C. Mác',
  'Học, học nữa, học mãi. — V.I. Lênin',
  'Học thuyết của chúng ta không phải là giáo điều, mà là kim chỉ nam cho hành động. — Ph. Ăngghen',
]

const journeySteps = [
  {
    label: 'Học',
    title: 'Chọn một hành tinh chương học',
    text: 'Mỗi hành tinh là một chương giáo trình: từ nhập môn CNXH khoa học đến dân chủ, liên minh giai cấp, dân tộc và gia đình.',
  },
  {
    label: 'Chơi',
    title: 'Vượt minigame, mở luận điểm then chốt',
    text: 'Mỗi chương có một thử thách tương tác gắn với nội dung: phân loại trường phái, phá xiềng giải phóng, cân bằng nhà nước...',
  },
  {
    label: 'Đấu',
    title: 'Hạ boss bằng câu hỏi ôn tập',
    text: 'Boss cuối chương là bộ trắc nghiệm từ phần câu hỏi ôn tập giáo trình — thắng boss để hoàn thành chương và nhận XP.',
  },
]

const starTopics = ['Nhập môn', 'Sứ mệnh GCN', 'Quá độ', 'Dân chủ', 'Liên minh', 'Dân tộc', 'Gia đình']



export default function LandingPage({ onExplore, onExam }) {
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
          <span className="travel-typewriter-label">Mở cổng lý luận</span>
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
          <span className="landing-overline">Game học tập MLN131 — Chủ nghĩa xã hội khoa học</span>
          <h1 className="landing-slogan" id="landing-title">
            Vũ Trụ Lý Luận
            <span>du hành qua chủ nghĩa Mác – Lênin.</span>
          </h1>
          <div className="quote-preview-strip" aria-label="Luận điểm nổi bật">
            {previewQuotes.map((quote) => (
              <article key={quote}>
                <span />
                <p>{quote}</p>
              </article>
            ))}
          </div>
          <div className="landing-hero-actions">
            <button className="primary-action landing-hero-action" type="button" onClick={handleExplore} disabled={traveling}>
              <span className="landing-action-icon" aria-hidden="true" />
              {traveling ? 'Đang mở cổng lý luận' : 'Bắt đầu du hành'}
            </button>
            <button className="secondary-action" type="button" onClick={onExam}>
              Vào phòng ôn thi
            </button>
          </div>
        </div>
      </div>

      <section className="landing-scroll-section landing-scroll-section--journey" aria-label="Luồng trải nghiệm">
        <div className="landing-section-heading">
          <span>Trải nghiệm</span>
          <h2>Không chỉ đọc giáo trình, mà chinh phục từng chương.</h2>
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

      <section className="landing-scroll-section landing-scroll-section--map" aria-label="Chòm sao chương học">
        <div className="topic-orbital-map">
          <div className="topic-map-core">Mác – Lênin</div>
          {starTopics.map((topic, index) => (
            <span key={topic} style={{ '--topic-index': index }}>
              {topic}
            </span>
          ))}
        </div>
        <div className="landing-section-heading">
          <span>Chòm sao chương học</span>
          <h2>Bảy chương giáo trình là bảy điểm sáng, nối lại thành bản đồ CNXH khoa học.</h2>
          <p>
            Mỗi chương là một hành tinh: đọc nội dung tóm tắt, chơi minigame mở khóa luận điểm then chốt,
            rồi hạ boss trắc nghiệm cuối chương. Hoàn thành cả bảy để thấu tỏ toàn bộ môn học.
          </p>
        </div>
      </section>

      <section className="landing-scroll-section landing-scroll-section--cta" aria-label="Bắt đầu khám phá">
        <div className="memory-vault">
          <span />
          <span />
          <span />
          <div>
            <p>Hồ sơ lý luận của bạn đang chờ được lấp đầy.</p>
            <div className="landing-hero-actions">
              <button className="primary-action" type="button" onClick={handleExplore} disabled={traveling}>
                Vào bản đồ sao
              </button>
              <button className="secondary-action" type="button" onClick={onExam}>
                Làm đề thi thử
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}
