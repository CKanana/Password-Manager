import React, { useState } from "react";

function AddPasswordForm({ addPassword }) {
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addPassword({ site, username, password });
    setSite("");
    setUsername("");
    setPassword("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-3 p-6 rounded-2xl backdrop-blur-xl bg-black/40 
                 border border-purple-700/40 shadow-lg shadow-purple-800/30 
                 text-gray-200 transition-all duration-300"
    >
      <input
        type="text"
        placeholder="Site / Service"
        value={site}
        onChange={(e) => setSite(e.target.value)}
        className="flex-1 min-w-[180px] p-3 rounded-lg bg-black/40 border border-purple-700/40 
                   text-gray-200 placeholder-purple-300 focus:outline-none focus:ring-2 
                   focus:ring-purple-500 transition"
        required
      />

      <input
        type="text"
        placeholder="Username / Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="flex-1 min-w-[180px] p-3 rounded-lg bg-black/40 border border-purple-700/40 
                   text-gray-200 placeholder-purple-300 focus:outline-none focus:ring-2 
                   focus:ring-purple-500 transition"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="flex-1 min-w-[180px] p-3 rounded-lg bg-black/40 border border-purple-700/40 
                   text-gray-200 placeholder-purple-300 focus:outline-none focus:ring-2 
                   focus:ring-purple-500 transition"
        required
      />

      <button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-gray-100 px-5 py-3 rounded-lg 
                   font-semibold shadow-md hover:shadow-purple-600/40 transition-all duration-300"
      >
        Add
      </button>
    </form>
  );
}

export default AddPasswordForm;
