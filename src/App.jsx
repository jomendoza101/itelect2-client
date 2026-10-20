import { useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Finish GT13", dueDate: "2026-10-21" },
    { id: 2, title: "Review Express routes", dueDate: "2026-10-23" },
    { id: 3, title: "Study for quiz", dueDate: "2026-10-25" },
  ]);

  const addTask = (title) => {
    const newTask = { id: Date.now(), title, dueDate: "No due date" };
    setTasks([...tasks, newTask]);
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm onAddTask={addTask} />
      <TaskList tasks={tasks} />
    </div>
  );
}

export default App;