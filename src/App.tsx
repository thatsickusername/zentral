import {Routes, Route} from 'react-router-dom';
import Desktop from './Pages/Desktop'
import ProtectedRoute from './components/routes/ProtectedRoute';
import LoginPage from './Pages/LoginPage';
import { TaskProvider } from './context/taskProvider';

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
                        <TaskProvider>
                            <Desktop/>
                        </TaskProvider>
                    </ProtectedRoute>
                }
            />
        </Routes>
        
    );
}

export default App;