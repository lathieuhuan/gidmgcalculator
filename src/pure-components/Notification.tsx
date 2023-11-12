import { ReactNode } from "react";
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa";
import { Button } from "./button";

export interface NotificationProps {
  type: "info" | "success" | "error" | "warn";
  content: ReactNode;
  onClose?: () => void;
}
export const Notification = (props: NotificationProps) => {
  const renderIcon = () => {
    switch (props.type) {
      case "info":
        return <FaInfoCircle className="text-dark-500" />;
      case "success":
        return <FaCheckCircle style={{ color: "#2fa80a" }} />;
      case "error":
        return <FaExclamationCircle className="text-red-600" />;
      case "warn":
        return <FaExclamationTriangle className="text-orange" />;
    }
  };

  return (
    <div
      className="w-full p-1 bg-light-400 rounded-lg flex items-start"
      style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px" }}
    >
      <span className="p-2 text-xl shrink-0">{renderIcon()}</span>
      <p className="pr-2 grow text-black font-semibold" style={{ paddingTop: "0.375rem" }}>
        {props.content}
      </p>
      <Button
        className="text-black/60 hover:text-black"
        variant="custom"
        boneOnly
        icon={<FaTimes />}
        onClick={props.onClose}
      />
    </div>
  );
};
