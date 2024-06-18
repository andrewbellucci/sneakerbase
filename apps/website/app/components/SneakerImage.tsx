import { useState } from "react";
import Image from "remix-image";

interface SneakerImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean
}

const PLACEHOLDER = 'https://cdn.sneakerbase.io/product/placeholder.png'

export default function SneakerImage({ src: defaultSrc, alt, width, height, className }: SneakerImageProps) {
  const [src, setSrc] = useState(() => defaultSrc);

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setSrc(PLACEHOLDER)}
      className={className}
      width={width}
      height={height}
    />
  );
}
