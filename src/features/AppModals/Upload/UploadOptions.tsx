import clsx from "clsx";
import { Fragment, useRef, useState } from "react";

// Hook
import { useDispatch } from "@Store/hooks";

// Util
import { convertUserData, convertFromGoodFormat } from "@Src/utils/convertUserData";
import { downloadToDevice } from "@Src/utils";

// Action
import { addUserDatabase } from "@Store/userDatabaseSlice";

// Component
import { Button, CloseButton } from "@Components/atoms";
import { Modal, type ModalControl } from "@Components/molecules";
import { UserArtifact, UserCharacter, UserSetup, UserWeapon } from "@Src/types";

type MessageState =
  | { uploadCase: "auto"; result: "success" | "fail" | "no_data" }
  | { uploadCase: "manual"; result: "success" | "fail" };

export interface UploadedData {
  characters: UserCharacter[];
  weapons: UserWeapon[];
  artifacts: UserArtifact[];
  setups: UserSetup[];
}

interface UploadOptionsProps {
  onClose: () => void;
  onSuccessUpload: (data: UploadedData) => void;
}
const UploadOptionsCore = ({ onClose, onSuccessUpload }: UploadOptionsProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState<MessageState | null>(null);

  const checkAndAddUserData = (data: any) => {
    const { version, ...database } = convertUserData(data);
    onSuccessUpload(database);
  };

  const tryToLoadFromLocalStorage = () => {
    let data = localStorage.getItem("GDC_Data");

    if (data) {
      data = JSON.parse(data);

      try {
        checkAndAddUserData(data);
        setMessage({
          uploadCase: "auto",
          result: "success",
        });
      } catch (err) {
        setMessage({
          uploadCase: "auto",
          result: "fail",
        });
      }
    } else {
      setMessage({
        uploadCase: "auto",
        result: "no_data",
      });
    }
  };

  const downloadFromLocalStorageToDevice = () => {
    const data = localStorage.getItem("GDC_Data");

    if (data) {
      downloadToDevice(data, "plain/text");
    }
  };

  const manuallyUpload = () => {
    const file = inputRef.current?.files?.[0];
    const reader = new FileReader();
    const isJson = file?.type.match(/application.*/);

    if (file && (file.type.match(/text.*/) || isJson)) {
      reader.onload = function (event) {
        try {
          let data = JSON.parse((event.target?.result as string) || "");

          if (isJson) {
            data = convertFromGoodFormat(data);
          }

          checkAndAddUserData(data);

          setMessage({
            uploadCase: "manual",
            result: "success",
          });
        } catch (err) {
          console.log(err);

          setMessage({
            uploadCase: "manual",
            result: "fail",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const failMessage = "An Error has occured while loading your data. Please send me your Database to fix it.";

  const messageColor = message?.result === "success" ? "text-green" : "text-lightred";
  const uploadFromLocalStorageFailed = message?.uploadCase === "auto" && message?.result === "fail";

  return (
    <Fragment>
      <CloseButton className="ml-auto mr-2 mb-4" onClick={onClose} />

      <div className="load-option flex flex-col items-center">
        <p className="px-4 py-2 text-xl text-default text-center">Load from Local Storage</p>

        {message?.uploadCase === "auto" && (
          <p className={clsx("mb-2 text-lg font-bold text-center", messageColor)}>
            {
              {
                success: "Successfully loaded data from Local Storage",
                no_data: "! There's no data in your Local Storage !",
                fail: failMessage,
              }[message.result]
            }
          </p>
        )}

        <Button
          className="my-1"
          variant="positive"
          onClick={() => {
            if (uploadFromLocalStorageFailed) {
              downloadFromLocalStorageToDevice();
            } else {
              tryToLoadFromLocalStorage();
            }
          }}
        >
          {uploadFromLocalStorageFailed ? "Download Database" : "Load"}
        </Button>
      </div>

      <div className="w-full border-b border-default" />

      <div className="load-option flex flex-col items-center">
        <p className="px-4 py-2 text-xl text-default text-center">
          Upload a .TXT file of GIDC or a .JSON file in GOOD format
        </p>

        {message?.uploadCase === "manual" && (
          <p className={clsx("mb-2 font-bold text-center", messageColor)}>
            {message.result === "success" ? "Successfully uploaded your file" : failMessage}
          </p>
        )}

        <input
          ref={inputRef}
          hidden
          type="file"
          // accept="text/*"
          accept="text/*,application/json"
          onChange={manuallyUpload}
        />
        <Button className="my-1" variant="positive" onClick={() => inputRef.current?.click()}>
          Choose File
        </Button>
      </div>
    </Fragment>
  );
};

export const UploadOptions = ({ active, onClose, ...rest }: ModalControl & UploadOptionsProps) => {
  return (
    <Modal
      className="pt-2 pb-4 rounded-lg bg-darkblue-2 shadow-white-glow"
      style={{ width: "28rem" }}
      {...{ active, onClose }}
    >
      <UploadOptionsCore onClose={onClose} {...rest} />
    </Modal>
  );
};
