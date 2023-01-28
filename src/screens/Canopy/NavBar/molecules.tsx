import clsx from "clsx";
import { Fragment } from "react";

// Constant
import { EScreen } from "@Src/constants";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Action & Selector
import { updateUI } from "@Store/uiSlice";
import { selectAtScreen } from "@Store/uiSlice/selectors";

interface NavTabsProps {
  className?: string;
  activeClassName?: string;
  idleClassName?: string;
  onClickTab?: () => void;
}
export function NavTabs({
  className = "",
  activeClassName,
  idleClassName,
  onClickTab,
}: NavTabsProps) {
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
      ))}
    </Fragment>
  );
}
