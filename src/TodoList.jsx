import TodoListItem from "./TodoListItem.jsx";

function TodoList({todoList}) {

    return (
        <>
            <div>
                <h2>My Todos</h2>
                <ul>
                    {todoList.map(todo => <TodoListItem todo={todo}/>)}
                </ul>
            </div>
        </>
    )
}

export default TodoList