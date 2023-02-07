import clsx from "clsx";
import { Fragment, useState } from "react";

// Hook
import { useSelector } from "@Store/hooks";

// Selector
import {
  selectUserArts,
  selectUserChars,
  selectUserSetups,
  selectUserWps,
} from "@Store/userDatabaseSlice/selectors";

// Util
import { downloadToDevice } from "./utils";

// Component
import { CloseButton } from "@Components/atoms";
import { ButtonBar } from "@Components/molecules";
import { LoadOption } from "./atoms";

export function DownloadOptions({ onClose }: { onClose: () => void }) {
  const [messageType, setMessageType] = useState(0);
  const userChars = useSelector(selectUserChars);
  const userWps = useSelector(selectUserWps);
  const userArts = useSelector(selectUserArts);
  const userSetups = useSelector(selectUserSetups);

  const downloadData = JSON.stringify({
    version: 3,
    characters: userChars,
    weapons: userWps,
    artifacts: userArts,
    setups: userSetups,
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

      <LoadOption onClick={trySaveToLocalStorage}>
        <p className="mt-1 text-xl font-bold text-lightgold">Save to Local Storage</p>
        <p className="mt-1 text-default">
          • Your Database stays in this Browser only and will be removed if you clear the Local
          Storage.
        </p>
      </LoadOption>

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

      <LoadOption onClick={() => downloadToDevice(downloadData)}>
        <p className="mt-1 text-xl font-bold text-lightgold">Download a .TXT file</p>
        <p className="mt-1 text-default">
          • Please DO NOT modify this file if you don't understand how it works.
        </p>
      </LoadOption>
    </Fragment>
  );
}
