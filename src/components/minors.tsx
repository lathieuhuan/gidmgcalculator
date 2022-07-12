import type { HTMLAttributes, ReactNode } from "react";
import { FaInfoCircle } from "react-icons/fa";
import cn from "classnames";
import { CalcArtSet } from "@Src/types";
import { Button, CloseButton } from "@Styled/Inputs";
import { findArtifactSet, findCharacter } from "@Data/controllers";
import { wikiImg } from "@Src/utils";
import Modal from "./Modal";

export const BetaMark = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
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
  className?: string;
  active?: boolean;
  selfHover?: boolean;
}
export const InfoSign = (props: InfoSignProps) => {
  if (props.active) {
    return <CloseButton className={cn("h-6 w-6 text-sm", props.className)} />;
  }
  return (
    <div
      className={cn(
        "h-6 w-6 text-2xl",
        !props.selfHover && "group-hover:text-lightgold",
        props.className
      )}
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
          variants[i] || (i ? (i === texts.length - 1 ? "positive" : "neutral") : "negative");
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
  rarity: number;
}
export const StarLine = ({ rarity, className }: StarLineProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      {Array(rarity).fill(
        <svg
          viewBox="0 0 24 24"
          className={cn("w-5 h-5", rarity === 5 ? "fill-rarity-5" : "fill-rarity-4")}
        >
          <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
        </svg>
      )}
    </div>
  );
};

interface SharedSpaceProps {
  leftPart: ReactNode;
  rightPart: ReactNode;
  atLeft: boolean;
}
export function SharedSpace({ leftPart, rightPart, atLeft }: SharedSpaceProps) {
  const className = cn(
    "absolute top-0 w-full h-full duration-200 ease-linear",
    atLeft ? "translate-x-0" : "-translate-x-full"
  );
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className={cn(className, "left-0")}>{leftPart}</div>
      <div className={cn(className, "left-full")}>{rightPart}</div>
    </div>
  );
}

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

interface CharFilledSlotProps {
  name: string;
  mutable: boolean;
  onClick: () => void;
  onRemove: () => void;
}
export function CharFilledSlot({ name, mutable, onClick, onRemove }: CharFilledSlotProps) {
  const { icon } = findCharacter({ name })!;
  return (
    <>
      <div className="zoomin-on-hover overflow-hidden rounded-full bg-darkblue-3">
        <img
          className={cn("w-full rounded-[inherit]", mutable && "cursor-pointer")}
          src={wikiImg(icon)}
          alt={name}
          draggable={false}
          onClick={onClick}
        />
      </div>
      {mutable && <CloseButton className="absolute -bottom-1 -right-2.5" onClick={onRemove} />}
    </>
  );
}

interface SetBonusProps {
  sets: CalcArtSet[];
}
export function SetBonus({ sets }: SetBonusProps) {
  return (
    <div>
      <p className="text-lg leading-relaxed text-orange font-bold">Set Bonus</p>

      {sets.length > 0 ? (
        sets.map(({ code, bonusLv }, index) => {
          const content = [];
          const artData = findArtifactSet({ code })!;

          for (let i = 0; i <= bonusLv; i++) {
            const { desc } = artData.setBonuses[i];
            content.push(
              <li key={i} className="mt-1">
                <span className="text-orange">{(i + 1) * 2}-Piece Set:</span> <span>{desc}</span>
              </li>
            );
          }
          return (
            <div key={index} className="mt-1">
              <p className="text-lg leading-relaxed font-bold text-green">{artData.name}</p>
              <ul className="pl-4">{content}</ul>
            </div>
          );
        })
      ) : (
        <p className="text-lesser font-bold">No Set Bonus</p>
      )}
    </div>
  );
}
