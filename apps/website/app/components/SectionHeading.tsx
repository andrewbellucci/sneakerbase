import { HTMLAttributes } from "react";
import clsx from "clsx";

interface SectionHeadingProps extends HTMLAttributes<HTMLHeadingElement> {}
export default function SectionHeading({
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <h2
      className={clsx(
        "text-2xl font-bold mb-2.5 text-default-black",
        className
      )}
      {...props}
    />
  );
}
