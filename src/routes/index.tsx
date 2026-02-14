import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Pewartaan from "../pages/Pewartaan";
import PewartaanDetail from "../pages/PewartaanDetail";
import Pengumuman from "../pages/Pengumuman";
import Agenda from "../pages/Agenda";
import ProgramKegiatan from "../pages/ProgramKegiatan";
import ProgramDetail from "../pages/ProgramDetail";
import Renungan from "../pages/Renungan";
import RenunganDetail from "../pages/RenunganDetail";
import Keuangan from "../pages/Keuangan";
import NotFound from "../pages/NotFound";

import AdminLayout from "../layouts/AdminLayout";
import SuperAdminLayout from "../layouts/SuperAdminLayout";

import ProtectedRoute from "../components/auth/ProtectedRoute";

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminPengumuman from "../pages/admin/Pengumuman";
import AdminWarta from "../pages/admin/Warta";
import AdminJadwal from "../pages/admin/Jadwal";
import AdminArsip from "../pages/admin/Arsip";

// Super Admin pages
import SuperAdminDashboard from "../pages/super-admin/Dashboard";
import SuperAdminPengumuman from "../pages/super-admin/Pengumuman";
import SuperAdminWarta from "../pages/super-admin/Warta";
import SuperAdminArsip from "../pages/super-admin/Arsip";
import SuperAdminKeuangan from "../pages/super-admin/Keuangan";
import SuperAdminPengaturan from "../pages/super-admin/Pengaturan";
import SuperAdminAgenda from "../pages/super-admin/Agenda";
import SuperAdminProgram from "../pages/super-admin/Program";
import SuperAdminPewartaanInput from "../pages/super-admin/SuperAdminPewartaanInput";
import SuperAdminRenungan from "../pages/super-admin/Renungan";
import SuperAdminCarousel from "../pages/super-admin/Carousel";
import JemaatManagement from "../pages/super-admin/JemaatManagement";
import SejarahManagement from "../pages/super-admin/SejarahManagement";
import Home from "../Home";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      {/* <Route path="/" element={<Navigate to="/pewartaan" replace />} /> */}
      <Route path="/pewartaan" element={<Pewartaan />} />
      <Route path="/pewartaan/:id" element={<PewartaanDetail />} />
      <Route path="/pengumuman" element={<Pengumuman />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/program" element={<ProgramKegiatan />} />
      <Route path="/program/:bidang" element={<ProgramDetail />} />
      <Route path="/renungan" element={<Renungan />} />
      <Route path="/renungan/:id" element={<RenunganDetail />} />
      <Route path="/keuangan" element={<Keuangan />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole={["admin", "admin_majelis"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="pengumuman" element={<AdminPengumuman />} />
        <Route path="warta" element={<AdminWarta />} />
        <Route path="jadwal" element={<AdminJadwal />} />
        <Route path="arsip" element={<AdminArsip />} />
        <Route path="keuangan" element={<SuperAdminKeuangan />} />
        <Route path="jemaat" element={<JemaatManagement />} />
        <Route path="program" element={<SuperAdminProgram />} />
      </Route>

      {/* Super Admin Routes */}
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute requiredRole="super_admin">
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Navigate to="/super-admin/dashboard" replace />}
        />
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="pengumuman" element={<SuperAdminPengumuman />} />
        <Route path="warta" element={<SuperAdminWarta />} />
        <Route path="arsip" element={<SuperAdminArsip />} />
        <Route path="keuangan" element={<SuperAdminKeuangan />} />
        <Route path="agenda" element={<SuperAdminAgenda />} />
        <Route path="program" element={<SuperAdminProgram />} />
        <Route path="renungan" element={<SuperAdminRenungan />} />
        <Route path="pengaturan" element={<SuperAdminPengaturan />} />
        <Route path="pewartaan-input" element={<SuperAdminPewartaanInput />} />
        <Route
          path="pewartaan-input/:id"
          element={<SuperAdminPewartaanInput />}
        />
        <Route path="carousel" element={<SuperAdminCarousel />} />
        <Route path="jemaat" element={<JemaatManagement />} />
        <Route path="sejarah" element={<SejarahManagement />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
