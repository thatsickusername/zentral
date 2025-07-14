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
    editTask: (id: string, content: string) => void;
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
            const unSyncedTasks = tasks.filter(task => task.updatedLocally || task.deleted || task.isNew)

            if(unSyncedTasks.length > 0) {
                setIsSyncing(true)
                syncTasks(user.uid, unSyncedTasks)
                    .then(()=> {
                        const updatedTasks = tasks.map(task => ({
                            ...task,
                            updatedLocally: false,
                            isNew: false,
                        })).filter(task => !task.deleted)
                        setTasks(updatedTasks)
                    })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(()=>{
                        setIsSyncing(false)
                    })
            }
        }, 500)

        return ()=> clearInterval(interval)
    }, [tasks, user])

    //addtask
    const addTask = (content: string) => {
        const newTask :Task = {
            id: crypto.randomUUID(),
            content,
            completed: false,
            createdAt: new Date(),
            updatedLocally: true,
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

    //editTask 
    const editTask = (taskId: string, newContent: string)=>{
        setTasks(prev=> prev.map(task =>{
            if(task.id === taskId){
                return {
                    ...task,
                    content: newContent,
                    updatedLocally: true,
                }
            }else return task
        }))
    }

    //removetask

    const removeTask= (taskId: string) =>{
        setTasks(prev=> prev.map((task)=>{
            if(task.id ===taskId){
                console.log(task.id, "deleted from context")
                return  {
                    ...task,
                    deleted: true,
                    updatedLocally: true,
                  }
            }else return task
        }))
    }

    return (
        <TaskContext.Provider value={{tasks, setTasks, isLoading, isSyncing, setIsLoading, addTask, toggleTask, editTask, removeTask}}>
            {!isLoading && children}
        </TaskContext.Provider>
    );
}
