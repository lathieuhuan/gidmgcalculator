import cn from "classnames";
import type { HTMLAttributes, ReactNode } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Button, CloseButton } from "@Styled/Inputs";
import Modal from "./Modal";

export const BetaMark = ({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
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

interface SeeDetailsProps extends HTMLAttributes<HTMLParagraphElement> {
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
  availables?: boolean[];
  variants?: ("positive" | "negative" | "neutral")[];
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

interface StarLineProps {
  className?: string;
  rarity: 4 | 5;
}
export const StarLine = ({ rarity, className }: StarLineProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      {Array(rarity).fill(
        <svg
          viewBox="0 0 24 24"
          className={cn(
            "w-5 h-5",
            rarity === 5 ? "fill-rarity-5" : "fill-rarity-4"
          )}
        >
          <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
        </svg>
      )}
    </div>
  );
};

interface HowToModalProps {
  content: JSX.Element;
  close: () => void;
}
export function HowToModal({ content, close }: HowToModalProps) {
  return (
    <Modal className="p-4" close={close}>
      <CloseButton className="absolute top-3 right-3" onClick={close} />
      <p className="mb-2 text-1.5xl text-orange">HOW-TOs</p>
      {content}
    </Modal>
  );
}
