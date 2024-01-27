import type { ReactNode } from "react";
import { Modal, type ModalProps } from "./Modal";

interface StandardModalProps extends Pick<ModalProps, "active" | "closable" | "onClose"> {
  title: ReactNode;
  bodyClassName?: string;
  children: ReactNode;
}
export const StandardModal = ({
  bodyClassName = "",
  title,
  children,
  closable = true,
  ...rest
}: StandardModalProps) => {
  return (
    <Modal
      className="px-2 py-4 md1:px-4 flex flex-col"
      preset="large"
      closable={closable}
      withCloseButton={closable}
      {...rest}
    >
      {title}
      <div className={"grow custom-scrollbar " + bodyClassName}>{children}</div>
    </Modal>
  );
};
