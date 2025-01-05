'use client';
import { AuthContextProvider } from '@/contexts/AuthContext';

export default function ClientWrapper({ children }) {
  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  );
}
