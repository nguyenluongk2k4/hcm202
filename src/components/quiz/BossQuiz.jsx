import { useEffect, useMemo, useRef, useState } from 'react'
import './BossQuiz.css'

const QUESTION_COUNT = 5
const PASS_SCORE = 4
const TIME_PER_QUESTION = 25

function shuffle(list) {
  const copy = [...list]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[target]] = [copy[target], copy[index]]
  }
  return copy
}

export default function BossQuiz({ planet, questions, onPass, onCancel }) {
  const [round, setRound] = useState(0)
  const quizQuestions = useMemo(
    () => shuffle(questions).slice(0, QUESTION_COUNT),
    // round mới → xáo lại câu hỏi
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, round],
  )

  const [questionIndex, setQuestionIndex] = useState(0)
  const [pickedIndex, setPickedIndex] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [finished, setFinished] = useState(false)
  const advanceTimerRef = useRef(null)

  const currentQuestion = quizQuestions[questionIndex]
  const answered = pickedIndex !== null
  const passed = correctCount >= PASS_SCORE

  useEffect(() => {
    if (finished || answered) return undefined

    const timer = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          // Hết giờ = trả lời sai
          setPickedIndex(-1)
          return 0
        }
        return value - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [finished, answered, questionIndex])

  useEffect(() => () => window.clearTimeout(advanceTimerRef.current), [])

  const pickAnswer = (index) => {
    if (answered || finished) return
    setPickedIndex(index)
    if (index === currentQuestion.answerIndex) {
      setCorrectCount((count) => count + 1)
    }
  }

  const goNext = () => {
    window.clearTimeout(advanceTimerRef.current)
    if (questionIndex + 1 >= quizQuestions.length) {
      setFinished(true)
      return
    }
    setQuestionIndex((index) => index + 1)
    setPickedIndex(null)
    setTimeLeft(TIME_PER_QUESTION)
  }

  const retry = () => {
    setRound((value) => value + 1)
    setQuestionIndex(0)
    setPickedIndex(null)
    setCorrectCount(0)
    setTimeLeft(TIME_PER_QUESTION)
    setFinished(false)
  }

  const hpPercent = 100 - (correctCount / quizQuestions.length) * 100

  if (finished) {
    return (
      <div className="boss-quiz">
        <div className={`boss-result ${passed ? 'is-passed' : 'is-failed'}`}>
          <p className="eyebrow">Boss {planet.name}</p>
          <h2>{passed ? 'Boss đã bị đánh bại!' : 'Chưa hạ được boss...'}</h2>
          <p className="boss-result-score">
            Đúng <strong>{correctCount}/{quizQuestions.length}</strong> câu
            {passed ? ' — chương này đã hoàn thành.' : ` — cần ít nhất ${PASS_SCORE} câu đúng để qua.`}
          </p>
          <div className="boss-result-actions">
            {passed ? (
              <button className="primary-action" type="button" onClick={onPass}>
                Nhận thưởng +150 XP
              </button>
            ) : (
              <button className="primary-action" type="button" onClick={retry}>
                Đánh lại
              </button>
            )}
            <button className="secondary-action" type="button" onClick={onCancel}>
              Quay lại bản đồ
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="boss-quiz">
      <div className="boss-hud">
        <div className="boss-hud-info">
          <p className="eyebrow">Thử thách Boss</p>
          <h3>{planet.name}</h3>
        </div>
        <div className="boss-hp" aria-label={`Máu boss còn ${Math.round(hpPercent)}%`}>
          <span style={{ width: `${hpPercent}%` }} />
        </div>
        <div className="boss-hud-meta">
          <span>
            Câu {questionIndex + 1}/{quizQuestions.length}
          </span>
          <span className={timeLeft <= 5 ? 'is-urgent' : ''}>⏱ {timeLeft}s</span>
          <span>Đúng: {correctCount}</span>
        </div>
      </div>

      <div className="boss-question-card">
        <h4>{currentQuestion.question}</h4>
        <div className="boss-options">
          {currentQuestion.options.map((option, index) => {
            let stateClass = ''
            if (answered) {
              if (index === currentQuestion.answerIndex) stateClass = 'is-correct'
              else if (index === pickedIndex) stateClass = 'is-wrong'
            }
            return (
              <button
                key={option}
                className={`boss-option ${stateClass}`}
                type="button"
                disabled={answered}
                onClick={() => pickAnswer(index)}
              >
                <span className="boss-option-key">{String.fromCharCode(65 + index)}</span>
                {option}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="boss-explanation">
            <strong>{pickedIndex === currentQuestion.answerIndex ? 'Chính xác!' : pickedIndex === -1 ? 'Hết giờ!' : 'Chưa đúng.'}</strong>
            <p>{currentQuestion.explanation}</p>
            <button className="primary-action" type="button" onClick={goNext}>
              {questionIndex + 1 >= quizQuestions.length ? 'Xem kết quả' : 'Câu tiếp theo'}
            </button>
          </div>
        )}
      </div>

      <button className="secondary-action boss-quit" type="button" onClick={onCancel}>
        Rút lui
      </button>
    </div>
  )
}
