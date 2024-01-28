import type { ReactNode } from "react";
import type { StringRecord } from "@Src/types";
import { Image, Modal, type ModalControl } from "@Src/pure-components";

interface TypeSelectProps extends ModalControl {
  options: StringRecord;
  footer?: ReactNode;
  onSelect: (key: string) => void;
}
export function TypeSelect({ active, options, footer, onSelect, onClose }: TypeSelectProps) {
  return (
    <Modal active={active} className="p-4 bg-dark-700" preset="small" title="Choose a Type" onClose={onClose}>
      <div className="flex">
        {Object.entries(options).map(([type, value], i) => (
          <button
            key={i}
            className="mx-1 p-1 w-14 h-14 rounded-full hover:bg-yellow-400"
            onClick={() => onSelect(type)}
          >
            <Image src={value} imgType="weapon" />
          </button>
        ))}
      </div>
      {footer}
    </Modal>
  );
}
