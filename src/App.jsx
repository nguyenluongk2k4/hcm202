import { startTransition, useEffect, useState } from 'react'
import LandingPage from './components/LandingPage'
import SpaceExperience from './components/SpaceExperience'
import ExamMode from './components/quiz/ExamMode'
import './App.css'

const EXPLORE_HASH = '#kham-pha'
const EXAM_HASH = '#on-thi'

function getPageFromLocation() {
  if (typeof window === 'undefined') {
    return 'landing'
  }

  if (window.location.hash === EXPLORE_HASH) return 'explore'
  if (window.location.hash === EXAM_HASH) return 'exam'
  return 'landing'
}

function App() {
  const [currentPage, setCurrentPage] = useState(() => getPageFromLocation())

  useEffect(() => {
    const syncPage = () => {
      startTransition(() => {
        setCurrentPage(getPageFromLocation())
      })
    }

    window.addEventListener('hashchange', syncPage)
    window.addEventListener('popstate', syncPage)

    return () => {
      window.removeEventListener('hashchange', syncPage)
      window.removeEventListener('popstate', syncPage)
    }
  }, [])

  const openExplorePage = () => {
    if (window.location.hash !== EXPLORE_HASH) {
      window.location.hash = EXPLORE_HASH
    }

    startTransition(() => {
      setCurrentPage('explore')
    })
  }

  const openExamPage = () => {
    if (window.location.hash !== EXAM_HASH) {
      window.location.hash = EXAM_HASH
    }

    startTransition(() => {
      setCurrentPage('exam')
    })
  }

  const openLandingPage = () => {
    const nextUrl = `${window.location.pathname}${window.location.search}`

    window.history.pushState(null, '', nextUrl)

    startTransition(() => {
      setCurrentPage('landing')
    })
  }

  return (
    <main className={`cosmos ${currentPage === 'explore' ? 'cosmos--explore' : 'cosmos--landing'}`}>
      {currentPage === 'explore' && <SpaceExperience onBack={openLandingPage} onExam={openExamPage} />}
      {currentPage === 'exam' && <ExamMode onBack={openLandingPage} onExplore={openExplorePage} />}
      {currentPage === 'landing' && <LandingPage onExplore={openExplorePage} onExam={openExamPage} />}
    </main>
  )
}

export default App
