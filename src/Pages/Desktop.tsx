import TopBar from "../components/TopBar/TopBar";
import Dock from "../components/Dock/Dock";
import React, { useState, FC } from 'react';
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
    isVisible: boolean;
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
            setWindows(prev =>
                prev.map(w =>
                    w.id === app.id ? { ...w, isVisible: true } : w
                )
            );
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
            isVisible: true
        };

        // add the opened app in current windows and update zCounter +1 for next app to be focused
        setWindows(prevWindows => [...prevWindows, newWindow]);
        setZCounter(prev => prev + 1);
    };

    const closeWindow = (id: string) => {
        setWindows(prevWindows =>
            prevWindows.map(w =>
                w.id === id ? { ...w, isVisible: false } : w
            )
        );
    };
    
    const focusWindow = (id: string) => {
        
         setWindows(prevWindows => 
            prevWindows
                .map(w =>  w.id === id ? { ...w, zIndex: zCounter } : w) // find the app in the current windows and update its zindex
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
                    <div key={win.id} style={{ display: win.isVisible ? "block" : "none" }}>
                        <Window
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
                    </div>
                );
            })}
            <Dock onIconClick={openWindow} />
        </div>
    );
};

export default Desktop;
