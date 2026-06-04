import { planetPalette } from '../../data/cosmos'

export default function InfoPanel({ planet, unlockedQuotes, onOpenQuote, onClose }) {
  const quoteCount = planet.quotes?.length ?? 0
  const unlockedCount = planet.quotes?.filter((quote) => unlockedQuotes.includes(quote.id)).length ?? 0
  
  const palette = planetPalette[planet.color] || ['#ffffff', '#a9c0dc', '#3d4e70']
  const colorPrimary = palette[1]
  const colorSecondary = palette[0]
  const colorDark = palette[2]

  return (
    <div className="info-panel-overlay" onClick={onClose}>
      <div className="info-panel-modal" onClick={(e) => e.stopPropagation()}>
        <button className="info-panel-close" type="button" onClick={onClose} aria-label="Đóng bảng thông tin">
          ×
        </button>
        
        <div className="info-panel-split">
          <div className="info-panel-visual">
             <div className="planet-image-preview" style={{
                '--planet-color-primary': colorPrimary,
                '--planet-color-secondary': colorSecondary,
                '--planet-color-dark': colorDark,
             }}>
                <div className="planet-orb"></div>
                <div className="planet-atmosphere"></div>
                <div className="planet-stars"></div>
             </div>
          </div>
          
          <div className="info-panel-content">
            <p className="eyebrow">{planet.signal}</p>
            <h2>{planet.name}</h2>
            <p className="panel-type">{planet.type}</p>
            <p className="panel-summary">{planet.summary}</p>
            
            <div className="concept-strip">
              <span>Giá trị cốt lõi</span>
              <strong>{planet.concept}</strong>
            </div>
            
            <ul className="planet-details-list">
              {planet.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            
            {quoteCount > 0 && (
              <div className="planet-bookmarks">
                <div>
                  <span>Bookmark đã mở</span>
                  <strong>
                    {unlockedCount}/{quoteCount}
                  </strong>
                </div>
                <div className="bookmark-buttons">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
