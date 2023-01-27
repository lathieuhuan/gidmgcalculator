import clsx from "clsx";
import { Fragment } from "react";

// Constant
import { EScreen } from "@Src/constants";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Action & Selector
import { updateUI } from "@Store/uiSlice";
import { selectAtScreen } from "@Store/uiSlice/selectors";

// Component
import { NavButton } from "./atoms";

interface NavTabsProps {
  className?: string;
  onClickTab?: () => void;
}
export function NavTabs({ className = "", onClickTab }: NavTabsProps) {
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
        <NavButton
          key={i}
          className={"font-bold " + className}
          isActive={tab === atScreen}
          onClick={() => {
            dispatch(updateUI({ atScreen: tab }));
            onClickTab?.();
          }}
        >
          {tab}
        </NavButton>
      ))}
    </Fragment>
  );
}
