import cn from "classnames";
import { useCloseWithEsc } from "@Hooks/useCloseWithEsc";
import styles from "./styles.module.scss";

interface ModalProps {
  standard?: boolean;
  className?: string;
  children: JSX.Element | JSX.Element[];
  close: () => void;
}
export default function Modal(props: ModalProps) {
  useCloseWithEsc(props.close);

  return (
    <div className={cn("fixed full-stretch z-10", styles.modal)}>
      <div className="w-full h-full bg-" onClick={props.close} />
      {props.standard || props.className ? (
        <div
          className={cn(
            "rounded-lg bg-darkblue-2",
            styles.modalContent,
            props.className
          )}
        >
          {props.children}
        </div>
      ) : (
        props.children
      )}
    </div>
  );
}
