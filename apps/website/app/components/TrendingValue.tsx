import TrendingIcon from "./icons/TrendingIcon";
import clsx from "clsx";
import { memo } from "react";

interface TrendingUpProps {
  value: string;
  trend: "up" | "down";
  optimized?: boolean;
}

function TrendingValue({ value, trend, optimized }: TrendingUpProps) {
  return (
    <span
      className={clsx(
        "rounded-full py-[3px] pl-[3px] pr-2 inline-flex items-center justify-start gap-[5px] max-h-[26px]",
        trend === "up" ? "bg-bright-green/[15%]" : "bg-bright-red/[15%]",
        !optimized && "backdrop-blur-lg"
      )}
    >
      <span
        className={clsx(
          "inline-flex items-center justify-center h-5 w-5 rounded-full",
          trend === "up" ? "bg-green" : "bg-red rotate-90"
        )}
      >
        <TrendingIcon />
      </span>
      <span
        className={clsx(
          "text-[13px] font-bold",
          trend === "up" ? "text-green" : "text-red"
        )}
      >
        {value}
      </span>
    </span>
  );
}

export default memo(TrendingValue);
