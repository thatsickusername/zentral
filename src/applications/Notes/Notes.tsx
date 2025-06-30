import { useRef, useState } from "react";
import TodoItem from "./TodoItem";

interface Todo{
    id: string,
    text: string,
    completed: boolean
}


function Notes() {
    const [todoList, setTodoList] = useState<Todo[]>([])
    const [newTodoText, setNewTodoText] = useState<string>("")
    const newTodoInputRef = useRef<HTMLInputElement>(null)

    const handleNewTodo = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setNewTodoText(e.target.value)
    }
    
    const addTodo = ()=>{
        if(newTodoText.trim() === '') return 

        setTodoList((prevTodoList: Todo[]) => {
            return([...prevTodoList, {id: Date.now().toString(), text: newTodoText, completed: false}])
        })

        setNewTodoText("")
        console.log(todoList)
    }

    const toggleCompleteTodo = (id: string) =>{
        setTodoList(prevTodoList => 
            prevTodoList.map(todo => 
                todo.id === id 
                    ? {...todo, completed: !todo.completed}
                    : todo
                
            )
        )   
    }

    const deleteTodo = (id: string) =>{
        setTodoList(prevTodoList=>
            prevTodoList.filter(todo => todo.id !== id)    
        )
    }

    const editTodo = (id: string, newText: string) => {
        setTodoList(prevTodoList=>
            prevTodoList.map(todo =>
                todo.id === id
                    ? {...todo, text: newText}
                    : todo
            )
        )
    }

    const focusNewTodoInput = ()=>{
        newTodoInputRef.current?.focus();
    }
   

    return (
        <div className="text-gray-800 min-h-full w-full flex flex-col justify-center p-12 max-w-3xl mx-auto">
            <h4 className="text-4xl font-extrabold text-gray-900 mb-4 px-1">Tasks</h4>
            {todoList.map((todo: Todo)=>(
               <TodoItem 
                    key={todo.id} 
                    id={todo.id}
                    text={todo.text} 
                    completed={todo.completed}
                    onToggleComplete={toggleCompleteTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                    onNewInputFocus={focusNewTodoInput}
                />
            ))}
            <div className="flex items-start py-1.5 px-0.5 my-1 hover:bg-gray-400/10 rounded">
                <div className="flex-shrink-0 w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center cursor-pointer transition-colors duration-100 mr-2.5"></div>
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
            {todoList.length===0 && (
                <p className="text-center text-gray-500 text-lg mt-10">
                    No tasks yet! Add one above.
                </p>
            )}
        </div>
    );
}

export default Notes;