import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-indigo-600 text-white",
      secondary: "bg-gray-100 text-gray-900",
      outline: "border border-gray-300 bg-white text-gray-700",
      destructive: "bg-red-100 text-red-700 border-red-200",
    };

    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs transition-colors ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
