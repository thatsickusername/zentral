import {Routes, Route} from 'react-router-dom';
import Desktop from './Pages/Desktop'
import ProtectedRoute from './components/routes/ProtectedRoute';
import LoginPage from './Pages/LoginPage';

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
                        <Desktop/>
                    </ProtectedRoute>
                }
            />
        </Routes>
        
    );
}

export default App;