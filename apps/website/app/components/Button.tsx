import { VariantProps, cva } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

const buttonVariants = cva(
  "font-semibold rounded-[10px] transition-opacity hover:opacity-90",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        secondary: "bg-light-gray text-default-black",
        ghost: "bg-transparent text-default-black",
      },
      size: {
        default: "h-9 px-4 text-sm",
        large: "h-[50px] text-sm px-4"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={clsx(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
