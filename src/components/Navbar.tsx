// import React from "react";

// interface NavbarProps {
//   setActiveTab: (tab: string) => void;
// }

// const Navbar: React.FC<NavbarProps> = ({ setActiveTab }) => {
//   return (
//     <nav className="navbar">
//       <button onClick={() => setActiveTab("add")}>Add Task</button>
//       <button onClick={() => setActiveTab("overdued")}>Overdue</button>
//       <button onClick={() => setActiveTab("today")}>Today</button>
//       <button onClick={() => setActiveTab("upcoming")}>Upcoming</button>
//       <button onClick={() => setActiveTab("completed")}>Completed</button>
//     </nav>
//   );
// };

// export default Navbar;

import React from "react";

interface NavbarProps {
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setActiveTab }) => {
  return (
    <nav className="navbar">
      <button onClick={() => setActiveTab("add")}>Add Task</button>
      <button onClick={() => setActiveTab("overdued")}>Overdue</button>
      <button onClick={() => setActiveTab("today")}>Today</button>
      <button onClick={() => setActiveTab("upcoming")}>Upcoming</button>
      <button onClick={() => setActiveTab("completed")}>Completed</button>
    </nav>
  );
};

export default Navbar;
