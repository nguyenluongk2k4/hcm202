import { useState } from 'react'
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

  const handleWin = () => {
    setCompleted(true)
    setTimeout(() => {
      onComplete()
    }, 1000) // Delay to show win state before closing
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
            className="secondary-action" 
            type="button" 
            onClick={onCancel} 
            title="Thoát trò chơi này"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            Thoát trò chơi
          </button>
        </div>
      </div>

      <div className="minigame-content">
        {!completed ? (
          <>
            {planet.id === 'dao-duc' && <PolishGem onWin={handleWin} />}
            {planet.id === 'phong-cach' && <TypeToAct onWin={handleWin} />}
            {planet.id === 'van-hoa' && <GrowSeed onWin={handleWin} />}
            {planet.id === 'doc-lap' && <BreakChains onWin={handleWin} />}
            {planet.id === 'dai-doan-ket' && <ConnectFragments onWin={handleWin} />}
            {planet.id === 'nha-nuoc' && <BalanceScale onWin={handleWin} />}
            {planet.id === 'nguon-goc' && <VortexEnlightenment onWin={handleWin} />}
            {planet.id === 'nhan-van' && <HeartConstellation onWin={handleWin} />}
            {planet.id === 'quoc-te' && <GlobalNetwork onWin={handleWin} />}
            {planet.id === 'ho-chi-minh' && <GravitySun onWin={handleWin} />}
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
