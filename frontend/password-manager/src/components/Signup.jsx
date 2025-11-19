import React, { useState } from "react";

function SignupForm({ setUser, goToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("https://password-manager-7p65.onrender.com/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }
      setSuccess("Signup successful! Please log in.");
      setTimeout(() => {
        goToLogin();
      }, 1200);
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSignup} className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-purple-400 mb-4 text-center">Sign Up</h2>
        {error && <div className="text-red-400 text-center mb-2">{error}</div>}
        {success && <div className="text-green-400 text-center mb-2">{success}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-4 rounded-lg bg-black/40 border border-purple-700/40 text-gray-200 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-4 rounded-lg bg-black/40 border border-purple-700/40 text-gray-200 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full font-semibold transition"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <p className="text-center text-gray-400 mt-2">
          Already have an account?{' '}
          <span className="text-purple-400 hover:underline cursor-pointer" onClick={goToLogin}>Log In</span>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;
