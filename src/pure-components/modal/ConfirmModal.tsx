import { cloneElement, useRef } from "react";
import { ButtonGroup, ButtonGroupItem } from "../button";
import { withModal } from "./Modal";

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
  bgColor = "bg-dark-500",
  buttons,
  closeOnClickButton = true,
  onClose,
}: ConfirmModalBodyProps) => {
  const messageRef = useRef(cloneElement(<p className="py-2 text-center text-1.5xl text-light-400">{message}</p>));

  const renderedButtons = buttons.map<ButtonGroupItem>((button, index) => {
    const { text, variant, onClick } = button || {};
    const buttonText = text || (index === buttons.length - 1 ? "Confirm" : !index ? "Cancel" : "");

    return {
      text: buttonText,
      variant,
      onClick: () => {
        onClick?.();
        closeOnClickButton && onClose();
      },
    };
  });

  return (
    <div className={"p-4 rounded-lg " + bgColor}>
      {messageRef.current}
      {renderedButtons.length ? (
        <ButtonGroup
          className="mt-4 flex-wrap"
          space={buttons.length > 2 ? "space-x-4" : undefined}
          buttons={renderedButtons}
          autoFocusIndex={buttons.length - 1}
        />
      ) : null}
    </div>
  );
};

export const ConfirmModal = withModal(ConfirmModalBody, { className: "small-modal" });
