import TodoListItem from "./TodoListItem.jsx";

function TodoList({todoList, onCompleteTodo}) {

    const filteredTodoList = todoList.filter(todo => todo.isCompleted === false)

    return filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
        ) : (
            <>
                <div>
                    <h2>My Todos</h2>
                    <ul>
                        {filteredTodoList.map(todo => <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo}/>)}
                    </ul>
                </div>
            </>
        )
}

export default TodoList