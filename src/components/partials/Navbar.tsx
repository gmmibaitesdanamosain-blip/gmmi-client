import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';

// Design Tokens
const NAVY = '#2f3d5f';
const GOLD = '#D4AF37';

const NavItem = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  padding: '0.625rem 1.25rem',
  position: 'relative',
  transition: 'all 0.4s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    color: '#fff',
  },
  '&.active': {
    color: GOLD,
  }
}));

const menuItems = [
  { label: "Beranda", path: "/" },
  { label: "Pewartaan", path: "/pewartaan" },
  { label: "Pengumuman", path: "/pengumuman" },
  { label: "Agenda", path: "/agenda" },
  { label: "Program", path: "/program" },
  { label: "Keuangan", path: "/keuangan" },
  { label: "Renungan", path: "/renungan" },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));



  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: '1rem',
        left: 0,
        right: 0,
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'center',
        px: 2,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        initial={false}
        animate={{
          maxWidth: '1280px',
          width: '100%',
        }}
        transition={{
          duration: 0.7,
          ease: [0.32, 0.72, 0, 1] // cubic-bezier as requested
        }}
        style={{
          pointerEvents: 'auto',
          background: 'rgba(47, 61, 95, 0.8)', // NAVY with 0.8 opacity
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          height: '4.5rem',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
        }}
      >
        {/* Branding & Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
              <img
                src="/img/LOGO GMMI.png"
                alt="Logo GMMI"
                style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }}
              />
              {isActive('/') && (
                <motion.div
                  layoutId="brand-glow"
                  style={{
                    position: 'absolute',
                    inset: -10,
                    background: 'rgba(212, 175, 55, 0.4)', // GOLD glow
                    borderRadius: '50%',
                    filter: 'blur(15px)',
                    zIndex: 0
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.04em',
                  fontFamily: '"Poppins", sans-serif'
                }}
              >
                GMMI
              </Typography>
              <Typography
                sx={{
                  color: GOLD,
                  fontWeight: 700,
                  fontSize: '8px',
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  mt: -0.2
                }}
              >
                Centrum
              </Typography>
            </Box>
          </Link>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {menuItems.map((item) => (
              <NavbarItem
                key={item.label}
                item={item}
                isActive={isActive(item.path)}
              />
            ))}
          </Box>
        )}

        {/* Auth / Mobile Menu Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile ? (
            <IconButton
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              sx={{
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.05)',
                width: 44,
                height: 44,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <Menu size={22} />
            </IconButton>
          ) : (
            <Box sx={{ width: 44 }} /> // Spacing for symmetry
          )}
        </Box>
      </motion.div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <Drawer
            anchor="top"
            open={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            transitionDuration={0}
            PaperProps={{
              sx: {
                background: 'transparent',
                boxShadow: 'none',
                overflow: 'visible',
                pt: 10,
                px: 2,
              }
            }}
            ModalProps={{
              keepMounted: true,
              BackdropProps: { sx: { background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' } }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.5 }}
              style={{
                background: NAVY,
                borderRadius: '3rem',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.6)',
                maxWidth: '440px',
                margin: '0 auto',
                width: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <IconButton
                  onClick={() => setIsMenuOpen(false)}
                  sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}
                >
                  <X size={24} />
                </IconButton>
              </Box>

              <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.08 }}
                  >
                    <ListItem disablePadding>
                      <ListItemButton
                        component={Link}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        sx={{
                          borderRadius: '1.5rem',
                          height: '4.5rem',
                          bgcolor: isActive(item.path) ? GOLD : 'transparent',
                          color: isActive(item.path) ? NAVY : 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            bgcolor: isActive(item.path) ? GOLD : 'rgba(255, 255, 255, 0.05)',
                          },
                          display: 'flex',
                          justifyContent: 'space-between',
                          px: 4,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '1.75rem',
                            fontWeight: 900,
                            tracking: '-0.02em',
                            fontFamily: '"Poppins", sans-serif'
                          }}
                        >
                          {item.label}
                        </Typography>
                        <ArrowUpRight
                          size={24}
                          style={{
                            opacity: isActive(item.path) ? 1 : 0.2,
                            transform: isActive(item.path) ? 'scale(1.2)' : 'scale(1)'
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </motion.div>
                ))}
              </List>

              <Box sx={{ mt: 6, pt: 6, borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {[1, 2, 3].map(i => (
                    <Box key={i} sx={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, opacity: 0.3 }} />
                  ))}
                </Box>
              </Box>

              {/* Background Decoration */}
              <Box sx={{ position: 'absolute', bottom: -60, right: -60, opacity: 0.03, pointerEvents: 'none', rotate: '-15deg' }}>
                <img src="/img/LOGO GMMI.png" alt="" style={{ width: 320, height: 320 }} />
              </Box>
            </motion.div>
          </Drawer>
        )}
      </AnimatePresence>
    </Box>
  );
};

// Sub-component for desktop items to use layoutId for shared element transition
const NavbarItem = ({ item, isActive }: { item: any, isActive: boolean }) => {
  return (
    <NavItem
      to={item.path}
      className={isActive ? 'active' : ''}
    >
      {item.label}
      {isActive && (
        <motion.div
          layoutId="active-nav"
          style={{
            position: 'absolute',
            inset: '0.25rem 0.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '9999px',
            zIndex: -1,
            backdropFilter: 'blur(4px)'
          }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 30
          }}
        />
      )}
    </NavItem>
  );
};

export default Navbar;
