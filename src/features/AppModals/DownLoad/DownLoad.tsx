import { FaDownload } from "react-icons/fa";

import { useSelector } from "@Store/hooks";
import { selectUserArts, selectUserChars, selectUserSetups, selectUserWps } from "@Store/userDatabaseSlice/selectors";

// Component
import { Button, Modal } from "@Src/pure-components";

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
    <div className="flex flex-col space-y-4">
      <Button className="mx-auto" variant="positive" icon={<FaDownload />} onClick={onClickDownload}>
        Download
      </Button>

      <p className="text-center text-red-100">
        Please DO NOT modify this file if you don't understand how it works.
      </p>
    </div>
  );
};

export const Download = Modal.wrap(DownloadOptions, {
  preset: "small",
  title: "Download",
  className: "bg-dark-700",
});
