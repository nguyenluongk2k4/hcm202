export default function InfoPanel({ planet, unlockedQuotes, onOpenQuote, onClose }) {
  const quoteCount = planet.quotes?.length ?? 0
  const unlockedCount = planet.quotes?.filter((quote) => unlockedQuotes.includes(quote.id)).length ?? 0

  return (
    <aside className="info-panel">
      <div className="panel-top">
        <p className="eyebrow">{planet.signal}</p>
        <button type="button" onClick={onClose} aria-label="Ẩn bảng thông tin">
          ×
        </button>
      </div>
      <h2>{planet.name}</h2>
      <p className="panel-type">{planet.type}</p>
      <p>{planet.summary}</p>
      <ul>
        {planet.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
      <div className="concept-strip">
        <span>Giá trị cốt lõi</span>
        <strong>{planet.concept}</strong>
      </div>
      {quoteCount > 0 && (
        <div className="planet-bookmarks">
          <div>
            <span>Bookmark đã mở</span>
            <strong>
              {unlockedCount}/{quoteCount}
            </strong>
          </div>
          {planet.quotes.map((quote) => (
            <button
              key={quote.id}
              className={unlockedQuotes.includes(quote.id) ? 'is-unlocked' : ''}
              type="button"
              onClick={() => onOpenQuote(quote)}
            >
              {unlockedQuotes.includes(quote.id) ? 'Đã lưu' : 'Mở khóa'} bookmark
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}
