import TopBar from "../components/TopBar/TopBar";
import Dock from "../components/Dock/Dock";
import React, { useState, FC, JSX } from 'react';
import Window from "../components/Window/Window";

// --- Type Definitions ---
interface Position {
  x: number;
  y: number;
}

interface AppDefinition {
  id: string;
  title: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  content: JSX.Element;
}

interface WindowInstance extends AppDefinition {
  position: Position;
  zIndex: number;
}


const Desktop = () => {

    // State for managing open windows
    // Each window object: { id, title, content, position, zIndex }
    const [windows, setWindows] = useState<WindowInstance[]>([]);
    const [zCounter, setZCounter] = useState<number>(1);

    const openWindow = (app: AppDefinition) => {
        const existingWindow = windows.find(w => w.id === app.id);
        if (existingWindow) {
            focusWindow(app.id);
            return;
        }
        
        const newWindow: WindowInstance = {
            ...app,
            position: { x: Math.random() * 300 + 50, y: Math.random() * 150 + 50 },
            zIndex: zCounter,
        };
        setWindows(prevWindows => [...prevWindows, newWindow]);
        setZCounter(prev => prev + 1);
    };

    const closeWindow = (id: string) => {
        setWindows(prevWindows => prevWindows.filter(w => w.id !== id));
    };
    
    const focusWindow = (id: string) => {
         setWindows(prevWindows => 
            prevWindows.map(w => 
                w.id === id ? { ...w, zIndex: zCounter } : w
            ).sort((a,b) => a.zIndex - b.zIndex) // Re-sort to help React with re-ordering DOM
        );
        setZCounter(prev => prev + 1);
    };

    const handleDragStop = (id: string, newPosition: Position) => {
        setWindows(prevWindows =>
            prevWindows.map(w => 
                w.id === id ? { ...w, position: newPosition } : w
            )
        );
    };

    return (
        <div className="relative h-screen w-screen bg-gradient-to-br from-blue-300 to-purple-300 overflow-hidden">
            <TopBar/>
            {/* Render all open windows */}
            {windows.map(win => (
                <Window
                    key={win.id}
                    id={win.id}
                    title={win.title}
                    content={win.content}
                    initialPosition={win.position}
                    zIndex={win.zIndex}
                    onClose={closeWindow}
                    onFocus={focusWindow}
                    onDragStop={handleDragStop}
                />
            ))}
            <Dock onIconClick={openWindow} />
        </div>
    );
};

export default Desktop;