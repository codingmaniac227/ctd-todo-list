import TodoList from "./TodoList.jsx";
import TodoForm from "./TodoForm.jsx";
import './App.css'
import { useState } from "react";

function App() {
  const [ todoList, setTodoList ] = useState([])

  function addTodo(todoTitle) {
      setTodoList(prev => [
          {id: Date.now(), title: todoTitle},
          ...prev]
      )
  console.log(todoList)
  }

  return (
    <>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList} />
    </>
  )
}

export default App
