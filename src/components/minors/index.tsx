import type { HTMLAttributes, ReactNode } from "react";
import cn from "classnames";
import { FaInfoCircle } from "react-icons/fa";

import type { CalcArtSet, Vision, Weapon } from "@Src/types";
import { findArtifactSet, findCharacter } from "@Data/controllers";
import { round3, getImgSrc } from "@Src/utils";
import { Green, Button, CloseButton } from "@Src/styled-components";
import { Modal, ModalControl } from "@Components/modals";

export const BetaMark = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded px-1 bg-white text-red-500 border-2 border-red-500 text-xs font-bold cursor-default",
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
  onClick?: () => void;
}
export const InfoSign = (props: InfoSignProps) => {
  if (props.active) {
    return <CloseButton className={cn("h-6 w-6 text-sm", props.className)} />;
  }
  return (
    <button
      className={cn(
        "h-6 w-6 text-2xl block rounded-circle",
        props.selfHover ? "hover:text-lightgold" : "group-hover:text-lightgold",
        props.className
      )}
      onClick={props.onClick}
    >
      <FaInfoCircle />
    </button>
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
        "cursor-pointer",
        active ? "text-green" : "text-default hover:text-lightgold",
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
  disabled?: boolean[];
  variants?: ("positive" | "negative" | "neutral" | "default")[];
  handlers: (() => void)[];
  autoFocusIndex?: number;
}
export const ButtonBar = ({
  className,
  texts,
  disabled = [],
  variants = [],
  handlers,
  autoFocusIndex,
}: ButtonBarProps) => {
  return (
    <div
      className={cn(
        "flex justify-center",
        !className?.includes("space-x-") && "space-x-8",
        className
      )}
    >
      {texts.map((text, i) => {
        const variant =
          variants[i] || (i ? (i === texts.length - 1 ? "positive" : "neutral") : "negative");
        return (
          <Button
            key={i}
            className="button-focus-shadow"
            disabled={disabled[i]}
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
      {[...Array(rarity)].map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={cn("w-5 h-5", rarity === 5 ? "fill-rarity-5" : "fill-rarity-4")}
        >
          <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
        </svg>
      ))}
    </div>
  );
};

interface SharedSpaceProps {
  className?: string;
  leftPart: ReactNode;
  rightPart: ReactNode;
  atLeft: boolean;
}
export function SharedSpace({ className, leftPart, rightPart, atLeft }: SharedSpaceProps) {
  const childClassName = cn(
    "absolute top-0 w-full h-full duration-200 ease-linear",
    atLeft ? "translate-x-0" : "-translate-x-full"
  );
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <div className={cn(childClassName, "left-0")}>{leftPart}</div>
      <div className={cn(childClassName, "left-full")}>{rightPart}</div>
    </div>
  );
}

interface TipsModalProps extends ModalControl {
  content: JSX.Element;
}
export function TipsModal({ active, content, onClose }: TipsModalProps) {
  return (
    <Modal active={active} className="p-4" withDefaultStyle onClose={onClose}>
      <CloseButton className="absolute top-3 right-3" onClick={onClose} />
      <p className="mb-2 text-1.5xl text-orange font-bold">TIPs</p>
      {content}
    </Modal>
  );
}

interface CharFilledSlotProps {
  className?: string;
  name: string;
  onClickIcon?: () => void;
}
export function CharacterPortrait({ className, name, onClickIcon }: CharFilledSlotProps) {
  const { code, icon } = findCharacter({ name })!;
  // for the traveler
  const bgColorByCode: Record<number, string> = {
    1: "bg-anemo",
    12: "bg-geo",
    46: "bg-electro",
    57: "bg-dendro",
  };

  return (
    <div
      className={cn(
        `zoomin-on-hover overflow-hidden rounded-circle ${bgColorByCode[code] || "bg-darkblue-3"}`,
        className
      )}
    >
      <img
        className="w-full rounded-circle"
        src={getImgSrc(icon)}
        alt={name}
        draggable={false}
        onClick={onClickIcon}
      />
    </div>
  );
}

interface SetBonusProps {
  noTitle?: boolean;
  sets: CalcArtSet[];
}
export function SetBonus({ noTitle, sets }: SetBonusProps) {
  return (
    <div>
      {noTitle ? null : <p className="text-lg leading-relaxed text-orange font-bold">Set Bonus</p>}

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
              <ul className="pl-6 list-disc">{content}</ul>
            </div>
          );
        })
      ) : (
        <p className="text-lesser font-bold">No Set Bonus</p>
      )}
    </div>
  );
}

export const renderModifiers = (
  modifiers: JSX.Element[],
  isBuff: boolean,
  mutable: boolean = true
) => {
  return modifiers.length ? (
    <div className={mutable ? "pt-2 space-y-3" : "space-y-2"}>{modifiers}</div>
  ) : (
    <p className="pt-6 pb-4 text-center">No {isBuff ? "buffs" : "debuffs"} found</p>
  );
};

export const renderNoItems = (type: string) => (
  <div className="w-full pt-8 flex-center">
    <p className="text-h5 font-bold text-lightred">No {type} to display</p>
  </div>
);

export const renderAmpReactionDesc = (element: Vision, mult: number) => (
  <>
    Increases <span className={`text-${element} capitalize`}>{element} DMG</span> by{" "}
    <Green b>{round3(mult)}</Green> times.
  </>
);

export const renderQuickenDesc = (element: Vision, value: number) => (
  <>
    Increase base <span className={`text-${element} capitalize`}>{element} DMG</span> by{" "}
    <Green b>{value}</Green>.
  </>
);

interface InfusionNotesProps {
  weapon: Weapon;
  vision: Vision;
}
export function InfusionNotes({ vision, weapon }: InfusionNotesProps) {
  // let notes: [string, AttackElement][] =
  //   weapon === "catalyst"
  //     ? [
  //         ["NA", vision],
  //         ["CA", vision],
  //         ["PA", vision],
  //       ]
  //     : Object.entries(infusion);

  let notes = [
    ["NA", vision],
    ["CA", vision],
    ["PA", vision],
  ];

  if (weapon === "bow") {
    notes[1][0] = "AS";
    notes.splice(2, 0, ["CAS", vision]);
  }

  return (
    <div className="mt-2 pr-2">
      <p className="text-h6 text-lightgold">Notes:</p>

      {notes.map(([attPatt, attElmt], i) => {
        return (
          <p key={i} className="mt-1">
            <b>{attPatt}</b> deal{" "}
            <span className={cn(attElmt === "phys" ? "text-default" : `text-${attElmt}`)}>
              {attElmt} DMG
            </span>
            .
          </p>
        );
      })}
    </div>
  );
}

interface ButtonInfo {
  text?: string;
  onClick?: () => void;
}
interface ConfirmTemplateProps {
  message: string | JSX.Element;
  left?: ButtonInfo;
  mid?: Required<ButtonInfo>;
  right: ButtonInfo;
  onClose: () => void;
}
export function ConfirmTemplate({ message, left, mid, right, onClose }: ConfirmTemplateProps) {
  const texts = [left?.text || "Cancel", right?.text || "Confirm"];
  const handlers = [
    () => {
      if (left?.onClick) left.onClick();
      onClose();
    },
    () => {
      if (right.onClick) right.onClick();
      onClose();
    },
  ];
  if (mid) {
    texts.splice(1, 0, mid.text);
    handlers.splice(1, 0, () => {
      mid.onClick();
      onClose();
    });
  }

  return (
    <div className="p-4 rounded-lg bg-darkblue-3">
      <p className="py-2 text-center text-1.5xl text-default">{message}</p>
      <ButtonBar
        className={cn("mt-4 flex-wrap", mid && "space-x-4")}
        texts={texts}
        handlers={handlers}
        autoFocusIndex={texts.length - 1}
      />
    </div>
  );
}

export function ConfirmModal({ active, onClose, ...rest }: ModalControl & ConfirmTemplateProps) {
  return (
    <Modal active={active} className="small-modal" onClose={onClose}>
      <ConfirmTemplate {...rest} onClose={onClose} />
    </Modal>
  );
}
