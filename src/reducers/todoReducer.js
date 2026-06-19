export function todoReducer(state, action) {
    switch (action.type) {
        case TODO_ACTIONS.FETCH_START:
            return {
                ...state,
                isTodoListLoading: true,
                error: '',
                filterError: ''
            }
        case TODO_ACTIONS.FETCH_SUCCESS:
            return {
                ...state,
                todoList: action.payload,
                isTodoListLoading: false,
                filterError: ''
            }
        case TODO_ACTIONS.FETCH_ERROR:
            return {
                ...state,
                isTodoListLoading: false,
                error: action.payload.isFilterError ? state.error : action.payload.message,
                filterError: action.payload.isFilterError ? action.payload.message : state.filterError
            }
        case TODO_ACTIONS.ADD_TODO_START:
            return {
                ...state,
                todoList: [action.payload, ...state.todoList],
                error: ''
            }
        case TODO_ACTIONS.ADD_TODO_SUCCESS:
            return {
                ...state,
                todoList: state.todoList.map(todo =>
                    todo.id === action.payload.tempId
                    ? action.payload.savedTodo
                    : todo
                )
            }
        case TODO_ACTIONS.ADD_TODO_ERROR:
            return {
                ...state,
                todoList: state.todoList.filter(
                    todo => todo.id !== action.payload.tempId
                ),
                error: action.payload.message
            }
        case TODO_ACTIONS.COMPLETE_TODO_START:
            return {
                ...state,
                todoList: state.todoList.map((todo) =>
                    todo.id === action.payload.id
                        ? { ...todo, isCompleted: true }
                        : todo
                ),
                error: ''
            }
        case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
            return {
                ...state,
                error: ''
            }

        case TODO_ACTIONS.COMPLETE_TODO_ERROR:
            return {
                ...state,
                todoList: state.todoList.map((todo) =>
                    todo.id === action.payload.originalTodo.id
                    ? action.payload.originalTodo
                    : todo
                ),
                error: action.payload.message
            }
        case TODO_ACTIONS.UPDATE_TODO_START:
            return {
                ...state,
                todoList: state.todoList.map((todo) =>
                    todo.id === action.payload.editedTodo.id
                        ? {...todo, title: action.payload.editedTodo.title}
                        : todo
                ),
                error: ''
            }
        case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
            return {
                ...state,
                error: ''
            }
        case TODO_ACTIONS.UPDATE_TODO_ERROR:
            return {
                ...state,
                todoList: state.todoList.map((todo) =>
                    todo.id === action.payload.originalTodo.id
                    ? action.payload.originalTodo
                    : todo
                ),
                error: action.payload.message
            }
        case TODO_ACTIONS.SET_SORT:
            return {
                ...state,
                ...action.payload,
                filterError: ''
            }
        case TODO_ACTIONS.SET_FILTER:
            return {
                ...state,
                filterTerm: action.payload,
                filterError: ''
            }
        case TODO_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: '',
            }
        case TODO_ACTIONS.CLEAR_FILTER_ERROR:
            return {
                ...state,
                filterError: ''
            }
        case TODO_ACTIONS.RESET_FILTERS:
            return {
                ...state,
                filterTerm: '',
                sortBy: initialTodoState.sortBy,
                sortDirection: initialTodoState.sortDirection,
                error: '',
                filterError: ''
            }
        case TODO_ACTIONS.INCREMENT_DATA_VERSION:
            return {
                ...state,
                dataVersion: state.dataVersion + 1
            }
        default:
            throw new Error(`Unknown action type: ${action.type}`)
    }
}


export const TODO_ACTIONS = {

    FETCH_START: 'FETCH_START',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',

    ADD_TODO_START: 'ADD_TODO_START',
    ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
    ADD_TODO_ERROR: 'ADD_TODO_ERROR',

    COMPLETE_TODO_START: 'COMPLETE_TODO_START',
    COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
    COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',


    UPDATE_TODO_START: 'UPDATE_TODO_START',
    UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
    UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

    SET_SORT: 'SET_SORT',
    SET_FILTER: 'SET_FILTER',
    CLEAR_ERROR: 'CLEAR_ERROR',
    CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',
    RESET_FILTERS: 'RESET_FILTERS',

    INCREMENT_DATA_VERSION: 'INCREMENT_DATA_VERSION'
}

export const initialTodoState = {
    todoList: [],
    error: '',
    isTodoListLoading: true,
    sortBy: 'createdAt',
    sortDirection: 'asc',
    filterTerm: '',
    filterError: '',
    dataVersion: 0,
}