import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginRequest } from '../utils/api';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await loginRequest(username, password);
      login(response.token, response.expires_in);
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl bg-slate-950/70 p-8 shadow-2xl backdrop-blur"
      >
        <h1 className="text-2xl font-semibold text-white">Ship Tracker Login</h1>
        <p className="mt-2 text-sm text-slate-300">Access real-time vessel positions and activity logs.</p>
        <div className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="text-slate-300">Username</span>
            <input
              type="text"
              value={username}
              onChange={event => setUsername(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
              required
              autoComplete="username"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
              required
              autoComplete="current-password"
            />
          </label>
        </div>
        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-600"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="mt-4 text-xs text-slate-500">Registration is disabled. Contact your administrator for access.</p>
      </form>
    </div>
  );
};

export default LoginForm;
