import cn from "classnames";
import { Fragment } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { changeScreen, selectAtScreen, toggleIntro } from "@Store/uiSlice";
import { useDispatch, useSelector } from "@Store/hooks";
import { EScreen } from "@Src/constants";

export const mobileNavButtonStyles = {
  base: "w-10 h-10 text-2xl",
  idle: "bg-darkblue-3 text-white",
  active: "bg-darkblue-1 text-green",
};

export function IntroButton({ clasName }: { clasName?: string }) {
  const dispatch = useDispatch();

  return (
    <button
      className={cn("flex items-center border-b border-white/40 group", clasName)}
      onClick={() => dispatch(toggleIntro(true))}
    >
      <FaInfoCircle className="mr-2 group-hover:text-lightgold" size="1.125rem" />
      <span className="text-base font-bold group-hover:text-lightgold">Introduction</span>
    </button>
  );
}

const navButtonStyles = {
  base: "flex items-center",
  idle: "bg-darkblue-3 hover:text-lightgold",
  active: "bg-darkblue-1 text-orange",
};

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
