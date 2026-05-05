import React from 'react';

/**
 * BaseCard Component
 * Implements Inheritance pattern - base component for all cards
 */
interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export class BaseCard extends React.Component<BaseCardProps> {
  render() {
    const { children, className = '', onClick, hover = true } = this.props;
    
    const baseClasses = 'bg-white rounded-xl shadow-md border border-gray-200 p-6';
    const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
    const clickClasses = onClick ? 'cursor-pointer' : '';
    
    return (
      <div 
        className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
}

// Functional version for modern React
export const BaseCardFC: React.FC<BaseCardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hover = true 
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-md border border-gray-200 p-6';
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  const clickClasses = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
