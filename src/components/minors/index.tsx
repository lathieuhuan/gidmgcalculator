import clsx from "clsx";
import type { ReactNode } from "react";

import { Modal, ModalControl } from "@Components/modals";
import { findCharacter } from "@Data/controllers";
import { ButtonBar, CloseButton } from "@Src/styled-components";
import type { Vision, WeaponType } from "@Src/types";
import { getImgSrc } from "@Src/utils";

interface SharedSpaceProps {
  className?: string;
  leftPart: ReactNode;
  rightPart: ReactNode;
  atLeft: boolean;
}
export function SharedSpace({ className, leftPart, rightPart, atLeft }: SharedSpaceProps) {
  const childClassNames = [
    "absolute top-0 w-full h-full duration-200 ease-linear",
    atLeft ? "translate-x-0" : "-translate-x-full",
  ];
  return (
    <div className={clsx("relative w-full h-full overflow-hidden", className)}>
      <div className={clsx(childClassNames, "left-0")}>{leftPart}</div>
      <div className={clsx(childClassNames, "left-full")}>{rightPart}</div>
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
      className={clsx(
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

export const renderNoItems = (type: string) => (
  <div className="w-full pt-8 flex-center">
    <p className="text-xl font-bold text-lightred">No {type} to display</p>
  </div>
);

interface InfusionNotesProps {
  weaponType: WeaponType;
  vision: Vision;
}
export function InfusionNotes({ vision, weaponType }: InfusionNotesProps) {
  // let notes: [string, AttackElement][] =
  //   weaponType === "catalyst"
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

  if (weaponType === "bow") {
    notes[1][0] = "AS";
    notes.splice(2, 0, ["CAS", vision]);
  }

  return (
    <div className="mt-2 pr-2">
      <p className="text-lg text-lightgold">Notes:</p>

      {notes.map(([attPatt, attElmt], i) => {
        return (
          <p key={i} className="mt-1">
            <b>{attPatt}</b> deal{" "}
            <span className={clsx(attElmt === "phys" ? "text-default" : `text-${attElmt}`)}>
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
      {/* <ButtonBar
        className={clsx("mt-4 flex-wrap", mid && "space-x-4")}
        texts={texts}
        handlers={handlers}
        autoFocusIndex={texts.length - 1}
      /> */}
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
