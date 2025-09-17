// import React, { useState } from "react";
// import type { Task } from "../pages/Main";

// interface TaskListProps {
//   tasks: Task[];
//   toggleComplete: (id: number) => void;
//   deleteTask: (id: number) => void;
//   updateTask: (id: number, updatedTask: Partial<Task>) => void;
// }

// const TaskList: React.FC<TaskListProps> = ({
//   tasks,
//   toggleComplete,
//   deleteTask,
//   updateTask,
// }) => {
//   const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [editDeadline, setEditDeadline] = useState("");

//   const startEdit = (task: Task) => {
//     setEditingTaskId(task.id);
//     setEditTitle(task.title);
//     setEditDeadline(task.deadline || "");
//   };

//   const handleUpdate = (id: number) => {
//     updateTask(id, { title: editTitle, deadline: editDeadline });
//     setEditingTaskId(null);
//   };

//   if (tasks.length === 0) {
//     return <p>No tasks to show.</p>;
//   }

//   return (
//     <ul>
//       {tasks.map((task) => (
//         <li key={task.id} className="task-item">
//           {editingTaskId === task.id ? (
//           <>
//           <div className="task-left">
//             <input className="task-input"
//               type="text"
//               value={editTitle}
//               onChange={(e) => setEditTitle(e.target.value)}
//             />
//             <input className="task-input"
//               type="date"
//               value={editDeadline}
//               onChange={(e) => setEditDeadline(e.target.value)}
//             />
//           </div>
//           <div className="task-buttons">
//             <button onClick={() => handleUpdate(task.id)}>Save</button>
//             <button onClick={() => setEditingTaskId(null)}>Cancel</button>
//           </div>
//           </>
//           ) : (
//           <>
//           <div className="task-left">
//             <span className="task-title">{task.title}</span>
//             <span className="task-deadline">
//               Deadline: {task.deadline || "No deadline"}
//             </span>
//           </div>
//           <div className="task-buttons">
//             <button onClick={() => toggleComplete(task.id)}>
//             {task.completed ? "Undo" : "Complete"}
//           </button>
//           <button onClick={() => startEdit(task)}>Update</button>
//           <button onClick={() => deleteTask(task.id)}>Delete</button>
//           </div>
//           </>
//           )}
//         </li>

//       ))}
//     </ul>
//   );
// };

// export default TaskList;

import React, { useState } from "react";
import type { Task } from "../types";

interface TaskListProps {
  tasks: Task[];
  toggleComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  toggleComplete,
  deleteTask,
  updateTask,
}) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDeadline(task.deadline || "");
  };

  const handleUpdate = (id: string) => {
    updateTask(id, { title: editTitle, deadline: editDeadline });
    setEditingTaskId(null);
  };

  if (tasks.length === 0) {
    return <p>No tasks to show.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} className="task-item">
          {editingTaskId === task.id ? (
            <>
              <div className="task-left">
                <input className="task-input"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input className="task-input"
                  type="date"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                />
              </div>
              <div className="task-buttons">
                <button onClick={() => handleUpdate(task.id)}>Save</button>
                <button onClick={() => setEditingTaskId(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <div className="task-left">
                <span className="task-title">{task.title}</span>
                <span className="task-deadline">
                  Deadline: {task.deadline || "No deadline"}
                </span>
              </div>
              <div className="task-buttons">
                <button onClick={() => toggleComplete(task.id)}>
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button onClick={() => startEdit(task)}>Update</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
