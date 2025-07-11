import { useEffect, useState } from 'react'
import { useAuth } from '../../context/useAuth'

function TopBar() {
    const [time, setTime] = useState<string>('')
    const {user, logout} = useAuth()

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
      <div className="fixed top-0 left-0 right-0 z-50 h-8 px-3 flex items-center justify-between bg-white bg-opacity-40 text-gray-700 text-sm font-medium backdrop-blur-md border border-opacity-30 border-white">
        <div className="flex items-center gap-3">
          <span>Zentral</span>
        </div>

        <div className="flex items-center gap-3">
          {user && (<span onClick={logout}>{user?.displayName}</span>)}
          <span>{time}</span>
        </div>
      </div>
    )
}

export default TopBar;

