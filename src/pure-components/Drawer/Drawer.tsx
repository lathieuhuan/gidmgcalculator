import clsx, { ClassValue } from "clsx";
import { CSSProperties, useEffect, useState } from "react";

type DrawerState = {
  mounted: boolean;
  active: boolean;
};

export interface DrawerProps {
  className?: ClassValue;
  style?: CSSProperties;
  active?: boolean;
  activeWidth?: CSSProperties["width"];
  closeOnMaskClick?: boolean;
  destroyOnClose?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}
export const Drawer = ({
  className,
  style,
  active,
  activeWidth,
  closeOnMaskClick = true,
  destroyOnClose,
  children,
  onClose,
}: DrawerProps) => {
  const [state, setState] = useState<DrawerState>({
    mounted: false,
    active: false,
  });

  const updateState = <T extends keyof DrawerState>(key: T, value: DrawerState[T]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (active) {
      if (!state.mounted) {
        updateState("mounted", true);

        setTimeout(() => {
          updateState("active", true);
        }, 50);
      }
    } else if (state.mounted) {
      closeDrawer();
    }
  }, [active]);

  const closeDrawer = () => {
    updateState("active", false);
  };

  const onMaskTransitionEnd = () => {
    if (state.active === false) {
      updateState("mounted", false);
      onClose?.();
    }
  };

  const durationCls = "duration-200";

  return (
    <div className={clsx("absolute full-stretch z-50", !state.mounted && "hidden")}>
      <div
        className={clsx(
          "w-full h-full bg-black transition-opacity",
          durationCls,
          state.active ? "opacity-60" : "opacity-20"
        )}
        onTransitionEnd={onMaskTransitionEnd}
        onClick={closeOnMaskClick ? closeDrawer : undefined}
      />

      <div
        className={clsx(
          "absolute top-0 right-0 z-10 h-full overflow-hidden transition-size flex",
          durationCls,
          className
        )}
        style={{
          width: state.active ? activeWidth : 0,
          ...style,
        }}
      >
        <div className="shrink-0 grow">{!destroyOnClose || state.mounted ? children : null}</div>
      </div>
    </div>
  );
};
