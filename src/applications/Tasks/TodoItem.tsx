import { FC, useState } from "react"

interface TodoItemProps{
    id: string,
    text: string,
    completed: boolean,
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, newText: string) => void
    onNewInputFocus: () => void
}

const  TodoItem: FC<TodoItemProps> = ({id, text, completed, onToggleComplete, onDelete, onEdit, onNewInputFocus}) =>  {
    const [editText, setEditText] = useState<string>(text)

    const handleEditText = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setEditText(e.target.value)
    }

    return (
        <div className="flex items-start py-1.5 px-0.5 my-1 hover:bg-gray-400/10 rounded">
            <div
                className="custom-checkbox flex-shrink-0 w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center cursor-pointer transition-colors duration-100 mr-2.5"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => { e.stopPropagation(); onToggleComplete(id); }}
                style={{ backgroundColor: completed ? 'rgb(35, 131, 226)' : 'transparent', borderColor: completed ? 'rgb(35, 131, 226)' : 'rgb(209, 213, 219)' }}
            >
                {completed && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                )}
            </div>
            <input 
                className={`flex-grow p-0 border-none focus:outline-none text-base bg-transparent ${
                    completed ? "line-through text-gray-500" : "text-gray-800"
                }`}                 
                type="text"
                value={editText}
                onChange={handleEditText}
                onBlur={()=> onEdit(id, editText)}
                onKeyDown={(e)=> {
                        if ( e.key === "Enter"){
                            onEdit(id, editText) 
                            onNewInputFocus()
                        }
                    }
                }
            />
            <div className="ml-4 p-1 text-red-400 hover:text-red-600 rounded-md cursor-pointer" 
                onClick={()=> {
                    onDelete(id)
                    onNewInputFocus()
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );
}

export default TodoItem;