'use client';
import ClientWrapper from '@/components/ClientWrapper';
import AIAssistantApp from '../components/AIAssistantApp';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  return (
    <ClientWrapper>
      <ProtectedRoute>
        <AIAssistantApp />
      </ProtectedRoute>
    </ClientWrapper>
  );
}