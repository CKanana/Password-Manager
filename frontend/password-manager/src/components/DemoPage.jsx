import React from "react";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 md:px-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-black to-black pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-700/40 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/30 blur-3xl rounded-full" />
      <nav className="fixed top-0 left-0 w-full bg-black/50 backdrop-blur-lg z-50 border-b border-purple-800/30">
        <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl text-purple-700 font-bold">PassVault Demo</h1>
        </div>
      </nav>
      <main className="flex flex-col items-center justify-center w-full max-w-3xl mt-36 z-10">
        <h2 className="text-4xl font-bold mb-6 text-purple-400">Demo Features</h2>
        <ul className="space-y-4 text-lg text-gray-200">
          <li className="bg-purple-900/30 rounded-lg px-6 py-4 shadow-lg">🔒 Master Password Unlock</li>
          <li className="bg-purple-900/30 rounded-lg px-6 py-4 shadow-lg">💾 Vault Persistence (Save/Load)</li>
          <li className="bg-purple-900/30 rounded-lg px-6 py-4 shadow-lg">🧮 Password Strength Meter</li>
          <li className="bg-purple-900/30 rounded-lg px-6 py-4 shadow-lg">🗂️ Add, View, Copy, Delete Passwords</li>
          <li className="bg-purple-900/30 rounded-lg px-6 py-4 shadow-lg">⚡ Security Features (Auto-lock, Clipboard Clear)</li>
        </ul>
        <div className="mt-10">
          <a href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-xl font-semibold transition">Back to Home</a>
        </div>
      </main>
    </div>
  );
}
