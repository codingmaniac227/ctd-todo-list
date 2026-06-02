import TodoListItem from "./TodoListItem.jsx";
import { useMemo } from "react";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, dataVersion }) {

    const filteredTodoList =  useMemo(() => {
        console.log(`Recalculating filtered todos (v${dataVersion})`)
        return { version: dataVersion, todos: todoList.filter(todo => todo.isCompleted === false) }
    }, [todoList, dataVersion])

    return filteredTodoList.todos.length === 0 ? (
        <p>Add todo above to get started</p>
        ) : (
            <>
                <div>
                    <h2>My Todos</h2>
                    <ul>
                        {filteredTodoList.todos.map(todo => <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}/>)}
                    </ul>
                </div>
            </>
        )
}

export default TodoList