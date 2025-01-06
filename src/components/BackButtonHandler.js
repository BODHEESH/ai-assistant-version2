'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function BackButtonHandler({ activeTab, setActiveTab }) {
  const router = useRouter();
  const tabHistoryRef = useRef(['home']);
  
  useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
      
      if (tabHistoryRef.current.length > 1) {
        // Remove current tab
        tabHistoryRef.current.pop();
        // Get previous tab
        const previousTab = tabHistoryRef.current[tabHistoryRef.current.length - 1];
        if (typeof setActiveTab === 'function') {
          setActiveTab(previousTab);
        }
      }
      
      // Push current state to prevent browser default back behavior
      window.history.pushState(null, '', window.location.pathname);
    };
    
    // Update tab history when activeTab changes
    if (activeTab && activeTab !== tabHistoryRef.current[tabHistoryRef.current.length - 1]) {
      tabHistoryRef.current.push(activeTab);
    }
    
    // Push initial state
    window.history.pushState(null, '', window.location.pathname);
    
    // Listen for popstate event (back button)
    window.addEventListener('popstate', handleBackButton);
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [activeTab, setActiveTab]);
  
  return null;
}