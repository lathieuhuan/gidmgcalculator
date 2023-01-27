import clsx from "clsx";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

// Component
import { Modal } from "@Components/molecules";
import { IntroButton, DownloadButton, UploadButton } from "./atoms";
import { NavTabs } from "./molecules";
import { DownloadOptions } from "./DownloadOptions";
import { UploadOptions } from "./UploadOptions";

export function NavBar() {
  const [loadOptionType, setLoadOptionType] = useState<"UP" | "DOWN" | "">("");
  const [navBarMenuActive, setNavBarMenuActive] = useState(false);

  const optionClassName = "px-6 py-2 border-b border-white/40 last:rounded-b";

  const onClickUpload = () => setLoadOptionType("UP");

  const onClickDownload = () => setLoadOptionType("DOWN");

  const closeLoadOptions = () => setLoadOptionType("");

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
              "flex-center w-10 h-10 text-2xl",
              navBarMenuActive ? "bg-darkblue-1 text-green" : "bg-darkblue-3 text-default"
            )}
            onClick={() => setNavBarMenuActive(true)}
          >
            <FaBars />
          </button>
        </div>
      </div>

      <Modal
        active={navBarMenuActive}
        className="rounded flex flex-col shadow-white-glow text-default"
        onClose={() => setNavBarMenuActive(false)}
      >
        <IntroButton className={optionClassName + " rounded-t bg-darkblue-3"} />
        <NavTabs className={optionClassName} onClickTab={() => setNavBarMenuActive(false)} />
        <DownloadButton className={optionClassName} onClick={onClickUpload} />
        <UploadButton className={optionClassName} onClick={onClickDownload} />
      </Modal>

      <Modal
        active={loadOptionType === "DOWN"}
        className="pt-2 pb-4 rounded-lg bg-darkblue-2 shadow-white-glow max-w-95"
        style={{ width: "28rem" }}
        onClose={closeLoadOptions}
      >
        <DownloadOptions onClose={closeLoadOptions} />
      </Modal>

      <Modal
        active={loadOptionType === "UP"}
        className="pt-2 pb-4 rounded-lg bg-darkblue-2 shadow-white-glow max-w-95"
        style={{ width: "28rem" }}
        onClose={closeLoadOptions}
      >
        <UploadOptions onClose={closeLoadOptions} />
      </Modal>
    </div>
  );
}
