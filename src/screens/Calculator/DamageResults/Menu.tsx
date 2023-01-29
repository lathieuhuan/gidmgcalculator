import { useRef, useState } from "react";
import { FaExpandArrowsAlt, FaSearch } from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";

// Hook
import { useClickOutside } from "@Src/hooks";

// Component
import { Modal } from "@Components/molecules";
import { TrackerModal, type TrackerModalState } from "../TrackerModal";
import { ResultsDisplay } from "./ResultsDisplay";

interface MenuProps {
  activeSetupName: string;
}
export const Menu = ({ activeSetupName }: MenuProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [menuDropped, setMenuDropped] = useState(false);
  const [trackerModalState, setTrackerModalState] = useState<TrackerModalState>("CLOSE");
  const [resultsEnlarged, setResultsEnlarged] = useState(false);

  useClickOutside(wrapperRef, () => setMenuDropped(false));

  const menuItems = [
    {
      icon: FaSearch,
      text: "Tracker",
      className: "flex " + (trackerModalState === "HIDDEN" ? "bg-green" : "hover:bg-lesser"),
      onClick: () => {
        setTrackerModalState(["CLOSE", "HIDDEN"].includes(trackerModalState) ? "OPEN" : "CLOSE");
      },
    },
    {
      icon: FaExpandArrowsAlt,
      text: "Expand",
      className: "hover:bg-lesser hidden md1:flex",
      onClick: () => setResultsEnlarged(true),
    },
  ];

  return (
    <div ref={wrapperRef} className="absolute top-2 right-2 w-8">
      <button
        className={
          "w-8 h-8 flex-center rounded-md text-2xl" + (menuDropped ? " bg-green text-black" : "")
        }
        onClick={() => setMenuDropped(!menuDropped)}
      >
        <MdMoreVert />
      </button>

      <div
        className={
          "absolute right-0 z-10 mt-1 rounded bg-default text-black hide-scrollbar" +
          (menuDropped ? "" : " max-h-0")
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

      <TrackerModal
        activeSetupName={activeSetupName}
        trackerState={trackerModalState}
        onChangeTrackerModalState={setTrackerModalState}
      />

      <Modal
        active={resultsEnlarged}
        className="h-large-modal p-4 pt-2 rounded-lg shadow-white-glow bg-darkblue-3 custom-scrollbar"
        onClose={() => setResultsEnlarged(false)}
      >
        <ResultsDisplay activeSetupName={activeSetupName} />
      </Modal>
    </div>
  );
};
