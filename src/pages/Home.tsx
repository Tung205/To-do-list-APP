// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Home: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="home">
//       <h1>Welcome to To-Do App</h1>
//       <button onClick={() => navigate("/app")}>Get Started</button>
//     </div>
//   );
// };

// export default Home;

import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>Welcome to To-Do App</h1>
      <button onClick={() => navigate("/login")}>Log in</button>
      <button onClick={() => navigate("/signup")}>Sign up</button>
    </div>
  );
};

export default Home;

