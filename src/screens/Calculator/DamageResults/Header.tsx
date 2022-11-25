import { Fragment, useEffect, useState } from "react";
import { FaExpandArrowsAlt, FaMinus, FaSearch, FaTimes } from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";

import { Modal } from "@Components/modals";
import TrackerContainer from "./TrackerContainer";
import { TrackerState } from "./types";

interface IHeaderProps {
  activeSetupName: string;
}
export function Header({ activeSetupName }: IHeaderProps) {
  const [menuDropped, setMenuDropped] = useState(false);
  const [enlargedOn, setEnlargedOn] = useState(false);
  const [trackerState, setTrackerState] = useState<TrackerState>("CLOSE");

  useEffect(() => {
    const handleClickOutsideMenu = (e: any) => {
      if (menuDropped && !e.target?.closest(`#gidc-damage-result-menu`)) {
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
      <div id="gidc-damage-result-menu" className="absolute top-2 right-2 w-8">
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
            "absolute right-0 mt-1 rounded bg-default text-black hide-scrollbar" +
            (menuDropped ? "" : " max-h-0")
          }
        >
          <div className="py-1">
            {menuItems.map((item, i) => {
              return (
                <button
                  key={i}
                  className="px-2 py-1 flex items-center font-medium hover:bg-lesser"
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

      <Modal
        active={trackerState === "OPEN"}
        withDefaultStyle
        onClose={() => setTrackerState("CLOSE")}
      >
        <div className="p-4 relative">
          <div className="absolute top-1 right-1 flex space-x-2 text-xl">
            <button
              className="w-8 h-8 flex-center hover:text-lightgold"
              // onClick={() => setTrackerState("CLOSE")}
            >
              <FaMinus />
            </button>
            <button
              className="w-8 h-8 flex-center hover:text-darkred"
              onClick={() => setTrackerState("CLOSE")}
            >
              <FaTimes />
            </button>
          </div>

          <p className="flex-center">
            <span className="text-2xl text-orange font-bold">Tracking Results</span>{" "}
            <span className="ml-2 text-lesser">({activeSetupName})</span>
          </p>

          <TrackerContainer trackerState={trackerState} />
        </div>
      </Modal>
    </Fragment>
  );
}
