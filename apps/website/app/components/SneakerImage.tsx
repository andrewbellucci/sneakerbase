import { useState } from "react";

interface SneakerImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean
}

export default function SneakerImage({ src: dSrc, alt, width, height, fill, className }: SneakerImageProps) {
  const [src, setSrc] = useState(dSrc);

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      // onError={() => setSrc('/images/placeholder.png')}
      // blurDataURL={'/images/placeholder.png'}
      // placeholder={'blur'}
    />
  );
}
