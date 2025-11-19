import React, { useState } from "react";

function PasswordItem({ site, username, password, onDelete }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      // Attempt to clear clipboard after 3s (browser security may block)
      navigator.clipboard.writeText("");
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-r from-purple-900 to-purple-700 
                    p-4 rounded-2xl shadow-lg border border-purple-500 
                    flex justify-between items-center hover:shadow-purple-600/50 
                    transition duration-300 ease-in-out">
      <div>
        <h3 className="font-bold text-lg text-purple-200">{site}</h3>
        <p className="text-gray-300 text-sm">{username}</p>
        <p className="text-gray-100 text-md tracking-widest mt-1">
          {show ? password : "••••••••"}
        </p>
      </div>

      <div className="flex flex-col gap-2 items-end">
        <div className="flex gap-2">
          <button
            onClick={() => setShow(!show)}
            className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-xl transition-colors"
          >
            {show ? "Hide" : "Show"}
          </button>
          <button
            onClick={copyPassword}
            className="bg-purple-200 hover:bg-black text-black px-3 py-1.5 rounded-xl transition-colors"
          >
            Copy
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl transition-colors"
          >
            Delete
          </button>
        </div>
        {copied && (
          <div className="text-green-400 text-xs mt-1">Copied! Clipboard will clear in 3s.</div>
        )}
      </div>
    </div>
  );
}

export default PasswordItem;
