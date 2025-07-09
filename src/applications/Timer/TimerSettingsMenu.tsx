import { useState } from "react"

interface TimerSettingsMenuProps {
    displaySettings: boolean
    pomodoroDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    onSave: (pomodoro: number, shortBreak: number, longBreak: number) => void
    onCancel: () => void
}


function TimerSettingsMenu({displaySettings, pomodoroDuration, shortBreakDuration, longBreakDuration, onSave, onCancel}: TimerSettingsMenuProps) {
    const [pomodoroDurationInput, setPomodoroDurationInput] = useState<number>(pomodoroDuration)
    const [shortBreakDurationInput, setShortBreakDurationInput] = useState<number>(shortBreakDuration)
    const [longBreakDurationInput, setLongBreakDurationInput] = useState<number>(longBreakDuration)

    const [errors, setErrors] = useState({
        pomodoro: false,
        shortBreak: false,
        longBreak: false,
    });



    const pomodoroDurationHandler = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setPomodoroDurationInput(Number(e.target.value))
    }

    const shortBreakDurationHandler = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setShortBreakDurationInput(Number(e.target.value))
    }

    const longBreakDurationHandler = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setLongBreakDurationInput(Number(e.target.value))
    }

    
    const validateDurations = ()=>{
        const newErrors = {
            pomodoro: pomodoroDurationInput <= 0,
            shortBreak: shortBreakDurationInput <= 0,
            longBreak: longBreakDurationInput <= 0,
        }

        setErrors(newErrors)

        return !Object.values(newErrors).some(Boolean)
    }

    const handleApply = () =>{
        if(!validateDurations()) return
        onSave(pomodoroDurationInput, shortBreakDurationInput, longBreakDurationInput)
    }

    return (
        <div className={`absolute py-6 px-12 top-0 left-0 h-full w-full ${displaySettings ? "flex flex-col": "hidden"}`}> 
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>
            <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="flex items-center justify-between">
                <label htmlFor="pomodoro-duration" className="text-gray-700 font-medium">Pomodoro:</label>
                <input
                id="pomodoro-duration"
                type="number"
                min="1"
                value={pomodoroDurationInput}
                onChange={pomodoroDurationHandler}
                className={`w-24 p-2 border ${errors.pomodoro ? "border-red-500": "border-gray-300"} rounded-md text-center`}
                />
            </div>

            <div className="flex items-center justify-between">
                <label htmlFor="short-break-duration" className="text-gray-700 font-medium">Short Break:</label>
                <input
                id="short-break-duration"
                type="number"
                min="1"
                value={shortBreakDurationInput}
                onChange={shortBreakDurationHandler}
                className={`w-24 p-2 border ${errors.shortBreak ? "border-red-300": "border-gray-300"} rounded-md text-center`}
                />
            </div>

            <div className="flex items-center justify-between">
                <label htmlFor="long-break-duration" className="text-gray-700 font-medium">Long Break:</label>
                <input
                id="long-break-duration"
                type="number"
                min="1"
                value={longBreakDurationInput}
                onChange={longBreakDurationHandler}
                className={`w-24 p-2 border ${errors.longBreak ? "border-red-300": "border-gray-300"} rounded-md text-center`}
                />
            </div>
            </div>

            <div className="flex justify-center space-x-4">
            <button
                onClick={handleApply}
                className="px-6 py-3 rounded-full text-lg font-semibold bg-blue-500 text-white shadow-md hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 ease-in-out transform active:scale-95"
            >
                Apply
            </button>
            <button
                onClick={onCancel}
                className="px-6 py-3 rounded-full text-lg font-semibold bg-gray-300 text-gray-800 shadow-md hover:bg-gray-400 active:bg-gray-500 transition-all duration-300 ease-in-out transform active:scale-95"
            >
                Cancel
            </button>
            </div>
    </div>
    )
}

export default TimerSettingsMenu;