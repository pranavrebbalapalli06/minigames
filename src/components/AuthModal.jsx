import { useState } from 'react';
import { auth, storage } from '../lib/api.js';

export default function AuthModal({ open, onClose, onAuthenticated }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState(storage.getUsername() || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await auth.register(username, password);
      } else {
        await auth.login(username, password);
      }
      storage.setUsername(username);
      onAuthenticated?.(username);
      onClose?.();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">{mode === 'register' ? 'Create account' : 'Sign in'}</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter unique username"
              minLength={3}
              maxLength={50}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter password"
              minLength={6}
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-purple-700 underline"
            >
              {mode === 'login' ? 'Create new account' : 'Already have an account? Sign in'}
            </button>
            <div className="space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button disabled={loading} type="submit" className="px-4 py-2 rounded-lg bg-purple-700 text-white">
                {loading ? 'Please wait...' : (mode === 'login' ? 'Sign in' : 'Register')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
