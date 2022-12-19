import { CloseButton } from "@Components/atoms";
import {
  ConfirmModalBody,
  Modal,
  type ConfirmModalBodyProps,
  type ModalControl,
} from "@Components/molecules";

export function ConfirmModal({ active, onClose, ...rest }: ModalControl & ConfirmModalBodyProps) {
  return (
    <Modal active={active} className="small-modal" onClose={onClose}>
      <ConfirmModalBody {...rest} onClose={onClose} />
    </Modal>
  );
}

interface TipsModalProps extends ModalControl {
  children: JSX.Element;
}
export function TipsModal({ active, children, onClose }: TipsModalProps) {
  return (
    <Modal active={active} className="p-4" withDefaultStyle onClose={onClose}>
      <CloseButton className="absolute top-3 right-3" onClick={onClose} />
      <p className="mb-2 text-1.5xl text-orange font-bold">Tips</p>
      {children}
    </Modal>
  );
}
