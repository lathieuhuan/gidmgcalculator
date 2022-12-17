import clsx from "clsx";
import { FaBars } from "react-icons/fa";

// Component
import { Modal } from "@Components/modals";
import {
  IntroButton,
  mobileNavButtonStyles,
  renderDownloadButton,
  renderUploadButton,
  Tabs,
} from "./components";

const navMobileMenuOptionStyles = "px-6 py-2 border-b border-white/40 last:rounded-b";

interface NavBarProps {
  menuActive: boolean;
  setMenuActive: (active: boolean) => void;
  onClickUpload: () => void;
  onClickDownload: () => void;
}
export function NavBar({ menuActive, setMenuActive, onClickUpload, onClickDownload }: NavBarProps) {
  return (
    <div className="bg-black/60">
      <div className="hidden lg:flex justify-between">
        <div className="flex">
          <Tabs className="px-2 py-1" />
        </div>

        <div className="px-1 flex bg-darkblue-3">
          <IntroButton className="px-2 py-1" />
          {renderDownloadButton("px-2 py-1", onClickDownload)}
          {renderUploadButton("px-2 py-1", onClickUpload)}
        </div>
      </div>

      <div className="flex lg:hidden">
        <div className="mr-auto relative">
          <button
            className={clsx(
              "flex-center",
              mobileNavButtonStyles.base,
              menuActive ? mobileNavButtonStyles.active : mobileNavButtonStyles.idle
            )}
            onClick={() => setMenuActive(true)}
          >
            <FaBars />
          </button>

          <Modal
            active={menuActive}
            className="rounded flex flex-col shadow-white-glow text-default"
            onClose={() => setMenuActive(false)}
          >
            <IntroButton className={clsx(navMobileMenuOptionStyles, "rounded-t bg-darkblue-3")} />
            <Tabs className={navMobileMenuOptionStyles} onClick={() => setMenuActive(false)} />
            {renderUploadButton(navMobileMenuOptionStyles, onClickUpload)}
            {renderDownloadButton(navMobileMenuOptionStyles, onClickDownload)}
          </Modal>
        </div>
      </div>
    </div>
  );
}
