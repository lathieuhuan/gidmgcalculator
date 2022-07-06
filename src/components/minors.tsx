import { Button, CloseButton } from "@Styled/Inputs";
import cn from "classnames";
import type { InsHTMLAttributes } from "react";
import { FaInfoCircle } from "react-icons/fa";

export const BetaMark = ({
  className,
  ...rest
}: InsHTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded px-1 bg-white text-red-500 border-2 border-red-500 text-xs font-bold",
      className
    )}
    {...rest}
  >
    BETA
  </div>
);

interface InfoSignProps {
  active?: boolean;
  selfHover?: boolean;
}
export const InfoSign = (props: InfoSignProps) => {
  if (props.active) {
    return <CloseButton className="h-6 w-6 text-sm" />;
  }
  return (
    <div
      className={cn("h-6 w-6 text-2xl", {
        "group-hover:text-lightgold": !props.selfHover,
      })}
    >
      <FaInfoCircle />
    </div>
  );
};

interface SeeDetailsProps extends InsHTMLAttributes<HTMLParagraphElement> {
  active?: boolean;
}
export const SeeDetails = (props: SeeDetailsProps) => {
  const { className, active, ...rest } = props;
  return (
    <p
      className={cn(
        "text-white cursor-pointer hover:text-lightgold",
        active && "text-green",
        className
      )}
      {...rest}
    >
      See details
    </p>
  );
};

interface ButtonBarProps {
  className?: string;
  texts: string[];
  availables: boolean[];
  variants: ("positive" | "negative" | "neutral")[];
  handlers: (() => void)[];
  autoFocusIndex: number;
}
export const ButtonBar = ({
  className,
  texts,
  availables,
  variants = [],
  handlers,
  autoFocusIndex,
}: ButtonBarProps) => {
  return (
    <div className={cn("flex justify-center gap-8", className)}>
      {texts.map((text, i) => {
        const variant =
          variants[i] ||
          (i ? (i === texts.length - 1 ? "positive" : "neutral") : "negative");
        return (
          <Button
            key={i}
            className="focus:shadow-[0_0_2px_2px_black,_0_0_2px_4px_white]"
            disabled={availables && !availables[i]}
            variant={variant}
            onClick={handlers[i]}
            autoFocus={i === autoFocusIndex}
          >
            {text}
          </Button>
        );
      })}
    </div>
  );
};
