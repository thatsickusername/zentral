import { useContext } from "react";
import { SessionContext, SessionContextType } from "../context/sessionProvider";

export const useSessions = ():SessionContextType=>{
    const context = useContext(SessionContext)
    if(context === undefined) {
        throw new Error ("useTasks must be used within TaskProvider")
    }
    return context
}