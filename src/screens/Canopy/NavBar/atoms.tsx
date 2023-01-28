import { ReactNode } from "react";
import { FaDownload, FaInfoCircle, FaQuestionCircle, FaUpload } from "react-icons/fa";

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

interface ActionButtonProps extends ButtonProps {
  icon: ReactNode;
  label: string;
}
const ActionButton = ({ className = "", icon, label, onClick }: ActionButtonProps) => {
  return (
    <button
      className={
        "px-4 py-2 flex items-center font-bold hover:text-default hover:bg-darkblue-1 cursor-default " +
        className
      }
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
};

export const IntroButton = (props: ButtonProps) => {
  return <ActionButton label="Introduction" icon={<FaInfoCircle size="1.125rem" />} {...props} />;
};

export const GuidesButton = (props: ButtonProps) => {
  return <ActionButton label="Guides" icon={<FaQuestionCircle />} {...props} />;
};

export const DownloadButton = (props: ButtonProps) => {
  return <ActionButton label="Download" icon={<FaDownload />} {...props} />;
};

export const UploadButton = (props: ButtonProps) => {
  return <ActionButton label="Upload" icon={<FaUpload />} {...props} />;
};

interface ListProps {
  children: ReactNode;
}

export const ListDecimal = (props: ListProps) => {
  return <ul className="mt-1 pl-4 list-decimal space-y-1" {...props} />;
};

export const ListDisc = (props: ListProps) => {
  return <ul className="mt-1 list-disc list-inside space-y-1" {...props} />;
};
