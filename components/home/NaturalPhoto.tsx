import Image from "next/image";

interface NaturalPhotoProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}

// 無邊框、無相框陰影，邊緣柔化漸隱以自然融入白色背景，並裁去圖片底部的文字標籤
export function NaturalPhoto({ src, alt, className = "", sizes = "128px" }: NaturalPhotoProps) {
  return (
    <div className={className}>
      <div
        className="relative aspect-square w-full overflow-hidden"
        style={{
          maskImage:
            "radial-gradient(ellipse 72% 72% at 50% 42%, black 50%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 72% 72% at 50% 42%, black 50%, transparent 100%)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: "50% 12%" }}
        />
      </div>
    </div>
  );
}
