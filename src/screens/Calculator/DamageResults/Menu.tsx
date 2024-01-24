import { useRef, useState } from "react";
import { FaExpandArrowsAlt, FaSearch } from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";

import { useDispatch } from "@Store/hooks";
import { updateUI } from "@Store/uiSlice";
import { useClickOutside } from "@Src/pure-hooks";

// Component
import { Modal } from "@Src/pure-components";
import { ResultsDisplay } from "./ResultsDisplay";

export const Menu = () => {
  const dispatch = useDispatch();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [menuDropped, setMenuDropped] = useState(false);
  const [resultsEnlarged, setResultsEnlarged] = useState(false);

  useClickOutside(wrapperRef, () => setMenuDropped(false));

  const menuItems = [
    {
      icon: FaSearch,
      text: "Tracker",
      className: "flex hover:bg-light-800",
      onClick: () => {
        dispatch(updateUI({ trackerState: "open" }));
      },
    },
    {
      icon: FaExpandArrowsAlt,
      text: "Expand",
      className: "hover:bg-light-800 hidden md1:flex",
      onClick: () => setResultsEnlarged(true),
    },
  ];

  return (
    <div ref={wrapperRef} className="absolute top-2 right-2 w-8">
      <button
        className={"w-8 h-8 flex-center rounded-md text-2xl" + (menuDropped ? " bg-green-300 text-black" : "")}
        onClick={() => setMenuDropped(!menuDropped)}
      >
        <MdMoreVert />
      </button>

      <div
        className={
          "absolute right-0 z-10 mt-1 rounded bg-light-400 text-black hide-scrollbar" + (menuDropped ? "" : " max-h-0")
        }
      >
        <div className="py-1 flex flex-col">
          {menuItems.map((item, i) => {
            return (
              <button
                key={i}
                className={"px-2 py-1 items-center font-medium " + (item.className || "")}
                onClick={() => {
                  item.onClick();
                  setMenuDropped(false);
                }}
              >
                <item.icon />
                <span className="ml-2">{item.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Modal
        active={resultsEnlarged}
        className={[Modal.LARGE_HEIGHT_CLS, "p-4 pt-2 rounded-lg bg-dark-500 custom-scrollbar"]}
        onClose={() => setResultsEnlarged(false)}
      >
        <ResultsDisplay />
      </Modal>
    </div>
  );
};
