import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Lock, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import axiosInstance from '../../utils/axiosInstance';
import { AppDispatch } from '../../store/store';

const signupSchema = yup.object().shape({
  name: yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Must be a valid 10-digit number').required('Mobile number is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/(?=.*[A-Z])/, 'Must contain at least 1 uppercase letter')
    .matches(/(?=.*[0-9])/, 'Must contain at least 1 number')
    .matches(/(?=.*[!@#$%^&*])/, 'Must contain at least 1 special character')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  terms: yup.boolean().oneOf([true], 'You must accept the terms and conditions')
});

const calculateStrength = (pass: string) => {
  let strength = 0;
  if (pass.length > 7) strength += 1;
  if (/(?=.*[A-Z])/.test(pass)) strength += 1;
  if (/(?=.*[0-9])/.test(pass)) strength += 1;
  if (/(?=.*[!@#$%^&*])/.test(pass)) strength += 1;
  return strength; // 0 to 4
};

const getStrengthDetails = (strength: number) => {
  switch (strength) {
    case 0: return { label: 'Weak', col: 'bg-red-500', w: 'w-1/4', text: 'text-red-500' };
    case 1: return { label: 'Weak', col: 'bg-red-500', w: 'w-1/4', text: 'text-red-500' };
    case 2: return { label: 'Fair', col: 'bg-yellow-500', w: 'w-2/4', text: 'text-yellow-500' };
    case 3: return { label: 'Strong', col: 'bg-green-500', w: 'w-3/4', text: 'text-green-500' };
    case 4: return { label: 'Very Strong', col: 'bg-emerald-600', w: 'w-full', text: 'text-emerald-600' };
    default: return { label: '', col: 'bg-gray-200', w: 'w-0', text: '' };
  }
};

interface SignupFormProps {
  onSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema)
  });

  const passwordValue = watch('password') || '';
  const strength = calculateStrength(passwordValue);
  const strengthDetails = getStrengthDetails(strength);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.post('/auth/register', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password
      });
      dispatch(login({ user: response.data.user, token: response.data.token }));
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMsg && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('name')}
            type="text"
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            placeholder="John Doe"
          />
        </div>
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('email')}
            type="email"
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            placeholder="you@example.com"
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('phone')}
            type="text"
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            placeholder="9876543210"
          />
        </div>
        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
        {passwordValue.length > 0 && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span>Password strength:</span>
              <span className={`font-semibold ${strengthDetails.text}`}>{strengthDetails.label}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className={`h-1.5 rounded-full transition-all duration-300 ${strengthDetails.col} ${strengthDetails.w}`}></div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('confirmPassword')}
            type={showPassword ? 'text' : 'password'}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            placeholder="••••••••"
          />
        </div>
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
      </div>

      <div className="flex items-start">
        <input {...register('terms')} id="terms" type="checkbox" className="mt-1 h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded" />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
          I agree to the <a href="#" className="text-rose-600 hover:underline">Terms of Service</a> and <a href="#" className="text-rose-600 hover:underline">Privacy Policy</a>
        </label>
      </div>
      {errors.terms && <p className="text-sm text-red-500">{errors.terms.message as string}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition flex items-center justify-center font-medium shadow-md disabled:bg-rose-400 mt-2"
      >
        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
      </button>
    </form>
  );
};

export default SignupForm;
