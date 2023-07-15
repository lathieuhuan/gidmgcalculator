import type { ReactNode } from "react";

import type { StringRecord } from "@Src/types";
import { getImgSrc } from "@Src/utils";

// Component
import { CloseButton, Modal, type ModalControl } from "@Src/pure-components";

interface TypeSelectProps extends ModalControl {
  choices: StringRecord;
  footer?: ReactNode;
  onClickChoice: (choice: string) => void;
}
export function TypeSelect({ active, choices, onClickChoice, onClose, footer }: TypeSelectProps) {
  return (
    <Modal active={active} className="p-4 shadow-white-glow rounded-2xl bg-darkblue-3" onClose={onClose}>
      <CloseButton className="absolute top-1 right-1" boneOnly onClick={onClose} />

      <p className="mt-2 text-2xl text-center text-default font-medium">Choose a Type</p>
      <div className="mt-2 mb-1 flex">
        {Object.entries(choices).map(([title, src], i) => (
          <button
            key={i}
            className="mx-1 p-1 w-14 h-14 rounded-full hover:bg-lightgold"
            onClick={() => onClickChoice(title)}
          >
            <img className="w-full" src={getImgSrc(src)} alt={title} draggable={false} />
          </button>
        ))}
      </div>
      {footer}
    </Modal>
  );
}