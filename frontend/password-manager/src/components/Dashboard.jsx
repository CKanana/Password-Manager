import React, { useState } from "react";
import PasswordItem from "./passitem";
import AddPasswordForm from "./passform";

function Dashboard({ user }) {
  // Hooks must be at the top
  const [passwords, setPasswords] = useState([]);

  // Handle case when user is undefined
  if (!user) return <p>Loading...</p>;

  const addPassword = (entry) => {
    setPasswords([...passwords, entry]);
  };

  return (
    <div className="w-full max-w-3xl p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}</h1>
      <AddPasswordForm addPassword={addPassword} />
      <div className="mt-6 space-y-3">
        {passwords.map((p, i) => (
          <PasswordItem key={i} {...p} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
