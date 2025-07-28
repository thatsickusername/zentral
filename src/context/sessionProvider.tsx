import { FC, createContext, useEffect, useState } from "react";
import { Session } from "../types/Session";
import { useAuth } from "./useAuth";
import { Timestamp } from "firebase/firestore";
import { useFirestore } from "../services/firestore";
import { SessionMetrics } from "../types/SessionMetrics";

export interface SessionContextType{
    sessions: Session[]
    isLoading: boolean
    isSyncing: boolean
    sessionMetrics: SessionMetrics
    addSession: (type: "pomodoro" | "break", duration: number, linkedTaskId: string) => void
    setSessions: React.Dispatch<React.SetStateAction<Session[]>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface SessionProviderProps {
    children: React.ReactNode
}

export const SessionProvider:FC<SessionProviderProps> = ({children}) => {
    const {user} = useAuth()
    const {fetchAllSessions, syncSessions, syncSessionMetrics, fetchSessionMetrics} = useFirestore()

    const [sessions, setSessions] = useState<Session[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSyncing, setIsSyncing] = useState(false)
    const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics>({
        pomodoroCount: 0,
        breakCount: 0,
        totalPomodoroDuration: 0,
        totalBreakDuration: 0,
        avgSessionLength: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastSessionDate: "",
    })
    const [isMetricUpdated, setIsMetricUpdated] = useState(false)

    
    useEffect(() => {
        const loadAll = async () => {
          if (!user?.uid) return;
      
          try {
            const [fetchedSessions, storedMetrics] = await Promise.all([
              fetchAllSessions(user.uid),
              fetchSessionMetrics(user.uid)
            ])
      
            setSessions(fetchedSessions)
            if (storedMetrics) {
              setSessionMetrics(storedMetrics)
              setIsMetricUpdated(false)
            }
      
          } catch (err) {
            console.error("Error loading sessions or metrics", err)
          } finally {
            setIsLoading(false)
          }
        }
      
        loadAll()
      }, [user?.uid])

    useEffect(()=>{
        let pomodoroCount = 0
        let breakCount = 0
        let totalPomodoroDuration = 0
        let totalBreakDuration = 0

        sessions.forEach(session => {
            if (session.type === "pomodoro") {
            pomodoroCount++
            totalPomodoroDuration += session.duration
            } else {
            breakCount++
            totalBreakDuration += session.duration
            }
        })

        const avg = pomodoroCount === 0
            ? 0
            : totalPomodoroDuration / pomodoroCount

        setSessionMetrics(prev => {
            return {
                ...prev,
                pomodoroCount,
                breakCount,
                totalPomodoroDuration,
                totalBreakDuration,
                avgSessionLength: avg,
            }
        })

        setIsMetricUpdated(true)
    },[sessions])


    useEffect(()=>{
        if(!user?.uid) return 

        const interval = setInterval(async () => {
            const unSyncedSessions = sessions.filter(s => !s.id)
            if(unSyncedSessions.length === 0) return

            setIsSyncing(true)
            try{
                await syncSessions(user.uid, unSyncedSessions)
                setSessions((prev) => 
                    prev.map((s)=> !s.id ? {...s, id: "synced-" + Math.random().toString()}: s)
                )
            }
            catch(error){
                console.log("error syncing sessions", error)
            } finally {
                setIsSyncing(false)
            }
        }, 5000)

        return ()=> clearInterval(interval)
    }, [sessions, user])

    useEffect(()=>{
        if(!user?.uid) return

        const interval = setInterval(()=>{
            if (!isMetricUpdated) return

            syncSessionMetrics(user.uid, sessionMetrics)
                .then(()=> setIsMetricUpdated(false))
                .catch(()=> setIsMetricUpdated(true))
        }, 5000)

        return ()=> clearInterval(interval)
    },[isMetricUpdated, user?.uid, sessionMetrics])

    const addSession = (type: "pomodoro" | "break", duration: number, linkedTaskId: string) => {

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0]

        const newSession: Session = {
            id: undefined,
            completedAt: Timestamp.fromDate(new Date(now)),
            type: type,
            duration: duration,
            linkedTaskId: linkedTaskId,
        }
        setSessions((prev) => {
            return [...prev, newSession]
        })

        setSessionMetrics(prev => {
            let newCurrent = prev.currentStreak || 0;
            let newLongest = prev.longestStreak || 0;

            const lastDate = prev.lastSessionDate;
            if(lastDate) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (lastDate === yesterdayStr) {
                    newCurrent++; //streak increased
                    newLongest = Math.max(newLongest, newCurrent)
                }else{
                    newCurrent = 1; // streak broken
                }
            }else {
                newCurrent = 1; // first ever session
                newLongest = 1; // first ever session
            }

            return {
                ...prev,
                lastSessionDate: todayStr,
                currentStreak: newCurrent,
                longestStreak: newLongest,
            }
        })

        setIsMetricUpdated(true)
        
    }

    return (
        <SessionContext.Provider value={{sessions, isLoading, isSyncing, sessionMetrics, addSession, setSessions, setIsLoading}}>
            {!isLoading &&  children}
        </SessionContext.Provider>
    )
}
