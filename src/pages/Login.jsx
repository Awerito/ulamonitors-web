import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-blush">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border-4 border-black bg-white p-8 shadow-brutal-lg"
      >
        <h1 className="mb-6 text-2xl font-black uppercase">ULA Monitors</h1>
        <label className="mb-1 block text-sm font-bold" htmlFor="username">
          Usuario
        </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mb-4 w-full border-2 border-black bg-white px-3 py-2 focus:bg-pink-100 focus:outline-none"
        />
        <label className="mb-1 block text-sm font-bold" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4 w-full border-2 border-black bg-white px-3 py-2 focus:bg-pink-100 focus:outline-none"
        />
        {error && (
          <p className="mb-4 text-sm font-bold text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={sending}
          className="w-full border-2 border-black bg-pink-300 py-2 font-bold shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
        >
          {sending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
