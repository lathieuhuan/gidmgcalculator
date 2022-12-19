import clsx from "clsx";
import { FaBars } from "react-icons/fa";

// Component
import { Modal } from "@Components/molecules";
import { IntroButton, DownloadButton, UploadButton, navButtonMobileStyles } from "./atoms";
import { NavTabs } from "./molecules";

interface NavBarProps {
  menuActive: boolean;
  setMenuActive: (active: boolean) => void;
  onClickUpload: () => void;
  onClickDownload: () => void;
}
export function NavBar({ menuActive, setMenuActive, onClickUpload, onClickDownload }: NavBarProps) {
  const optionClassName = "px-6 py-2 border-b border-white/40 last:rounded-b";

  return (
    <div className="bg-black/60">
      <div className="hidden lg:flex justify-between">
        <div className="flex">
          <NavTabs className="px-2 py-1" />
        </div>

        <div className="px-1 flex bg-darkblue-3">
          <IntroButton className="px-2 py-1" />
          <DownloadButton className="px-2 py-1" onClick={onClickDownload} />
          <UploadButton className="px-2 py-1" onClick={onClickUpload} />
        </div>
      </div>

      <div className="flex lg:hidden">
        <div className="mr-auto relative">
          <button
            className={clsx(
              "flex-center",
              navButtonMobileStyles.base,
              menuActive ? navButtonMobileStyles.active : navButtonMobileStyles.idle
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
            <IntroButton className={optionClassName + " rounded-t bg-darkblue-3"} />
            <NavTabs className={optionClassName} onClickTab={() => setMenuActive(false)} />
            <DownloadButton className={optionClassName} onClick={onClickUpload} />
            <UploadButton className={optionClassName} onClick={onClickDownload} />
          </Modal>
        </div>
      </div>
    </div>
  );
}
