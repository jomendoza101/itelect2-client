import { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const loadTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : data.tasks);
      setLoadError(null);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Login failed");
      setToken(data.token);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const addTask = async (title) => {
    setActionError(null);
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Match the body your Postman createTask request sends
        body: JSON.stringify({
          title,
          dueDate: new Date().toISOString().slice(0, 10),
        }),
      });
      if (!res.ok) throw new Error(`Could not add task (${res.status})`);
      await loadTasks(); // fetch the list again so the new row appears
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div>
      <h1>Task Manager</h1>

      {!token ? (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Log in</button>
          {authError && <p>{authError}</p>}
        </form>
      ) : (
        <TaskForm onAddTask={addTask} />
      )}
      {actionError && <p>{actionError}</p>}

      {loading && <p>Loading...</p>}
      {loadError && <p>Error: {loadError}</p>}
      {!loading && !loadError && <TaskList tasks={tasks} />}
    </div>
  );
}

export default App;