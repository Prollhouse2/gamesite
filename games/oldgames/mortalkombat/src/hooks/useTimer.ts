import { useState, useEffect } from 'react'

export const useTimer = (seconds: number): number => {
  const [currentSecond, setCurrentSecond] = useState(seconds)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSecond(prev => prev - 1)
    }, 1000)

    if (currentSecond === 0) {
      clearInterval(interval)
    }

    return () => {
      clearInterval(interval)
    }
  }, [currentSecond])

  return currentSecond
}
