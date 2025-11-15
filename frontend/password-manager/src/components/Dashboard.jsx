import React, { useState } from "react";
import PasswordItem from "./passitem";
import AddPasswordForm from "./passform";

function Dashboard({ user }) {
  const [passwords, setPasswords] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user) return <p>Loading...</p>;

  const addPassword = (entry) => {
    setPasswords([...passwords, entry]);
    setMessage("Password added!");
    setTimeout(() => setMessage(""), 2000);
  };

  // Export vault as JSON
  const exportVault = () => {
    try {
      const data = JSON.stringify(passwords, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vault.json";
      a.click();
      setMessage("Vault exported!");
      setTimeout(() => setMessage(""), 2000);
    } catch (e) {
      setError("Export failed");
      setTimeout(() => setError(""), 2000);
    }
  };

  // Import vault from JSON
  const importVault = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        if (Array.isArray(imported)) {
          setPasswords(imported);
          setMessage("Vault imported!");
        } else {
          setError("Invalid vault file");
        }
      } catch {
        setError("Import failed");
      }
      setTimeout(() => { setMessage(""); setError(""); }, 2000);
    };
    reader.readAsText(file);
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
      <div className="relative z-10 w-full max-w-4xl mt-10 p-8 rounded-2xl backdrop-blur-xl bg-black/40 border border-purple-700/40 shadow-lg shadow-purple-800/40">
        <h1 className="text-4xl font-bold text-purple-300 text-center mb-6">
          Welcome, {user.email}
        </h1>

        {/* Notifications */}
        {message && <div className="text-green-400 text-center mb-2">{message}</div>}
        {error && <div className="text-red-400 text-center mb-2">{error}</div>}

        {/* Vault Export/Import */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={exportVault}
            className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-full font-semibold shadow-md transition"
          >
            Export Vault
          </button>
          <label className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-full font-semibold shadow-md transition cursor-pointer">
            Import Vault
            <input type="file" accept="application/json" onChange={importVault} className="hidden" />
          </label>
        </div>

        <AddPasswordForm addPassword={addPassword} />

        <div className="mt-8 space-y-4">
          {passwords.length > 0 ? (
            passwords.map((p, i) => <PasswordItem key={i} {...p} />)
          ) : (
            <p className="text-center text-gray-400 italic">No passwords saved yet.</p>
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
