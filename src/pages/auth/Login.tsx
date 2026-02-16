import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Alert,
  Collapse
} from '@mui/material';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  CloudSun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../hooks/useAuth';

const NAVY = '#2f3d5f';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [greetingIcon, setGreetingIcon] = useState<React.ReactNode>(null);

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 11) {
      setGreeting('Selamat Pagi');
      setGreetingIcon(<Sun size={24} style={{ color: '#fbbf24' }} />);
    } else if (hour >= 11 && hour < 15) {
      setGreeting('Selamat Siang');
      setGreetingIcon(<CloudSun size={24} style={{ color: '#f59e0b' }} />);
    } else if (hour >= 15 && hour < 18) {
      setGreeting('Selamat Sore');
      setGreetingIcon(<CloudSun size={24} style={{ color: '#d97706' }} />);
    } else {
      setGreeting('Selamat Malam');
      setGreetingIcon(<Moon size={24} style={{ color: '#818cf8' }} />);
    }
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (auth.login) {
        await auth.login(email, password);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Kombinasi email dan password salah.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      const role = auth.user.role;
      if (['super_admin', 'superadmin', 'Super Admin'].includes(role)) {
        navigate('/super-admin/dashboard');
      } else if (['admin', 'admin_majelis', 'Admin Majelis'].includes(role)) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [auth.isAuthenticated, auth.user, navigate]);

  return (
    <AuthLayout>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        sx={{
          width: '100%',
          maxWidth: '420px',
          mx: 'auto'
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 5 },
            borderRadius: '2rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 4, width: '100%' }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                bgcolor: '#f8fafc',
                borderRadius: '1.25rem',
                mb: 3
              }}
            >
              {greetingIcon}
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#1e293b',
                fontFamily: '"Poppins", sans-serif',
                mb: 1
              }}
            >
              {greeting}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em'
              }}
            >
              Sistem Portal GMMI
            </Typography>
          </Box>

          {/* Error Message */}
          <Box sx={{ width: '100%', mb: 3 }}>
            <AnimatePresence>
              {error && (
                <Collapse in={!!error}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Alert
                      severity="error"
                      variant="filled"
                      sx={{
                        borderRadius: '1rem',
                        bgcolor: '#fecaca',
                        color: '#991b1b',
                        fontWeight: 600,
                        '& .MuiAlert-icon': { color: '#991b1b' }
                      }}
                    >
                      {error}
                    </Alert>
                  </motion.div>
                </Collapse>
              )}
            </AnimatePresence>
          </Box>

          {/* Form Section */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                placeholder="admin@gmmi.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={18} color="#94a3b8" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    '& fieldset': { borderColor: '#e2e8f0' },
                    '&:hover fieldset': { borderColor: '#cbd5e1 !important' },
                    '&.Mui-focused fieldset': { borderColor: `${NAVY} !important` }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} color="#94a3b8" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: '#94a3b8' }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    '& fieldset': { borderColor: '#e2e8f0' },
                    '&:hover fieldset': { borderColor: '#cbd5e1 !important' },
                    '&.Mui-focused fieldset': { borderColor: `${NAVY} !important` }
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                disabled={isLoading}
                sx={{
                  bgcolor: NAVY,
                  color: 'white',
                  fontWeight: 800,
                  height: '56px',
                  borderRadius: '12px',
                  mt: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 10px 20px rgba(47, 61, 95, 0.2)',
                  '&:hover': {
                    bgcolor: '#1e2947',
                    boxShadow: '0 15px 30px rgba(47, 61, 95, 0.3)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {isLoading ? 'Sedang Masuk...' : 'Masuk ke Sistem Portal'}
              </Button>
            </Box>
          </Box>

          {/* Footer Section */}
          <Box sx={{ mt: 5, borderTop: '1px solid #f8fafc', pt: 3, width: '100%', textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{
                color: '#cbd5e1',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.2em'
              }}
            >
              GMMI CORE ENGINE V3.4.2
            </Typography>
          </Box>
        </Paper>
      </Box>
    </AuthLayout>
  );
};

export default Login;