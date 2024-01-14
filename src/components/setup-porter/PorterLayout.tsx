import type { TextareaHTMLAttributes } from "react";
import { CloseButton, ButtonGroup, type ButtonGroupItem } from "@Src/pure-components";

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
    <div className="px-6 pt-4 pb-6 rounded-lg bg-dark-900 shadow-white-glow relative">
      <CloseButton className="absolute top-1 right-1" boneOnly onClick={onClose} />

      <div className="w-75">
        <p className="mb-2 px-2 text-xl text-orange-500 text-center font-bold">{heading}</p>
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

        <ButtonGroup
          className="mt-4"
          buttons={[
            {
              text: "Cancel",
              onClick: onClose,
            },
            ...moreButtons,
          ]}
        />
      </div>
    </div>
  );
};
