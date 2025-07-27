import {db} from "./firebase"
import { collection, setDoc, doc, getDoc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore'
import { Task } from "../types/Tasks";
import { Session } from "../types/Session";
import { SessionMetrics } from "../types/SessionMetrics";

interface UserInfo {
  uid: string;
  displayName: string;
  email: string;
}

export const useFirestore = ()=>{

    const checkIfInUser = async ({uid, displayName, email}: UserInfo): Promise<void> =>{
        const userRef = doc(db, "users", uid)
        const userSnap = await getDoc(userRef)

        if(!userSnap.exists()){
            await setDoc(userRef, {
                uid,
                displayName,
                email,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
            })
        }else{
            await setDoc(userRef, { 
                lastLogin: serverTimestamp()
            },{
                merge: true
            })
        }
    }

    const fetchAllTasks = async (uid: string): Promise<Task[]> =>{
        const tasksRef = collection(db, "users", uid, "tasks")
        const tasksSnap = await getDocs(tasksRef)
        return tasksSnap.docs.map((doc)=>({
            id: doc.id, //return the id of that task as we will need that
            ...doc.data(), // return the data for that task id
        })) as Task[]
    }

    const syncTasks = async (uid: string, tasks: Task[]): Promise<void> => {
        const batch = writeBatch(db);
        const tasksCollection = collection(db, "users", uid, "tasks");
    
        for (const task of tasks) {
          // 1. DELETE
          if (task.deleted && task.id) {
            const taskRef = doc(db, "users", uid, "tasks", task.id);
            batch.delete(taskRef);
            console.log(task.id, "deleted from firestore")
          }
    
          // 2. ADD
          else if (task.isNew) {
            const newTaskRef = doc(tasksCollection); // Auto ID
            batch.set(newTaskRef, {
              content: task.content,
              completed: task.completed ?? false,
              createdAt: serverTimestamp(),
            });
          }
    
          // 3. UPDATE
          else if (task.updatedLocally && task.id) {
            const taskRef = doc(db, "users", uid, "tasks", task.id);
            batch.set(
              taskRef,
              {
                content: task.content,
                completed: task.completed,
              },
              { merge: true }
            );
          }
        }
    
        await batch.commit();
    };

    const fetchAllSessions = async(uid: string): Promise<Session[]> =>{
        const sessionsRef = collection(db, "users", uid, "sessions")
        const sessionsSnap = await getDocs(sessionsRef)
        return sessionsSnap.docs.map((doc)=>({
            id: doc.id,
            ...doc.data(),
        })) as Session[]
    }

    const syncSessions = async (uid: string, sessions: Session[]): Promise<void> => {
        const batch = writeBatch(db);
        const sessionsCollection = collection(db, "users", uid, "sessions");

        for(const session of sessions){
          if(!session.id){
            const newSessionRef = doc(sessionsCollection)
            const { id, ...dataWithoutId } = session;
            batch.set(newSessionRef, {
              ...dataWithoutId,
              completedAt: serverTimestamp()
            })
          }
        }

        await batch.commit()
    }

    const fetchSessionMetrics = async(uid: string):Promise<SessionMetrics | null> =>{
        try{
          const sessionMetricRef = doc(db, "users", uid, "metrics", "sessionMetrics")
          const docSnap = await getDoc(sessionMetricRef);

          if(docSnap.exists()){
            const data = docSnap.data();
            return {
              pomodoroCount: data.pomodoroCount ?? 0,
              breakCount: data.breakCount ?? 0,
              totalPomodoroDuration: data.totalPomodoroDuration ?? 0,
              totalBreakDuration: data.totalBreakDuration ?? 0,
              avgSessionLength: data.avgSessionLength ?? 0
            }
          }else {
            return null
          } 
        } catch(error) {
          console.error("Error fetching session metrics:", error);
          throw error;
        }
      }

    const syncSessionMetrics = async (uid: string, metrics: SessionMetrics): Promise<void> =>{
      const sessionMetricRef = doc(db, "users", uid, "metrics", "sessionMetrics")
      await setDoc(sessionMetricRef, { 
        ...metrics,
        updatedAt: serverTimestamp()
      }, {merge: true})
    }

    return { checkIfInUser, fetchAllTasks, syncTasks, fetchAllSessions, syncSessions, fetchSessionMetrics, syncSessionMetrics}
}