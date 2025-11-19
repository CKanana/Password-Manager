import React, { useState } from "react";
import LoginForm from "./components/Login";
import SignupForm from "./components/Signup";
import Dashboard from "./components/Dashboard";
import HomePage from "./components/Home";

function App() {
  const [user, setUser] = useState(null);
  const [showHome, setShowHome] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  // Show HomePage initially
  if (showHome) {
    return <HomePage goToLogin={() => setShowHome(false)} />;
  }

  // Show Signup form
  if (showSignup) {
    return <SignupForm setUser={setUser} goToLogin={() => setShowSignup(false)} />;
  }

  // Show Login or Dashboard
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {user ? (
        <Dashboard user={user} />
      ) : (
        <LoginForm setUser={setUser} goToSignup={() => setShowSignup(true)} />
      )}
    </div>
  );
}

export default App;
