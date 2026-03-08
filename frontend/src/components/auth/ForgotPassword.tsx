import React, { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter a valid email address');
      setStatus('error');
      return;
    }
    
    setStatus('loading');
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      setStatus('success');
      setMessage('A password reset link has been sent to your email address. It is valid for 15 minutes.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Failed to send reset link. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {status === 'success' ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
          <button
            onClick={onBack}
            className="w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition font-medium mt-4"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>

          {status === 'error' && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              {message}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50"
                placeholder="you@example.com"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition flex items-center justify-center font-medium shadow-md disabled:bg-rose-400 mt-2"
          >
            {status === 'loading' ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Reset Link'}
          </button>

          <div className="text-center mt-6">
            <button type="button" onClick={onBack} className="text-sm font-semibold text-gray-600 hover:text-gray-800">
              Back to Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
