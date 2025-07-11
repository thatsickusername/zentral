import { useContext } from "react";
import { AuthContext } from "./authProvider";
import { AuthContextType } from "./authProvider";

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
