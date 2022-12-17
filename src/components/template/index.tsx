import type { ArtifactSetBonus } from "@Src/types";

// Util
import { findArtifactSet } from "@Data/controllers";

// Component
import { CloseButton } from "@Components/atoms";
import { Modal, type ModalControl } from "../modals";

export * from "./modifiers-render";
export * from "./ModifierTemplate";
export * from "./ConfirmModal";

interface ISetBonusesDisplayProps {
  setBonuses: ArtifactSetBonus[];
  noTitle?: boolean;
}
export function SetBonusesDisplay({ setBonuses, noTitle }: ISetBonusesDisplayProps) {
  return (
    <div>
      {!noTitle && <p className="text-lg leading-relaxed text-orange font-semibold">Set bonus</p>}

      {setBonuses.length > 0 ? (
        setBonuses.map(({ code, bonusLv }, index) => {
          const content = [];
          const artData = findArtifactSet({ code })!;

          for (let i = 0; i <= bonusLv; i++) {
            const { desc } = artData.setBonuses[i];
            content.push(
              <li key={i} className="mt-1">
                <span className="text-orange">{(i + 1) * 2}-Piece Set:</span> <span>{desc}</span>
              </li>
            );
          }
          return (
            <div key={index} className="mt-1">
              <p className="text-lg leading-relaxed font-medium text-green">{artData.name}</p>
              <ul className="pl-6 list-disc">{content}</ul>
            </div>
          );
        })
      ) : (
        <p className="text-lesser font-medium">No Set Bonus</p>
      )}
    </div>
  );
}

interface TipsModalProps extends ModalControl {
  children: JSX.Element;
}
export function TipsModal({ active, children, onClose }: TipsModalProps) {
  return (
    <Modal active={active} className="p-4" withDefaultStyle onClose={onClose}>
      <CloseButton className="absolute top-3 right-3" onClick={onClose} />
      <p className="mb-2 text-1.5xl text-orange font-bold">Tips</p>
      {children}
    </Modal>
  );
}
