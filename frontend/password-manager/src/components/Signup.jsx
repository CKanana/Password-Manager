import React, { useState } from "react";

function SignupForm({ setUser, goToLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
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
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
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
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="p-4 rounded-lg bg-black/40 border border-purple-700/40 text-gray-200 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition pr-12"
            required
          />
          <span
            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-purple-400"
            onClick={() => setShowPassword((v) => !v)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.175-6.125M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )}
          </span>
        </div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
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
