import { ButtonGroup, ButtonGroupItem } from "../button";
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
        className="mt-4 flex-wrap"
        space={buttons.length > 2 ? "space-x-4" : undefined}
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
