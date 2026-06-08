import { useRef, useState } from 'react'
import PolishGem from './PolishGem'
import TypeToAct from './TypeToAct'
import GrowSeed from './GrowSeed'
import BreakChains from './BreakChains'
import ConnectFragments from './ConnectFragments'
import BalanceScale from './BalanceScale'
import AlignRings from './AlignRings'
import HeartConstellation from './HeartConstellation'
import GlobalNetwork from './GlobalNetwork'
import VortexEnlightenment from './VortexEnlightenment'
import GravitySun from './GravitySun'

export default function MinigameOverlay({ quote, planet, onComplete, onCancel }) {
  const [completed, setCompleted] = useState(false)
  const [solved, setSolved] = useState(false)
  const solvedRef = useRef(false)
  const completedRef = useRef(false)

  const handleSolved = () => {
    solvedRef.current = true
    setSolved(true)
  }

  const handleWin = ({ skipSuccess = false } = {}) => {
    if (completedRef.current) return
    completedRef.current = true
    handleSolved()

    if (skipSuccess) {
      onComplete()
      return
    }

    setCompleted(true)
    setTimeout(() => {
      onComplete()
    }, 1000) // Delay to show win state before closing
  }

  const handleExit = () => {
    if (solvedRef.current) {
      handleWin({ skipSuccess: true })
      return
    }

    onCancel()
  }

  return (
    <div className="minigame-overlay">
      <div className="minigame-header">
        <div className="minigame-title">
          <small>Thử thách</small>
          <h2>{planet.name}</h2>
        </div>
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: '10px' }}>
          <button 
            className={`secondary-action ${solved ? 'is-solved-exit' : ''}`} 
            type="button" 
            onClick={handleExit} 
            title={solved ? 'Mở bookmark vừa hoàn thành' : 'Thoát trò chơi này'}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            {solved ? 'Xem bookmark' : 'Thoát trò chơi'}
          </button>
        </div>
      </div>

      <div className="minigame-content">
        {!completed ? (
          <>
            {planet.id === 'dao-duc' && <PolishGem onWin={handleWin} onSolved={handleSolved} />}
            {planet.id === 'phong-cach' && <TypeToAct onWin={() => handleWin({ skipSuccess: true })} onSolved={handleSolved} />}
            {planet.id === 'van-hoa' && <GrowSeed onWin={handleWin} onSolved={handleSolved} />}
            {planet.id === 'doc-lap' && <BreakChains onWin={handleWin} onSolved={handleSolved} />}
            {planet.id === 'dai-doan-ket' && <ConnectFragments onWin={handleWin} onSolved={handleSolved} />}
            {planet.id === 'nha-nuoc' && <BalanceScale onWin={handleWin} onSolved={handleSolved} />}
            {planet.id === 'nguon-goc' && <VortexEnlightenment onWin={handleWin} onSolved={handleSolved} />}
            {planet.id === 'nhan-van' && <HeartConstellation onWin={handleWin} onSolved={handleSolved} />}
            {planet.id === 'quoc-te' && <GlobalNetwork onWin={handleWin} onSolved={handleSolved} />}
            {planet.id === 'ho-chi-minh' && <GravitySun onWin={handleWin} onSolved={handleSolved} />}
            {/* Fallback */}
            {![
              'dao-duc', 'phong-cach', 'van-hoa', 'doc-lap', 'dai-doan-ket',
              'nha-nuoc', 'nguon-goc', 'nhan-van', 'quoc-te', 'ho-chi-minh'
            ].includes(planet.id) && (
              <div className="minigame-placeholder">
                <h3>(Minigame cho {planet.name} đang được phát triển)</h3>
                <button className="primary-action" type="button" onClick={handleWin}>
                  Giả lập Chiến thắng
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="minigame-success">
            <h3>Hoàn thành!</h3>
            <p>Đã mở khóa bookmark.</p>
          </div>
        )}
      </div>
    </div>
  )
}
