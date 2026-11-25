import React from 'react';

export interface PinwheelLogoProps {
  size?: number;
  className?: string;
}

export const PinwheelLogo: React.FC<PinwheelLogoProps> = ({
  size = 56,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Suraksha Chakra Pinwheel Logo"
      role="img"
    >
      {/* 4 Petals: Black (Top), Green (Right), Red (Bottom), Blue (Left) */}
      {/* Top Petal - Black */}
      <path
        d="M50 50 C40 30, 30 15, 50 5 C60 15, 60 35, 50 50 Z"
        fill="#1A2420"
      />
      {/* Right Petal - Green */}
      <path
        d="M50 50 C70 40, 85 30, 95 50 C85 60, 65 60, 50 50 Z"
        fill="#0F5C3A"
      />
      {/* Bottom Petal - Red */}
      <path
        d="M50 50 C60 70, 70 85, 50 95 C40 85, 40 65, 50 50 Z"
        fill="#C62828"
      />
      {/* Left Petal - Blue */}
      <path
        d="M50 50 C30 60, 15 70, 5 50 C15 40, 35 40, 50 50 Z"
        fill="#1E6FD9"
      />
      {/* White center circle with gold/brand border */}
      <circle cx="50" cy="50" r="11" fill="#FFFFFF" stroke="#0F5C3A" strokeWidth="2.5" />
      {/* Inner center dot */}
      <circle cx="50" cy="50" r="4" fill="#0F5C3A" />
    </svg>
  );
};
