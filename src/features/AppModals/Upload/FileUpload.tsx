import { useRef } from "react";
import { FaUpload } from "react-icons/fa";
import type { UploadedData } from "./types";
import type { ModalControl } from "@Src/components";

// Util
import { notification } from "@Src/utils";
import { convertFromGoodFormat, toVersion3_0 } from "@Src/utils/convertUserData";

// Component
import { Button, CloseButton, Modal } from "@Src/components";

interface FileUploadProps {
  onSuccessUploadFile: (data: UploadedData) => void;
}
const FileUploadCore = ({ onSuccessUploadFile }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onUploadFile = () => {
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

          const version = +data.version;

          if (version < 2.1) {
            notification.error({
              content: "Your database are too old and cannot be converted to the current version.",
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
            content: "Your version of data cannot be recognised.",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col">
      <p className="mt-4 px-8 text-center text-default">Upload a .TXT file of GIDC or a .JSON file in GOOD format</p>

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

export const FileUpload = ({ active, onClose, ...rest }: ModalControl & FileUploadProps) => {
  return (
    <Modal
      className="p-4 rounded-lg bg-darkblue-2 shadow-white-glow"
      style={{ width: "28rem" }}
      {...{ active, onClose }}
    >
      <CloseButton className="absolute top-1 right-1" boneOnly onClick={onClose} />
      <FileUploadCore {...rest} />
    </Modal>
  );
};
