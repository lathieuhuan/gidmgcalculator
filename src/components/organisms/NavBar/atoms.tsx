import clsx from "clsx";
import { FaDownload, FaInfoCircle, FaUpload } from "react-icons/fa";
import { useDispatch } from "@Store/hooks";
import { updateUI } from "@Store/uiSlice";

export const navButtonStyles = {
  base: "flex items-center font-bold",
  idle: "bg-darkblue-3 hover:text-lightgold",
  active: "bg-darkblue-1 text-orange",
};

export const navButtonMobileStyles = {
  base: "w-10 h-10 text-2xl",
  idle: "bg-darkblue-3 text-default",
  active: "bg-darkblue-1 text-green",
};

interface ButtonProps {
  className?: string;
  onClick?: () => void;
}

export function IntroButton({ className }: ButtonProps) {
  const dispatch = useDispatch();

  return (
    <button
      className={clsx("group", navButtonStyles.base, className)}
      onClick={() => dispatch(updateUI({ introOn: true }))}
    >
      <FaInfoCircle className="mr-2 group-hover:text-lightgold" size="1.125rem" />
      <span className="group-hover:text-lightgold">Introduction</span>
    </button>
  );
}

export function DownloadButton({ className, onClick }: ButtonProps) {
  return (
    <button
      className={clsx(navButtonStyles.base, navButtonStyles.idle, className)}
      onClick={onClick}
    >
      <FaDownload />
      <span className="ml-2">Download</span>
    </button>
  );
}

export function UploadButton({ className, onClick }: ButtonProps) {
  return (
    <button
      className={clsx(navButtonStyles.base, navButtonStyles.idle, className)}
      onClick={onClick}
    >
      <FaUpload />
      <span className="ml-2">Upload</span>
    </button>
  );
}
