import './App.css'
import { useState, useEffect } from "react"
import { IoSettingsOutline, IoClose } from "react-icons/io5";
import { Confetti } from "./components/Confetti"
import { Timer } from "./components/Timer"
// import { Stats } from "./components/Stats"
// import { Rewards } from "./components/Rewards"
// import { Settings } from "./components/Settings"


function App() {

    // Timer states
  const [activeTab, setActiveTab] = useState("timer")
  const [timerMode, setTimerMode] = useState("focus") // focus, shortBreak, longBreak
  const [cycles, setCycles] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [rewards, setRewards] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [currentTask, setCurrentTask] = useState("")

  // Settings
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    cyclesBeforeLongBreak: 4,
    notifications: true,
    sounds: true,
    autoStartBreaks: true,
    autoStartPomodoros: false,
    dailyGoal: 8,
  })

  // Stats
  const [stats, setStats] = useState({
    todayFocusMinutes: 0,
    weekFocusMinutes: 0,
    totalFocusMinutes: 0,
    completedCycles: 0,
    streakDays: 3,
  })

  // Load data from storage on mount
  useEffect(() => {
    
  }, [])

  // Save data to storage when it changes
  useEffect(() => {
   
  }, [])

  // Listen for messages from background script
  useEffect(() => {
   
  }, [])

  // Handle timer completion
  const handleTimerComplete = () => {
    if (timerMode === "focus") {
      // Update stats
      setStats((prev) => ({
        ...prev,
        todayFocusMinutes: prev.todayFocusMinutes + settings.focusTime,
        weekFocusMinutes: prev.weekFocusMinutes + settings.focusTime,
        totalFocusMinutes: prev.totalFocusMinutes + settings.focusTime,
        completedCycles: prev.completedCycles + 1,
      }))

      // Update cycles and check if long break is needed
      const newCycles = cycles + 1
      setCycles(newCycles)

      // Add rewards
      setRewards((prev) => prev + 10)

      // Show confetti for completed focus session
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)

      // Determine next break type
      if (newCycles % settings.cyclesBeforeLongBreak === 0) {
        setTimerMode("longBreak")
      } else {
        setTimerMode("shortBreak")
      }
    } else {
      // Break completed, go back to focus mode
      setTimerMode("focus")
    }
  }

  // Update settings
  const updateSettings = (key, value) => {
 
  }

  // Get background color based on timer mode
  const getBgColor = () => {
    switch (timerMode) {
      case "focus":
        return "bg-gradient-to-br from-focus to-focus-dark"
      case "shortBreak":
        return "bg-gradient-to-br from-shortBreak to-shortBreak-dark"
      case "longBreak":
        return "bg-gradient-to-br from-longBreak to-longBreak-dark"
      default:
        return "bg-gradient-to-br from-focus to-focus-dark"
    }
  }

  return (
    <>
      <div className={`min-h-screen flex items-center justify-center p-4 ${getBgColor()}`}>
      {showConfetti && <Confetti />}

      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-0">
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 text-center font-medium ${activeTab === "timer" ? "border-b-2 border-blue-500" : ""}`}
              onClick={() => setActiveTab("timer")}
            >
              Timer
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium ${activeTab === "stats" ? "border-b-2 border-blue-500" : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              Stats
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium ${activeTab === "rewards" ? "border-b-2 border-blue-500" : ""}`}
              onClick={() => setActiveTab("rewards")}
            >
              Rewards
            </button>
          </div>

            {/* Timer Tab */}
            {activeTab === "timer" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <button className="p-2 rounded-md hover:bg-gray-100" onClick={() => setShowSettings(true)}>
                    <IoSettingsOutline className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <Timer
                timerMode={timerMode}
                setTimerMode={setTimerMode}
                settings={settings}
                cycles={cycles}
                setCycles={setCycles}
                onTimerComplete={handleTimerComplete}
              />

              <div className="bg-gray-100 p-3 rounded-lg">
                <h3 className="font-medium text-black mb-2">Current Task</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    placeholder="What are you working on?"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="p-2 rounded-md hover:bg-gray-200" onClick={() => setCurrentTask("")}>
                    <IoClose className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            )}

            {/* Stats Tab */}

            {/* Rewards Tab */}

            {/* Settings Modal */}

          </div>
        </div>
      </div>
    </>
  )
}

export default App
