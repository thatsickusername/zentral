import { useEffect, useState } from 'react'
import { useAuth } from '../../context/useAuth'
import TopBarDropdown from './TopBarDropdown'
import AnalogClock from './AnalogClock'
import Calendar from './Calendar'

function TopBar() {
    const [now, setNow] = useState(new Date())
    const [time, setTime] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const {user, logout} = useAuth()

    useEffect(() => {
      const updateTime = () => {
        const current =new Date()
        setNow(current)
        const formattedTime = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(current)
        setTime(formattedTime)

        const formattedDate = Intl.DateTimeFormat('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }).format(current)
        setDate(formattedDate)
      }
  
      updateTime()

      const current = new Date()

      const delayUntilNextMinute = (60 -now.getSeconds()) * 1000 - current.getMilliseconds()

      const timeout = setTimeout(()=>{
        updateTime();
        const interval = setInterval(updateTime, 60000)
        return()=> clearInterval(interval)
      }, delayUntilNextMinute)

      return () => clearInterval(timeout)
    }, [])

    return (
      <div className="fixed top-0 left-0 right-0 z-[1000] h-8 px-3 flex items-center justify-between text-gray-700 text-sm font-medium border border-opacity-30 border-white">
        {/* a dummy box to make the top bar background blur without affecting children elements */}
        <div className="absolute inset-0 backdrop-blur-md bg-white/30"></div>
        <div className="flex items-center gap-2 h-full">
          <TopBarDropdown
              align="left"
              trigger={<span>Zentral</span>}
          >
            <div className="px-4 py-2 rounded-xl hover:bg-gray-500/20 hover:cursor-pointer transition-all cursor-pointer">Settings</div>
            <div className="px-4 py-2 rounded-xl hover:bg-gray-500/20 hover:cursor-pointer transition-all cursor-pointer">About Zentral</div>
            <div className="px-4 py-2 rounded-xl hover:bg-gray-500/20 hover:cursor-pointer transition-all cursor-pointer">About Developer</div>
          </TopBarDropdown>
          
        </div>

        <div className="flex items-center gap-2 h-full">
          {user && (
              <TopBarDropdown 
                  align="right"
                  trigger={
                    <span>{user?.displayName}</span>
                  }>
                  <div className="px-4 py-2 rounded-xl hover:bg-gray-500/20 hover:cursor-pointer transition-all cursor-pointer">My Profile</div>
                  
                  <div className="px-4 py-2 rounded-xl hover:bg-gray-500/20 hover:cursor-pointer transition-all cursor-pointer" onClick={logout}>Logout</div>
              </TopBarDropdown>
            
          )}
          <TopBarDropdown
              align="right"
              trigger={<span>{date} {time}</span>}
          >
                <div className="w-72 p-2">
                        <AnalogClock time={now} />
                        <hr className="my-2 border-gray-200/80" />
                        <Calendar date={now} />
                </div>
          </TopBarDropdown>
          
        </div>        
      </div>
    )
}

export default TopBar;
