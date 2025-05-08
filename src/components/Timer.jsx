import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Coffee, Bell } from "lucide-react"
import { Progress } from "./Progress"

export function Timer({ timerMode, setTimerMode, settings, cycles, setCycles, onTimerComplete }) {
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [progress, setProgress] = useState(100)

  // Add audio ref
  const tickingAudioRef = useRef(null)
  
   // Play/stop ticking sound when timer runs or stops
   useEffect(() => {
    const ticking = tickingAudioRef.current
    if (!ticking) return

    if (isRunning) {
      ticking.loop = true
      ticking.play().catch((err) => console.warn("Audio play failed:", err))
    } else {
      ticking.pause()
      ticking.currentTime = 0 // reset to start
    }

    return () => {
      ticking.pause()
      ticking.currentTime = 0
    }
  }, [isRunning]);

  // Initialize timer based on mode
  useEffect(() => {
    let initialTime
    switch (timerMode) {
      case "focus":
        initialTime = settings.focusTime * 60
        break
      case "shortBreak":
        initialTime = settings.shortBreakTime * 60
        break
      case "longBreak":
        initialTime = settings.longBreakTime * 60
        break
      default:
        initialTime = settings.focusTime * 60
    }
    setTimeLeft(initialTime)
    setProgress(100)
  }, [timerMode, settings])

  // Timer logic
  useEffect(() => {
    let interval = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1

          // Calculate progress percentage
          let totalTime
          switch (timerMode) {
            case "focus":
              totalTime = settings.focusTime * 60
              break
            case "shortBreak":
              totalTime = settings.shortBreakTime * 60
              break
            case "longBreak":
              totalTime = settings.longBreakTime * 60
              break
            default:
              totalTime = settings.focusTime * 60
          }

          setProgress((newTime / totalTime) * 100)
          return newTime
        })
      }, 1000)
    } else if (timeLeft === 0) {
      clearInterval(interval)
      onTimerComplete()
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, timerMode, settings, onTimerComplete])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle timer controls
  const startTimer = () => {
    setIsRunning(true)

    // Send message to background script to set alarm
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
      let minutes
      switch (timerMode) {
        case "focus":
          minutes = settings.focusTime
          break
        case "shortBreak":
          minutes = settings.shortBreakTime
          break
        case "longBreak":
          minutes = settings.longBreakTime
          break
        default:
          minutes = settings.focusTime
      }

      chrome.runtime.sendMessage({
        action: "setAlarm",
        minutes,
        mode: timerMode,
      })
    }
  }

  const pauseTimer = () => setIsRunning(false)

  const resetTimer = () => {
    setIsRunning(false)

    let resetTime
    switch (timerMode) {
      case "focus":
        resetTime = settings.focusTime * 60
        break
      case "shortBreak":
        resetTime = settings.shortBreakTime * 60
        break
      case "longBreak":
        resetTime = settings.longBreakTime * 60
        break
      default:
        resetTime = settings.focusTime * 60
    }

    setTimeLeft(resetTime)
    setProgress(100)
  }

  // Get timer label based on mode
  const getTimerLabel = () => {
    switch (timerMode) {
      case "focus":
        return "Focus Time"
      case "shortBreak":
        return "Short Break"
      case "longBreak":
        return "Long Break"
      default:
        return "Focus Time"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center mb-8">

    <audio ref={tickingAudioRef} src="/sounds/ticking-clock.mp3" preload="auto" />
        
      <h2 className="text-2xl font-bold mb-6">{getTimerLabel()}</h2>

      <div className="text-6xl font-bold mb-4 tabular-nums">{formatTime(timeLeft)}</div>
      <Progress value={progress} className="w-full h-2 mb-6" />

      <div className="flex gap-2 mb-4">
        <button
          className="rounded-full h-12 w-12 flex items-center justify-center border border-gray-300 hover:bg-gray-100"
          onClick={resetTimer}
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        {isRunning ? (
          <button
            className="rounded-full h-14 w-14 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white"
            onClick={pauseTimer}
          >
            <Pause className="h-6 w-6" />
          </button>
        ) : (
          <button
            className="rounded-full h-14 w-14 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white"
            onClick={startTimer}
          >
            <Play className="h-6 w-6" />
          </button>
        )}

        <button
          className="rounded-full h-12 w-12 flex items-center justify-center border border-gray-300 hover:bg-gray-100"
          onClick={() => {
            const modes = ["focus", "shortBreak", "longBreak"]
            const currentIndex = modes.indexOf(timerMode)
            const nextIndex = (currentIndex + 1) % modes.length
            setTimerMode(modes[nextIndex])
          }}
        >
          {timerMode === "focus" ? <Coffee className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        </button>
      </div>

      <div className="text-sm text-gray-500">
        Cycle: {cycles % settings.cyclesBeforeLongBreak || settings.cyclesBeforeLongBreak}/
        {settings.cyclesBeforeLongBreak}
      </div>
    </div>
  )
}
