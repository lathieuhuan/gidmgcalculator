import type { ReactNode } from "react";
import { Image, Modal, type ModalControl } from "@Src/pure-components";

interface TypeSelectProps extends ModalControl {
  options: Array<{
    type: string;
    icon: string;
  }>;
  footer?: ReactNode;
  onSelect: (key: string) => void;
}
export function TypeSelect({ active, options, footer, onSelect, onClose }: TypeSelectProps) {
  return (
    <Modal active={active} className="bg-dark-700" preset="small" title="Choose a Type" onClose={onClose}>
      <div className="flex space-x-2">
        {options.map((option, i) => (
          <button key={i} className="p-1 w-full rounded-full hover:bg-yellow-400" onClick={() => onSelect(option.type)}>
            <Image src={option.icon} imgType="weapon" />
          </button>
        ))}
      </div>
      {footer}
    </Modal>
  );
}
