import React, { useState } from "react";
import PasswordItem from "./passitem";
import AddPasswordForm from "./passform";

function Dashboard({ user }) {
  const [passwords, setPasswords] = useState([]);

  if (!user) return <p>Loading...</p>;

  const addPassword = (entry) => {
    setPasswords([...passwords, entry]);
  };

  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-start
                    bg-gradient-to-br from-purple-900 via-black to-purple-800
                    text-gray-200 p-6 overflow-hidden">

      {/* Animated Background Glows */}
      <div className="absolute w-[500px] h-[500px] bg-purple-700/40 rounded-full filter blur-3xl 
                      animate-ping-slow top-[-200px] left-[-200px]" />
      <div className="absolute w-[600px] h-[600px] bg-purple-500/30 rounded-full filter blur-3xl 
                      animate-ping-slower bottom-[-300px] right-[-300px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 rounded-full filter blur-3xl 
                      animate-ping-slow top-[150px] right-[-150px]" />

      {/* Dashboard Content */}
      <div className="relative z-10 w-full max-w-4xl mt-10 p-8 rounded-2xl backdrop-blur-xl 
                      bg-black/40 border border-purple-700/40 shadow-lg shadow-purple-800/40">

        <h1 className="text-4xl font-bold text-purple-300 text-center mb-6">
          Welcome, {user.email}
        </h1>

        <AddPasswordForm addPassword={addPassword} />

        <div className="mt-8 space-y-4">
          {passwords.length > 0 ? (
            passwords.map((p, i) => <PasswordItem key={i} {...p} />)
          ) : (
            <p className="text-center text-gray-400 italic">
              No passwords saved yet.
            </p>
          )}
        </div>
      </div>

      {/* Tailwind Custom Animations */}
      <style jsx>{`
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0.4; }
        }
        @keyframes ping-slower {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0.3; }
        }
        .animate-ping-slow { animation: ping-slow 8s infinite; }
        .animate-ping-slower { animation: ping-slower 12s infinite; }
      `}</style>
    </div>
  );
}

export default Dashboard;
