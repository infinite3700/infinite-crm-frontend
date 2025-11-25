import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 shadow-sm",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-blue-600 underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg",
      },
      size: {
        sm: "h-9 px-3 py-2 text-sm",
        default: "h-10 px-4 py-2 text-sm",
        lg: "h-11 px-6 py-3 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
