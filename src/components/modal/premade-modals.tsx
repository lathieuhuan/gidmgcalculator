import type { ReactNode } from "react";

import type { UserArtifact, UserWeapon } from "@Src/types";
import { findDataArtifact, findDataWeapon } from "@Data/controllers";

// Component
import { CloseButton, ButtonGroup, type ButtonGroupItem } from "../button";
import { Modal, type ModalControl } from "./Modal";

export interface ConfirmModalBodyProps {
  message: string | JSX.Element;
  bgColor?: string;
  buttons: (Partial<ButtonGroupItem> | undefined | false)[];
  /** Default to true */
  closeOnClickButton?: boolean;
  onClose: () => void;
}
export const ConfirmModalBody = ({
  message,
  bgColor = "bg-darkblue-3",
  buttons,
  closeOnClickButton = true,
  onClose,
}: ConfirmModalBodyProps) => {
  const renderButtons: ButtonGroupItem[] = [];

  buttons.forEach((button, index) => {
    const { text, variant, onClick } = button || {};
    const buttonText = text || (index === buttons.length - 1 ? "Confirm" : !index ? "Cancel" : "");

    renderButtons.push({
      text: buttonText,
      variant,
      onClick: () => {
        onClick?.();
        closeOnClickButton && onClose();
      },
    });
  });

  return (
    <div className={"p-4 rounded-lg " + bgColor}>
      <p className="py-2 text-center text-1.5xl text-default">{message}</p>
      <ButtonGroup
        className={"mt-4 flex-wrap" + (buttons.length > 2 ? " space-x-4" : "")}
        buttons={renderButtons}
        autoFocusIndex={buttons.length - 1}
      />
    </div>
  );
};

export const ConfirmModal = ({ active, onClose, ...rest }: ModalControl & ConfirmModalBodyProps) => {
  return (
    <Modal active={active} className="small-modal" onClose={onClose}>
      <ConfirmModalBody {...rest} onClose={onClose} />
    </Modal>
  );
};

interface StandardModalProps extends ModalControl {
  title: ReactNode;
  bodyClassName?: string;
  children: ReactNode;
}
export const StandardModal = ({ bodyClassName = "", active, title, children, onClose }: StandardModalProps) => {
  return (
    <Modal className="px-2 py-4 md1:px-4 flex flex-col" withDefaultStyle {...{ active, onClose }}>
      <CloseButton className="absolute top-1 right-1" boneOnly onClick={onClose} />
      {title}
      <div className={"grow custom-scrollbar " + bodyClassName}>{children}</div>
    </Modal>
  );
};

interface WeaponRemoveConfirmProps {
  itemType: "weapon";
  item: UserWeapon;
  onConfirm: () => void;
}
interface ArtifactRemoveConfirmProps {
  itemType: "artifact";
  item: UserArtifact;
  onConfirm: () => void;
}
export const ItemRemoveConfirm = ({
  active,
  item,
  itemType,
  onConfirm,
  onClose,
}: (WeaponRemoveConfirmProps | ArtifactRemoveConfirmProps) & Omit<ModalControl, "state">) => {
  const itemData = itemType === "weapon" ? findDataWeapon(item) : findDataArtifact(item);

  return (
    <ConfirmModal
      active={active}
      message={
        <>
          Remove "<b>{itemData?.name}</b>"?{" "}
          {item.owner ? (
            <>
              It is currently used by <b>{item.owner}</b>.
            </>
          ) : null}
        </>
      }
      buttons={[undefined, { onClick: onConfirm }]}
      onClose={onClose}
    />
  );
};

interface UnderConstructNoticeProps {
  active: boolean;
  onClose: () => void;
}
export const UnderConstructNotice = (props: UnderConstructNoticeProps) => {
  return (
    <ConfirmModal
      message="This feature is under construction. Please come back later."
      buttons={[undefined]}
      {...props}
    />
  );
};
