import { useEffect, useState, useRef, FC, JSX, MouseEvent as ReactMouseEvent} from "react";

// --- Type Definitions ---
interface Position {
    x: number;
    y: number;
}

interface WindowProps {
    id: string;
    title: string;
    initialPosition: Position;
    zIndex: number;
    width: number;
    height: number;
    children: React.ReactNode; // To render the specific app component
    onClose: (id: string) => void;
    onFocus: (id: string) => void;
    onDragStop: (id: string, pos: Position) => void;
}

// --- Helper hook for managing window drag ---
const useDraggable = (id: string, initialPosition: Position, onDragStop: (id: string, pos: Position) => void) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [position, setPosition] = useState<Position>(initialPosition);
    const dragStartRef = useRef<Position>({ x: 0, y: 0 });

    const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
        // Prevent dragging from starting on buttons or other interactive elements within the header
        if ((e.target as HTMLElement).closest('button')) return;
        
        setIsDragging(true);
        // Record the starting mouse position relative to the window's top-left corner
        const rect = e.currentTarget.parentElement?.getBoundingClientRect();
        if (!rect) return;
        
        dragStartRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    // Use native MouseEvent for global listeners
    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStartRef.current.x,
                y: e.clientY - dragStartRef.current.y,
            });
        }
    };
    
    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            // The position state is already up-to-date from handleMouseMove
        }
    };
    
    // Effect to add/remove global event listeners
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else if (!isDragging && position !== initialPosition) {
            // Call onDragStop only when dragging has stopped and position has potentially changed
            onDragStop(id, position);
        }
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, id, position]);


    return { position, handleMouseDown };
};

// --- Window Component ---
const Window: FC<WindowProps> = ({ id, title, children, initialPosition, zIndex, width, height, onClose, onFocus, onDragStop }) => {
    const { position, handleMouseDown } = useDraggable(id, initialPosition, onDragStop);
    
    return (
        <div
            className="absolute bg-white/60 backdrop-blur-md rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-300/50"
            style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
                width: `${width}px`, 
                height: `${height}px`,
                zIndex: zIndex,
            }}
            onMouseDown={() => onFocus(id)} // Bring to front on any click within the window
        >
            {/* Title Bar - Draggable Handle */}
            <div
                className="h-8 bg-gray-100/80 flex items-center justify-between px-2 cursor-move border-b border-gray-200/80"
                onMouseDown={handleMouseDown}
            >
                <span className="text-sm font-medium text-gray-700 select-none">{title}</span>
                <button
                    onClick={() => onClose(id)}
                    className="w-4 h-4 bg-red-500 rounded-full hover:bg-red-600 focus:outline-none transition-colors"
                    aria-label="Close window"
                />
            </div>

            {/* Content Area */}
            <div className="flex-grow text-gray-800 overflow-auto">
                {children}
            </div>
        </div>
    );
};
export default Window;