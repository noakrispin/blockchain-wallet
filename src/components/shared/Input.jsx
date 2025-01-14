import React from 'react';

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`
        w-full p-4 
        bg-green-50/50 
        rounded-full
        border-2 border-green-500 
        placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
        ${className}
      `}
      {...props}
    />
  );
}

