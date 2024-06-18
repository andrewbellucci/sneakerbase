import { PropsWithChildren } from "react";
import clsx from "clsx";

interface PillProps extends PropsWithChildren {
  green?: boolean;
}
export default function Pill({ green, children }: PillProps) {
  return (
    <span
      className={clsx(
        "h-[26px] px-2 inline-flex items-center rounded-full text-[13px] font-bold whitespace-nowrap",
        green ? "bg-bright-green/[15%] text-green" : "bg-light-gray text-primary"
      )}
    >
      {children}
    </span>
  );
}
