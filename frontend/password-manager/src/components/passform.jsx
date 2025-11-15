import React, { useState } from "react";

function AddPasswordForm({ addPassword }) {
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);

  // Simple strength meter (length + variety)
  function calculateStrength(pw) {
    let score = 0;
    if (pw.length > 7) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setStrength(calculateStrength(val));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPassword({ site, username, password });
    setSite("");
    setUsername("");
    setPassword("");
    setStrength(0);
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


      <div className="flex flex-col flex-1 min-w-[180px]">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className="p-3 rounded-lg bg-black/40 border border-purple-700/40 text-gray-200 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        />
        <div className="mt-2 w-full">
          <div className={`h-2 rounded-full transition-all duration-300 ${strength === 0 ? 'bg-gray-700' : strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-yellow-500' : strength === 3 ? 'bg-blue-500' : 'bg-green-500'}`}></div>
          <div className="text-xs text-purple-300 mt-1">
            {strength === 0 && 'Enter a password'}
            {strength === 1 && 'Weak'}
            {strength === 2 && 'Medium'}
            {strength === 3 && 'Strong'}
            {strength === 4 && 'Very Strong'}
          </div>
        </div>
      </div>

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
