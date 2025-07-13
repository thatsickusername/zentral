import { FC, createContext, useEffect, useState } from "react";
import { Task } from "../types/Tasks";
import { useAuth } from "./useAuth";
import {useFirestore} from '../services/firestore'

export interface TaskContextType {
    tasks: Task[]
    isLoading: boolean
    isSyncing: boolean
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    addTask: (content: string) => void;
    toggleTask: (id: string) => void;
    removeTask: (id: string) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined)

interface TaskProviderProps {
    children: React.ReactNode
}

export const TaskProvider:FC<TaskProviderProps> = ({children}) =>{
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSyncing, setIsSyncing] = useState(false)

    const {user} = useAuth()
    const {fetchAllTasks, syncTasks} = useFirestore()

    useEffect(()=>{
        const loadTasks = async()=>{
            if(!user?.uid) return

            try{
                const fetchedTasks = await fetchAllTasks(user.uid)
                setTasks(fetchedTasks)
            }catch(error){
                console.log(error)
            }finally{
                setIsLoading(false)
            }
        }

        loadTasks()
    }, [user?.uid])

    useEffect(()=>{
        if(!user?.uid) return

        const interval = setInterval(()=>{
            const hasUnSyncedChanges = tasks.some(task => task.updatedLocally || task.deleted)

            if(hasUnSyncedChanges) {
                setIsSyncing(true)
                syncTasks(user.uid, tasks)
                    .then(()=> {
                        const updated = tasks.map(task => ({
                            ...task,
                            updatedLocally: false,
                            deleted: task.deleted ?? false
                        }))
                        setTasks(updated)
                    })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(()=>{
                        setIsSyncing(false)
                    })
            }
        }, 3000)

        return ()=> clearInterval(interval)
    }, [tasks, user])

    //addtask
    const addTask = (content: string) => {
        const newTask :Task = {
            id: crypto.randomUUID(),
            content,
            completed: false,
            createdAt: new Date(),
            updatedLocally: false,
        }
        setTasks(prev => [...prev, newTask])
    }

    //toggletask

    const toggleTask = (taskId: string) =>{
        setTasks(prev=> prev.map((task) => {
            if(task.id===taskId){
                return {
                    ...task,
                    completed: !task.completed,
                    updatedLocally: true,
                }
            }else return task
        }))
    }

    //removetask

    const removeTask= (taskId: string) =>{
        setTasks(prev=> prev.map((task)=>{
            if(task.id ===taskId){
                return  {
                    ...task,
                    deleted: true,
                    updatedLocally: true,
                  }
            }else return task
        }))
    }

    return (
        <TaskContext.Provider value={{tasks, setTasks, isLoading, isSyncing, setIsLoading, addTask, toggleTask, removeTask}}>
            {!isLoading && children}
        </TaskContext.Provider>
    );
}