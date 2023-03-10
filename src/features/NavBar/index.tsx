import { useState, useRef } from "react";
import { FaBars, FaCog, FaDownload, FaInfoCircle, FaQuestionCircle, FaUpload } from "react-icons/fa";
import type { UIState } from "@Store/uiSlice/types";

// Hook
import { useClickOutside } from "@Src/hooks";
import { useDispatch } from "@Store/hooks";

// Action
import { updateUI } from "@Store/uiSlice";

// Component
import { ActionButton } from "./atoms";
import { NavTabs } from "./molecules";

export function NavBar() {
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [menuDropped, setMenuDropped] = useState(false);

  const isLargeView = window.innerWidth >= 1025;

  const closeMenu = () => setMenuDropped(false);

  useClickOutside(ref, closeMenu);

  const openModal = (type: UIState["appModalType"]) => () => {
    dispatch(updateUI({ appModalType: type }));
    closeMenu();
  };

  return (
    <div className="absolute top-0 left-0 right-0 bg-black/60">
      <div className="flex justify-between">
        <div className="flex">
          {isLargeView ? (
            <NavTabs
              className="px-2 py-1"
              activeClassName="bg-darkblue-1 text-orange"
              idleClassName="bg-darkblue-3 hover:text-lightgold"
            />
          ) : null}
        </div>

        <div ref={ref} className="relative text-default">
          <button className="w-8 h-8 flex-center bg-darkblue-3 text-xl" onClick={() => setMenuDropped(!menuDropped)}>
            <FaBars />
          </button>

          <div
            className={
              "absolute top-full right-0 z-30 origin-top-right transition-transform duration-200 pt-2 pr-2 " +
              (menuDropped ? "scale-100" : "scale-0")
            }
          >
            <div className="flex flex-col bg-default text-black rounded-md overflow-hidden shadow-common">
              <ActionButton label="Introduction" icon={<FaInfoCircle size="1.125rem" />} onClick={openModal("INTRO")} />
              <ActionButton label="Guides" icon={<FaQuestionCircle />} onClick={openModal("GUIDES")} />
              {isLargeView ? null : (
                <NavTabs
                  className="px-4 py-2"
                  activeClassName="border-l-4 border-darkred bg-darkblue-1 text-default"
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
  );
}
