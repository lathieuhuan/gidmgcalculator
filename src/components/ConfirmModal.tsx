import cn from "classnames";
import { ButtonBar } from "./minors";
import Modal from "./Modal";

interface ButtonInfo {
  text?: string;
  onClick?: () => void;
}
interface ConfirmModalProps {
  message: string | JSX.Element;
  left: ButtonInfo;
  mid?: Required<ButtonInfo>;
  right: ButtonInfo;
  close: () => void;
}
export default function ConfirmModal({
  message,
  left,
  mid,
  right,
  close,
}: ConfirmModalProps) {
  const texts = [left?.text || "Cancel", right?.text || "Confirm"];
  const handlers = [
    () => {
      if (left?.onClick) left.onClick();
      close();
    },
    () => {
      if (confirm) confirm();
      close();
    },
  ];
  if (mid) {
    texts.splice(1, 0, mid.text);
    handlers.splice(1, 0, () => {
      mid.onClick();
      close();
    });
  }
  return (
    <Modal close={close}>
      <div className="p-3 w-[22.5rem] max-w-95 rounded-2xl bg-darkblue-3">
        <div className="py-3">
          <p className="text-center text-1.5xl">{message}</p>
        </div>
        <ButtonBar
          className={cn("mt-3", mid && "gap-4")}
          texts={texts}
          handlers={handlers}
          autoFocusIndex={texts.length - 1}
        />
      </div>
    </Modal>
  );
}
