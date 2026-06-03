export default function QuotePanel({ quote, onClose }) {
  if (!quote) {
    return null
  }

  const speakQuote = () => {
    if (!('speechSynthesis' in window)) {
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(quote.text)
    utterance.lang = 'vi-VN'
    utterance.rate = 0.86
    utterance.pitch = 0.92
    window.speechSynthesis.speak(utterance)
  }

  return (
    <aside className="quote-panel" aria-live="polite">
      <div className="panel-top">
        <p className="eyebrow">Bookmark ký ức</p>
        <button type="button" onClick={onClose} aria-label="Đóng bookmark">
          ×
        </button>
      </div>
      <blockquote>{quote.text}</blockquote>
      <p className="quote-source">{quote.source}</p>
      <div className="quote-actions">
        <button type="button" onClick={speakQuote}>
          Nghe bằng giọng đọc hệ thống
        </button>
        <button type="button" onClick={() => window.speechSynthesis?.cancel()}>
          Dừng
        </button>
      </div>
      <div className="quote-meaning">
        <span>Ý nghĩa</span>
        <p>{quote.meaning}</p>
      </div>
      <div className="quote-prompt">
        <span>Liên hệ</span>
        <p>{quote.prompt}</p>
      </div>
    </aside>
  )
}
