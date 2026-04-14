import Image from "next/image";
import clsx from "clsx";

type PostImageProps = {
  imageProps: React.ComponentProps<typeof Image>;
  imageHeight?: "full" | number;
};

export function PostImage({
  imageProps,
  imageHeight = "full",
}: PostImageProps) {
  return (
    <div
      className={clsx(
        "w-full",
        `${imageHeight === "full" ? "h-full" : `h-[${imageHeight}rem]`}`,
        "overflow-hidden",
        "rounded-2xl",
      )}
    >
      <Image
        {...imageProps}
        className={clsx(
          "w-full",
          "h-full",
          "object-cover",
          "object-center",
          "group-hover:scale-105",
          "transition",
          "duration-500",
          imageProps.className,
        )}
        width={1200}
        height={720}
        alt={imageProps.alt}
      />
    </div>
  );
}
