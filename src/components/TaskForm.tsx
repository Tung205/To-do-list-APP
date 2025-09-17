// import React, { useState } from "react";
// import type { Task } from "../pages/Main";

// interface TaskFormProps {
//   addTask: (task: Omit<Task, "id" | "completed">) => void;
// }

// const TaskForm: React.FC<TaskFormProps> = ({ addTask }) => {
//   const [title, setTitle] = useState("");
//   const [deadline, setDeadline] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim()) return;
//     addTask({ title, deadline });
//     setTitle("");
//     setDeadline("");
//   };

//   return (
//     <form onSubmit={handleSubmit} className="task-item">
//       <div className="task-left">
//         <input
//           type="text"
//           placeholder="Task title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="task-input"
//         />
//         <input
//           type="date"
//           value={deadline}
//           onChange={(e) => setDeadline(e.target.value)}
//           className="task-input"
//         />
//       </div>
//       <div className="task-buttons">
//         <button type="submit">Add</button>
//       </div>
//     </form>
//   );
// };

// export default TaskForm;

import React, { useState } from "react";
import type { Task } from "../types";

interface TaskFormProps {
  addTask: (task: Omit<Task, "id" | "completed" | "user_id">) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ addTask }) => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title, deadline });
    setTitle("");
    setDeadline("");
  };

  return (
    <form onSubmit={handleSubmit} className="task-item">
      <div className="task-left">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="task-input"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="task-input"
        />
      </div>
      <div className="task-buttons">
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default TaskForm;
