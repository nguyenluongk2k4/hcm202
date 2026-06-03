import { Html } from '@react-three/drei'
import { useRef } from 'react'

export default function HolographicArchive({ visible, unlockedQuotes, onClose, openQuote }) {
  const containerRef = useRef()

  if (!visible) return null

  return (
    <group position={[-18, 2, -5]} rotation={[0, 0.5, 0]}>
      {/* Decorative Hologram Backing */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[14, 18]} />
        <meshBasicMaterial color="#0b1b36" transparent opacity={0.6} />
      </mesh>
      
      {/* Glow frame */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[14.2, 18.2]} />
        <meshBasicMaterial color="#32c7ff" wireframe transparent opacity={0.4} />
      </mesh>

      <Html
        ref={containerRef}
        transform
        distanceFactor={10}
        position={[0, 0, 0]}
        zIndexRange={[100, 0]}
        className="hologram-html-container"
      >
        <aside className="archive-panel archive-panel--hologram">
          <div className="panel-top">
            <p className="eyebrow">Sổ tay ký ức</p>
            <button type="button" onClick={onClose} aria-label="Đóng sổ tay">
              x
            </button>
          </div>
          {unlockedQuotes.length > 0 ? (
            <div className="archive-list">
              {unlockedQuotes.map((quote) => (
                <button key={quote.id} type="button" onClick={() => openQuote(quote)}>
                  {quote.text}
                </button>
              ))}
            </div>
          ) : (
            <p className="archive-empty">Hãy click các bookmark phát sáng quanh hành tinh để lưu câu nói.</p>
          )}
        </aside>
      </Html>
    </group>
  )
}
