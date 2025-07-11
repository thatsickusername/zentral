import { FC } from "react";
import MusicPlayer from "../../applications/MusicPlayer/MusicPlayer";
import Tasks from "../../applications/Tasks/Tasks";
import Timer from "../../applications/Timer/Timer";

// AppDefinition now holds the component reference and its default size
interface AppDefinition {
    id: string;
    title: string;
    icon: FC<React.SVGProps<SVGSVGElement>>;
    component: FC; // Reference to the app's functional component
    defaultWidth?: number;
    defaultHeight?: number;
}

interface DockProps {
    onIconClick: (app: AppDefinition) => void;
}

// --- SVG Icons for "Apps" ---
const Icons = {
    Tasks: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Box with an open top-right corner */}
            <path d="M4 4 L4 20 L20 20 L20 6" /> {/* Draws the left, bottom, and partial right side of the box */}
            <path d="M4 4 L16 4" /> {/* Draws the partial top side of the box */}

            {/* Checkmark that flows out of the open corner */}
            <polyline points="7 12 12 17 19 5" /> 
        </svg>
    ),
    Music: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>
        </svg>
    ),
    Timer: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    ),
};


// --- App Definitions with Component and Size ---
const APPS: AppDefinition[] = [
    { id: 'musicPlayer', title: 'Music Player', icon: Icons.Music, component: MusicPlayer, defaultWidth: 350, defaultHeight: 320 },
    { id: 'tasks', title: 'Tasks', icon: Icons.Tasks, component: Tasks, defaultWidth: 500, defaultHeight: 400 },
    { id: 'timer', title: 'Timer', icon: Icons.Timer, component: Timer, defaultWidth: 450, defaultHeight: 380 },
];

const Dock: FC<DockProps> = ({ onIconClick }) => {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
            <div className="flex items-center justify-center gap-3 bg-white/40 backdrop-blur-xl p-2 rounded-xl border border-opacity-30 border-white shadow-lg">
                {APPS.map(app => (
                    <button
                        key={app.id}
                        onClick={() => onIconClick(app)}
                        className="w-14 h-14 bg-gray-300/50 rounded-lg flex items-center justify-center text-gray-700
                                   transition-all duration-200 ease-in-out
                                   hover:bg-white/60 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label={`Open ${app.title}`}
                    >
                        <app.icon className="w-7 h-7" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dock;