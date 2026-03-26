function TodoList() {
    const todoList = [
        {id: 1, title: "review resources"},
        {id: 2, title: "take notes"},
        {id: 3, title: "code out app"}
    ]

    return (
        <>
            <div>
                <h2>My Todos</h2>
                <ul>
                    {todoList.map(todo => <li key={todo.id}>{todo.title}</li>)}
                </ul>
            </div>
        </>
    )
}

export default TodoList