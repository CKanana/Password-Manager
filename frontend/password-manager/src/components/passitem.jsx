import React, { useState } from "react";

function PasswordItem({ site, username, password }) {
  const [show, setShow] = useState(false);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    alert("Password copied to clipboard!");
  };

  return (
    <div className="bg-white p-4 rounded shadow-md flex justify-between items-center">
      <div>
        <h3 className="font-bold">{site}</h3>
        <p>{username}</p>
        <p>{show ? password : "••••••••"}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setShow(!show)}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          {show ? "Hide" : "Show"}
        </button>
        <button
          onClick={copyPassword}
          className="bg-gray-500 text-white px-2 py-1 rounded"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

export default PasswordItem;
