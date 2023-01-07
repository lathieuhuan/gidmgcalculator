import clsx from "clsx";
import { Fragment, useEffect, useRef, useState } from "react";

// Util
import { downloadToDevice, styles } from "./utils";

// Component
import { Button, CloseButton } from "@Components/atoms";
import { Modal, type ModalControl } from "@Components/molecules";

type MessageState =
  | { uploadCase: "auto"; result: "success" | "fail" | "no_data" }
  | { uploadCase: "manual"; result: "success" | "fail" };

interface UploadOptionsProps {
  uploadUserDatabase: (data: any) => void;
  onSuccess: () => void;
  onClose: () => void;
}
function Options({ uploadUserDatabase, onSuccess, onClose }: UploadOptionsProps) {
  const [message, setMessage] = useState<MessageState | null>(null);

  const tryToLoadFromLocalStorage = () => {
    let data = localStorage.getItem("GDC_Data");

    if (data) {
      data = JSON.parse(data);
      try {
        uploadUserDatabase(data);
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
      downloadToDevice(data);
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);

  const manuallyUpload = () => {
    const file = inputRef.current?.files?.[0];
    const reader = new FileReader();
    const isJson = file?.type.match(/application.*/);

    if (file?.type.match(/text.*/) || isJson) {
      reader.onload = function (event) {
        try {
          let data = JSON.parse((event.target?.result as string) || "");
          // if (isJson) data = convertToGOOD(data);

          uploadUserDatabase(data);
          setMessage({
            uploadCase: "manual",
            result: "success",
          });

          if (typeof onSuccess === "function") {
            onSuccess();
          }
        } catch (err) {
          console.log(err);

          setMessage({
            uploadCase: "manual",
            result: "fail",
          });
        }
      };
      reader.readAsText(file!);
    }
  };

  const failMessage =
    "An Error has occured while loading your data. Please send me your Database to fix it.";

  const messageColor = message?.result === "success" ? "text-green" : "text-lightred";
  const uploadFromLocalStorageFailed = message?.uploadCase === "auto" && message?.result === "fail";

  return (
    <Fragment>
      <CloseButton className="ml-auto mr-2 mb-4" onClick={onClose} />

      <div className={clsx("flex flex-col items-center", styles.option)}>
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
      <div className={clsx("flex flex-col items-center", styles.option)}>
        <p className="px-4 py-2 text-xl text-default text-center">
          Upload a .TXT file or a .JSON file in GOOD format
        </p>

        {message?.uploadCase === "manual" && (
          <p className={clsx("mb-2 font-bold text-center", messageColor)}>
            {message.result === "success" ? "Successfully uploaded your File" : failMessage}
          </p>
        )}

        <input
          ref={inputRef}
          hidden
          type="file"
          accept="text/*,application/json"
          onChange={manuallyUpload}
        />
        <Button className="my-1" variant="positive" onClick={() => inputRef.current?.click()}>
          Choose File
        </Button>
      </div>
    </Fragment>
  );
}

export function UploadOptions({ active, onClose, ...rest }: ModalControl & UploadOptionsProps) {
  return (
    <Modal
      active={active}
      className={styles.wrapper + " max-w-95"}
      style={{ width: "28rem" }}
      onClose={onClose}
    >
      <Options {...rest} onClose={onClose} />
    </Modal>
  );
}
