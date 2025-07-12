import { useEffect, useRef, useState } from "react";

interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align: 'left' | 'right'
}

const TopBarDropdown: React.FC<DropdownProps> = ({trigger, children, align}) => {
    const [open, setOpen] = useState(false);
    const dropDownRef = useRef<HTMLDivElement>(null)

    const toggleDropdown = ()=> setOpen(!open)

    useEffect(()=>{
        function handleClickOutside(event: MouseEvent){
            if(dropDownRef.current && !dropDownRef.current.contains(event.target as Node)){
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)

        return ()=> document.removeEventListener('mousedown', handleClickOutside)
    })

    return (
        <div className="relative inline-block h-full" ref={dropDownRef}>
            <div onClick={toggleDropdown} className="h-full flex items-center px-2 rounded-md hover:bg-gray-700/20 hover:cursor-pointer"> 
                {trigger}
            </div>

            {open && (
                <div
                    className={`absolute z-50 mt-1 min-w-[10rem] rounded-xl bg-white bg-opacity-40 text-gray-700 text-sm font-medium backdrop-blur-md border border-opacity-30 border-white ${
                    align === 'right' ? 'right-0' : 'left-0'
                    }`}
                >
                    {children}    
                </div>
            )}
        </div>
    );
}

export default TopBarDropdown;