import { useCallback, useEffect, useReducer } from "react";
import TodoForm from "../features/Todos/TodoForm.jsx";
import TodoList from "../features/Todos/TodoList/TodoList.jsx";
import { ClipLoader } from "react-spinners";
import SortBy from "../shared/SortBy.jsx";
import { useDebounce } from "../utils/useDebounce.js";
import FilterInput from "../shared/FilterInput.jsx";
import {
    initialTodoState,
    TODO_ACTIONS,
    todoReducer,
} from "../reducers/todoReducer.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate, useSearchParams } from "react-router";
import StatusFilter from "../shared/StatusFilter.jsx";
import styles from "./TodosPage.module.css";

import {
    getTodoValidationError,
    sanitizeTodoTitle,
} from "../utils/sanitizeTodo.js";

export default function TodosPage() {
    const { token, logout } = useAuth();
    const [searchParams] = useSearchParams();

    const [state, dispatch] = useReducer(todoReducer, initialTodoState);

    const {
        todoList,
        error,
        filterError,
        isTodoListLoading,
        sortBy,
        sortDirection,
        filterTerm,
        dataVersion,
    } = state;

    const navigate = useNavigate();
    const statusFilter = searchParams.get("status") || "all";
    const debouncedFilterTerm = useDebounce(filterTerm, 300);

    const invalidateCache = useCallback(() => {
        dispatch({
            type: TODO_ACTIONS.INCREMENT_DATA_VERSION,
        });
    }, []);

    const handleInvalidToken = async (response) => {
        if (response.status === 401 || response.status === 403) {
            await logout();
            navigate("/login", { replace: true });
            return true;
        }

        return false;
    };

    const handleFilterChange = (newTerm) => {
        dispatch({
            type: TODO_ACTIONS.SET_FILTER,
            payload: newTerm,
        });
    };

    const handleSortBy = (event) => {
        dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy: event.target.value },
        });
    };

    const handleSortDirection = (event) => {
        dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortDirection: event.target.value },
        });
    };

    const handleFilterReset = () => {
        dispatch({
            type: TODO_ACTIONS.RESET_FILTERS,
        });
    };

    const addTodo = async (todoTitle) => {
        const validationError = getTodoValidationError(todoTitle);

        if (validationError) {
            dispatch({
                type: TODO_ACTIONS.ADD_TODO_ERROR,
                payload: {
                    tempId: Date.now(),
                    message: validationError,
                },
            });
            return;
        }

        const cleanTitle = sanitizeTodoTitle(todoTitle);
        const tempId = Date.now();

        dispatch({
            type: TODO_ACTIONS.ADD_TODO_START,
            payload: {
                id: tempId,
                title: cleanTitle,
                isCompleted: false,
            },
        });

        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                body: JSON.stringify({
                    title: cleanTitle,
                    isCompleted: false,
                }),
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": token,
                },
                credentials: "include",
            });

            if (await handleInvalidToken(res)) {
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Failed to add todo");
            }

            dispatch({
                type: TODO_ACTIONS.ADD_TODO_SUCCESS,
                payload: {
                    tempId,
                    savedTodo: data,
                },
            });
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.ADD_TODO_ERROR,
                payload: {
                    tempId,
                    message: `Error: ${err.message}`,
                },
            });
        } finally {
            invalidateCache();
        }
    };

    const completeTodo = async (id) => {
        const originalTodo = todoList.find((todo) => todo.id === id);

        if (!originalTodo) {
            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
                payload: {
                    message: "Error: Todo not found.",
                    originalTodo: null,
                },
            });
            return;
        }

        dispatch({
            type: TODO_ACTIONS.COMPLETE_TODO_START,
            payload: {
                id,
                isCompleted: true,
            },
        });

        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    isCompleted: true,
                    title: originalTodo.title,
                }),
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": token,
                },
                credentials: "include",
            });

            if (await handleInvalidToken(res)) {
                return;
            }

            if (!res.ok) {
                throw new Error("Failed to complete todo");
            }

            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
            });
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
                payload: {
                    message: `Error: ${err.message}`,
                    originalTodo,
                },
            });
        } finally {
            invalidateCache();
        }
    };

    const updateTodo = async (editedTodo) => {
        const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

        const validationError = getTodoValidationError(editedTodo.title);

        if (validationError) {
            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO_ERROR,
                payload: {
                    originalTodo,
                    message: validationError,
                },
            });
            return;
        }

        const cleanEditedTodo = {
            ...editedTodo,
            title: sanitizeTodoTitle(editedTodo.title),
        };

        dispatch({
            type: TODO_ACTIONS.UPDATE_TODO_START,
            payload: { editedTodo: cleanEditedTodo },
        });

        try {
            const res = await fetch(`/api/tasks/${cleanEditedTodo.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    title: cleanEditedTodo.title,
                    isCompleted: cleanEditedTodo.isCompleted,
                }),
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": token,
                },
                credentials: "include",
            });

            if (await handleInvalidToken(res)) {
                return;
            }

            if (!res.ok) {
                throw new Error("Failed to update todo");
            }

            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
            });
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO_ERROR,
                payload: {
                    originalTodo,
                    message: `Error: ${err.message}`,
                },
            });
        } finally {
            invalidateCache();
        }
    };

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                dispatch({
                    type: TODO_ACTIONS.FETCH_START,
                });

                const paramsObject = {
                    sortBy,
                    sortDirection,
                };

                if (debouncedFilterTerm) {
                    paramsObject.find = debouncedFilterTerm;
                }

                const params = new URLSearchParams(paramsObject);

                const resp = await fetch(`/api/tasks?${params}`, {
                    method: "GET",
                    headers: {
                        "X-CSRF-TOKEN": token,
                    },
                    credentials: "include",
                });

                if (await handleInvalidToken(resp)) {
                    return;
                }

                const data = await resp.json();
                const { tasks } = data;

                if (resp.status === 200) {
                    dispatch({
                        type: TODO_ACTIONS.FETCH_SUCCESS,
                        payload: tasks,
                    });
                } else {
                    throw new Error("Something went wrong");
                }
            } catch (err) {
                if (
                    debouncedFilterTerm ||
                    sortBy !== "createdAt" ||
                    sortDirection !== "desc"
                ) {
                    dispatch({
                        type: TODO_ACTIONS.FETCH_ERROR,
                        payload: {
                            message: `Error filtering/sorting todos: ${err.message}`,
                            isFilterError: true,
                        },
                    });
                } else {
                    dispatch({
                        type: TODO_ACTIONS.FETCH_ERROR,
                        payload: {
                            message: `Error fetching todos: ${err.message}`,
                            isFilterError: false,
                        },
                    });
                }
            }
        };

        if (token) {
            fetchTodos();
        }
    }, [token, sortBy, sortDirection, debouncedFilterTerm]);

    return (
        <section className={styles.todosPage}>
            <div className={styles.pageHeader}>
                <h2 className={styles.pageTitle}>Todo Dashboard</h2>
                <p className={styles.pageSubtitle}>
                    Search, sort, filter, and manage your tasks in one place.
                </p>
            </div>

            {error !== "" && (
                <div className={styles.errorBox}>
                    <p>
                        <strong>{error}</strong>
                    </p>

                    <button
                        className={styles.dangerButton}
                        onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
                    >
                        Clear Error
                    </button>
                </div>
            )}

            {filterError && (
                <div className={styles.errorBox}>
                    <p>{filterError}</p>

                    <div className={styles.errorActions}>
                        <button
                            className={styles.dangerButton}
                            onClick={() =>
                                dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })
                            }
                        >
                            Clear Filter Error
                        </button>

                        <button
                            className={styles.secondaryButton}
                            onClick={handleFilterReset}
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            )}

            {isTodoListLoading && (
                <div className={styles.loadingBox}>
                    <ClipLoader
                        color="#2563eb"
                        size={80}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            )}

            <div className={styles.controls}>
                <div className={styles.statusRow}>
                    <StatusFilter />

                    <SortBy
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        onSortByChange={handleSortBy}
                        onSortDirectionChange={handleSortDirection}
                    />
                </div>

                <FilterInput
                    filterTerm={filterTerm}
                    onFilterChange={handleFilterChange}
                />

                <TodoForm onAddTodo={addTodo} />
            </div>

            <TodoList
                onCompleteTodo={completeTodo}
                todoList={todoList}
                onUpdateTodo={updateTodo}
                dataVersion={dataVersion}
                statusFilter={statusFilter}
            />
        </section>
    );
}