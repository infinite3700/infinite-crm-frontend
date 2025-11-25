import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "../../lib/utils"

const Select = React.forwardRef(({ className, children, size = "default", ...props }, ref) => {
  const sizeClasses = {
    sm: "h-8 px-3 py-1.5 text-sm",
    default: "h-9 px-3 py-2 text-sm",
    lg: "h-10 px-4 py-2.5 text-base"
  };

  return (
    <select
      className={cn(
        // Base styles with consistent sizing
        "flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white/80 backdrop-blur-sm transition-all duration-300",
        sizeClasses[size],
        // Focus styles - consistent with inputs
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none",
        // Hover styles
        "hover:bg-white/90 hover:border-gray-400",
        // Disabled styles
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        // Appearance
        "appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcgMTFMMiA2SDE5TDcgMTFaIiBmaWxsPSIjNjM2MzYzIi8+Cjwvc3ZnPgo=')] bg-no-repeat bg-[position:right_12px_center] pr-10",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
})

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    className={cn(
      "relative z-50 min-w-[8rem] overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-950 shadow-lg animate-in fade-in-0 zoom-in-95",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </div>
))

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <option
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-3 pr-8 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </option>
))

Select.displayName = "Select"
SelectContent.displayName = "SelectContent" 
SelectItem.displayName = "SelectItem"

export { Select, SelectContent, SelectItem }