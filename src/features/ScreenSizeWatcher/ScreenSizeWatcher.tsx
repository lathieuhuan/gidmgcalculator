import { ReactNode, createContext, useContext, useEffect, useState } from "react";

/** See tailwind.config for breakpoints */
type ScreenSize = "xs" | "sm" | "md1" | "md2" | "lg";

const ScreenSizeContext = createContext<ScreenSize>("sm");

const getScreenSize = (): ScreenSize => {
  const width = window.innerWidth;

  if (width < 440) return "xs";
  if (width < 610) return "sm";
  if (width < 769) return "md1";
  if (width < 1025) return "md2";
  return "lg";
};

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

  return <ScreenSizeContext.Provider value={screenSize}>{props.children}</ScreenSizeContext.Provider>;
};

export const useScreenSize = () => {
  return useContext(ScreenSizeContext);
};
