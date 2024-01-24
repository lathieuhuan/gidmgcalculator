import type { ReactNode } from "react";

import type { StringRecord } from "@Src/types";
import { getImgSrc } from "@Src/utils";

// Component
import { CloseButton, Modal, type ModalControl } from "@Src/pure-components";

interface TypeSelectProps extends ModalControl {
  options: StringRecord;
  footer?: ReactNode;
  onSelect: (key: string) => void;
}
export function TypeSelect({ active, options, onSelect, onClose, footer }: TypeSelectProps) {
  return (
    <Modal active={active} className="p-4 bg-dark-500" preset="small" onClose={onClose}>
      <CloseButton className="absolute top-1 right-1" boneOnly onClick={onClose} />

      <p className="mt-2 text-2xl text-center text-light-400 font-medium">Choose a Type</p>
      <div className="mt-2 mb-1 flex">
        {Object.entries(options).map(([title, src], i) => (
          <button
            key={i}
            className="mx-1 p-1 w-14 h-14 rounded-full hover:bg-yellow-400"
            onClick={() => onSelect(title)}
          >
            <img className="w-full" src={getImgSrc(src)} alt={title} draggable={false} />
          </button>
        ))}
      </div>
      {footer}
    </Modal>
  );
}
