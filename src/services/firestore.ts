import {db} from "./firebase"
import { collection, setDoc, doc, getDoc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore'
import { Task } from "../types/Tasks";
import { Session } from "../types/Session";

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

    const syncSesions = async (uid: string, sessions: Session[]): Promise<void> => {
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


    return { checkIfInUser, fetchAllTasks, syncTasks, fetchAllSessions, syncSesions}
}