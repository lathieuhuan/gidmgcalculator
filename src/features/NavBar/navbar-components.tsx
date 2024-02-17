import clsx from "clsx";
import type { ReactNode } from "react";

import { EScreen } from "@Src/constants";
import { useSelector } from "@Store/hooks";

interface ActionButtonProps {
  className?: string;
  icon: ReactNode;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}
export const ActionButton = ({ className = "", icon, label, disabled, onClick }: ActionButtonProps) => {
  return (
    <button
      className={clsx(
        "px-4 py-2 flex items-center font-bold cursor-default",
        disabled ? "text-light-800" : "hover:text-light-400 hover:bg-dark-900",
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
};

interface NavTabsProps {
  ready?: boolean;
  className?: string;
  activeClassName?: string;
  idleClassName?: string;
  onClickTab?: (tab: EScreen) => void;
}
export function NavTabs({ ready, className = "", activeClassName, idleClassName, onClickTab }: NavTabsProps) {
  const atScreen = useSelector((state) => state.ui.atScreen);

  return (
    <>
      {[EScreen.MY_CHARACTERS, EScreen.MY_WEAPONS, EScreen.MY_ARTIFACTS, EScreen.MY_SETUPS, EScreen.CALCULATOR].map(
        (tab, i) => (
          <button
            key={i}
            className={clsx(
              "flex items-center font-semibold ",
              tab === atScreen ? activeClassName : ready ? idleClassName : "text-light-800",
              className
            )}
            disabled={!ready}
            onClick={() => onClickTab?.(tab)}
          >
            {tab}
          </button>
        )
      )}
    </>
  );
}
