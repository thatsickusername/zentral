import { FC, createContext, useEffect, useState } from "react";
import { Task } from "../types/Tasks";
import { useAuth } from "./useAuth";
import {useFirestore} from '../services/firestore'
import { TaskMetrics } from "../types/TaskMetrics";

export interface TaskContextType {
    tasks: Task[]
    isLoading: boolean
    isSyncing: boolean
    taskMetrics: TaskMetrics
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
    const {user} = useAuth()
    const {fetchAllTasks, syncTasks, fetchTaskMetrics, syncTaskMetrics} = useFirestore()

    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSyncing, setIsSyncing] = useState(false)
    const [taskMetrics, setTaskMetrics] = useState<TaskMetrics>({
        totalTasksCreated: 0,
        totalTasksCompleted: 0,
        activeTasks: 0,
        completionRate: 0,
    })
    const [isMetricUpdated, setIsMetricUpdated] = useState(false)

    

    useEffect(()=>{
        const loadAll = async()=>{
            if(!user?.uid) return

            try{
                const [fetchedTasks, storedMetrics] = await Promise.all([
                    fetchAllTasks(user.uid),
                    fetchTaskMetrics(user.uid)
                ])
        
                setTasks(fetchedTasks)
                if (storedMetrics) {
                    setTaskMetrics(storedMetrics)
                    setIsMetricUpdated(false)
                }
            }catch(error){
                console.error("Error loading tasks or metrics", error)
            }finally{
                setIsLoading(false)
            }
        }

        loadAll()
    }, [user?.uid])

    useEffect(()=>{
        let totalTasksCreated = 0
        let totalTasksCompleted = 0
        let activeTasks = 0
        let completionRate = 0

        tasks.forEach(task => {
            totalTasksCreated++
            if(task.completed){
                totalTasksCompleted++
            } 
            else activeTasks++
        })

        completionRate = (totalTasksCompleted/totalTasksCreated)*100

        setTaskMetrics(prev => {
            return {
                ...prev,
                totalTasksCreated,
                totalTasksCompleted,
                activeTasks,
                completionRate,
            }
        })
        setIsMetricUpdated(true)
    },[tasks])


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
        }, 5000)

        return ()=> clearInterval(interval)
    }, [tasks, user])

    useEffect(()=>{
        if(!user?.uid) return

        const interval = setInterval(()=>{
            if (!isMetricUpdated) return

            syncTaskMetrics(user.uid, taskMetrics)
                .then(()=> setIsMetricUpdated(false))
                .catch(()=> setIsMetricUpdated(true))
        }, 5000)

        return ()=> clearInterval(interval)
    },[isMetricUpdated, user?.uid, taskMetrics])

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
        <TaskContext.Provider value={{tasks, taskMetrics, setTasks, isLoading, isSyncing, setIsLoading, addTask, toggleTask, editTask, removeTask}}>
            {!isLoading && children}
        </TaskContext.Provider>
    );
}
