import { FC, JSX } from "react";

interface AppDefinition {
    id: string;
    title: string;
    icon: FC<React.SVGProps<SVGSVGElement>>;
    content: JSX.Element;
}

interface DockProps {
    onIconClick: (app: AppDefinition) => void;
}

// --- SVG Icons for our "Apps" ---
const Icons = {
    Photos: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>
        </svg>
    ),
    Music: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>
        </svg>
    ),
    Settings: (props: React.SVGProps<SVGSVGElement>) => (
         <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle>
        </svg>
    ),
};


// --- App Definitions ---
const APPS: AppDefinition[] = [
    { id: 'photos', title: 'Photos', icon: Icons.Photos, content: <div className="p-4"><h3 className="font-bold mb-2">My Photo Gallery</h3><p>This is where your photos would appear. It's a simple, static content area for this demo.</p></div> },
    { id: 'music', title: 'Music Player', icon: Icons.Music, content: <div className="p-4"><h3 className="font-bold mb-2">Now Playing</h3><p>Your minimalist music player controls would go here. Imagine a playlist and play/pause buttons.</p></div> },
    { id: 'settings', title: 'Settings', icon: Icons.Settings, content: <div className="p-4"><h3 className="font-bold mb-2">System Settings</h3><p>Adjust your preferences here. Toggles, sliders, and other controls would live in this window.</p></div> },
];

const Dock: FC<DockProps> = ({ onIconClick }) => {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
            <div className="flex items-center justify-center gap-3 bg-white/50 backdrop-blur-xl p-2 rounded-xl border border-gray-200/60 shadow-lg">
                {APPS.map(app => (
                    <button
                        key={app.id}
                        onClick={() => onIconClick(app)}
                        className="w-14 h-14 bg-gray-200/50 rounded-lg flex items-center justify-center text-gray-700
                                   transition-all duration-200 ease-in-out
                                   hover:bg-gray-300/70 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
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