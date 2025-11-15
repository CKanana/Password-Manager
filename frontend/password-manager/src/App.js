import React, { useState } from "react";
import LoginForm from "./components/Login";
import Dashboard from "./components/Dashboard";
import HomePage from "./components/Home"; 

function App() {
  const [user, setUser] = useState(null);
  const [showHome, setShowHome] = useState(true); // 👈 show Home first

  // Show HomePage initially
  if (showHome) {
return <HomePage goToLogin={() => setShowHome(false)} />;  }

  // Show Login or Dashboard after leaving HomePage
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {user ? (
        <Dashboard user={user} />
      ) : (
        <LoginForm setUser={setUser} />
      )}
    </div>
  );
}

export default App;
