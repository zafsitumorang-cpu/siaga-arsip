import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { api, ApiError } from './lib/api';
import Login from './pages/Login';
import Layout from './components/Layout';

interface Me {
  username: string;
  role: string;
}

function BerandaPlaceholder() {
  return <h1 className="text-xl font-bold text-slate-800">Beranda</h1>;
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
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route element={<Layout username={me.username} />}>
        <Route path="/" element={<BerandaPlaceholder />} />
      </Route>
    </Routes>
  );
}
