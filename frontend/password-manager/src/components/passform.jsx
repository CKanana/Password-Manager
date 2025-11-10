import React, { useState } from "react";

function AddPasswordForm({ addPassword }) {
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addPassword({ site, username, password });
    setSite(""); setUsername(""); setPassword("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow-md flex gap-3"
    >
      <input
        type="text"
        placeholder="Site/Service"
        value={site}
        onChange={(e) => setSite(e.target.value)}
        className="flex-1 p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Username/Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="flex-1 p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="flex-1 p-2 border rounded"
        required
      />
      <button type="submit" className="bg-green-500 text-white px-3 rounded">
        Add
      </button>
    </form>
  );
}

export default AddPasswordForm;
