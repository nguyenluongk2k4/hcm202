import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { planets } from '../data/cosmos'
import InfoPanel from './space/InfoPanel'
import QuotePanel from './space/QuotePanel'
import Scene from './space/Scene'

export default function SpaceExperience({ onBack }) {
  const [selectedPlanet, setSelectedPlanet] = useState(planets[0])
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [panelVisible, setPanelVisible] = useState(true)
  const [archiveVisible, setArchiveVisible] = useState(false)
  const [unlockedQuotes, setUnlockedQuotes] = useState([])
  const [quoteRevealKey, setQuoteRevealKey] = useState(0)
  const [isWarping, setIsWarping] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWarping(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  const allQuotes = useMemo(() => planets.flatMap((planet) => planet.quotes ?? []), [])
  const unlockedQuoteItems = allQuotes.filter((quote) => unlockedQuotes.includes(quote.id))
  const isCompleted = unlockedQuotes.length === allQuotes.length

  const selectPlanet = (planet) => {
    setSelectedPlanet(planet)
    setPanelVisible(true)
  }

  const openQuote = (quote) => {
    setSelectedQuote(quote)
    setQuoteRevealKey((key) => key + 1)
    setUnlockedQuotes((current) => (current.includes(quote.id) ? current : [...current, quote.id]))
  }

  return (
    <section className="experience-page">
      <div className="experience-topbar">
        <button className="secondary-action" type="button" onClick={onBack}>
          Trang đầu
        </button>
        <div className="experience-copy">
          <p className="eyebrow">Vũ Trụ Kí Ức</p>
          <h1>Bản đồ tư tưởng Hồ Chí Minh</h1>
        </div>
        <button className="archive-toggle" type="button" onClick={() => setArchiveVisible((visible) => !visible)}>
          Sổ tay {unlockedQuotes.length}/{allQuotes.length}
        </button>
      </div>

      <div className="space-experience">
        <Canvas camera={{ position: [0, 17, 31], fov: 50, near: 0.1, far: 160 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Scene
              selectedPlanet={selectedPlanet}
              setSelectedPlanet={selectPlanet}
              unlockedQuotes={unlockedQuotes}
              onOpenQuote={openQuote}
              isWarping={isWarping}
              archiveVisible={archiveVisible}
              setArchiveVisible={setArchiveVisible}
              unlockedQuoteItems={unlockedQuoteItems}
              isCompleted={isCompleted}
            />
          </Suspense>
        </Canvas>

        {quoteRevealKey > 0 && (
          <div key={quoteRevealKey + 'trail'} className="quote-reveal-trail" aria-hidden="true" />
        )}

        <div className="hud-bar">
          <div>
            <span>Drag</span> xoay camera
          </div>
          <div>
            <span>Scroll</span> zoom
          </div>
          <div>
            <span>Click</span> mở hành tinh
          </div>
          <div>
            <span>Bookmark</span> mở câu nói
          </div>
        </div>

        {panelVisible && (
          <InfoPanel
            planet={selectedPlanet}
            unlockedQuotes={unlockedQuotes}
            onOpenQuote={openQuote}
            onClose={() => setPanelVisible(false)}
          />
        )}
        {!panelVisible && (
          <button className="reopen-panel" type="button" onClick={() => setPanelVisible(true)}>
            Mở bảng chủ đề
          </button>
        )}
        <QuotePanel quote={selectedQuote} onClose={() => setSelectedQuote(null)} />
      </div>
    </section>
  )
}
