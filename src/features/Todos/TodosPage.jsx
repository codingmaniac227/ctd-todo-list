import { useCallback, useEffect, useState } from "react";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList/TodoList.jsx";
import { ClipLoader } from "react-spinners";
import SortBy from "../../shared/SortBy.jsx";
import { useDebounce } from "../../utils/useDebounce.js";
import FilterInput from "../../shared/FilterInput.jsx";

export default function TodosPage({ token }) {

    const [ todoList, setTodoList ] = useState([])
    const [ error, setError ] = useState('')
    const [ isTodoListLoading, setIsTodoListLoading ] = useState(false)

    const [ sortBy, setSortBy ] = useState('creationDate')
    const [ sortDirection, setSortDirection ] = useState('desc')

    const [ filterTerm, setFilterTerm ] = useState('')
    const [ filterError, setFilterError ] = useState('')
    const debouncedFilterTerm = useDebounce( filterTerm, 300)

    const [ dataVersion, setDataVersion ] = useState(0)

    const invalidateCache = useCallback(() => {
        setDataVersion(prev => prev + 1)
        console.log('Invalidating memo cache after todo mutation')
    }, [])

    const handleFilterChange = (newTerm) => {
        setFilterTerm(newTerm)
    }

    const handleSortBy = (event) => {
        setSortBy(event.target.value)
    }

    const handleSortDirection = (event) => {
        setSortDirection(event.target.value)
    }

    const addTodo = async (todoTitle) => {
        const tempId = Date.now()

        setTodoList(prevTodoList => [
            { id: tempId, title: todoTitle, isCompleted: false },
            ...prevTodoList
        ])

        try {
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
                setTodoList(prevTodoList =>
                    prevTodoList.map(todo =>
                        todo.id === tempId ? data : todo
                    )
                )
            }
        } catch(err) {
            setError(`Error: ${err}`)
        } finally {
            invalidateCache()
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
        } finally {
            invalidateCache()
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
        } finally {
            invalidateCache()
        }
    }

    useEffect(() => {
        const fetchTodos = async () => {
                try {
                  setIsTodoListLoading(true)
                  const paramsObject = { sortBy, sortDirection }

                  if (debouncedFilterTerm) {
                      paramsObject.find = debouncedFilterTerm
                  }
                  const params = new URLSearchParams(paramsObject)


                  const resp = await fetch(`/api/tasks?${params}`, {
                      method: "GET",
                      headers: { 'X-CSRF-TOKEN': token },
                      credentials: 'include'
                  })

                  const data = await resp.json()
                  const { tasks } = data

                  if (resp.status === 200) {
                      setTodoList(tasks)
                      setFilterError('')
                  } else if (resp.status === 401) {
                      throw new Error('unauthorized')
                  } else {
                      throw new Error('Something went wrong')
                  }
                } catch (err) {
                    if (debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc') {
                        setFilterError(`Error filtering/sorting todos: ${err.message}`)
                    } else {
                        setError(`Error fetching todos: ${err.message}`)
                    }
                } finally {
                    setIsTodoListLoading(false)
                }
        }
        if (token) {
            fetchTodos()
        }
    }, [token, sortBy, sortDirection, debouncedFilterTerm])

    const handleFilterReset = () => {
        setFilterTerm('')
        setSortBy('creationDate')
        setSortDirection('desc')
        setFilterError('')
    }

    return (
        <>
            {error !== '' && (
                <>
                    <p><strong>{error}</strong></p>
                    <button onClick={() => setError('')}>Clear Error</button>
                </>
            )}

            {filterError && (
                <>
                    <div>
                        <p>{filterError}</p>
                        <button onClick={() => setFilterError('')}>Clear Filter Error</button>
                        <button onClick={() => {handleFilterReset()}}>Reset Filters</button>
                    </div>
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
            <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={handleSortBy} onSortDirectionChange={handleSortDirection} />
            <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
            <TodoForm onAddTodo={addTodo}/>
            <TodoList onCompleteTodo={completeTodo} todoList={todoList} onUpdateTodo={updateTodo} dataVersion={dataVersion} />
        </>
    )
}