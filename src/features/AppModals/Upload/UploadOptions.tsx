import clsx from "clsx";
import { Fragment, useRef, useState } from "react";
import type { UploadedData, UploadStep } from "./types";

// Constant
import { MAX_USER_ARTIFACTS, MAX_USER_WEAPONS } from "@Src/constants";

// Util
import { convertFromGoodFormat, toVersion3_0 } from "@Src/utils/convertUserData";
import { downloadToDevice } from "@Src/utils";

// Hook
import { useDispatch } from "@Store/hooks";

// Action
import { addUserDatabase } from "@Store/userDatabaseSlice";

// Component
import { Button, CloseButton } from "@Components/atoms";
import { Modal, type ModalControl } from "@Components/molecules";

type MessageState =
  | { uploadMethod: "auto"; result: "success" | "fail" | "no_data" }
  | { uploadMethod: "manual"; result: "success" | "fail" };

interface UploadOptionsProps {
  onRequestSelect: (data: UploadedData, steps: UploadStep[]) => void;
  onClose: () => void;
}
const UploadOptionsCore = ({ onClose, onRequestSelect }: UploadOptionsProps) => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState<MessageState | null>(null);

  const addUserData = (data: UploadedData, method: "manual" | "auto") => {
    const uploadSteps: UploadStep[] = [];

    if (data.weapons.length > MAX_USER_WEAPONS) {
      uploadSteps.push("CHECK_WEAPONS");
    }
    if (data.artifacts.length > MAX_USER_ARTIFACTS) {
      uploadSteps.push("CHECK_ARTIFACTS");
    }

    if (uploadSteps.length) {
      return onRequestSelect(data, uploadSteps);
    }

    dispatch(addUserDatabase(data));

    setMessage({
      uploadMethod: method,
      result: "success",
    });
  };

  const checkAndAddUserData = (data: any, method: "manual" | "auto") => {
    const version = +data.version;

    if (version < 2.1) {
      // "Your database are too old and cannot be converted to the current version"
      return setMessage({
        uploadMethod: method,
        result: "fail",
      });
    }
    if (version === 2.1) {
      return addUserData(toVersion3_0(data), method);
    }
    if (version === 3) {
      return addUserData(data, method);
    }

    // "Your version of data cannot be recognised."
    setMessage({
      uploadMethod: method,
      result: "fail",
    });
  };

  const tryToLoadFromLocalStorage = () => {
    let data = localStorage.getItem("GDC_Data");

    if (data) {
      data = JSON.parse(data);

      checkAndAddUserData(data, "auto");
    } else {
      setMessage({
        uploadMethod: "auto",
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

          checkAndAddUserData(data, "manual");
        } catch (err) {
          console.log(err);

          setMessage({
            uploadMethod: "manual",
            result: "fail",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const failMessage = "An Error has occured while loading your data. You can send me your data for checking.";

  const messageColor = message?.result === "success" ? "text-green" : "text-lightred";
  const autoUploadFailed = message?.uploadMethod === "auto" && message?.result === "fail";

  return (
    <Fragment>
      <CloseButton className="ml-auto mr-2 mb-4" onClick={onClose} />

      <div className="load-option flex flex-col items-center">
        <p className="px-4 py-2 text-xl text-default text-center">Load from Local Storage</p>

        {message?.uploadMethod === "auto" && (
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
            if (autoUploadFailed) {
              downloadFromLocalStorageToDevice();
            } else {
              tryToLoadFromLocalStorage();
            }
          }}
        >
          {autoUploadFailed ? "Download Database" : "Load"}
        </Button>
      </div>

      <div className="w-full border-b border-default" />

      <div className="load-option flex flex-col items-center">
        <p className="px-4 py-2 text-xl text-default text-center">
          Upload a .TXT file of GIDC or a .JSON file in GOOD format
        </p>

        {message?.uploadMethod === "manual" && (
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
