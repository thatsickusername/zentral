import {Routes, Route} from 'react-router-dom';
import Desktop from './Pages/Desktop'

function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <div>
                        Login Please
                    </div>
                }
            />
            <Route
                path="/"
                element = {
                      <Desktop/>
                }
            />
        </Routes>
        
    );
}

export default App;