import { useRef } from "react";

function TodoForm({ onAddTodo }) {
    const inputRef = useRef(null)

    const handleAddTodo = (event) => {
        event.preventDefault()

        const todoTitle = event.target.todoTitle.value.trim()
        if (todoTitle && todoTitle !== "") {
            onAddTodo(todoTitle)
            event.target.reset()
            inputRef.current.focus()
        }
    }

    return (
        <>
            <form onSubmit={handleAddTodo}>
                <label htmlFor="todoTitle">Title</label>
                <input
                    ref={inputRef}
                    type="text"
                    id="todoTitle"
                    name="todoTitle"
                    placeholder={'Todo text'}
                    required
                />
                <button type="submit">Add Todo</button>
            </form>
        </>
    )
}

export default TodoForm
