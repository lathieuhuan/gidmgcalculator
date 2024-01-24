import type { ReactNode } from "react";
import { Modal, type ModalControl } from "./Modal";
import { CloseButton } from "../button";

interface StandardModalProps extends ModalControl {
  title: ReactNode;
  bodyClassName?: string;
  children: ReactNode;
}
export const StandardModal = ({
  bodyClassName = "",
  title,
  children,
  closable = true,
  onClose,
  ...rest
}: StandardModalProps) => {
  return (
    <Modal className="px-2 py-4 md1:px-4 flex flex-col" preset="large" {...{ closable, onClose }} {...rest}>
      {closable ? <CloseButton className="absolute top-1 right-1" boneOnly onClick={onClose} /> : null}
      {title}
      <div className={"grow custom-scrollbar " + bodyClassName}>{children}</div>
    </Modal>
  );
};
