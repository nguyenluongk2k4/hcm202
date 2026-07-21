import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { planets } from '../data/curriculum'
import { questionsByChapter } from '../data/quizBank'
import useProgress from '../hooks/useProgress'
import InfoPanel from './space/InfoPanel'
import QuotePanel from './space/QuotePanel'
import Scene from './space/Scene'
import TruthMuseum from './space/TruthMuseum'
import MinigameOverlay from './minigames/MinigameOverlay'
import BossQuiz from './quiz/BossQuiz'

export default function SpaceExperience({ onBack, onExam }) {
  const { progress, unlockLesson, markBossPassed } = useProgress()
  const [selectedPlanet, setSelectedPlanet] = useState(planets[0])
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [openedPlanet, setOpenedPlanet] = useState(null)
  const [quoteRevealKey, setQuoteRevealKey] = useState(0)
  const [isWarping, setIsWarping] = useState(true)
  const [pendingMinigame, setPendingMinigame] = useState(null)
  const [pendingBoss, setPendingBoss] = useState(null)
  const [minigamesEnabled, setMinigamesEnabled] = useState(true)
  const [museumOpen, setMuseumOpen] = useState(false)
  const minigameSessionRef = useRef(0)
  const activeMinigameIdRef = useRef(null)
  const previousUnlockedCountRef = useRef(0)

  const unlockedQuotes = progress.unlockedLessons

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
        const minigameId = `${quote.id}-${(minigameSessionRef.current += 1)}`
        activeMinigameIdRef.current = minigameId
        setSelectedQuote(null)
        setPendingMinigame({ id: minigameId, quote, planet })
        return
      }
      // Tắt thử thách → mở khóa luôn
      unlockLesson(quote.id)
    }

    setSelectedQuote(quote)
    setQuoteRevealKey((key) => key + 1)
  }

  const handleMinigameComplete = (completedMinigame) => {
    if (!completedMinigame || activeMinigameIdRef.current !== completedMinigame.id) return
    const { quote } = completedMinigame
    unlockLesson(quote.id)
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

  const challengeBoss = (planet) => {
    setOpenedPlanet(null)
    setSelectedQuote(null)
    setPendingBoss(planet)
  }

  const handleBossPass = () => {
    if (!pendingBoss) return
    markBossPassed(pendingBoss.id)
    setPendingBoss(null)
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
          <p className="eyebrow">Vũ Trụ Lý Luận</p>
          <h1>Bản đồ Chủ nghĩa xã hội khoa học</h1>
        </div>
        <div className="experience-controls" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="xp-badge" title="Điểm kinh nghiệm tích lũy — lên cấp mỗi 300 XP">
            ⭐ Cấp {Math.floor(progress.xp / 300) + 1} · {progress.xp} XP
          </span>
          <button className="secondary-action" type="button" onClick={onExam}>
            Phòng ôn thi
          </button>
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
          aria-label="Mở Hồ sơ lý luận"
        >
          <span>Hồ sơ</span>
          <strong>Lý luận</strong>
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
            <span>Double Click</span> xem thông tin + boss
          </div>
          <div>
            <span>Bookmark</span> mở bài học
          </div>
        </div>

        {openedPlanet && (
          <InfoPanel
            planet={openedPlanet}
            unlockedQuotes={unlockedQuotes}
            bossPassed={progress.bossPassed.includes(openedPlanet.id)}
            onOpenQuote={(quote) => openQuote(quote, openedPlanet)}
            onChallengeBoss={() => challengeBoss(openedPlanet)}
            onClose={() => setOpenedPlanet(null)}
          />
        )}
        <QuotePanel quote={selectedQuote} onClose={() => setSelectedQuote(null)} />

        <TruthMuseum
          visible={museumOpen}
          bookmarks={allBookmarks}
          unlockedQuotes={unlockedQuotes}
          bossPassed={progress.bossPassed}
          examBest={progress.examBest}
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

        {pendingBoss && (
          <BossQuiz
            planet={pendingBoss}
            questions={questionsByChapter[pendingBoss.chapter] ?? []}
            onPass={handleBossPass}
            onCancel={() => setPendingBoss(null)}
          />
        )}
      </div>
    </section>
  )
}
