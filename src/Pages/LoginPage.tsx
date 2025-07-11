import { useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const {user, isLoading, signInWithGoogle} = useAuth()
    const navigate = useNavigate()

    useEffect(()=>{
        if(!isLoading && user){
            navigate('/', {replace: true})
        }
    },[user, isLoading, navigate])

    const handleGoogleLogin = async ()=>{
        try {
            await signInWithGoogle()
            console.log("success")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-purple-300 text-white">
          <div className="rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-sm bg-white bg-opacity-40 text-gray-700 text-sm font-medium backdrop-blur-md border border-opacity-30 border-white">
            <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Zentral</h1>
            <p className="text-sm text-gray-600 text-center mb-8">
              Stay focused. Get things done.
            </p>
    
            <button className="flex items-center justify-center w-full px-6 py-3 text-sm font-medium bg-white text-gray-800 rounded-xl hover:bg-gray-100 transition duration-300"
                    onClick={handleGoogleLogin}>
                <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-5 h-5 mr-3"
                />
                Continue with Google
            </button>
          </div>
        </div>
    );
}

export default LoginPage;