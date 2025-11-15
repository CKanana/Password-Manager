import React, { useState } from "react";
import LoginForm from "./components/Login";
import Dashboard from "./components/Dashboard";
import HomePage from "./components/Home";
import DemoPage from "./components/DemoPage";
import UnlockVault from "./components/UnlockVault";

function App() {
  const [user, setUser] = useState(null);
  const [showHome, setShowHome] = useState(true);
  const [showDemo, setShowDemo] = useState(false);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);

  // Show HomePage initially
  if (showHome) {
    return (
      <HomePage
        goToLogin={() => setShowHome(false)}
        goToDemo={() => { setShowHome(false); setShowDemo(true); }}
      />
    );
  }

  // Show DemoPage after leaving HomePage, before login/dashboard
  if (showDemo) {
    return <DemoPage />;
  }

  // Show Login, UnlockVault, or Dashboard
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoginForm setUser={setUser} />
      </div>
    );
  }
  if (!vaultUnlocked) {
    return <UnlockVault onUnlock={() => setVaultUnlocked(true)} />;
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Dashboard user={user} />
    </div>
  );
}

export default App;
