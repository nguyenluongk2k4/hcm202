import { useEffect, useMemo, useState } from 'react'
import { planets } from '../../data/curriculum'
import { allQuestions } from '../../data/quizBank'
import useProgress from '../../hooks/useProgress'
import './ExamMode.css'

const EXAM_QUESTION_COUNT = 20
const EXAM_DURATION_SECONDS = 10 * 60

function shuffle(list) {
  const copy = [...list]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[target]] = [copy[target], copy[index]]
  }
  return copy
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export default function ExamMode({ onBack, onExplore }) {
  const { progress, recordExam } = useProgress()
  const [phase, setPhase] = useState('intro') // intro | running | result
  const [round, setRound] = useState(0)

  const examQuestions = useMemo(
    () => shuffle(allQuestions).slice(0, EXAM_QUESTION_COUNT),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round],
  )

  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS)

  useEffect(() => {
    if (phase !== 'running') return undefined

    const timer = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          setPhase('result')
          return 0
        }
        return value - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [phase])

  const startExam = () => {
    setRound((value) => value + 1)
    setQuestionIndex(0)
    setAnswers([])
    setTimeLeft(EXAM_DURATION_SECONDS)
    setPhase('running')
  }

  const answerAndNext = (optionIndex) => {
    const nextAnswers = [...answers, optionIndex]
    setAnswers(nextAnswers)

    if (questionIndex + 1 >= examQuestions.length) {
      const score = nextAnswers.filter(
        (picked, index) => picked === examQuestions[index].answerIndex,
      ).length
      recordExam(score)
      setPhase('result')
      return
    }
    setQuestionIndex((index) => index + 1)
  }

  const finishEarly = () => {
    const score = answers.filter((picked, index) => picked === examQuestions[index].answerIndex).length
    recordExam(score)
    setPhase('result')
  }

  const score = answers.filter((picked, index) => picked === examQuestions[index].answerIndex).length

  const chapterStats = useMemo(() => {
    const stats = new Map()
    examQuestions.forEach((question, index) => {
      if (index >= answers.length) return
      const entry = stats.get(question.chapter) ?? { total: 0, correct: 0 }
      entry.total += 1
      if (answers[index] === question.answerIndex) entry.correct += 1
      stats.set(question.chapter, entry)
    })
    return [...stats.entries()].sort((a, b) => a[0] - b[0])
  }, [answers, examQuestions])

  const chapterName = (chapter) =>
    chapter === 0 ? 'Tổng quan' : planets.find((planet) => planet.chapter === chapter)?.name ?? `Chương ${chapter}`

  const weakChapters = chapterStats.filter(([, stat]) => stat.correct / stat.total < 0.6)

  if (phase === 'intro') {
    return (
      <section className="exam-page">
        <div className="exam-card exam-intro">
          <p className="eyebrow">Phòng ôn thi MLN131</p>
          <h1>Đề thi thử Chủ nghĩa xã hội khoa học</h1>
          <ul className="exam-rules">
            <li>
              <strong>{EXAM_QUESTION_COUNT} câu</strong> trắc nghiệm, xáo ngẫu nhiên từ toàn bộ 7 chương giáo trình.
            </li>
            <li>
              Thời gian <strong>{formatTime(EXAM_DURATION_SECONDS)}</strong> — hết giờ tự động nộp bài.
            </li>
            <li>Chọn đáp án là chuyển câu ngay, không quay lại được.</li>
            <li>
              Điểm cao nhất hiện tại: <strong>{progress.examBest}/{EXAM_QUESTION_COUNT}</strong>
            </li>
          </ul>
          <div className="exam-actions">
            <button className="primary-action" type="button" onClick={startExam}>
              Bắt đầu làm bài
            </button>
            <button className="secondary-action" type="button" onClick={onBack}>
              Trang đầu
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (phase === 'running') {
    const currentQuestion = examQuestions[questionIndex]
    return (
      <section className="exam-page">
        <div className="exam-topbar">
          <span>
            Câu {questionIndex + 1}/{examQuestions.length}
          </span>
          <div className="exam-progress-track" aria-hidden="true">
            <span style={{ width: `${(questionIndex / examQuestions.length) * 100}%` }} />
          </div>
          <span className={timeLeft <= 60 ? 'exam-timer is-urgent' : 'exam-timer'}>
            ⏱ {formatTime(timeLeft)}
          </span>
        </div>

        <div className="exam-card">
          <p className="eyebrow">{chapterName(currentQuestion.chapter)}</p>
          <h2 className="exam-question">{currentQuestion.question}</h2>
          <div className="exam-options">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option}
                className="exam-option"
                type="button"
                onClick={() => answerAndNext(index)}
              >
                <span className="exam-option-key">{String.fromCharCode(65 + index)}</span>
                {option}
              </button>
            ))}
          </div>
          <button className="secondary-action exam-finish-early" type="button" onClick={finishEarly}>
            Nộp bài sớm
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="exam-page">
      <div className="exam-card exam-result">
        <p className="eyebrow">Kết quả</p>
        <h1>
          {score}/{examQuestions.length} câu đúng
        </h1>
        <p className="exam-result-sub">
          {score >= 16
            ? 'Xuất sắc! Bạn nắm rất chắc giáo trình.'
            : score >= 12
              ? 'Khá tốt — ôn lại vài chương yếu bên dưới.'
              : 'Cần ôn thêm — vào bản đồ sao học lại từng chương nhé.'}{' '}
          Điểm cao nhất: {Math.max(progress.examBest, score)}/{examQuestions.length}
        </p>

        <div className="exam-chapter-stats">
          {chapterStats.map(([chapter, stat]) => (
            <div
              key={chapter}
              className={`exam-chapter-stat ${stat.correct / stat.total < 0.6 ? 'is-weak' : ''}`}
            >
              <span>{chapterName(chapter)}</span>
              <strong>
                {stat.correct}/{stat.total}
              </strong>
            </div>
          ))}
        </div>

        {weakChapters.length > 0 && (
          <p className="exam-weak-hint">
            Chương cần ôn lại: {weakChapters.map(([chapter]) => chapterName(chapter)).join(', ')}.
          </p>
        )}

        <div className="exam-actions">
          <button className="primary-action" type="button" onClick={startExam}>
            Làm đề mới
          </button>
          <button className="secondary-action" type="button" onClick={onExplore}>
            Ôn lại trên bản đồ sao
          </button>
          <button className="secondary-action" type="button" onClick={onBack}>
            Trang đầu
          </button>
        </div>
      </div>
    </section>
  )
}
