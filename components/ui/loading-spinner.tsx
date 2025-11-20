"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "primary" | "secondary";
  className?: string;
}

export const LoadingSpinner = ({
  size = "md",
  variant = "primary",
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const variantClasses = {
    default: "border-border",
    primary: "border-primary",
    secondary: "border-secondary",
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer ring - slowest */}
      <div
        className={`absolute inset-0 rounded-full border-4 border-t-transparent ${variantClasses[variant]} animate-spin`}
        style={{
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
          animationDuration: "1.2s",
        }}
      />

      {/* Middle ring - medium speed, reverse */}
      <div
        className={`absolute inset-2 rounded-full border-4 border-t-transparent ${variantClasses[variant]} animate-spin`}
        style={{
          animationDirection: "reverse",
          animationDuration: "0.9s",
          opacity: 0.7,
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
        }}
      />

      {/* Inner ring - fastest */}
      <div
        className={`absolute inset-4 rounded-full border-3 border-t-transparent ${variantClasses[variant]} animate-spin`}
        style={{
          animationDuration: "0.6s",
          opacity: 0.5,
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
          borderWidth: "3px",
        }}
      />

      {/* Center dot - pulsing */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${variantClasses[variant]} animate-pulse`}
        style={{
          backgroundColor: "currentColor",
          opacity: 0.8,
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
