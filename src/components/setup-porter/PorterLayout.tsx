import type { TextareaHTMLAttributes } from "react";
import { ButtonGroup, Modal, type ButtonGroupItem } from "@Src/pure-components";

interface PorterLayoutProps {
  heading: string;
  message?: {
    text: string;
    type?: "success" | "error";
  };
  textareaAttrs: TextareaHTMLAttributes<HTMLTextAreaElement>;
  moreButtons: ButtonGroupItem[];
  onClose: () => void;
}
export const PorterLayout = ({ heading, message, textareaAttrs, moreButtons, onClose }: PorterLayoutProps) => {
  return (
    <div className="bg-dark-900 relative">
      <Modal.Header>{heading}</Modal.Header>

      <div className="px-4 flex flex-col">
        <textarea className="w-full p-2 text-black rounded resize-none" rows={15} {...textareaAttrs} />

        {message ? (
          <p
            className={
              "mt-2 text-center" +
              (message.type ? (message.type === "success" ? " text-green-300" : " text-red-100") : "")
            }
          >
            {message.text}
          </p>
        ) : null}
      </div>

      <ButtonGroup
        className="p-4"
        justify="end"
        buttons={[
          {
            text: "Cancel",
            onClick: onClose,
          },
          ...moreButtons,
        ]}
      />

      <Modal.CloseButton onClick={onClose} />
    </div>
  );
};
