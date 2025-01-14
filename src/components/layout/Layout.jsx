import React from 'react';
import BackgroundIcons from './BackgroundIcons';
import { Navbar } from './Navbar';

export function Layout({ children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 overflow-hidden p-4">
      <BackgroundIcons />
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Gradient Header */}
          <Navbar />
          
          {/* Main Content */}
          {children}
        </div>
      </div>
    </div>
  );
}

