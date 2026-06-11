import {useCallback, useEffect, useReducer} from "react";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList/TodoList.jsx";
import { ClipLoader } from "react-spinners";
import SortBy from "../../shared/SortBy.jsx";
import { useDebounce } from "../../utils/useDebounce.js";
import FilterInput from "../../shared/FilterInput.jsx";
import {initialTodoState, TODO_ACTIONS, todoReducer} from "../../reducers/todoReducer.js";
import {useAuth} from "../../contexts/AuthContext.jsx";

export default function TodosPage() {

    const { token } = useAuth()

    const [ state, dispatch ] = useReducer(todoReducer, initialTodoState)
    const {
        todoList,
        error,
        filterError,
        isTodoListLoading,
        sortBy,
        sortDirection,
        filterTerm,
        dataVersion
    } = state

    const debouncedFilterTerm = useDebounce( filterTerm, 300)

    const invalidateCache = useCallback(() => {
        dispatch({
            type: TODO_ACTIONS.INCREMENT_DATA_VERSION
        })
        console.log('Invalidating memo cache after todo mutation')
    }, [])

    const handleFilterChange = (newTerm) => {
        dispatch({
            type: TODO_ACTIONS.SET_FILTER,
            payload: newTerm
        })
    }

    const handleSortBy = (event) => {
        dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy: event.target.value }
        })
    }

    const handleSortDirection = (event) => {
        dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortDirection: event.target.value }
        })
    }

    const addTodo = async (todoTitle) => {
        const tempId = Date.now()

        dispatch({
            type: TODO_ACTIONS.ADD_TODO_START,
            payload: {
                id: tempId,
                title: todoTitle,
                isCompleted: false
            }
        })

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

                dispatch({
                    type: TODO_ACTIONS.ADD_TODO_SUCCESS,
                    payload: {
                        tempId,
                        savedTodo: data
                    }
                })
            }
        } catch(err) {
            dispatch({
                type: TODO_ACTIONS.ADD_TODO_ERROR,
                payload: {
                    tempId,
                    message: `Error: ${err.message}`
                }
            })
        } finally {
            invalidateCache()
        }

    }

    const completeTodo = async (id) => {
        const originalTodo = todoList.find(todo => todo.id === id)

        dispatch({
            type: TODO_ACTIONS.COMPLETE_TODO_START,
            payload: {
                id: id,
                isCompleted: true
            }
        })

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
            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS
            })
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
                payload: {
                    message: `Error: ${err.message}`,
                    originalTodo: originalTodo
                }
            })
        } finally {
            invalidateCache()
        }
    }

    const updateTodo = async (editedTodo) => {
        const originalTodo = todoList.find(todo => todo.id === editedTodo.id)

        dispatch({
            type: TODO_ACTIONS.UPDATE_TODO_START,
            payload: { editedTodo }
        })

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

            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO_SUCCESS
            })
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO_ERROR,
                payload: {
                    originalTodo,
                    message: `Error: ${err.message}`,
                }
            })
        } finally {
            invalidateCache()
        }
    }

    useEffect(() => {
        const fetchTodos = async () => {
                try {
                  dispatch({
                      type: TODO_ACTIONS.FETCH_START
                  })
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
                      dispatch({
                          type: TODO_ACTIONS.FETCH_SUCCESS,
                          payload: tasks
                      })
                      console.log(tasks)
                  } else if (resp.status === 401) {
                      throw new Error('unauthorized')
                  } else {
                      throw new Error('Something went wrong')
                  }
                } catch (err) {
                    if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
                        dispatch({
                            type: TODO_ACTIONS.FETCH_ERROR,
                            payload: {
                                message: `Error filtering/sorting todos: ${err.message}`,
                                isFilterError: true
                            }
                        })
                    } else {
                        dispatch({
                            type: TODO_ACTIONS.FETCH_ERROR,
                            payload: {
                                message: `Error fetching todos: ${err.message}`,
                                isFilterError: false
                            }
                        })
                    }
                }
        }
        if (token) {
            fetchTodos()
        }
    }, [token, sortBy, sortDirection, debouncedFilterTerm])

    const handleFilterReset = () => {
        dispatch({
            type: TODO_ACTIONS.RESET_FILTERS,
        })
    }

    return (
        <>
            {error !== '' && (
                <>
                    <p><strong>{error}</strong></p>
                    <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>Clear Error</button>
                </>
            )}

            {filterError && (
                <>
                    <div>
                        <p>{filterError}</p>
                        <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}>Clear Filter Error</button>
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