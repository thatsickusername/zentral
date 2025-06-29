import { useEffect, useState } from 'react'

function TopBar() {
    const [time, setTime] = useState<string>('')

    useEffect(() => {
      const updateTime = () => {
        const now = new Date()
        const formattedTime = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(now)
        setTime(formattedTime)
      }
  
      updateTime()
      const interval = setInterval(updateTime, 60000) // update every minute
      return () => clearInterval(interval)
    }, [])
  
    return (
      <div className="fixed top-0 left-0 right-0 z-50 h-8 px-3 flex items-center justify-between bg-white bg-opacity-50 text-gray-700 text-sm font-medium backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span>Zentral</span>
        </div>

        <div className="flex items-center gap-3">
          <span>{time}</span>
        </div>
      </div>
    )
}

export default TopBar;

