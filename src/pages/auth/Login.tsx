import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import {
  Input,
  Button,
  Checkbox,
  Alert
} from "@heroui/react";
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

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [greetingIcon, setGreetingIcon] = useState<React.ReactNode>(null);

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) {
      setGreeting('Selamat Pagi');
      setGreetingIcon(<Sun className="w-6 h-6 text-amber-400 animate-spin-slow" />);
    } else if (hour < 15) {
      setGreeting('Selamat Siang');
      setGreetingIcon(<CloudSun className="w-6 h-6 text-orange-400" />);
    } else if (hour < 18) {
      setGreeting('Selamat Sore');
      setGreetingIcon(<CloudSun className="w-6 h-6 text-orange-300" />);
    } else {
      setGreeting('Selamat Malam');
      setGreetingIcon(<Moon className="w-6 h-6 text-indigo-400 animate-pulse" />);
    }
  }, []);

  const toggleVisibility = () => setIsVisible(!isVisible);

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

  // Use useEffect to navigate when user state changes
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      const role = auth.user.role;
      // Normalize role checking to handle variations
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[420px] mx-auto"
      >
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Minimalist Header */}
            <header className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center justify-center p-3 bg-slate-50 rounded-2xl mb-6"
              >
                {greetingIcon}
              </motion.div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                {greeting}
              </h1>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
                Portalis Kepegawaian
              </p>
            </header>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-6"
                >
                  <Alert
                    color="danger"
                    variant="flat"
                    className="rounded-xl"
                    description={error}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Input
                  type="email"
                  label="Email Kepegawaian"
                  placeholder="admin@gmmi.org"
                  labelPlacement="outside"
                  variant="bordered"
                  size="lg"
                  radius="lg"
                  startContent={<Mail className="text-slate-400 w-4 h-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isRequired
                  classNames={{
                    label: "text-slate-600 font-semibold text-xs",
                    inputWrapper: "border-slate-200 hover:border-slate-300 focus-within:!border-gmmi-navy shadow-none h-12 transition-colors",
                    input: "text-sm"
                  }}
                />
              </div>

              <div className="space-y-2">
                <Input
                  label="Kode Akses"
                  placeholder="••••••••"
                  labelPlacement="outside"
                  variant="bordered"
                  size="lg"
                  radius="lg"
                  startContent={<Lock className="text-slate-400 w-4 h-4" />}
                  endContent={
                    <button className="focus:outline-none text-slate-400 hover:text-slate-600 transition-colors" type="button" onClick={toggleVisibility}>
                      {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isRequired
                  classNames={{
                    label: "text-slate-600 font-semibold text-xs",
                    inputWrapper: "border-slate-200 hover:border-slate-300 focus-within:!border-gmmi-navy shadow-none h-12 transition-colors",
                    input: "text-sm"
                  }}
                />
              </div>

              <div className="flex justify-between items-center pt-1">
                <Checkbox
                  size="sm"
                  radius="sm"
                  classNames={{
                    label: "text-slate-500 text-xs font-medium",
                  }}
                >
                  Ingat saya
                </Checkbox>
                <Link to="/forgot-password" className="text-xs font-semibold text-gmmi-navy hover:underline">
                  Lupa password?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                radius="lg"
                color="primary"
                className="w-full bg-gmmi-navy text-white font-bold h-12 mt-4 shadow-lg shadow-gmmi-navy/20 hover:shadow-xl hover:shadow-gmmi-navy/30 transition-all"
                isLoading={isLoading}
              >
                Masuk ke Sistem
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-center">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                GMMI Core Engine v3.4.2
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;