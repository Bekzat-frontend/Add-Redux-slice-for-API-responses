import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  clearTodos,
} from "./slice/todoSlice";
import styled from "styled-components";

const App = () => {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector((state) => state.todos);
  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAdd = () => {
    if (text.trim()) {
      dispatch(addTodo(text));
      setText("");
    }
  };

  return (
    <Container>
      <h1 style={{ color: "red", fontSize: "50px", fontWeight: "900px" }}>
        To-Do List
      </h1>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="написать текст"
      />
      {items.length > 0 && (
        <Button danger onClick={() => dispatch(clearTodos())}>
          Очистить всё
        </Button>
      )}
      <span>
        <Button onClick={handleAdd}>Добавить</Button>
      </span>

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
      <List>
        {items.map((todo) => (
          <TodoItem
            key={todo.id}
            completed={todo.completed}
            onClick={() => dispatch(toggleTodo(todo))}
          >
            {todo.text}
            <Button
              danger
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteTodo(todo.id));
              }}
            >
              delet
            </Button>
          </TodoItem>
        ))}
      </List>
    </Container>
  );
};

export default App;

const Container = styled.div`
  width: 300px;
  margin: 40px auto;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 8px;
  border-radius: 8px;
  margin: 5px;

  border: none;
  background: ${(props) => (props.danger ? "#008cff;" : "green")};
  color: white;
  cursor: pointer;
`;

const List = styled.div`
  margin-top: 20px;
`;

const TodoItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid lightgray;
  background: ${(props) => (props.completed ? "lightgreen" : "white")};
  color: ${(props) => (props.completed ? "#0682e7;" : "black")};
  cursor: pointer;
`;
