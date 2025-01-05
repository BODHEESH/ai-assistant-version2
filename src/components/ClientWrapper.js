'use client';
import { AuthContextProvider } from '@/contexts/AuthContext';
import ThemeInitializer from './ThemeInitializer';
import { Toaster } from 'react-hot-toast';

export default function ClientWrapper({ children }) {
  return (
    <AuthContextProvider>
      <ThemeInitializer />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#059669',
            },
          },
          error: {
            style: {
              background: '#DC2626',
            },
          },
        }}
      />
      {children}
    </AuthContextProvider>
  );
}