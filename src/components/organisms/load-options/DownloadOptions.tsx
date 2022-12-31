import clsx from "clsx";
import { Fragment, useState } from "react";

// Hook
import { useSelector } from "@Store/hooks";

// Selector
import {
  selectUserArts,
  selectUserChars,
  selectMySetups,
  selectUserWps,
} from "@Store/userDatabaseSlice/selectors";

// Util
import { downloadToDevice, styles } from "./utils";

// Component
import { CloseButton } from "@Components/atoms";
import { ButtonBar, Modal, type ModalControl } from "@Components/molecules";

function Options({ onClose }: { onClose: () => void }) {
  const [messageType, setMessageType] = useState(0);
  const userChars = useSelector(selectUserChars);
  const userWps = useSelector(selectUserWps);
  const userArts = useSelector(selectUserArts);
  const mySetups = useSelector(selectMySetups);

  const downloadData = JSON.stringify({
    version: 2.1,
    Characters: userChars,
    Weapons: userWps,
    Artifacts: userArts,
    Setups: mySetups,
  });

  const saveToLocalStorage = () => {
    localStorage.setItem("GDC_Data", downloadData);
    setMessageType(2);
  };

  const trySaveToLocalStorage = () => {
    if (localStorage.getItem("GDC_Data")) {
      setMessageType(1);
    } else {
      saveToLocalStorage();
    }
  };

  return (
    <Fragment>
      <CloseButton className="ml-auto mr-2 mb-2" onClick={onClose} />

      <div className={styles.option} onClick={trySaveToLocalStorage}>
        <p className="mt-1 text-xl font-bold text-lightgold">Save to Local Storage</p>
        <p className="mt-1 text-default">
          • Your Database stays in this Browser only and will be removed if you clear the Local
          Storage.
        </p>
      </div>

      {!!messageType && (
        <>
          <div className="w-full border-b border-default" />
          <div className="p-4">
            <p
              className={clsx(
                "mt-1 text-lg font-b text-center",
                messageType === 1 ? "text-lightred" : "text-green"
              )}
            >
              {messageType === 1
                ? "We detect old data in your Local Storage. Do you want to replace it?"
                : "Successfully saved to Local Storage!"}
            </p>

            {messageType === 1 && (
              <ButtonBar
                className="my-2"
                buttons={[
                  { text: "Cancel", onClick: onClose },
                  { text: "Confirm", onClick: saveToLocalStorage },
                ]}
              />
            )}
          </div>
        </>
      )}

      <div className="w-full border-b border-default" />
      <div className={styles.option} onClick={() => downloadToDevice(downloadData)}>
        <p className="mt-1 text-xl font-bold text-lightgold">Download a .TXT file</p>
        <p className="mt-1 text-default">
          • Please DO NOT modify this file if you don't understand how it works.
        </p>
      </div>
    </Fragment>
  );
}

export function DownloadOptions({ active, onClose }: ModalControl) {
  return (
    <Modal
      active={active}
      className={styles.wrapper + " max-w-95"}
      style={{ width: "28rem" }}
      onClose={onClose}
    >
      <Options onClose={onClose} />
    </Modal>
  );
}
