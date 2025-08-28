import { useEffect, useState } from 'react';
import AuthModal from './AuthModal.jsx';
import { storage } from '../lib/api.js';

export default function RequireAuth() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!storage.getUsername()) setOpen(true);
  }, []);
  return <AuthModal open={open} onClose={() => setOpen(false)} onAuthenticated={() => setOpen(false)} />;
}
