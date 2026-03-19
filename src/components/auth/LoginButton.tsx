// src/components/auth/LoginButton.tsx | Version: v2.0.8
'use client';

import React from 'react';
import { useAuth } from './AuthProvider';

export const LoginButton = () => {
  const { user, loading, signInWithGoogle, signInWithGithub, logout } = useAuth();

  const handleLogin = async (provider: 'google' | 'github') => {
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithGithub();
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (loading) return null;

  if (user) {
    return (
      <button 
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Sign Out
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleLogin('google')}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Login with Google
      </button>
      <button 
        onClick={() => handleLogin('github')}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
      >
        Login with GitHub
      </button>
    </div>
  );
};
