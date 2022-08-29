import React, { useState, createContext, useContext, useEffect } from "react";
import Button from "./Button";
import styles from "../../styles/style.module.css";

let id = 0;
const TodoListContext = createContext({ todoList: [] });

function Todo(props) {
  const { updateTodo, removeTodo } = useContext(TodoListContext);
  const [todo, setTodo] = useState(props);

  const handleTodoCompleteClick = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    updateTodo(updatedTodo);
    setTodo(updatedTodo);
  };

  const handleTodoRemoveClick = () => {
    removeTodo(todo.id);
  };

  return (
    <li className={styles.todoContainer}>
      <div
        onClick={handleTodoCompleteClick}
        className={`${styles.todo} ${
          todo.completed ? styles.complete : styles.notComplete
        }`}
      >
        <input type="checkbox" checked={todo.completed} onChange={() => {}} />
        {todo.text}
      </div>
      <div className={styles.todoRemove} onClick={handleTodoRemoveClick}>
        -
      </div>
    </li>
  );
}

const TodoList = () => {
  const { todoList, addTodo } = useContext(TodoListContext);
  const [input, setInput] = useState("");

  const handleClick = () => {
    const todo = { todo_text: input, completed: false };
    addTodo(todo);
    setInput("");
    return todo;
  };
  return (
    <div className={styles.todoListContainer}>
      <Button onClick={handleClick} text="Add Todo" disabled={!input} />
      <input
        className={styles.todoInput}
        placeholder="Add a todo..."
        value={input}
        onInput={(e) => setInput(e.target.value)}
      />
      <ul className={styles.todoList}>
        {todoList.map((todo) => (
          <Todo
            id={todo.id}
            key={todo.id}
            text={todo.todo_text}
            completed={todo.completed}
          />
        ))}
      </ul>
    </div>
  );
};

export default ({ todos }) => {
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    todos.forEach((todo) => {
      addTodo(todo);
    });
  }, []);

  useEffect(() => {
    sortTodoList();
  });

  const todoCompare = (todoA, todoB) => {
    if (todoA.completed && todoB.completed) {
      // Earlier IDs correspond to higher place in the list
      return todoA.id - todoB.id;
    }
    if (todoA.completed) return 1;
    if (todoB.completed) return -1;
    return todoA.id - todoB.id;
  };

  const removeTodo = (todoId) => {
    const removeIndex = todoList.map((todo) => todo.id).indexOf(todoId);
    setTodoList((prevList) => {
      let updatedList = [...prevList];
      updatedList.splice(removeIndex, 1);
      return updatedList;
    });
  };

  const updateTodo = (updatedTodo) => {
    const updatedId = updatedTodo.id;
    const updateIndex = todoList.map((todo) => todo.id).indexOf(updatedId);
    setTodoList((prevList) => {
      let updatedList = [...prevList];
      updatedList[updateIndex] = updatedTodo;
      return updatedList.sort(todoCompare);
    });
  };

  const sortTodoList = () => {
    setTodoList((prevList) => prevList.sort(todoCompare));
  };

  const addTodo = (todo) => {
    todo["id"] = id;
    todo["key"] = id;
    id += 1;
    setTodoList((prevList) => [...prevList, todo].sort(todoCompare));
  };

  return (
    <TodoListContext.Provider
      value={{ todoList, addTodo, updateTodo, removeTodo }}
    >
      <TodoList />
    </TodoListContext.Provider>
  );
};
