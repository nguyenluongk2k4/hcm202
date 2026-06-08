import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { planets } from '../data/cosmos'
import InfoPanel from './space/InfoPanel'
import QuotePanel from './space/QuotePanel'
import Scene from './space/Scene'
import TruthMuseum from './space/TruthMuseum'
import MinigameOverlay from './minigames/MinigameOverlay'

export default function SpaceExperience({ onBack }) {
  const [selectedPlanet, setSelectedPlanet] = useState(planets[0])
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [openedPlanet, setOpenedPlanet] = useState(null)
  const [unlockedQuotes, setUnlockedQuotes] = useState([])
  const [quoteRevealKey, setQuoteRevealKey] = useState(0)
  const [isWarping, setIsWarping] = useState(true)
  const [pendingMinigame, setPendingMinigame] = useState(null)
  const [minigamesEnabled, setMinigamesEnabled] = useState(true)
  const [museumOpen, setMuseumOpen] = useState(false)
  const minigameSessionRef = useRef(0)
  const activeMinigameIdRef = useRef(null)
  const previousUnlockedCountRef = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWarping(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  const allBookmarks = useMemo(
    () => planets.flatMap((planet) => (planet.quotes ?? []).map((quote) => ({ quote, planet }))),
    [],
  )
  const allQuotes = useMemo(() => allBookmarks.map((item) => item.quote), [allBookmarks])
  const isCompleted = unlockedQuotes.length === allQuotes.length

  useEffect(() => {
    const previousCount = previousUnlockedCountRef.current
    previousUnlockedCountRef.current = unlockedQuotes.length

    if (allQuotes.length > 0 && previousCount < allQuotes.length && unlockedQuotes.length === allQuotes.length) {
      setMuseumOpen(true)
    }
  }, [allQuotes.length, unlockedQuotes.length])

  const selectPlanet = (planet) => {
    setSelectedPlanet(planet)
  }

  const openQuote = (quote, planet) => {
    if (!unlockedQuotes.includes(quote.id)) {
      if (minigamesEnabled) {
        const minigameId = `${quote.id}-${minigameSessionRef.current += 1}`
        activeMinigameIdRef.current = minigameId
        setSelectedQuote(null)
        setPendingMinigame({ id: minigameId, quote, planet })
        return
      } else {
        // Automatically unlock if minigames are disabled
        setUnlockedQuotes((current) => [...current, quote.id])
      }
    }
    
    setSelectedQuote(quote)
    setQuoteRevealKey((key) => key + 1)
  }

  const handleMinigameComplete = (completedMinigame) => {
    if (!completedMinigame || activeMinigameIdRef.current !== completedMinigame.id) return
    const { quote } = completedMinigame
    setUnlockedQuotes((current) => (current.includes(quote.id) ? current : [...current, quote.id]))
    setSelectedQuote(quote)
    setQuoteRevealKey((key) => key + 1)
    activeMinigameIdRef.current = null
    setPendingMinigame(null)
  }

  const handleMinigameCancel = (minigame) => {
    if (!minigame || activeMinigameIdRef.current !== minigame.id) return
    activeMinigameIdRef.current = null
    setPendingMinigame(null)
  }

  const openCollectedQuote = (quote) => {
    setSelectedQuote(quote)
    setQuoteRevealKey((key) => key + 1)
    setMuseumOpen(false)
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
        <div className="experience-controls" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Thử thách:</span>
          <button 
            className={`secondary-action ${minigamesEnabled ? 'active' : ''}`} 
            type="button" 
            onClick={() => setMinigamesEnabled(!minigamesEnabled)}
            style={{ 
              background: minigamesEnabled ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)',
              borderColor: minigamesEnabled ? '#4ade80' : '#f87171',
              color: minigamesEnabled ? '#4ade80' : '#f87171'
            }}
          >
            {minigamesEnabled ? 'Bật' : 'Tắt'}
          </button>
        </div>
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
              isCompleted={isCompleted}
              onDoubleClickPlanet={setOpenedPlanet}
            />
          </Suspense>
        </Canvas>

        {quoteRevealKey > 0 && (
          <div key={quoteRevealKey + 'trail'} className="quote-reveal-trail" aria-hidden="true" />
        )}

        <button
          className={`collection-toggle ${isCompleted ? 'is-complete' : ''}`}
          type="button"
          onClick={() => setMuseumOpen(true)}
          aria-label="Mở Túi đồ và Bộ sưu tập"
        >
          <span>Túi đồ</span>
          <strong>Bộ sưu tập</strong>
          <em>{unlockedQuotes.length}/{allQuotes.length}</em>
        </button>

        <div className="hud-bar">
          <div>
            <span>Drag</span> xoay camera
          </div>
          <div>
            <span>Scroll</span> zoom
          </div>
          <div>
            <span>Click</span> zoom hành tinh
          </div>
          <div>
            <span>Double Click</span> xem thông tin
          </div>
          <div>
            <span>Bookmark</span> mở câu nói
          </div>
        </div>

        {openedPlanet && (
          <InfoPanel
            planet={openedPlanet}
            unlockedQuotes={unlockedQuotes}
            onOpenQuote={(quote) => openQuote(quote, openedPlanet)}
            onClose={() => setOpenedPlanet(null)}
          />
        )}
        <QuotePanel quote={selectedQuote} onClose={() => setSelectedQuote(null)} />

        <TruthMuseum
          visible={museumOpen}
          bookmarks={allBookmarks}
          unlockedQuotes={unlockedQuotes}
          onClose={() => setMuseumOpen(false)}
          onOpenQuote={openCollectedQuote}
        />
        
        {pendingMinigame && (
          <MinigameOverlay
            quote={pendingMinigame.quote}
            planet={pendingMinigame.planet}
            onComplete={() => handleMinigameComplete(pendingMinigame)}
            onCancel={() => handleMinigameCancel(pendingMinigame)}
          />
        )}
      </div>
    </section>
  )
}
