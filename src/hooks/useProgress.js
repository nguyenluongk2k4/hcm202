import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'mln131-progress-v1'

const DEFAULT_PROGRESS = {
  unlockedLessons: [],
  bossPassed: [],
  xp: 0,
  examBest: 0,
}

function loadProgress() {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PROGRESS

    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      unlockedLessons: Array.isArray(parsed.unlockedLessons) ? parsed.unlockedLessons : [],
      bossPassed: Array.isArray(parsed.bossPassed) ? parsed.bossPassed : [],
      xp: Number.isFinite(parsed.xp) ? parsed.xp : 0,
      examBest: Number.isFinite(parsed.examBest) ? parsed.examBest : 0,
    }
  } catch {
    return DEFAULT_PROGRESS
  }
}

export default function useProgress() {
  const [progress, setProgress] = useState(loadProgress)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // Bỏ qua nếu localStorage không khả dụng (chế độ private, đầy bộ nhớ...)
    }
  }, [progress])

  const unlockLesson = useCallback((lessonId) => {
    setProgress((current) => {
      if (current.unlockedLessons.includes(lessonId)) return current
      return {
        ...current,
        unlockedLessons: [...current.unlockedLessons, lessonId],
        xp: current.xp + 50,
      }
    })
  }, [])

  const markBossPassed = useCallback((planetId) => {
    setProgress((current) => {
      if (current.bossPassed.includes(planetId)) return current
      return {
        ...current,
        bossPassed: [...current.bossPassed, planetId],
        xp: current.xp + 150,
      }
    })
  }, [])

  const recordExam = useCallback((score) => {
    setProgress((current) => ({
      ...current,
      examBest: Math.max(current.examBest, score),
      xp: current.xp + score,
    }))
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS)
  }, [])

  return {
    progress,
    unlockLesson,
    markBossPassed,
    recordExam,
    resetProgress,
  }
}
