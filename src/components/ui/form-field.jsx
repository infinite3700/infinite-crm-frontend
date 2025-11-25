import React from 'react';
import { Input } from './input';
import { Select } from './select';
import { Label } from './label';
import { cn } from '../../lib/utils';

// Standardized Form Field Component
const FormField = ({ 
  label,
  id,
  type = "text",
  icon: Icon,
  rightIcon: RightIcon,
  size = "default",
  required = false,
  error,
  helpText,
  className,
  labelClassName,
  inputClassName,
  options, // For select fields
  placeholder,
  ...props 
}) => {
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

  const renderInput = () => {
    if (type === 'select' && options) {
      return (
        <div className="relative group">
          {Icon && (
            <Icon className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10",
              currentSize.icon
            )} />
          )}
          <Select
            id={id}
            size={size}
            className={cn(
              currentSize.padding,
              RightIcon && "pr-10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              inputClassName
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          {RightIcon && (
            <RightIcon className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10",
              currentSize.icon
            )} />
          )}
        </div>
      );
    }

    return (
      <div className="relative group">
        {Icon && (
          <Icon className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10",
            currentSize.icon
          )} />
        )}
        <Input
          id={id}
          type={type}
          size={size}
          placeholder={placeholder}
          className={cn(
            currentSize.padding,
            RightIcon && "pr-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            "transition-all duration-300 focus:shadow-colored",
            inputClassName
          )}
          {...props}
        />
        {RightIcon && (
          <RightIcon className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10",
            currentSize.icon
          )} />
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
          htmlFor={id}
          className={cn(
            "text-sm font-semibold text-gray-700",
            required && "after:content-['*'] after:ml-0.5 after:text-red-500",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}
      
      {renderInput()}
      
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="text-xs text-gray-500 mt-1">{helpText}</p>
      )}
    </div>
  );
};

export { FormField };