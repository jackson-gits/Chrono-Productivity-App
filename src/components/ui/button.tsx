import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-50";

    // Theme colors
    const darkBrown = "bg-[#4B2E23] text-white hover:bg-[#3A241B]";
    const amberBorder = "border border-[#E6B878] text-[#4B2E23] hover:bg-[#FFF2D6]";
    const amberGhost = "text-[#4B2E23] hover:bg-[#FFECCE]";
    const destructive = "bg-red-600 text-white hover:bg-red-700";

    const variants = {
      default: darkBrown,
      outline: amberBorder,
      ghost: amberGhost,
      destructive: destructive,
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-lg px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
