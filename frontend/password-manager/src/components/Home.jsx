import React from 'react';
import { Shield, Lock, KeyRound, Fingerprint } from "lucide-react";

export default function HomePage({ goToLogin }) {
  return (
<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 md:px-12 relative overflow-hidden"> {/* Background glow */} <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-black to-black pointer-events-none" />
 <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-700/40 blur-3xl rounded-full" />
  <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/30 blur-3xl rounded-full" />
      {/* Navbar (Fixed at Top) */}
      <nav className="fixed top-0 left-0 w-full bg-black/50 backdrop-blur-lg z-50 border-b border-purple-800/30">
        <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">


          <h1 className="text-2xl text-purple-700 font-bold text--400">PassVault</h1>

          <div className="hidden md:flex gap-6 text-gray-300">
            <a href="#features" className="hover:text-purple-400 transition">Features</a>
         
            <a href="#download" className="hover:text-purple-400 transition">Download</a>
            <a href="#blog" className="hover:text-purple-400 transition">Blog</a>
            <a href="#support" className="hover:text-purple-400 transition">Support</a>
          </div>

          <button
            onClick={goToLogin}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full transition"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mt-36 z-10">
        {/* Left Content */}
        <div className="max-w-lg">
          <h1 className="text-4xl text-white md:text-4xl font-extrabold leading-tight mb-4">
            Your Passwords, <br />
            Secured in One Vault.
          </h1>

          <p className="text-gray-400 text-lg mb-6">
            Simplify your digital life. PassVault keeps your credentials encrypted, 
            synced, and accessible only to you, powered by cutting-edge security and sleek design.
          </p>

          <div className="flex gap-4">
            <button
              onClick={goToLogin}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full font-semibold transition"
            >
              Get Started Free →
            </button>

            <button className="border border-purple-500 text-purple-400 hover:bg-purple-500/10 px-6 py-3 rounded-full font-semibold transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Right-side Icons */}
        <div className="hidden md:flex flex-wrap justify-center gap-6 mt-12 md:mt-0">
          <div className="p-6 bg-purple-900/20 rounded-2xl border border-purple-700/40">
            <Shield size={70} className="text-purple-400" />
          </div>
          <div className="p-6 bg-purple-900/20 rounded-2xl border border-purple-700/40">
            <Lock size={70} className="text-purple-400" />
          </div>
          <div className="p-6 bg-purple-900/20 rounded-2xl border border-purple-700/40">
            <KeyRound size={70} className="text-purple-400" />
          </div>
          <div className="p-6 bg-purple-900/20 rounded-2xl border border-purple-700/40">
            <Fingerprint size={70} className="text-purple-400" />
          </div>
        </div>
      </main>
    </div>
  );
}
