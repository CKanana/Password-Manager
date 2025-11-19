import React, { useState } from "react";
import { Key } from "lucide-react";

function LoginForm({ setUser, goToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      setUser(data.user);
      setSuccess("Login successful!");
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  
  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden
                    bg-gradient-to-br from-purple-900 via-black to-purple-800">

      {/* Animated Background */}
      <div className="absolute w-[500px] h-[500px] bg-purple-700/50 rounded-full filter blur-3xl animate-ping-slow top-[-200px] left-[-200px]" />
      <div className="absolute w-[600px] h-[600px] bg-purple-500/40 rounded-full filter blur-3xl animate-ping-slower bottom-[-300px] right-[-300px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600/30 rounded-full filter blur-3xl animate-ping-slow top-[100px] right-[-150px]" />

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 flex flex-col items-center justify-center h-full w-full
                   bg-black/40 backdrop-blur-xl border border-purple-700/40 text-gray-200 p-8 max-w-md"
      >
        <div className="flex items-center justify-center mb-6">
          <Key size={60} className="text-purple-400 animate-bounce-slow" />
        </div>

        <h2 className="text-4xl font-bold text-center mb-4 text-purple-300">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-center text-lg mb-6">
          Log in to your secure PassVault
        </p>
        {error && <div className="text-red-400 text-center mb-4">{error}</div>}
        {success && <div className="text-green-400 text-center mb-4">{success}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 mb-4 rounded-lg bg-black/40 border border-purple-700/40
                     text-gray-200 placeholder-purple-300 focus:outline-none focus:ring-2
                     focus:ring-purple-500 transition"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 mb-6 rounded-lg bg-black/40 border border-purple-700/40
                     text-gray-200 placeholder-purple-300 focus:outline-none focus:ring-2
                     focus:ring-purple-500 transition"
          required
        />

        <button
          type="submit"
          className="w-full max-w-md bg-purple-600 hover:bg-purple-700 text-gray-100 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-600/40"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Log In"}
        </button>

        <p className="text-center text-lg text-gray-400 mt-6">
          Don’t have an account?{" "}
          <span className="text-purple-400 hover:underline cursor-pointer" onClick={goToSignup}>
            Sign Up
          </span>
        </p>
      </form>

      <style>{`
      <style>{`
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0.4; }
        }
        @keyframes ping-slower {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0.3; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-ping-slow { animation: ping-slow 8s infinite; }
        .animate-ping-slower { animation: ping-slower 12s infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
      `}</style>
    </div>
  );
}

export default LoginForm;
