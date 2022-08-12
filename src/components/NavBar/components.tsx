import cn from "classnames";
import { Fragment } from "react";
import { FaDownload, FaInfoCircle, FaUpload } from "react-icons/fa";
import { EScreen } from "@Src/constants";
import { useDispatch, useSelector } from "@Store/hooks";
import { changeScreen, selectAtScreen, toggleIntro } from "@Store/uiSlice";

export const navButtonStyles = {
  base: "flex items-center font-bold",
  idle: "bg-darkblue-3 hover:text-lightgold",
  active: "bg-darkblue-1 text-orange",
};

export const mobileNavButtonStyles = {
  base: "w-10 h-10 text-2xl",
  idle: "bg-darkblue-3 text-white",
  active: "bg-darkblue-1 text-green",
};

export function IntroButton({ className }: { className?: string }) {
  const dispatch = useDispatch();

  return (
    <button
      className={cn("group", navButtonStyles.base, className)}
      onClick={() => dispatch(toggleIntro(true))}
    >
      <FaInfoCircle className="mr-2 group-hover:text-lightgold" size="1.125rem" />
      <span className="group-hover:text-lightgold">Introduction</span>
    </button>
  );
}

export function renderDownloadButton(className: string, onClick: () => void) {
  return (
    <button className={cn(navButtonStyles.base, navButtonStyles.idle, className)} onClick={onClick}>
      <FaDownload />
      <span className="ml-2">Download</span>
    </button>
  );
}

export function renderUploadButton(className: string, onClick: () => void) {
  return (
    <button className={cn(navButtonStyles.base, navButtonStyles.idle, className)} onClick={onClick}>
      <FaUpload />
      <span className="ml-2">Upload</span>
    </button>
  );
}

interface TabsProps {
  className?: string;
  onClick?: () => void;
}
export function Tabs({ className, onClick }: TabsProps) {
  const atScreen = useSelector(selectAtScreen);
  const dispatch = useDispatch();

  return (
    <Fragment>
      {[
        EScreen.MY_CHARACTERS,
        EScreen.MY_WEAPONS,
        EScreen.MY_ARTIFACTS,
        EScreen.MY_SETUPS,
        EScreen.CALCULATOR,
      ].map((tab, i) => (
        <button
          key={i}
          className={cn(
            "font-bold",
            className,
            navButtonStyles.base,
            tab === atScreen ? navButtonStyles.active : navButtonStyles.idle
          )}
          onClick={() => {
            dispatch(changeScreen(tab));

            if (typeof onClick === "function") {
              onClick();
            }
          }}
        >
          {tab}
        </button>
      ))}
    </Fragment>
  );
}
