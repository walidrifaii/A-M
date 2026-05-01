"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

interface LoginFormValues {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
}) as yup.ObjectSchema<LoginFormValues>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const response = await axios.post(
        'https://api-perfuim-production.up.railway.app/auth/login',
        {
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        // Store JWT token in cookies
        if (response.data.access_token) {
          Cookies.set('access_token', response.data.access_token);
        }
        
        toast.success('Login successful!');
        
        // Redirect to the original destination or dashboard
        const redirectTo = searchParams.get('redirect') || '/dashboard';
        router.push(redirectTo);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          const errorMessage = (error.response.data as { message?: string })?.message;
          toast.error(errorMessage || 'Login failed. Please check your credentials.');
        } else if (error.request) {
          // Request was made but no response received
          toast.error('Network error. Please check your connection.');
        } else {
          // Something else happened
          toast.error('Something went wrong. Please try again.');
        }
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ 
      background: 'linear-gradient(to bottom, var(--background) 0%, hsl(var(--background), 0.95) 100%)'
    }}>
      <Toaster position="top-right" />
      
      {/* Back to home link */}
      <Link 
        href="/" 
        className="font-semibold absolute top-6 left-6 flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
         
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-sm opacity-70">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-[var(--background)] rounded-2xl shadow-xl border border-neutral-200/50 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.email ? 'border-red-300' : 'border-neutral-200/70'
                  } focus:outline-none focus:border-brand-400 bg-[var(--background)] text-[var(--foreground)] transition`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border ${
                    errors.password ? 'border-red-300' : 'border-neutral-200/70'
                  } focus:outline-none focus:border-brand-400 bg-[var(--background)] text-[var(--foreground)] transition`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 hover:text-neutral-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#6f6862]  text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-linear disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
