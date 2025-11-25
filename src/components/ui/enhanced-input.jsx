import * as React from "react"
import { Input } from "./input"
import { cn } from "../../lib/utils"

const EnhancedInput = React.forwardRef(({ 
  className, 
  icon: Icon, 
  rightIcon: RightIcon,
  size = "default", 
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: {
      icon: "h-4 w-4",
      padding: Icon ? "pl-10" : "px-3"
    },
    default: {
      icon: "h-4 w-4",
      padding: Icon ? "pl-10" : "px-3"
    },
    lg: {
      icon: "h-5 w-5",
      padding: Icon ? "pl-12" : "px-4"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="relative group">
      {Icon && (
        <Icon className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500 z-10",
          currentSize.icon
        )} />
      )}
      <Input
        className={cn(
          currentSize.padding,
          RightIcon && "pr-10",
          "transition-all duration-300 focus:shadow-colored",
          className
        )}
        size={size}
        ref={ref}
        {...props}
      />
      {RightIcon && (
        <RightIcon className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors z-10",
          currentSize.icon
        )} />
      )}
    </div>
  );
})
EnhancedInput.displayName = "EnhancedInput"

export { EnhancedInput }