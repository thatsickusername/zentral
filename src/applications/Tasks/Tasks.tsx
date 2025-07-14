import { useRef, useState } from "react";
import TodoItem from "./TodoItem";
import { useTasks } from "../../hooks/useTasks";
import { Task } from "../../types/Tasks";

interface Todo{
    id: string,
    text: string,
    completed: boolean
}


function Tasks() {

    const {tasks, setTasks, isLoading, setIsLoading, addTask, toggleTask, editTask, removeTask} = useTasks()

    const [filterStatus,setFilteredStatus] = useState<string>("All")
    const filteredList = tasks.filter(todo => {
        if(filterStatus === "All" && !todo.deleted) return true
        if(filterStatus === "Completed" && !todo.deleted ) return todo.completed
        if(filterStatus === "Active" && !todo.deleted) return !todo.completed
    })
    const [newTodoText, setNewTodoText] = useState<string>("")
    const newTodoInputRef = useRef<HTMLInputElement>(null)

    const handleNewTodo = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setNewTodoText(e.target.value)
    }
    
    const addTodo = ()=>{
        if(newTodoText.trim() === '') return 

        addTask(newTodoText)
        setNewTodoText("")
    }

    const toggleCompleteTodo = (id: string) =>{

        toggleTask(id)  
    }

    const deleteTodo = (id: string) =>{
        console.log(id, "sent for delete from context")
        removeTask(id)
    }

    const editTodo = (id: string, newText: string) => {

        editTask(id, newText)
    }

    const focusNewTodoInput = ()=>{
        newTodoInputRef.current?.focus();
    }
   

    return (
            <div className="text-gray-800 min-h-full w-full flex flex-col p-12 max-w-3xl mx-auto overflow-auto">
                <h4 className="text-4xl font-extrabold text-gray-900 mb-4 px-1">Tasks</h4>
                <div className="flex space-x-2 mb-8 px-1">
                    <button className={`px-4 py-2 rounded-md text-sm font-medium ${filterStatus ==="All"? 'bg-blue-200 text-blue-700' : 'text-gray-600 hover:bg-gray-100' }`} 
                            onClick={()=>setFilteredStatus("All")}>All
                    </button>
                    <button className={`px-4 py-2 rounded-md text-sm font-medium ${filterStatus ==="Completed"? 'bg-blue-200 text-blue-700' : 'text-gray-600 hover:bg-gray-100' }`} 
                            onClick={()=> setFilteredStatus("Completed")}>Completed
                    </button>
                    <button className={`px-4 py-2 rounded-md text-sm font-medium ${filterStatus ==="Active"? 'bg-blue-200 text-blue-700' : 'text-gray-600 hover:bg-gray-100' }`} 
                            onClick={()=> setFilteredStatus("Active")}>Active
                    </button>
                </div>
                {filteredList.map((todo: Task)=>(
                <TodoItem 
                        key={todo.id} 
                        id={todo.id}
                        text={todo.content} 
                        completed={todo.completed}
                        onToggleComplete={toggleCompleteTodo}
                        onDelete={deleteTodo}
                        onEdit={editTodo}
                        onNewInputFocus={focusNewTodoInput}
                    />
                ))}
                <div className="flex items-start py-1.5 px-0.5 my-1 hover:bg-gray-400/10 rounded">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center cursor-pointer text-gray-400 mr-2.5"
                     onClick={()=>{addTodo()}}    
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                            <path
                            d="M7 2.5C7 2.22386 7.22386 2 7.5 2C7.77614 2 8 2.22386 8 2.5V7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H8V12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5V8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H7V2.5Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"/>
                    </svg>
                </div>                    
                <input 
                    ref={newTodoInputRef}
                        className="flex-grow p-0 border-none focus:outline-none text-base text-gray-800 bg-transparent"
                        type="text" 
                        value={newTodoText} 
                        placeholder = "Type your new task"
                        onChange={handleNewTodo} 
                        onKeyDown={(e)=> e.key === "Enter" && addTodo() }
                    />
                </div>
                {tasks.length===0 && (
                    <p className="text-center text-gray-500 text-lg mt-10">
                        No tasks yet! Add one above.
                    </p>
                )}
            </div>
    );
}

export default Tasks;