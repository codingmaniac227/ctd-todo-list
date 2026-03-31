import TodoList from "./features/TodoList/TodoList.jsx";
import TodoForm from "./features/TodoForm.jsx";
import './App.css'
import { useState } from "react";

function App() {
  const [ todoList, setTodoList ] = useState([])

  function addTodo(todoTitle) {
      setTodoList(prev => [
          {id: Date.now(), title: todoTitle, isCompleted: false},
          ...prev]
      )
  console.log(todoList)
  }

  function completeTodo(id) {
      setTodoList(prev =>
        prev.map(todo =>
        todo.id === id ? {...todo, isCompleted: true}
        : todo
        ))
  }

  function updateTodo(editedTodo) {
     const updatedTodos = todoList.map(todo => todo.id === editedTodo.id ? {...editedTodo} : todo)
     setTodoList(updatedTodos)
  }

  return (
    <>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList onCompleteTodo={completeTodo} todoList={todoList} onUpdateTodo={updateTodo}/>
    </>
  )
}

export default App
