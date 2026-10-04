import { Navigate, Route, Routes } from 'react-router-dom';
import Beranda from './pages/Beranda';
import DaftarArsip from './pages/DaftarArsip';
import UploadArsip from './pages/UploadArsip';
import DetailArsip from './pages/DetailArsip';
import Laporan from './pages/Laporan';
import Layout from './components/Layout';

interface Me {
  username: string;
  role: string;
}

export default function AuthenticatedApp({ me }: { me: Me }) {
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route element={<Layout username={me.username} />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/arsip" element={<DaftarArsip />} />
        <Route path="/arsip/:id" element={<DetailArsip />} />
        <Route path="/upload" element={<UploadArsip />} />
        <Route path="/laporan" element={<Laporan />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
