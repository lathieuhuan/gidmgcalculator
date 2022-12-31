import clsx from "clsx";
import { Fragment } from "react";

// Constant
import { EScreen } from "@Src/constants";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Action & Selector
import { updateUI } from "@Store/uiSlice";
import { selectAtScreen } from "@Store/uiSlice/selectors";

// Style
import { navButtonStyles } from "./atoms";

interface INavTabsProps {
  className?: string;
  onClickTab?: () => void;
}
export function NavTabs({ className, onClickTab }: INavTabsProps) {
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
            "font-bold",
            className,
            navButtonStyles.base,
            tab === atScreen ? navButtonStyles.active : navButtonStyles.idle
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
