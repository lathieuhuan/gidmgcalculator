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
    if (!index || index === buttons.length - 1) {
      const { text = index ? "Confirm" : "Cancel", onClick } = button || {};

      renderButtons.push({
        text,
        onClick: () => {
          onClick?.();
          closeOnClickButton && onClose();
        },
      });
    } else if (button) {
      renderButtons.push({
        text: button.text || "",
        onClick: () => {
          button.onClick?.();
          closeOnClickButton && onClose();
        },
      });
    }
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
