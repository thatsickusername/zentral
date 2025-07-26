import { FC, createContext, useEffect, useState } from "react";
import { Session } from "../types/Session";
import { useAuth } from "./useAuth";
import { Timestamp } from "firebase/firestore";
import { useFirestore } from "../services/firestore";

export interface SessionContextType {
    sessions: Session[]
    isLoading: boolean
    isSyncing: boolean
    sessionsCount: number
    totalDuration: number
    addSession: (type: "pomodoro" | "break", duration: number, linkedTaskId: string) => void
    setSessions: React.Dispatch<React.SetStateAction<Session[]>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface SessionProviderProps {
    children: React.ReactNode
}

export const SessionProvider:FC<SessionProviderProps> = ({children}) => {
    const [sessions, setSessions] = useState<Session[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSyncing, setIsSyncing] = useState(false)
    const [sessionsCount, setSessionsCount] = useState(0)
    const [totalDuration, setTotalDuration] = useState(0)

    const {user} = useAuth()
    const {fetchAllSessions, syncSesions} = useFirestore()

    useEffect(()=>{
        const loadSessions = async () => {
            if(!user?.uid) return;
            try {
                const fetchedSessions = await fetchAllSessions(user.uid)
                setSessions(fetchedSessions)
            } catch (error) {
                console.log("error loading sessions", error)
            } finally {
                setIsLoading(false)
            }
        }
        console.log("sessions currently", sessions)
        loadSessions()
    },[user?.uid])

    useEffect(()=>{
        let counter = 0; 
        sessions.forEach((session)=>{
            if (session.type !== "pomodoro") counter++
        })
        setSessionsCount(counter)
    },[sessions])


    useEffect(()=>{
        if(!user?.uid) return 

        const interval = setInterval(async () => {
            const unSyncedSessions = sessions.filter(s => !s.id)
            if(unSyncedSessions.length === 0) return

            setIsSyncing(true)
            try{
                await syncSesions(user.uid, unSyncedSessions)
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

    const addSession = (type: "pomodoro" | "break", duration: number, linkedTaskId: string) => {
        setTotalDuration(prev => prev + duration)
        const newSession: Session = {
            id: undefined,
            completedAt: Timestamp.fromDate(new Date()),
            type: type,
            duration: duration,
            linkedTaskId: linkedTaskId,
        }
        setSessions((prev) => {
            console.log("updated Sessions", [...prev, newSession])
            return [...prev, newSession]
        })
        
    }

    return (
        <SessionContext.Provider value={{sessions, isLoading, isSyncing, sessionsCount, totalDuration, addSession, setSessions, setIsLoading}}>
            {!isLoading &&  children}
        </SessionContext.Provider>
    )
}
