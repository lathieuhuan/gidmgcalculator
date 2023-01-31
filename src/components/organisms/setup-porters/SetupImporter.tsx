import { useState } from "react";
import { Modal, ModalControl } from "@Components/molecules";

const SetupImporterCore = ({ onClose }: Pick<ModalControl, "onClose">) => {
  const [code, setCode] = useState("");

  return (
    <div>
      <p className="mb-2 px-2 text-xl text-orange text-center font-bold">Import setup</p>
      <textarea
        className="w-full p-2 text-black rounded resize-none"
        rows={15}
        onChange={(e) => setCode(e.target.value)}
      />
    </div>
  );
};

export const SetupImporter = ({ active, onClose }: ModalControl) => {
  return (
    <Modal className="" {...{ active, onClose }}>
      <SetupImporterCore onClose={onClose} />
    </Modal>
  );
};
