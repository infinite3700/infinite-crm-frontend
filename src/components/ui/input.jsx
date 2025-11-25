import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, size = "default", ...props }, ref) => {
  const sizeClasses = {
    sm: "h-8 px-3 py-1.5 text-sm",
    default: "h-9 px-3 py-2 text-sm", 
    lg: "h-10 px-4 py-2.5 text-base"
  };

  return (
    <input
      type={type}
      className={cn(
        // Base styles with consistent sizing
        "flex w-full rounded-lg border border-gray-300 bg-white/80 backdrop-blur-sm transition-all duration-300",
        sizeClasses[size],
        // Focus styles - consistent across all inputs
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none",
        // File input styles
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Placeholder and hover styles
        "placeholder:text-gray-400 hover:bg-white/90 hover:border-gray-400",
        // Disabled styles
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        // Remove default focus-visible outline
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-0",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Input.displayName = "Input"

export { Input }
