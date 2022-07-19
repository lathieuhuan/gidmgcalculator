import cn from "classnames";
import { useCloseWithEsc } from "@Hooks/useCloseWithEsc";
import { ButtonBar } from "@Components/minors";
import styles from "./styles.module.scss";

interface ModalProps {
  standard?: boolean;
  className?: string;
  children: JSX.Element | JSX.Element[];
  close: () => void;
}
export function Modal(props: ModalProps) {
  useCloseWithEsc(props.close);

  return (
    <div className={cn("fixed full-stretch z-10", styles.modal)}>
      <div className="w-full h-full bg-black/60" onClick={props.close} />
      {props.standard || props.className ? (
        <div className={cn("rounded-lg bg-darkblue-2", styles.modalContent, props.className)}>
          {props.children}
        </div>
      ) : (
        props.children
      )}
    </div>
  );
}

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
export function ConfirmModal({ message, left, mid, right, close }: ConfirmModalProps) {
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
      <div className="p-4 w-[22.5rem] max-w-95 rounded-2xl bg-darkblue-3">
        <div className="py-4">
          <p className="text-center text-1.5xl">{message}</p>
        </div>
        <ButtonBar
          className={cn("mt-4", mid && "gap-4")}
          texts={texts}
          handlers={handlers}
          autoFocusIndex={texts.length - 1}
        />
      </div>
    </Modal>
  );
}
