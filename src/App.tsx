import {Routes, Route} from 'react-router-dom';
import DesktopLayout from './layout/DesktopLayout'
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
                    <DesktopLayout>
                        <Desktop/>
                    </DesktopLayout>
                }
            />
        </Routes>
        
    );
}

export default App;


{/* <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-pink-400 flex items-center justify-center">
                        <h1 className="text-white text-4xl font-bold">
                            ✅ Tailwind is working!
                        </h1>
                    </div> */}