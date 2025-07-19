import {Routes, Route} from 'react-router-dom';
import Desktop from './Pages/Desktop'
import ProtectedRoute from './components/routes/ProtectedRoute';
import LoginPage from './Pages/LoginPage';
import { TaskProvider } from './context/taskProvider';
import { SessionProvider } from './context/sessionProvider';

function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <LoginPage/>
                }
            />
            <Route
                path="/"
                element = {
                    <ProtectedRoute>
                        <SessionProvider>
                            <TaskProvider>
                                <Desktop/>
                            </TaskProvider>
                        </SessionProvider>  
                    </ProtectedRoute>
                }
            />
        </Routes>
        
    );
}

export default App;