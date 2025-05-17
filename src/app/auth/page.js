"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../services/auth';

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      router.replace('/app'); // Redirect to app if already authenticated
    }
    setIsLoading(false);
  }, [router]);

  const handleLogin = async (loginData) => {
    try {
      // The login is already handled in AuthLayout
      router.replace('/app'); // Redirect to app after successful login
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGuestMode = () => {
    // Handle guest mode if needed
    router.replace('/app');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthLayout
      onLogin={handleLogin}
      onGuestMode={handleGuestMode}
    />
  );
} 