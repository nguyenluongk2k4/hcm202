import { useEffect, useRef } from 'react'

export default function QuotePanel({ quote, onClose }) {
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current

    return () => {
      audio?.pause()
    }
  }, [quote])

  if (!quote) {
    return null
  }

  const speakQuote = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  const stopSpeaking = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
  }

  const closePanel = () => {
    stopSpeaking()
    onClose()
  }

  return (
    <aside className="quote-panel" aria-live="polite" aria-label={quote.title}>
      <div className="panel-top">
        <div>
          <p className="eyebrow">Luận điểm then chốt</p>
          <h2>{quote.title}</h2>
        </div>
        <button type="button" onClick={closePanel} aria-label="Đóng bài học">
          ×
        </button>
      </div>

      <div className="quote-panel-scroll">
        <blockquote>{quote.text}</blockquote>

        <section className="quote-content">
          <span>Nội dung chương</span>
          {quote.content?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      </div>

      {quote.audio && (
        <>
          <div className="quote-actions">
            <button type="button" onClick={speakQuote}>
              Nghe toàn bộ chuyên đề
            </button>
            <button type="button" onClick={stopSpeaking}>
              Dừng đọc
            </button>
          </div>

          <audio ref={audioRef} src={quote.audio} preload="metadata" />
        </>
      )}
    </aside>
  )
}
