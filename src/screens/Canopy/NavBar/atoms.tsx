import { ReactNode } from "react";
import { FaDownload, FaInfoCircle, FaUpload } from "react-icons/fa";

interface ButtonProps {
  className?: string;
  onClick?: () => void;
}

interface LoadOptionProps extends ButtonProps {
  children: ReactNode;
}
export const LoadOption = ({ className = "", ...rest }: LoadOptionProps) => {
  return <div className={"pt-2 pb-3 px-4 hover:bg-darkblue-1 " + className} {...rest} />;
};

interface NavButtonProps extends ButtonProps {
  isActive?: boolean;
  children: ReactNode;
}
export const NavButton = ({ className = "", isActive, ...rest }: NavButtonProps) => {
  return (
    <button
      className={
        "flex items-center font-bold " +
        (isActive ? "bg-darkblue-1 text-orange " : "bg-darkblue-3 hover:text-lightgold ") +
        className
      }
      {...rest}
    />
  );
};

export const IntroButton = ({ className = "", onClick }: ButtonProps) => {
  return (
    <NavButton className={"group " + className} onClick={onClick}>
      <FaInfoCircle size="1.125rem" />
      <span className="ml-2">Introduction</span>
    </NavButton>
  );
};

export const DownloadButton = ({ className, onClick }: ButtonProps) => {
  return (
    <NavButton className={className} onClick={onClick}>
      <FaDownload />
      <span className="ml-2">Download</span>
    </NavButton>
  );
};

export const UploadButton = ({ className, onClick }: ButtonProps) => {
  return (
    <NavButton className={className} onClick={onClick}>
      <FaUpload />
      <span className="ml-2">Upload</span>
    </NavButton>
  );
};
