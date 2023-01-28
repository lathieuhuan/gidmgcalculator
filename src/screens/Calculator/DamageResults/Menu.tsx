import { useEffect, useState } from "react";
import { FaExpandArrowsAlt, FaSearch } from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";

// Hook
import { useDispatch } from "@Store/hooks";

// Action & Selector
import { updateUI } from "@Store/uiSlice";

// Component
import { TrackerModal, type TrackerModalState } from "../TrackerModal";

interface MenuProps {
  activeSetupName: string;
}
export const Menu = ({ activeSetupName }: MenuProps) => {
  const dispatch = useDispatch();

  const [trackerModalState, setTrackerModalState] = useState<TrackerModalState>("CLOSE");
  const [menuDropped, setMenuDropped] = useState(false);

  useEffect(() => {
    const handleClickOutsideMenu = (e: any) => {
      const menuElmt = document.querySelector(`#damage-results-menu`);
      const targetParent = e.target?.closest(`#damage-results-menu`);

      if (!targetParent && menuElmt?.classList.contains("dropped")) {
        setMenuDropped(false);
      }
    };
    document.body.addEventListener("click", handleClickOutsideMenu);

    return () => document.body.removeEventListener("click", handleClickOutsideMenu);
  }, []);

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
      onClick: () => dispatch(updateUI({ resultsEnlarged: true })),
    },
  ];

  return (
    <div
      id="damage-results-menu"
      className={"absolute top-2 right-2 w-8" + (menuDropped ? " dropped" : "")}
    >
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
    </div>
  );
};
