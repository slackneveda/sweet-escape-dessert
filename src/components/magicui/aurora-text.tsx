"use client";

import React, { memo } from "react";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

export const AuroraText = memo(
  ({
    children,
    className = "",
    colors,
    speed = 1,
  }: AuroraTextProps) => {
    // Sweet dessert theme colors
    const defaultColors = [
      "#8B4513", // Chocolate brown
      "#CD853F", // Sandy brown/caramel  
      "#DDA0DD", // Plum/berry
      "#F4A460", // Sandy brown
      "#D2691E", // Chocolate
      "#BC8F8F"  // Rosy brown
    ];

    const finalColors = colors || defaultColors;
    
    return (
      <span 
        className={`aurora-text inline-block font-bold ${className}`}
        style={{
          background: `linear-gradient(45deg, ${finalColors.join(", ")})`,
          backgroundSize: "400% 400%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          animation: `aurora ${8 / speed}s ease-in-out infinite`,
          display: "inline-block",
        }}
      >
        {children}
      </span>
    );
  },
);

AuroraText.displayName = "AuroraText";
