import React, { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import axiosInstance from '../../utils/axiosInstance';
import { AppDispatch } from '../../store/store';

interface OTPVerificationProps {
  onSuccess: () => void;
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ onSuccess, onBack }) => {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(phone)) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      await axiosInstance.post('/auth/send-otp', { phone });
      setStep('otp');
      setTimer(30);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to send OTP. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if full
    if (value !== '' && index === 5 && newOtp.every(v => v !== '')) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpCode: string) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.post('/auth/verify-otp', { phone, otp: otpCode });
      dispatch(login({ user: response.data.user, token: response.data.token }));
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setErrorMsg('');
    handleSendOtp({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {errorMsg}
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter your Mobile Number</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg border border-gray-300 focus:ring-rose-500 focus:border-rose-500 text-sm"
                placeholder="9876543210"
                autoFocus
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || phone.length !== 10}
            className="w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition flex items-center justify-center font-medium shadow-md disabled:bg-rose-400"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Get OTP'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Enter the 6-digit OTP sent to</p>
            <p className="font-medium text-gray-900">+91 {phone}</p>
          </div>

          <div className="flex justify-between max-w-xs mx-auto">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => inputRefs.current[index] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-10 md:w-12 md:h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:border-rose-500 focus:ring-rose-500 focus:outline-none transition-colors"
              />
            ))}
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">
              {timer > 0 ? `00:${timer.toString().padStart(2, '0')}` : 'Code expired?'}
            </span>
            <button
              onClick={handleResend}
              disabled={timer > 0 || isLoading}
              className={`font-semibold ${timer > 0 ? 'text-gray-400' : 'text-rose-600 hover:text-rose-700'}`}
            >
              Resend OTP
            </button>
          </div>

          <button
            onClick={() => handleVerifyOtp(otp.join(''))}
            disabled={isLoading || otp.some(v => v === '')}
            className="w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition flex items-center justify-center font-medium shadow-md disabled:bg-rose-400"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verify'}
          </button>
        </div>
      )}

      <div className="text-center mt-6">
        <button onClick={onBack} className="text-sm font-semibold text-gray-600 hover:text-gray-800">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
