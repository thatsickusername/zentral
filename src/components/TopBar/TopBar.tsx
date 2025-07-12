import { useEffect, useState } from 'react'
import { useAuth } from '../../context/useAuth'
import TopBarDropdown from './TopBarDropdown'

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
        <div className="flex items-center gap-2 h-full">
          <span>Zentral</span>
        </div>

        <div className="flex items-center gap-2 h-full">
          {user && (
              <TopBarDropdown 
                  align="right"
                  trigger={
                    <span>{user?.displayName}</span>
                  }>
                  <div className="px-4 py-2 rounded-xl hover:bg-gray-700/20 hover:cursor-pointer transition-all cursor-pointer">My Profile</div>
                  <div className="px-4 py-2 rounded-xl hover:bg-gray-700/20 hover:cursor-pointer transition-all cursor-pointer">Settings</div>
                  <div className="px-4 py-2 rounded-xl hover:bg-gray-700/20 hover:cursor-pointer transition-all cursor-pointer" onClick={logout}>Logout</div>
              </TopBarDropdown>
            
          )}
          <span>{time}</span>
        </div>

        
      </div>
    )
}

export default TopBar;

