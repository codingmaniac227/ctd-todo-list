import {useEffect, useState} from "react";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList/TodoList.jsx";
import {ClipLoader} from "react-spinners";

export default function TodosPage({ token }) {

    const [ todoList, setTodoList ] = useState([])
    const [ error, setError ] = useState('')
    const [ isTodoListLoading, setIsTodoListLoading ] = useState(false)

    const addTodo = async (todoTitle) => {
        const res = await fetch('/api/tasks', {
            method: 'POST',
            body: JSON.stringify({ title: todoTitle, isCompleted: false }),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            credentials: 'include',
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data?.message || 'Failed to add todo')
        } else {
            setTodoList(prevTodoList => [
                data,
                ...prevTodoList
            ])
        }
    }

    const completeTodo = async (id) => {
        const originalTodo = todoList.find(todo => todo.id === id)

        setTodoList(prevTodoState =>
            prevTodoState.map(todo =>
                todo.id === id ?
                    {...todo, isCompleted: true}
                : todo
            )
        )

        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ isCompleted: true, title: originalTodo.title }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                credentials: 'include'
            })

            if (!res.ok) {
                throw new Error('Failed to complete todo')
            }
        } catch (err) {
            setTodoList(prevTodoState =>
                prevTodoState.map(todo => todo.id === id ?
                    originalTodo : todo
                )
            )
            setError(`Error: ${err.message}`)
        }
    }

    const updateTodo = async (editedTodo) => {
        const originalTodo = todoList.find(todo => todo.id === editedTodo.id)

        setTodoList(prevTodoState =>
            prevTodoState.map(todo =>
                todo.id === editedTodo.id
                    ? { ...todo, title: editedTodo.title }
                    : todo
            )
        )

        try {
            const res = await fetch(`/api/tasks/${editedTodo.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ title: editedTodo.title, isCompleted: editedTodo.isCompleted }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                credentials: 'include'
            })

            if (!res.ok) {
                throw new Error('Failed to update todo')
            }
        } catch (err) {
            setTodoList(prevTodoState =>
                prevTodoState.map(todo => todo.id === editedTodo.id ? originalTodo : todo)
                )
            setError(`Error: ${err.message}`)
        }
    }

    useEffect(() => {
        const fetchTodos = async () => {
                try {
                  setIsTodoListLoading(true)
                  const resp = await fetch('/api/tasks', {
                      method: "GET",
                      headers: { 'X-CSRF-TOKEN': token },
                      credentials: 'include'
                  })

                  const data = await resp.json()
                  const { tasks } = data

                  if (resp.status === 200) {
                      setTodoList(tasks)
                  } else if (resp.status === 401) {
                      throw new Error('unauthorized')
                  } else {
                      throw new Error('Something went wrong')
                  }
                } catch (err) {
                    setError(`Error: ${err.message}`)
                } finally {
                    setIsTodoListLoading(false)
                }
        }
        if (token) {
            fetchTodos()
        }
    }, [token])

    return (
        <>
            {error && (
                <>
                    <p><strong>{error}</strong></p>
                    <button>Clear Error</button>
                </>
            )}

            {isTodoListLoading && (
                <ClipLoader
                    color='red'
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            )}
            <TodoForm onAddTodo={addTodo}/>
            <TodoList onCompleteTodo={completeTodo} todoList={todoList} onUpdateTodo={updateTodo}/>
        </>
    )
}