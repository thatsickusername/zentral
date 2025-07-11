import { FC,ReactNode } from "react";
import { useAuth } from "../../context/useAuth";
import { Navigate } from "react-router-dom";

interface AuthProviderProps {
    children: ReactNode
}

const ProtectedRoute: FC<AuthProviderProps> = ({children}) => {
    const {user} = useAuth()

    return (
        <>
            {user ? children: <Navigate to={'/login'}/>}
        </>
    );
}

export default ProtectedRoute;