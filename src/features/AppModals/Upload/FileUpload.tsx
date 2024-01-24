import { useRef } from "react";
import { FaUpload } from "react-icons/fa";
import type { UploadedData } from "./types";

// Util
import { notification } from "@Src/utils/notification";
import { convertFromGoodFormat, toVersion3_0 } from "@Src/utils/convertUserData";

// Component
import { Button, Modal } from "@Src/pure-components";

interface FileUploadProps {
  onSuccessUploadFile: (data: UploadedData) => void;
}
const FileUploadCore = ({ onSuccessUploadFile }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onUploadFile = () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const isJson = /application.*/.test(file.type);

    if (/text.*/.test(file.type) || isJson) {
      reader.onload = function (event) {
        try {
          let data = JSON.parse((event.target?.result as string) || "");
          if (isJson) data = convertFromGoodFormat(data);

          const version = +data.version;

          if (version < 2.1) {
            notification.error({
              content: "Your data are too old and cannot be converted to the current version.",
            });
          }
          if (version === 2.1) {
            return onSuccessUploadFile(toVersion3_0(data));
          }
          if (version === 3) {
            return onSuccessUploadFile(data);
          }

          notification.error({
            content: "Your version of data cannot be recognised.",
          });
        } catch (err) {
          console.log(err);

          notification.error({
            content: "An error occurred while reading your data.",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-4 flex flex-col bg-dark-700">
      <p className="mt-4 px-8 text-center text-light-400">Upload a .TXT file of GIDC or a .JSON file in GOOD format</p>
      <input
        ref={inputRef}
        hidden
        type="file"
        // accept="text/*"
        accept="text/*,application/json"
        onChange={onUploadFile}
      />
      <Button
        className="mt-4 mb-4 mx-auto"
        variant="positive"
        icon={<FaUpload />}
        onClick={() => inputRef.current?.click()}
      >
        Choose File
      </Button>
    </div>
  );
};

export const FileUpload = Modal.wrap(FileUploadCore, { preset: "small" }, true);
