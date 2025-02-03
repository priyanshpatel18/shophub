interface IProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function Image({ src, alt, className = "", width, height }: IProps) {
  return (
    <picture className={className}>
      <img src={src} alt={alt} className={className} width={width} height={height} />
    </picture>
  );
}
