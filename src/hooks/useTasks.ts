import { useContext } from "react";
import { TaskContext, TaskContextType } from "../context/taskProvider";

export const  useTasks = (): TaskContextType=>{
    const context = useContext(TaskContext)
    if(context === undefined) {
        throw new Error ("useTasks must be used within TaskProvider")
    }
    return context
}