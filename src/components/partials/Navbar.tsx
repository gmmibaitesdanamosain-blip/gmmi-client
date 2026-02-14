import React, { useEffect, useState } from 'react';
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,

} from "@heroui/react";
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const { user, isAuthenticated } = useAuth();


  const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/super-admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const menuItems = [
    { label: "Beranda", path: "/" },
    { label: "Pewartaan", path: "/pewartaan" },
    { label: "Pengumuman", path: "/pengumuman" },
    { label: "Agenda", path: "/agenda" },
    { label: "Program & Kegiatan", path: "/program" },
    { label: "Keuangan", path: "/keuangan" },
    { label: "Renungan", path: "/renungan" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed top-4 inset-x-0 z-[100] flex justify-center px-4 pointer-events-none">
      <HeroNavbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        maxWidth="full"
        className={`transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-auto rounded-[2rem] border overflow-hidden ${isScrolled || isDashboard || isMenuOpen
          ? "bg-gmmi-navy/90 backdrop-blur-xl shadow-2xl border-white/10"
          : "bg-gmmi-navy/60 backdrop-blur-lg border-white/5"
          } ${isScrolled ? "w-full max-w-5xl md:max-w-7xl lg:max-w-7xl" : "w-full max-w-7xl"}`}
        height="4.5rem"
      >
        <NavbarContent justify="start">
          <NavbarBrand>
            <Link to="/" className="flex items-center gap-3">
              <div className="relative shrink-0 w-10 h-10 flex items-center justify-center">
                <img
                  src="/img/LOGO%20GMMI.png"
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
                {isActive('/') && (
                  <motion.div
                    layoutId="brand-glow"
                    className="absolute -inset-2 bg-gmmi-gold/30 rounded-full blur-lg -z-10"
                  />
                )}
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-black text-xl tracking-tighter">GMMI</span>
                <span className="text-gmmi-gold font-bold text-[9px] tracking-[0.4em] uppercase pl-0.5">Centrum</span>
              </div>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden lg:flex gap-1 xl:gap-4" justify="center">
          {!isDashboard && menuItems.map((item) => (
            <NavbarItem key={item.label}>
              <Link
                to={item.path}
                className={`px-2 xl:px-5 py-2.5 text-[10px] xl:text-xs font-bold uppercase tracking-wider xl:tracking-widest transition-all duration-300 relative group ${isActive(item.path) ? "text-gmmi-gold" : "text-white/70 hover:text-white"
                  }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end" className="gap-2 sm:gap-4">
          <NavbarItem>
            {isAuthenticated && user && (
              /* User profile dropdown removed for security as requested */
              <></>
            )}
          </NavbarItem>
          <NavbarMenuToggle
            icon={isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            className="lg:hidden text-white w-10 h-10 flex items-center justify-center bg-white/5 rounded-full"
          />
        </NavbarContent>

        <NavbarMenu className="bg-transparent backdrop-blur-none pt-24 px-4 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-sm bg-gmmi-navy border border-white/10 rounded-[3rem] shadow-2xl p-6 flex flex-col gap-2 overflow-hidden relative"
          >
            <div className="flex flex-col gap-1 relative z-10">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border border-transparent ${isActive(item.path)
                      ? "bg-gmmi-gold text-gmmi-navy shadow-lg shadow-gmmi-gold/20"
                      : "text-white/60 hover:text-white hover:bg-white/5 hover:border-white/5"
                      }`}
                  >
                    <span className="text-xl font-black tracking-tight">{item.label}</span>
                    <ArrowUpRight size={18} className={isActive(item.path) ? "opacity-100" : "opacity-20"} />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-4 relative z-10">
              <div className="flex justify-center gap-2 opacity-20">
                <span className="w-1 h-1 bg-white rounded-full" />
                <span className="w-1 h-1 bg-white rounded-full" />
                <span className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Huge Abstract Branding */}
            <div className="absolute -bottom-10 -right-10 opacity-[0.03] select-none pointer-events-none">
              <img src="/img/LOGO GMMI.png" alt="" className="w-60 h-60 grayscale" />
            </div>
          </motion.div>
        </NavbarMenu>
      </HeroNavbar >
    </div >
  );
};


export default Navbar;
