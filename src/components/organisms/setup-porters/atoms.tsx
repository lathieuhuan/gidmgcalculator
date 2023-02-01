import type { ReactNode, TextareaHTMLAttributes } from "react";
import { ButtonBar, type ButtonBarButton } from "@Components/molecules";
import { CloseButton } from "@Components/atoms";

interface PorterLayoutProps {
  heading: string;
  message?: {
    text: string;
    type?: "success" | "error";
  };
  textareaAttrs: TextareaHTMLAttributes<HTMLTextAreaElement>;
  moreButtons: ButtonBarButton[];
  autoFocusButtonIndex?: number;
  onClose: () => void;
}
export const PorterLayout = ({
  heading,
  message,
  textareaAttrs,
  moreButtons,
  autoFocusButtonIndex,
  onClose,
}: PorterLayoutProps) => {
  return (
    <div className="px-6 pt-4 pb-6 rounded-lg bg-darkblue-1 shadow-white-glow relative">
      <CloseButton className="absolute top-1 right-1" boneOnly onClick={onClose} />

      <div className="w-75">
        <p className="mb-2 px-2 text-xl text-orange text-center font-bold">{heading}</p>
        <textarea
          className="w-full p-2 text-black rounded resize-none"
          rows={15}
          {...textareaAttrs}
        />

        {message ? (
          <p
            className={
              "mt-2 text-center" +
              (message.type
                ? message.type === "success"
                  ? " text-green"
                  : " text-lightred"
                : "")
            }
          >
            {message.text}
          </p>
        ) : null}

        <ButtonBar
          className="mt-4"
          autoFocusIndex={autoFocusButtonIndex}
          buttons={[{ text: "Cancel", onClick: onClose }, ...moreButtons]}
        />
      </div>
    </div>
  );
};
