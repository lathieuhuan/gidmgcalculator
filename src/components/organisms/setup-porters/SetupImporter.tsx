import { useState } from "react";

import { Modal, ModalControl } from "@Components/molecules";
import { PorterLayout } from "./atoms";
import { decodeSetup } from "./utils";

const SetupImporterCore = ({ onClose }: Pick<ModalControl, "onClose">) => {
  const [code, setCode] = useState("");

  return (
    <PorterLayout
      heading="Import setup"
      textareaAttrs={{
        onChange: (e) => setCode(e.target.value),
      }}
      moreButtons={[
        {
          text: "Import",
          onClick: () => {
            const split = code.split("&").map((str) => str.split("=")[1]);
            const result = decodeSetup(split);

            console.log(result);
          },
        },
      ]}
      onClose={onClose}
    />
  );
};

export const SetupImporter = ({ active, onClose }: ModalControl) => {
  return (
    <Modal className="" {...{ active, onClose }}>
      <SetupImporterCore onClose={onClose} />
    </Modal>
  );
};
