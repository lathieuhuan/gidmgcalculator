import { useRef, useState } from "react";
import {
  FaBars,
  FaCog,
  FaDonate,
  FaDownload,
  FaInfoCircle,
  FaQuestionCircle,
  FaSearch,
  FaUpload,
} from "react-icons/fa";

import { EScreen } from "@Src/constants";
import { useClickOutside } from "@Src/pure-hooks";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { updateUI } from "@Store/uiSlice";
import { UIState } from "@Store/uiSlice/types";

// Component
import { Button } from "@Src/pure-components";
import { ActionButton, NavTabs } from "./components";

export function NavBar() {
  const dispatch = useDispatch();
  const trackerState = useSelector((state) => state.ui.trackerState);
  const appReady = useSelector((state) => state.ui.ready);
  const ref = useRef<HTMLDivElement>(null);
  const [menuDropped, setMenuDropped] = useState(false);

  const closeMenu = () => setMenuDropped(false);

  useClickOutside(ref, closeMenu);

  const openModal = (type: UIState["appModalType"]) => () => {
    dispatch(updateUI({ appModalType: type }));
    closeMenu();
  };

  const onClickTab = (tab: EScreen) => {
    dispatch(updateUI({ atScreen: tab }));
  };

  const onClickTrackerIcon = () => {
    dispatch(updateUI({ trackerState: "open" }));
  };

  return (
    <div className="absolute top-0 left-0 right-0 bg-black/60">
      <div className="flex">
        <div className="hidden xm:flex">
          <NavTabs
            className="px-2 py-1"
            activeClassName="bg-dark-900"
            idleClassName="bg-dark-500 glow-on-hover"
            ready={appReady}
            onClickTab={onClickTab}
          />
        </div>

        <div className="ml-auto flex">
          <Button
            variant="positive"
            shape="square"
            icon={<FaDonate />}
            onClick={openModal("DONATE")}
          >
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

                <NavTabs
                  className="px-4 py-2 xm:hidden"
                  activeClassName="border-l-4 border-red-400 bg-dark-900 text-light-400"
                  ready={appReady}
                  onClickTab={(tab) => {
                    onClickTab(tab);
                    closeMenu();
                  }}
                />

                <ActionButton label="Settings" icon={<FaCog />} onClick={openModal("SETTINGS")} />
                <ActionButton
                  label="Download"
                  disabled={!appReady}
                  icon={<FaDownload />}
                  onClick={openModal("DOWNLOAD")}
                />
                <ActionButton label="Upload" disabled={!appReady} icon={<FaUpload />} onClick={openModal("UPLOAD")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
