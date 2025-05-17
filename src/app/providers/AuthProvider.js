'use client';

import { useEffect } from 'react';
import useStore from '../store/useStore';

export default function AuthProvider({ children }) {
  const initializeAuth = useStore(state => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return children;
} 