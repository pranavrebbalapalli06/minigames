import { useEffect, useRef, useState } from 'react';
import { auth, storage } from '../lib/api.js';

export default function UserMenu() {
  const [username, setUsername] = useState(storage.getUsername());
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const logout = async () => {
    try {
      await auth.logout();
    } catch {}
    storage.clear();
    setUsername('');
    window.location.reload();
  };

  if (!username) return null;

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} className="bg-white/90 text-black px-3 py-1 rounded-lg shadow">
        {username}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-40 p-2">
          <button onClick={logout} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Logout</button>
        </div>
      )}
    </div>
  );
}
