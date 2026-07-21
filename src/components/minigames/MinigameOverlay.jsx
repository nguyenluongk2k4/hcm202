import { useRef, useState } from 'react'
import SortIsm from './SortIsm'
import GrowSeed from './GrowSeed'
import BreakChains from './BreakChains'
import ConnectFragments from './ConnectFragments'
import BalanceScale from './BalanceScale'
import HeartConstellation from './HeartConstellation'
import GlobalNetwork from './GlobalNetwork'
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
    // Không tự động chuyển sang màn hình "Hoàn thành" nữa
    // Chỉ đánh dấu là đã giải quyết xong để hiện nút "Xem bài học"
    handleSolved()
  }

  const handleExit = () => {
    if (solvedRef.current) {
      if (completedRef.current) return
      completedRef.current = true

      // Mới hiện màn hình "Hoàn thành! Đã mở khóa bài học."
      setCompleted(true)
      
      // Đợi 1.2 giây rồi mới đóng overlay
      setTimeout(() => {
        onComplete()
      }, 1200)
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
            title={solved ? 'Mở bài học vừa hoàn thành' : 'Thoát trò chơi này'}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            {solved ? 'Xem bài học' : 'Thoát trò chơi'}
          </button>
        </div>
      </div>

      <div className="minigame-content">
        {!completed ? (
          <>
            {planet.id === 'tong-quan' && <GravitySun onWin={handleWin} onSolved={handleSolved} />}
            {planet.id === 'chuong-1' && <SortIsm onWin={handleWin} onSolved={handleSolved} />}
            {planet.id === 'chuong-2' && <BreakChains onWin={handleWin} onSolved={handleSolved} />}
            {planet.id === 'chuong-3' && <GrowSeed onWin={handleWin} onSolved={handleSolved} />}
            {planet.id === 'chuong-4' && <BalanceScale onWin={handleWin} onSolved={handleSolved} />}
            {planet.id === 'chuong-5' && <ConnectFragments onWin={handleWin} onSolved={handleSolved} />}
            {planet.id === 'chuong-6' && <GlobalNetwork onWin={handleWin} onSolved={handleSolved} />}
            {planet.id === 'chuong-7' && <HeartConstellation onWin={handleWin} onSolved={handleSolved} />}
            {/* Fallback */}
            {![
              'tong-quan', 'chuong-1', 'chuong-2', 'chuong-3', 'chuong-4',
              'chuong-5', 'chuong-6', 'chuong-7'
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
            <p>Đã mở khóa bài học.</p>
          </div>
        )}
      </div>
    </div>
  )
}
