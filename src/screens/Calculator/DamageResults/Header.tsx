import { Fragment, useEffect, useState } from "react";
import { FaExpandArrowsAlt, FaSearch } from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";

// Component
import { TrackerModal, type TrackerModalState } from "@Screens/Calculator/TrackerModal";

interface HeaderProps {
  activeSetupName: string;
}
export function Header({ activeSetupName }: HeaderProps) {
  const [menuDropped, setMenuDropped] = useState(false);
  const [enlargedOn, setEnlargedOn] = useState(false);
  const [trackerState, setTrackerState] = useState<TrackerModalState>("CLOSE");

  useEffect(() => {
    const handleClickOutsideMenu = (e: any) => {
      if (menuDropped && !e.target?.closest(`#damage-result-menu`)) {
        setMenuDropped(false);
      }
    };
    document.body.addEventListener("click", handleClickOutsideMenu);

    return () => document.body.removeEventListener("click", handleClickOutsideMenu);
  }, [menuDropped]);

  const menuItems = [
    {
      icon: FaSearch,
      text: "Tracker",
      onClick: () => setTrackerState(["CLOSE", "HIDDEN"].includes(trackerState) ? "OPEN" : "CLOSE"),
    },
    {
      icon: FaExpandArrowsAlt,
      text: "Expand",
      onClick: () => setEnlargedOn(true),
    },
  ];

  return (
    <Fragment>
      <div id="damage-result-menu" className="absolute top-2 right-2 w-8">
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
                  className={
                    "px-2 py-1 flex items-center font-medium " +
                    (!i && trackerState === "HIDDEN" ? "bg-green" : "hover:bg-lesser")
                  }
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
      </div>

      <TrackerModal
        activeSetupName={activeSetupName}
        trackerState={trackerState}
        onChangeTrackerState={setTrackerState}
      />
    </Fragment>
  );
}
