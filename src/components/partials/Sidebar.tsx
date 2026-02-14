import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Megaphone,
  BookOpen,
  Calendar,
  Archive,
  Wallet,
  Settings,
  ChevronRight,
  UserCircle,
  ListTodo,
  LogOut,
  Users,
  Home,
  BookHeart,
  Image as ImageIcon,
  History
} from 'lucide-react';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/react";
import { useAuth } from '../../hooks/useAuth';

type SidebarProps = {
  role: 'admin' | 'superadmin' | 'super_admin';
  isOpen?: boolean;
  onClose?: () => void;
};

const adminMenu = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Program Kerja', path: '/admin/program', icon: ListTodo },
  { label: 'Pengumuman', path: '/admin/pengumuman', icon: Megaphone },
  { label: 'Keuangan', path: '/admin/keuangan', icon: Wallet },
  { label: 'Data Jemaat', path: '/admin/jemaat', icon: Users },
];

const superAdminMenu = [
  { label: 'Dashboard', path: '/super-admin/dashboard', icon: LayoutDashboard },
  { label: 'Program & Kegiatan', path: '/super-admin/program', icon: ListTodo },
  { label: 'Pengumuman', path: '/super-admin/pengumuman', icon: Megaphone },
  { label: 'Warta', path: '/super-admin/warta', icon: BookOpen },
  { label: 'Agenda', path: '/super-admin/agenda', icon: Calendar },
  { label: 'Arsip Bulanan', path: '/super-admin/arsip', icon: Archive },
  { label: 'Keuangan', path: '/super-admin/keuangan', icon: Wallet },
  { label: 'Renungan', path: '/super-admin/renungan', icon: BookHeart },
  { label: 'Data Jemaat', path: '/super-admin/jemaat', icon: Users },
  { label: 'Carousel', path: '/super-admin/carousel', icon: ImageIcon },
  { label: 'Sejarah Gereja', path: '/super-admin/sejarah', icon: History },
  { label: 'Pengaturan', path: '/super-admin/pengaturan', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ role, isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Close sidebar on route change (mobile)
  React.useEffect(() => {
    if (onClose) onClose();
  }, [location.pathname]);

  const normalizedRole = role === 'super_admin' ? 'super_admin' : (role === 'superadmin' ? 'super_admin' : 'admin');
  const menu = normalizedRole === 'super_admin' ? superAdminMenu : adminMenu;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-80 h-screen bg-white border-r border-slate-100 px-6 py-8 flex flex-col overflow-y-auto custom-scrollbar transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static shadow-2xl lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Mobile Header / Close Button */}
        <div className="flex justify-end lg:hidden mb-2">
          <Button isIconOnly size="sm" variant="light" onPress={onClose}>
            <ChevronRight className="rotate-180" />
          </Button>
        </div>
        {/* Profile Header Redesign - Compact spacing with Dropdown */}
        <div className="flex flex-col mb-8 px-1 flex-shrink-0">
          <Dropdown placement="bottom-start" className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
            <DropdownTrigger>
              <div className="flex items-center gap-4 cursor-pointer group hover:opacity-80 transition-all">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-gmmi-gold to-gmmi-navy rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-gmmi-navy p-3 rounded-2xl shadow-2xl flex items-center justify-center">
                    <UserCircle className="w-7 h-7 text-gmmi-gold" />
                  </div>
                </div>
                <div className="flex flex-col gap-0">
                  <p className="text-[9px] font-black text-gmmi-gold uppercase tracking-[0.3em] leading-none">PORTAL AKUN</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black text-gmmi-navy tracking-tighter">Administrator</p>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile Actions"
              variant="flat"
              itemClasses={{
                base: "rounded-xl py-3 px-4",
                title: "font-black uppercase tracking-widest text-[11px]",
              }}
            >
              <DropdownItem
                key="dashboard"
                startContent={<LayoutDashboard className="w-4 h-4 text-gmmi-navy" />}
                onPress={() => navigate(normalizedRole === 'super_admin' ? '/super-admin/dashboard' : '/admin/dashboard')}
              >
                Dashboard
              </DropdownItem>
              <DropdownItem
                key="home"
                startContent={<Home className="w-4 h-4 text-gmmi-gold" />}
                onPress={() => navigate('/')}
              >
                Beranda Utama
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <div className="mt-5">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/40 shadow-sm backdrop-blur-md ${normalizedRole === 'super_admin' ? 'bg-gmmi-gold/10' : 'bg-blue-50'
              }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${normalizedRole === 'super_admin' ? 'bg-gmmi-gold animate-pulse' : 'bg-blue-500'
                }`}></div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${normalizedRole === 'super_admin' ? 'text-gmmi-gold' : 'text-blue-600'
                }`}>
                {normalizedRole === 'super_admin' ? 'Super Admin Authority' : 'Cabang Administrator'}
              </span>
            </div>
          </div>
        </div>

        <div className="px-3 flex items-center gap-3 mb-4 flex-shrink-0">
          <div className="h-[1px] flex-grow bg-slate-100/50"></div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap">Navigasi Utama</p>
          <div className="h-[1px] flex-grow bg-slate-100/50"></div>
        </div>

        <nav className="flex-grow space-y-2 pr-2">
          {menu.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-4 py-3 px-4 rounded-2xl transition-all duration-500 outline-none ${active
                  ? "bg-slate-50 shadow-sm border border-slate-200/60"
                  : "text-gray-600 hover:bg-gray-50 hover:pl-6"
                  }`}
              >
                {/* Active Marker */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-gmmi-gold rounded-r-full shadow-[2px_0_10px_rgba(212,175,55,0.4)]"></div>
                )}

                <div className={`p-2 rounded-xl transition-all duration-500 ${active ? "bg-gmmi-navy text-gmmi-gold shadow-lg shadow-gmmi-navy/10" : "bg-gray-100 text-gray-500 group-hover:bg-gmmi-gold group-hover:text-white"
                  }`}>
                  <item.icon className="w-4.5 h-4.5" />
                </div>

                <span className={`font-black text-[13px] uppercase tracking-wider transition-colors duration-300 ${active ? "text-gmmi-navy" : "text-gray-700 group-hover:text-gmmi-navy"
                  }`}>
                  {item.label}
                </span>

                {!active && (
                  <ChevronRight className="ml-auto w-3.5 h-3.5 text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Help Card & Logout - Compact bottom section */}
        <div className="mt-auto pt-6 space-y-6 flex-shrink-0 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-300">
              <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
            </div>
            <span className="font-black text-[13px] uppercase tracking-wider text-slate-400 group-hover:text-red-500 transition-colors">Keluar Sesi</span>
          </button>

          <div className="relative p-6 rounded-3xl bg-white text-gray-800 overflow-hidden group shadow-lg border border-gray-100 transition-all duration-500">
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-14 h-14 mb-4 bg-gray-50 rounded-2xl flex items-center justify-center shadow-inner border border-gray-100">
                <Settings className="w-7 h-7 text-gmmi-gold animate-spin-slow" />
              </div>

              <h4 className="text-sm font-black uppercase tracking-widest text-gray-800 mb-2">Butuh Bantuan?</h4>
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed mb-6 px-4">
                Hubungi tim developer untuk kendala teknis
              </p>

              <Button
                as="a"
                href="https://wa.me/6281236927067?text=Halo%20tim%20developer%2C%20saya%20butuh%20bantuan%20terkait%20sistem%20GMMI"
                target="_blank"
                rel="noopener noreferrer"
                size="md"
                className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold uppercase text-[10px] tracking-[0.15em] h-12 rounded-xl shadow-[0_5px_15px_rgba(99,102,241,0.3)] transition-all"
              >
                KONTAK DEVELOPER
              </Button>
            </div>

            <div className="flex flex-col items-center pb-4">
              <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-50/50 backdrop-blur-md border border-slate-100 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Sistem Online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;