import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import OTPVerification from './OTPInput';
import ForgotPassword from './ForgotPassword';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup' | 'forgot-password' | 'otp';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState(initialView);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset view when opened
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setShowSuccess(false);
    }
  }, [isOpen, initialView]);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500); // Auto close after 1.5s
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-md p-6 overflow-hidden bg-white shadow-xl rounded-2xl"
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute p-2 text-gray-400 transition-colors top-4 right-4 hover:bg-gray-100 hover:text-gray-600 rounded-full"
          >
            <X size={20} />
          </button>

          <div className="mt-2 relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {view === 'login' && !showSuccess && (
                <motion.div
                  key="login"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
                  <p className="text-sm text-gray-500 mb-6 font-medium">Please login to continue using Catchy Shop</p>
                  
                  <LoginForm 
                    onSuccess={handleSuccess} 
                    onForgotPassword={() => setView('forgot-password')}
                    onOtpLogin={() => setView('otp')}
                  />
                  
                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <button onClick={() => setView('signup')} className="font-semibold text-rose-500 hover:text-rose-600">
                        Sign up
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {view === 'signup' && !showSuccess && (
                <motion.div
                  key="signup"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>
                  
                  <SignupForm onSuccess={handleSuccess} />

                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <button onClick={() => setView('login')} className="font-semibold text-rose-500 hover:text-rose-600">
                        Login
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {view === 'otp' && !showSuccess && (
                <motion.div
                  key="otp"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Login with Mobile</h2>
                  <OTPVerification onSuccess={handleSuccess} onBack={() => setView('login')} />
                </motion.div>
              )}

              {view === 'forgot-password' && !showSuccess && (
                <motion.div
                  key="forgot-password"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Reset Password</h2>
                  <ForgotPassword onBack={() => setView('login')} />
                </motion.div>
              )}

              {showSuccess && (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-white"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  >
                    <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                  <p className="text-gray-500 mt-2">You are now logged in.</p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
