import { ReactNode } from "react";
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa";

import { IconButton } from "@Components/atoms";

export interface NotificationProps {
  type: "info" | "success" | "error" | "warn";
  content: ReactNode;
  onClose?: () => void;
}
export const Notification = (props: NotificationProps) => {
  const renderIcon = () => {
    switch (props.type) {
      case "info":
        return <FaInfoCircle className="text-darkblue-3" />;
      case "success":
        return <FaCheckCircle style={{ color: "#2fa80a" }} />;
      case "error":
        return <FaExclamationCircle className="text-darkred" />;
      case "warn":
        return <FaExclamationTriangle className="text-orange" />;
    }
  };

  return (
    <div
      className="w-full p-1 bg-default rounded-lg flex"
      style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px" }}
    >
      <span className="p-2 text-xl shrink-0">{renderIcon()}</span>
      <p className="grow text-black" style={{ paddingTop: "0.375rem" }}>
        {props.content}
      </p>
      <IconButton className="text-black text-xl" size="w-8 h-8" variant="custom" boneOnly onClick={props.onClose}>
        <FaTimes />
      </IconButton>
    </div>
  );
};
