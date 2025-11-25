import * as React from "react"
import { cn } from "../../lib/utils"
import { Input } from "./input"

const FormInput = React.forwardRef(({ 
  className, 
  type, 
  label,
  error,
  icon: Icon, 
  iconPosition = "left",
  rightElement,
  containerClassName,
  labelClassName,
  errorClassName,
  ...props 
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={cn("text-sm font-semibold text-gray-700", labelClassName)}
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && iconPosition === "left" && (
          <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
        )}
        <Input
          id={inputId}
          type={type}
          className={cn(
            Icon && iconPosition === "left" ? "pl-10" : "",
            Icon && iconPosition === "right" ? "pr-10" : "",
            rightElement ? "pr-10" : "",
            error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {Icon && iconPosition === "right" && (
          <Icon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
        )}
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className={cn("text-xs text-red-600", errorClassName)}>
          {error}
        </p>
      )}
    </div>
  );
})

FormInput.displayName = "FormInput"

export { FormInput }