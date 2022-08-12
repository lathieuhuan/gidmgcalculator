import cn from "classnames";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
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
  onClickUpload: () => void;
  onClickDownload: () => void;
}
export function NavBar({ onClickUpload, onClickDownload }: NavBarProps) {
  const [active, setActive] = useState(false);
  return (
    <div className="bg-black/60">
      <div className="hidden lg:flex justify-between">
        <div className="flex">
          <Tabs className="px-2 py-1" />
        </div>

        <div className="px-1 flex bg-darkblue-3">
          <IntroButton className="px-2 py-1" />
          {renderUploadButton("px-2 py-1", onClickUpload)}
          {renderDownloadButton("px-2 py-1", onClickDownload)}
        </div>
      </div>

      <div className="flex lg:hidden">
        <div className="mr-auto relative">
          <button
            className={cn(
              "flex-center",
              mobileNavButtonStyles.base,
              active ? mobileNavButtonStyles.active : mobileNavButtonStyles.idle
            )}
            onClick={() => setActive(!active)}
          >
            <FaBars />
          </button>
          {active && (
            <Modal onClose={() => setActive(false)}>
              <div className="rounded flex flex-col shadow-white-glow">
                <IntroButton className={cn(navMobileMenuOptionStyles, "rounded-t bg-darkblue-3")} />
                <Tabs className={navMobileMenuOptionStyles} onClick={() => setActive(false)} />
                {renderUploadButton(navMobileMenuOptionStyles, onClickUpload)}
                {renderDownloadButton(navMobileMenuOptionStyles, onClickDownload)}
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}
