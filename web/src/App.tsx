import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { api, ApiError } from './lib/api';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AuthenticatedApp from './AuthenticatedApp';
import { ToastProvider } from './components/Toast';

interface Me {
  username: string;
  role: string;
}

export default function App() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/auth/me')
      .then((data) => {
        setMe(data as Me);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) {
          setMe(null);
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">Memuat…</div>
    );
  }

  if (!me) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <ToastProvider>
      <AuthenticatedApp me={me} />
    </ToastProvider>
  );
}
