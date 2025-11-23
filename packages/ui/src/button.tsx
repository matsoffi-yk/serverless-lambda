"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: 'development' | 'production' | 'test' | string;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  
  const handleCLick = () => {
    console.log('appName:', appName);
    fetch(`${process.env.BACKEND_URL}/hello`)
      .then((res) => res.json())
      .then((data) => alert(data.message))
      .catch((error) => {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data from the server.');
      });
  };
  return (
    <button
      className={className}
      onClick={handleCLick}
    >
      {children}
    </button>
  );
};
