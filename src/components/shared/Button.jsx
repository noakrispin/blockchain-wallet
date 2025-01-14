import React from 'react';

export const Button = ({ 
  text, 
  icon: Icon, 
  className = '', 
  onClick, 
  ariaLabel,
  iconColor = 'text-gray-500'  // Added default icon color
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-4 
        flex items-center justify-center space-x-3 
        text-gray-600 hover:text-purple-600 
        border-2 border-gray-200 rounded-lg hover:border-purple-200 
        transition-colors
        ${className}
      `}
      aria-label={ariaLabel}
    >
      {Icon && <Icon className={`w-6 h-6 ${iconColor}`} />}
      <span className="text-lg">{text}</span>
    </button>
  );
};

