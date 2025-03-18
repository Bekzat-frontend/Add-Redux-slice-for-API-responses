import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://54e68405b3d687f5.mokky.dev/hw";

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Ошибка загрузки");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (text, { rejectWithValue }) => {
    try {
      const newTodo = { text, completed: false };
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      if (!response.ok) throw new Error("Ошибка добавления");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleTodo = createAsyncThunk(
  "todos/toggleTodo",
  async (todo, { rejectWithValue }) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      const response = await fetch(`${API_URL}/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) throw new Error("Ошибка обновления");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id, { rejectWithValue }) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearTodos = createAsyncThunk(
  "todos/clearTodos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Ошибка очистки");
      const todos = await response.json();

      await Promise.all(
        todos.map((todo) =>
          fetch(`${API_URL}/${todo.id}`, { method: "DELETE" })
        )
      );
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const todoSlice = createSlice({
  name: "todos",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      })
      .addCase(clearTodos.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default todoSlice.reducer;
