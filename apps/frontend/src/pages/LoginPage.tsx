import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { token } = await login(email, password);
      localStorage.setItem("token", token);
      navigate("/search");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl mb-6 text-center">Login</h2>

        <label className="block mb-1">Email</label>
        <input
          type="email"
          className="w-full border border-gray-300 p-2 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-1">Password</label>
        <input
          type="password"
          className="w-full border border-gray-300 p-2 rounded mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
