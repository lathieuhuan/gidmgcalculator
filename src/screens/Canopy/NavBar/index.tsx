import { useState } from "react";
import { FaBars } from "react-icons/fa";

// Component
import { Modal } from "@Components/molecules";
import { IntroButton, DownloadButton, UploadButton } from "./atoms";
import { NavTabs } from "./molecules";
import { Intro } from "./Intro";
import { DownloadOptions } from "./DownloadOptions";
import { UploadOptions } from "./UploadOptions";

export function NavBar() {
  const [modalType, setModalType] = useState<"UPLOAD" | "DOWNLOAD" | "INTRO" | "">("");
  const [navBarMenuActive, setNavBarMenuActive] = useState(false);

  const optionClassName = "px-6 py-2 border-b border-white/40 last:rounded-b";

  const onClickIntro = () => setModalType("INTRO");

  const onClickUpload = () => setModalType("UPLOAD");

  const onClickDownload = () => setModalType("DOWNLOAD");

  const closeModal = () => setModalType("");

  return (
    <div className="bg-black/60">
      {window.innerWidth > 1025 ? (
        <div className="flex justify-between">
          <div className="flex">
            <NavTabs className="px-2 py-1" />
          </div>

          <div className="px-1 flex bg-darkblue-3">
            <IntroButton className="px-2 py-1" onClick={onClickIntro} />
            <DownloadButton className="px-2 py-1" onClick={onClickDownload} />
            <UploadButton className="px-2 py-1" onClick={onClickUpload} />
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="ml-auto relative">
            <button
              className={
                "flex-center w-10 h-10 text-2xl " +
                (navBarMenuActive ? "bg-darkblue-1 text-green" : "bg-darkblue-3 text-default")
              }
              onClick={() => setNavBarMenuActive(true)}
            >
              <FaBars />
            </button>
          </div>
        </div>
      )}

      <Intro active={modalType === "INTRO"} onClose={closeModal} />

      <Modal
        active={navBarMenuActive}
        className="rounded flex flex-col shadow-white-glow text-default"
        onClose={() => setNavBarMenuActive(false)}
      >
        <IntroButton
          className={optionClassName + " rounded-t bg-darkblue-3"}
          onClick={onClickIntro}
        />
        <NavTabs className={optionClassName} onClickTab={() => setNavBarMenuActive(false)} />
        <DownloadButton className={optionClassName} onClick={onClickUpload} />
        <UploadButton className={optionClassName} onClick={onClickDownload} />
      </Modal>

      <Modal
        active={modalType === "DOWNLOAD"}
        className="pt-2 pb-4 rounded-lg bg-darkblue-2 shadow-white-glow max-w-95"
        style={{ width: "28rem" }}
        onClose={closeModal}
      >
        <DownloadOptions onClose={closeModal} />
      </Modal>

      <Modal
        active={modalType === "UPLOAD"}
        className="pt-2 pb-4 rounded-lg bg-darkblue-2 shadow-white-glow max-w-95"
        style={{ width: "28rem" }}
        onClose={closeModal}
      >
        <UploadOptions onClose={closeModal} />
      </Modal>
    </div>
  );
}
