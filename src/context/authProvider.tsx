import { createContext, useEffect, useState, ReactNode, FC } from 'react';
import { auth } from '../services/firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, User, signOut } from 'firebase/auth';

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signInWithGoogle: () => Promise<any>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true)

    function signInWithGoogle(){
        const provider = new GoogleAuthProvider()
        return signInWithPopup(auth, provider)
    }

    function logout(){
        return signOut(auth);
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            if(currentUser){
                setUser(currentUser)
            }else{
                setUser(null)
            }
            setIsLoading(false)
        }) 

        return () => unsubscribe()
    },[])

    return (
        <AuthContext.Provider value={{ user, isLoading, signInWithGoogle, logout }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
