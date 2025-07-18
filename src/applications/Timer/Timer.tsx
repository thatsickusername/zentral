import { useEffect, useRef, useState } from "react";
import chime from "./Sounds/timerCompleted.mp3" 
import TimerSettingsMenu from "./TimerSettingsMenu";
import { useTasks } from "../../hooks/useTasks";

interface Mode{
    key: string,
    label: string
    duration: number
}

function Timer() {
    const [modes, setModes] = useState<Mode[]>([
        { key: 'pomodoro', label: 'Pomodoro', duration: 5 * 60 },
        { key: 'shortBreak', label: 'Short Break', duration: 6 * 60 },
        { key: 'longBreak', label: 'Long Break', duration: 4 * 60 }
      ]);
    const [activeModeKey, setAciveModeKey] = useState('pomodoro')
    const activeMode = modes.find(mode => mode.key === activeModeKey) || modes[0]

    const [isTimerActive, setIsTimerActive] =useState(false)
    const [totalSeconds, setTotalSeconds] = useState(activeMode.duration)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)

    const intervalRef = useRef<number | null> (null) // initializing a ref as null for our interval-ID so that we can stop it later
    const chimeRef = useRef<HTMLAudioElement>(null)

    const [pomodoroCounter, setPomodoroCounter] = useState(0)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [sessionTask, setSessionTask] = useState<string>()

    const {tasks} = useTasks()

    useEffect(()=>{
        setTotalSeconds(activeMode.duration)
    },[activeMode])
    
    // console.log(modes)

    useEffect(()=>{
        if(isTimerActive){

            intervalRef.current = window.setInterval(()=>{

                setTotalSeconds((prev) => {
                    if (prev === 1) {
                      chimeRef.current?.play();
                      setIsTimerActive(false);
                  
                      setPomodoroCounter((count) => {
                        const nextCount = count + 1;
                  
                        if (activeModeKey === 'pomodoro') {
                          // Pomodoro just ended
                          if (nextCount < 5) {
                            setAciveModeKey('shortBreak');
                          } else {
                            setAciveModeKey('longBreak');
                          }
                          return nextCount;
                        } else {
                          // Any break just ended → back to Pomodoro
                          setAciveModeKey('pomodoro');
                  
                          // Reset counter if long break just happened
                          return activeModeKey === 'longBreak' ? 0 : count;
                        }
                      });
                  
                      if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                      }
                    }
                  
                    return prev - 1;
                  });
            }, 1000)
        }

        return ()=>{
            if(intervalRef.current){
                clearInterval(intervalRef.current)
            }
        }
    },[isTimerActive])

    const formatTime = () =>{
        const formatttedMinutes = String(minutes).padStart(2, '0')
        const formatttedSeconds = String(seconds).padStart(2, '0')

        return `${formatttedMinutes}:${formatttedSeconds}`
    }

    const toggleTimer = () =>{
        setIsTimerActive(!isTimerActive) 
    }

    const resetTimer = () =>{
        setIsTimerActive(false)
        setTotalSeconds(activeMode.duration)
    }

    const toggleSettingsMenu = () =>{
        setIsSettingsOpen(!isSettingsOpen)
    }

    const toggleDropdownMenu = ()=>{
        setIsDropdownOpen(!isDropdownOpen)
    }


    const handleSettingsSave = (pomodoro: number, shortBreak: number, longBreak: number) =>{
        setModes([
            { key: 'pomodoro', label: 'Pomodoro', duration: pomodoro * 60  },
            { key: 'shortBreak', label: 'Short Break', duration: shortBreak * 60 },
            { key: 'longBreak', label: 'Long Break', duration: longBreak * 60 }
          ])

        setIsSettingsOpen(false)

        if (!isTimerActive) {
            setTotalSeconds(pomodoro)
        }
    }

    const handleSessionTaskInput = (taskId: string)=>{
        setSessionTask(taskId)
        setIsDropdownOpen(false)
    }

    return (
        <div  className="p-6 max-w-md w-full h-full text-center flex flex-col items-center relative">
            <div className={`${isSettingsOpen ? "hidden" : ""}`}>
                {/* Settings button (coggle) */}
                <button
                    className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 z-10"
                    aria-label="Open settings"
                    onClick={toggleSettingsMenu}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.942 3.331.83 2.394 2.373a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.942 1.543-.83 3.331-2.373 2.394a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.942-3.331-.83-2.394-2.373a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.942-1.543.83-3.331 2.373-2.394a1.724 1.724 0 002.572-1.065z"
                            />
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg> 
                </button>

                {/* Current mode display */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {activeMode.label}
                </h2>

                <div className="relative w-full max-w-xs">
                    <div
                        onClick={toggleDropdownMenu}
                        className="flex items-center justify-between px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm cursor-pointer hover:shadow-md transition-all"
                    >
                        <h2 className="text-sm font-medium text-gray-800">
                            {sessionTask? sessionTask : "Choose a task"}
                        </h2>
                        <svg
                        className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    {isDropdownOpen && (
                        <div className="absolute z-50 mt-1 w-full rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
                        {tasks.map((task) => (
                            <div
                            key={task.id}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                            onClick={()=> handleSessionTaskInput(task.id)}
                            >
                            {task.content}
                            </div>
                        ))}
                        </div>
                    )}
                </div>

                <div className="text-8xl font-bold text-gray-800 my-4 tracking-tight">
                    {formatTime()}
                </div>
                <div className="flex space-x-4 my-6">
                    <button
                        onClick={toggleTimer}
                        className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out
                        ${isTimerActive
                            ? 'bg-red-500 text-white shadow-lg hover:bg-red-600 active:bg-red-700'
                            : 'bg-blue-500 text-white shadow-lg hover:bg-blue-600 active:bg-blue-700'
                        }
                        transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300`}>
                        {isTimerActive ? 'Pause' : 'Start'}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="px-8 py-4 rounded-full text-lg font-semibold bg-gray-300 text-gray-800 shadow-lg
                            hover:bg-gray-400 active:bg-gray-500 transition-all duration-300 ease-in-out
                            transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-400"
                        >
                        Reset
                    </button>
                </div>
                {/* Pomodoro count display */}
                {/* <p className="mt-6 text-gray-600 text-sm">
                Pomodoros completed: <span className="font-semibold text-gray-800">{pomodoroCounter}</span>
                </p> */}
                
            </div>

            
            
            <TimerSettingsMenu 
                displaySettings={isSettingsOpen}   
                pomodoroDuration={modes[0].duration / 60} 
                shortBreakDuration={modes[1].duration / 60} 
                longBreakDuration={modes[2].duration / 60} 
                onSave={handleSettingsSave}
                onCancel={() => setIsSettingsOpen(false)}
            />

            <audio ref={chimeRef} src={chime}/>
        </div>
    );
}

export default Timer;