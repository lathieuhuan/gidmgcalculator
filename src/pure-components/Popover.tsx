import clsx from "clsx";

interface PopoverPros {
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  active?: boolean;
  withTooltipStyle?: boolean;
  origin?: "bottom-center" | "bottom-right" | "top-left";
  children: React.ReactNode;
}
export const Popover = ({
  className = "",
  as = "span",
  active,
  withTooltipStyle,
  origin = "bottom-center",
  children,
}: PopoverPros) => {
  const Tag = as as keyof JSX.IntrinsicElements;
  const originClasses = {
    "bottom-center": "origin-bottom-center",
    "bottom-right": "origin-bottom-right",
    "top-left": "origin-top-left",
  } as const;

  return (
    <Tag
      className={clsx(
        "absolute transform duration-200 z-10 cursor-default",
        active ? "scale-100" : "scale-0",
        originClasses[origin],
        withTooltipStyle && "bg-black text-light-400 rounded-lg text-sm cursor-default",
        className
      )}
    >
      {children}
    </Tag>
  );
};
