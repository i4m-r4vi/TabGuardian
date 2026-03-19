"use client";
import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export default function Logo({ size = "md" }: LogoProps) {
  const containerSizes = {
    sm: "w-10 h-10 rounded-xl",
    md: "w-12 h-12 rounded-full",
    lg: "w-20 h-20 rounded-3xl",
  };

  const pillSizes = {
    sm: "w-6 h-3 border-[1.5px]",
    md: "w-8 h-4 border-2",
    lg: "w-12 h-6 border-4",
  };

  return (
    <div className={`relative flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300 ${containerSizes[size]}`}>
      {/* Realistic Two-Toned Pill */}
      <div className={`relative ${pillSizes[size]} rotate-45 flex rounded-full overflow-hidden border-gray-100 shadow-sm group-hover:rotate-[225deg] transition-transform duration-700`}>
        <div className="w-1/2 h-full bg-blue-500"></div>
        <div className="w-1/2 h-full bg-white"></div>
      </div>
      {/* Shadow effect */}
      <div className={`absolute bottom-2 bg-black/5 blur-sm rounded-full ${size === 'lg' ? 'w-10 h-1.5' : 'w-6 h-1'}`}></div>
    </div>
  );
}
