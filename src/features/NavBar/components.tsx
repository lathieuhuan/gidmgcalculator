import clsx from "clsx";
import type { ReactNode } from "react";

import { EScreen } from "@Src/constants";
import { useDispatch, useSelector } from "@Store/hooks";
import { updateUI } from "@Store/uiSlice";
import { selectAtScreen } from "@Store/uiSlice/selectors";

interface ActionButtonProps {
  className?: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}
export const ActionButton = ({ className = "", icon, label, onClick }: ActionButtonProps) => {
  return (
    <button
      className={
        "px-4 py-2 flex items-center font-bold hover:text-default hover:bg-darkblue-1 cursor-default " + className
      }
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
};

interface NavTabsProps {
  className?: string;
  activeClassName?: string;
  idleClassName?: string;
  onClickTab?: () => void;
}
export function NavTabs({ className = "", activeClassName, idleClassName, onClickTab }: NavTabsProps) {
  const atScreen = useSelector(selectAtScreen);
  const dispatch = useDispatch();

  return (
    <>
      {[EScreen.MY_CHARACTERS, EScreen.MY_WEAPONS, EScreen.MY_ARTIFACTS, EScreen.MY_SETUPS, EScreen.CALCULATOR].map(
        (tab, i) => (
          <button
            key={i}
            className={clsx(
              "flex items-center font-bold ",
              tab === atScreen ? activeClassName : idleClassName,
              className
            )}
            onClick={() => {
              dispatch(updateUI({ atScreen: tab }));
              onClickTab?.();
            }}
          >
            {tab}
          </button>
        )
      )}
    </>
  );
}
