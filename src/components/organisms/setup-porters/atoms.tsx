import type { ReactNode, TextareaHTMLAttributes } from "react";
import { ButtonBar, type ButtonBarButton } from "@Components/molecules";

interface PorterLayoutProps {
  heading: string;
  message?: ReactNode;
  textareaAttrs: TextareaHTMLAttributes<HTMLTextAreaElement>;
  moreButtons: ButtonBarButton[];
  onClose: () => void;
}
export const PorterLayout = ({
  heading,
  message,
  textareaAttrs,
  moreButtons,
  onClose,
}: PorterLayoutProps) => {
  return (
    <div className="px-6 pt-4 pb-6 rounded-lg bg-darkblue-1 shadow-white-glow">
      <div className="w-75">
        <p className="mb-2 px-2 text-xl text-orange text-center font-bold">{heading}</p>
        <textarea
          className="w-full p-2 text-black rounded resize-none"
          rows={15}
          {...textareaAttrs}
        />

        {message}

        <ButtonBar
          className="mt-4"
          buttons={[{ text: "Cancel", onClick: onClose }, ...moreButtons]}
        />
      </div>
    </div>
  );
};
