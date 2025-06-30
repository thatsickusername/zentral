import TopBar from "../components/TopBar/TopBar";
import Dock from "../components/Dock/Dock";
import React, { useState, FC, JSX } from 'react';
import Window from "../components/Window/Window";

// --- Type Definitions ---

// interface for the cordinates (top-left corner) of a window
interface Position {
  x: number;
  y: number;
}

// AppDefinition now holds the component reference and its default size
interface AppDefinition {
    id: string;
    title: string;
    icon: FC<React.SVGProps<SVGSVGElement>>;
    component: FC; // Reference to the app's functional component
    defaultWidth?: number;
    defaultHeight?: number;
}

// WindowInstance will store the live properties of an open window
interface WindowInstance extends AppDefinition {
    position: Position;
    zIndex: number;
    width: number;
    height: number;
}


const Desktop = () => {

    // State for managing list of currently open windows
    const [windows, setWindows] = useState<WindowInstance[]>([]);
    // State for managing z-index of the focused window
    const [zCounter, setZCounter] = useState<number>(1);

    const openWindow = (app: AppDefinition) => {
        // for if the app is already opened in a window, focus that window
        const existingWindow = windows.find(w => w.id === app.id);
        if (existingWindow) {
            focusWindow(app.id);
            return;
        }
        
        const newWindow: WindowInstance = {
            ...app,
            position: { x: Math.random() * 300 + 50, y: Math.random() * 150 + 50 },
            zIndex: zCounter,
            // Use default sizes from the app definition, with a fallback
            width: app.defaultWidth || 400,
            height: app.defaultHeight || 250,
        };

        // add the opened app in current windows and update zCounter +1 for next app to be focused
        setWindows(prevWindows => [...prevWindows, newWindow]);
        setZCounter(prev => prev + 1);
    };

    const closeWindow = (id: string) => {
        // remove the closed app id from windows  
        setWindows(prevWindows => prevWindows.filter(w => w.id !== id));
    };
    
    const focusWindow = (id: string) => {
        
         setWindows(prevWindows => 
            prevWindows
                .map(w =>  w.id === id ? { ...w, zIndex: zCounter } : w) // find the app in the current windows and update its zindex
                .sort((a,b) => a.zIndex - b.zIndex) // Re-sort to help React with re-ordering DOM
        );
        // update zCounter +1 for next app to be focused
        setZCounter(prev => prev + 1);
    };

    const handleDragStop = (id: string, newPosition: Position) => {
        setWindows(prevWindows =>
            prevWindows
                .map(w => w.id === id ? { ...w, position: newPosition } : w ) // Updates the window's position when dragging ends
        );
    };

    return (
        <div className="relative h-screen w-screen bg-gradient-to-br from-blue-300 to-purple-300 overflow-hidden">
            <TopBar/>
            {/* Render all open windows and rerender if any changes made to list of windows*/}
            {windows.map(win => {
                const AppComponent = win.component;
                return (
                    <Window
                        key={win.id}
                        id={win.id}
                        title={win.title}
                        initialPosition={win.position}
                        zIndex={win.zIndex}
                        width={win.width}
                        height={win.height}
                        onClose={closeWindow}
                        onFocus={focusWindow}
                        onDragStop={handleDragStop}
                    >
                        <AppComponent />
                    </Window>
                );
            })}
            <Dock onIconClick={openWindow} />
        </div>
    );
};

export default Desktop;