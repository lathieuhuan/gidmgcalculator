import { ButtonBar, ButtonBarButton } from "./ButtonBar";

export interface ConfirmModalBodyProps {
  message: string | JSX.Element;
  buttons: (Partial<ButtonBarButton> | undefined | false)[];
  /** Default to true */
  closeOnClickButton?: boolean;
  onClose: () => void;
}
export function ConfirmModalBody({
  message,
  buttons,
  closeOnClickButton = true,
  onClose,
}: ConfirmModalBodyProps) {
  const renderButtons: ButtonBarButton[] = [];

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
    <div className="p-4 rounded-lg bg-darkblue-3">
      <p className="py-2 text-center text-1.5xl text-default">{message}</p>
      <ButtonBar
        className={"mt-4 flex-wrap" + (buttons.length > 2 ? " space-x-4" : "")}
        buttons={renderButtons}
        autoFocusIndex={buttons.length - 1}
      />
    </div>
  );
}
