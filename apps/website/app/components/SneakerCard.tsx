import { useMemo } from "react";
import Pill from "~/components/Pill";
import TrendingValue from "~/components/TrendingValue";
import SneakerImage from "~/components/SneakerImage";
import {Link} from "@remix-run/react";

interface SneakerCardProps {
  title: string;
  retailPrice?: number;
  trend?: "up" | "down";
  trendValue?: string;
  releaseDate?: string | null;
  imageUrl: string;
  slug: string;
}

export default function SneakerCard({
  title,
  retailPrice,
  trend,
  trendValue,
  releaseDate,
  imageUrl,
  slug
}: SneakerCardProps) {
  const releaseDateFormatted = useMemo(() => {
    if (!releaseDate) return "Release Date N/A";
    const date = new Date(releaseDate);
    return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
  }, [releaseDate]);
  return (
    <Link to={`/sneaker/${slug}`} className={"bg-white border border-light-gray rounded-[22px] flex-1"}>
      <div className={"relative h-[217px] border-b border-b-light-gray"}>
        <div className={"flex items-center justify-between p-5 absolute top-0 left-0 z-10"}>
          {trend && trendValue ? (
            <TrendingValue value={trendValue} trend={trend} />
          ) : undefined}
          {retailPrice ? <Pill>${retailPrice}</Pill> : undefined}
        </div>
        <SneakerImage
          src={imageUrl}
          alt={title}
          fill
          className={"object-contain p-5 object-bottom h-full w-full overflow-hidden"}
        />
      </div>
      <div className={"py-[15px] px-5"}>
        <h3 className={"font-bold text-default-black text-lg"}>{title}</h3>
        <span className={"text-medium text-secondary text-[13px]"}>
          {releaseDateFormatted}
        </span>
      </div>
    </Link>
  );
}
