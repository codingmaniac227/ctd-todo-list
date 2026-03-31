import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel.jsx";
import { isValidTodoTitle} from "../utils/todoValidation.js";

function TodoForm({ onAddTodo }) {
    const inputRef = useRef(null)

    const [ workingTodoTitle, setWorkingTodoTitle ] = useState("")

    const handleAddTodo = (event) => {
        event.preventDefault()
        if (workingTodoTitle && workingTodoTitle !== "") {
            onAddTodo(workingTodoTitle)
            setWorkingTodoTitle("")
            inputRef.current.focus()
        }
    }

    return (
        <>
            <form onSubmit={handleAddTodo}>
                <TextInputWithLabel elementId={"todoTitle"} ref={inputRef} onChange={(event) => setWorkingTodoTitle(event.target.value)} labelText={'Todo'} value={workingTodoTitle}/>
                <button type="submit" disabled={!isValidTodoTitle(workingTodoTitle)}>Add Todo</button>
            </form>
        </>
    )
}

export default TodoForm
