import { FaDownload } from "react-icons/fa";

// Hook
import { useSelector } from "@Store/hooks";

// Selector
import { selectUserArts, selectUserChars, selectUserSetups, selectUserWps } from "@Store/userDatabaseSlice/selectors";

// Component
import { Button, CloseButton } from "@Components/atoms";
import { Modal, type ModalControl } from "@Components/molecules";

const DownloadOptions = () => {
  const userChars = useSelector(selectUserChars);
  const userWps = useSelector(selectUserWps);
  const userArts = useSelector(selectUserArts);
  const userSetups = useSelector(selectUserSetups);

  const onClickDownload = () => {
    const downloadData = JSON.stringify({
      version: 3,
      characters: userChars,
      weapons: userWps,
      artifacts: userArts,
      setups: userSetups,
    });

    // type "text/plain" | "application/json"
    const textBlob = new Blob([downloadData], { type: "text/plain" });
    const newLink = document.createElement("a");

    newLink.download = "GDC_Data";

    if (window.webkitURL != null) {
      newLink.href = window.webkitURL.createObjectURL(textBlob);
    } else {
      newLink.href = window.URL.createObjectURL(textBlob);
      newLink.style.display = "none";
      document.body.appendChild(newLink);
    }

    newLink.click();
  };

  return (
    <div className="flex flex-col">
      <Button className="mt-4 mx-auto" variant="positive" icon={<FaDownload />} onClick={onClickDownload}>
        Download
      </Button>

      <p className="mt-4 text-center text-lightred">
        Please DO NOT modify this file if you don't understand how it works.
      </p>
    </div>
  );
};

export const Download = ({ active, onClose }: ModalControl) => {
  return (
    <Modal
      className="p-4 rounded-lg bg-darkblue-2 shadow-white-glow"
      style={{ width: "28rem" }}
      {...{ active, onClose }}
    >
      <CloseButton className="absolute top-1 right-1" boneOnly onClick={onClose} />
      <DownloadOptions />
    </Modal>
  );
};
