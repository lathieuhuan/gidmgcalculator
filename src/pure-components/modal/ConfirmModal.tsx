import clsx from "clsx";
import { cloneElement, useRef } from "react";
import { ButtonGroup, ButtonGroupItem, ConfirmButtonGroupProps } from "../button";
import { Modal, ModalActionsProps } from "./Modal";
import { ModalControl } from "./ModalCore";
import { PartiallyRequired } from "@Src/types";

// Omit<ConfirmButtonGroupProps, "className" | "justify">

export interface ConfirmModalBodyProps extends Omit<ModalActionsProps, "className" | "justify" | "formId"> {
  message: string | JSX.Element;
  /** Default to 'bg-dark-500' */
  bgColorCls?: string;
}
export const ConfirmModalBody = ({ message, bgColorCls = "bg-dark-500", ...actionsProps }: ConfirmModalBodyProps) => {
  const contentRef = useRef(
    <>
      <p className="py-2 text-center text-xl text-light-400">{message}</p>
      <Modal.Actions justify="center" {...actionsProps} />
    </>
  );
  return <div className={clsx("p-4", bgColorCls)}>{contentRef.current}</div>;
};

export const ConfirmModal = ({
  active,
  onClose,
  onCancel,
  onConfirm,
  ...bodyProps
}: ConfirmModalBodyProps & ModalControl) => {
  return (
    <Modal.Core active={active} preset="small" onClose={onClose}>
      <ConfirmModalBody
        {...bodyProps}
        onCancel={() => {
          onCancel?.();
          onClose();
        }}
        onConfirm={onConfirm}
      />
    </Modal.Core>
  );
};
