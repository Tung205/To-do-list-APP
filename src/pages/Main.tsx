// import React, { useState } from "react";
// import Navbar from "../components/Navbar.tsx";
// import TaskForm from "../components/TaskForm.tsx";
// import TaskList from "../components/TaskList.tsx";

// export interface Task {
//   id: number;
//   title: string;
//   deadline: string;
//   completed: boolean;
// }

// const Main: React.FC = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [activeTab, setActiveTab] = useState<string>("add");

//   const addTask = (task: Omit<Task, "id" | "completed">) => {
//     setTasks([...tasks, { ...task, id: Date.now(), completed: false }]);
//   };

//   const toggleComplete = (id: number) => {
//     setTasks(
//       tasks.map((task) =>
//         task.id === id ? { ...task, completed: !task.completed } : task
//       )
//     );
//   };

//   const deleteTask = (id: number) => {
//     setTasks(tasks.filter((task) => task.id !== id));
//   };

//   const updateTask = (id: number, updatedTask: Partial<Task>) => {
//   setTasks((prev) =>
//     prev.map((task) =>
//       task.id === id ? { ...task, ...updatedTask } : task
//       )
//     );
//   };


//   // lọc task theo tab
//   const today = new Date().toLocaleDateString("en-CA"); 
//   console.log(today)
//   let filteredTasks = tasks;
//   if (activeTab === "today") {
//     filteredTasks = tasks.filter(
//       (t) => !t.completed && t.deadline && t.deadline == today
//     );
//   } else if (activeTab === "upcoming") {
//     filteredTasks = tasks.filter(
//       (t) => (!t.completed && t.deadline && t.deadline > today) || (!t.completed && t.deadline === "")
//     );
//   } else if (activeTab === "completed") {
//     filteredTasks = tasks.filter((t) => t.completed);
//   } else if (activeTab === "overdued") {
//     filteredTasks = tasks.filter(
//       (t) => !t.completed && t.deadline && t.deadline < today
//     );
//   }

//   return (
//     <div className="main">
//       <Navbar setActiveTab={setActiveTab} />
//       <h2>Manage Your Tasks</h2>

//       {activeTab === "add" && <TaskForm addTask={addTask} />}
//       {activeTab !== "add" && (
//         <TaskList
//           tasks={filteredTasks}
//           toggleComplete={toggleComplete}
//           deleteTask={deleteTask}
//           updateTask={updateTask}
//         />
//       )}
//     </div>
//   );
// };

// export default Main;

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import type { Task } from "../types";

const API_BASE = "http://localhost:8000/api";

const Main: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<string>("add");
  const token = localStorage.getItem("token") || "";

  // fetch tasks
  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // maybe token expired -> remove and redirect to login
        localStorage.removeItem("token");
        setTasks([]);
        return;
      }
      const data = await res.json();
      // map server _id -> id
      const mapped: Task[] = data.map((t: any) => ({
        id: t._id,
        user_id: t.user_id,
        title: t.title,
        deadline: t.deadline || "",
        completed: t.completed,
      }));
      setTasks(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTask = async (task: Omit<Task, "id" | "completed" | "user_id">) => {
    if (!token) {
      alert("Please login");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: task.title, deadline: task.deadline }),
      });
      if (!res.ok) throw new Error("Add failed");
      const data = await res.json();
      const newTask: Task = {
        id: data.id || data._id,
        user_id: data.user_id,
        title: data.title,
        deadline: data.deadline || "",
        completed: data.completed,
      };
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      console.error(err);
      alert("Add failed");
    }
  };

  const toggleComplete = async (id: string) => {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    const token = localStorage.getItem("token") || "";
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ completed: !t.completed }),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setTasks(prev => prev.map(p => (p.id === id ? { ...p, completed: updated.completed } : p)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: string) => {
    const token = localStorage.getItem("token") || "";
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) {
        setTasks(prev => prev.filter(t => t.id !== id));
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    const token = localStorage.getItem("token") || "";
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, title: data.title, deadline: data.deadline, completed: data.completed } : t)));
    } catch (err) {
      console.error(err);
    }
  };

  // lọc task theo tab
  const today = new Date().toLocaleDateString("en-CA");
  let filteredTasks = tasks;
  if (activeTab === "today") {
    filteredTasks = tasks.filter((t) => !t.completed && t.deadline && t.deadline === today);
  } else if (activeTab === "upcoming") {
    filteredTasks = tasks.filter((t) => (!t.completed && t.deadline && t.deadline > today) || (!t.completed && t.deadline === ""));
  } else if (activeTab === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  } else if (activeTab === "overdued") {
    filteredTasks = tasks.filter((t) => !t.completed && t.deadline && t.deadline < today);
  }

  return (
    <div className="main">
      <Navbar setActiveTab={setActiveTab} />
      <h2>Manage Your Tasks</h2>

      {activeTab === "add" && <TaskForm addTask={addTask} />}
      {activeTab !== "add" && (
        <TaskList
          tasks={filteredTasks}
          toggleComplete={(id) => toggleComplete(id)}
          deleteTask={(id) => deleteTask(id)}
          updateTask={(id, u) => updateTask(id, u)}
        />
      )}
    </div>
  );
};

export default Main;
