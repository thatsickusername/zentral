import { useEffect, useState } from "react";

type AnalogClockProps = {
    time: Date; // The 'time' prop is a Date object
  };
  


const AnalogClock:React.FC<AnalogClockProps> = () => {

    const [time , setTime] = useState(new Date());

    useEffect(()=>{
        const interval = setInterval(()=>{
            setTime(new Date())
        },1000) 
        return ()=> clearInterval(interval)
    },)

    // Calculate hand rotations based on the current time.
    // The hour hand's rotation is also affected by the current minute for a smoother transition.
    const secondsRotation = time.getSeconds() * 6;
    const minutesRotation = time.getMinutes() * 6 + time.getSeconds() * 0.1;
    const hoursRotation = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;



    return (
        <div className="w-40 h-40 mx-auto my-2 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Clock face */}
                <circle cx="100" cy="100" r="96" fill="rgba(255, 255, 255, 0.5)" stroke="#475569" strokeWidth="3" />
                <circle cx="100" cy="100" r="94" fill="rgba(255, 255, 255, 0.5)" stroke="#94a3b8" strokeWidth="3" />
                <circle cx="100" cy="100" r="4" fill="#334155" />

                {/* Hour Markers */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <line

                        key={`hour-${i}`}
                        x1="100"
                        y1="15"
                        x2="100"
                        y2="25"
                        stroke="#94a3b8"
                        strokeWidth="3"
                        strokeLinecap="round"
                        transform={`rotate(${i * 30} 100 100)`}
                    />
                ))}

                {/* Hour Hand */}
                <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="55"
                    stroke="#475569"
                    strokeWidth="6"
                    strokeLinecap="round"
                    transform={`rotate(${hoursRotation} 100 100)`}
                />
                {/* Minute Hand */}
                <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="30"
                    stroke="#64748b"
                    strokeWidth="4"
                    strokeLinecap="round"
                    transform={`rotate(${minutesRotation} 100 100)`}
                />
                {/* Second Hand */}
                <line
                    x1="100"
                    y1="110"
                    x2="100"
                    y2="20"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    transform={`rotate(${secondsRotation} 100 100)`}
                />
            </svg>
        </div>
    );
};

export default AnalogClock;
