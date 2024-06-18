import Pill from "~/components/Pill";
import TrendingValue from "~/components/TrendingValue";
import SneakerImage from "~/components/SneakerImage";
import {Link} from "@remix-run/react";

interface SneakerRowProps {
  label: string;
  title: string;
  retailPrice: number;
  trend?: "up" | "down";
  trendValue?: string;
  imageUrl: string;
  slug: string;
}

export default function SneakerRow({
  label,
  title,
  retailPrice,
  trend,
  trendValue,
  imageUrl,
  slug
}: SneakerRowProps) {
  return (
    <Link
      to={`/sneaker/${slug}`}
      className={
        "p-[15px] bg-white border border-light-gray rounded-l-[22px] rounded-r-[50px] gap-2 flex items-center justify-between"
      }
    >
      <div
        className={
          "flex-1 flex items-center justify-start gap-2.5 overflow-hidden"
        }
      >
        <div
          className={
            "relative border border-light-gray rounded-[15px] h-[60px] w-[60px] overflow-hidden bg-white"
          }
        >
          <SneakerImage
            src={imageUrl}
            alt={title}
            fill
            className={"object-contain object-center p-[5px]"}
          />
        </div>
        <div className={"flex-1 overflow-hidden"}>
          <h3
            className={"font-bold text-default-black text-lg mb-[5px] truncate"}
          >
            {title}
          </h3>
          <div className={"flex items-center justify-start gap-[5px]"}>
            {trend && trendValue && (
              <TrendingValue value={trendValue} trend={trend} />
            )}
            <Pill>${retailPrice}</Pill>
          </div>
        </div>
      </div>
      <span
        className={
          "h-[60px] w-[60px] border border-light-gray bg-off-white inline-flex items-center justify-center font-bold text-[28px] rounded-full"
        }
      >
        {label}
      </span>
    </Link>
  );
}
