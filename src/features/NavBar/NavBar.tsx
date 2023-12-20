import { useState, useRef } from "react";
import {
  FaBars,
  FaDonate,
  FaCog,
  FaDownload,
  FaInfoCircle,
  FaQuestionCircle,
  FaUpload,
  FaSearch,
} from "react-icons/fa";
import type { UIState } from "@Store/uiSlice/types";

// Hook
import { useClickOutside } from "@Src/pure-hooks";
import { useDispatch, useSelector } from "@Store/hooks";

// Action
import { updateUI } from "@Store/uiSlice";

// Component
import { Button } from "@Src/pure-components";
import { ActionButton, NavTabs } from "./components";

export function NavBar() {
  const dispatch = useDispatch();
  const trackerState = useSelector((state) => state.ui.trackerState);
  const ref = useRef<HTMLDivElement>(null);
  const [menuDropped, setMenuDropped] = useState(false);

  const isLargeView = window.innerWidth >= 1025;

  const closeMenu = () => setMenuDropped(false);

  useClickOutside(ref, closeMenu);

  const openModal = (type: UIState["appModalType"]) => () => {
    dispatch(updateUI({ appModalType: type }));
    closeMenu();
  };

  const onClickTrackerIcon = () => {
    dispatch(updateUI({ trackerState: "open" }));
  };

  return (
    <div className="absolute top-0 left-0 right-0 bg-black/60">
      <div className="flex justify-between">
        <div className="flex">
          {isLargeView ? (
            <NavTabs
              className="px-2 py-1"
              activeClassName="bg-dark-900 text-orange-500"
              idleClassName="bg-dark-500 hover:text-yellow-400"
            />
          ) : null}
        </div>

        <div className="flex">
          <Button variant="positive" shape="square" icon={<FaDonate />} onClick={openModal("DONATE")}>
            Donate
          </Button>

          {trackerState !== "close" ? (
            <button className="w-8 h-8 flex-center text-xl text-black bg-green-300" onClick={onClickTrackerIcon}>
              <FaSearch />
            </button>
          ) : null}

          <div ref={ref} className="relative text-light-400">
            <button className="w-8 h-8 flex-center bg-dark-500 text-xl" onClick={() => setMenuDropped(!menuDropped)}>
              <FaBars />
            </button>

            <div
              className={
                "absolute top-full right-0 z-50 origin-top-right transition-transform duration-200 pt-2 pr-2 " +
                (menuDropped ? "scale-100" : "scale-0")
              }
            >
              <div className="flex flex-col bg-light-400 text-black rounded-md overflow-hidden shadow-common">
                <ActionButton
                  label="Introduction"
                  icon={<FaInfoCircle size="1.125rem" />}
                  onClick={openModal("INTRO")}
                />
                <ActionButton label="Guides" icon={<FaQuestionCircle />} onClick={openModal("GUIDES")} />
                {isLargeView ? null : (
                  <NavTabs
                    className="px-4 py-2"
                    activeClassName="border-l-4 border-red-400 bg-dark-900 text-light-400"
                    onClickTab={closeMenu}
                  />
                )}
                <ActionButton label="Settings" icon={<FaCog />} onClick={openModal("SETTINGS")} />
                <ActionButton label="Download" icon={<FaDownload />} onClick={openModal("DOWNLOAD")} />
                <ActionButton label="Upload" icon={<FaUpload />} onClick={openModal("UPLOAD")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
