import { ReactNode, createContext, useContext, useEffect, useState } from "react";

/** See tailwind.config for breakpoints */
type ScreenSize = "xs" | "sm" | "md1" | "md2" | "lg";

type ScreenSizeContextValue = {
  screenSize: ScreenSize;
  isFromSize: (size: ScreenSize) => boolean;
};

const SCREEN_SIZE_MAP: Record<ScreenSize, number> = {
  xs: 0,
  sm: 440,
  md1: 610,
  md2: 769,
  lg: 1025,
};

const getScreenSize = (): ScreenSize => {
  const width = window.innerWidth;

  if (width >= SCREEN_SIZE_MAP.lg) return "lg";
  if (width >= SCREEN_SIZE_MAP.md2) return "md2";
  if (width >= SCREEN_SIZE_MAP.md1) return "md1";
  if (width >= SCREEN_SIZE_MAP.sm) return "sm";
  return "xs";
};

const ScreenSizeContext = createContext<ScreenSizeContextValue>({
  screenSize: getScreenSize(),
  isFromSize: () => true,
});

export const ScreenSizeWatcher = (props: { children: ReactNode }) => {
  const [screenSize, setScreenSize] = useState<ScreenSize>(getScreenSize);

  useEffect(() => {
    document.body.setAttribute("data-screen", screenSize);
  }, [screenSize]);

  useEffect(() => {
    const handleResize = (e: UIEvent) => {
      const newScreenSize = getScreenSize();
      const currentScreenSize = document.body.getAttribute("data-screen");

      if (newScreenSize !== currentScreenSize) {
        setScreenSize(newScreenSize);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isFromSize: ScreenSizeContextValue["isFromSize"] = (size) => {
    const minWidth = SCREEN_SIZE_MAP[size];
    return window.innerWidth >= minWidth;
  };

  return (
    <ScreenSizeContext.Provider
      value={{
        screenSize,
        isFromSize,
      }}
    >
      {props.children}
    </ScreenSizeContext.Provider>
  );
};

export const useScreenWatcher = () => {
  return useContext(ScreenSizeContext);
};
