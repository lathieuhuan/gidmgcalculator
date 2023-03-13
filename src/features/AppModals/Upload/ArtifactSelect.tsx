import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import type { BooRecord, UserArtifact, UserWeapon } from "@Src/types";

// Component
import { Modal, ModalHeader, type ModalControl } from "@Components/molecules";
import { ArtifactCard, InventoryRack, OwnerLabel } from "@Components/organisms";
import { Button } from "@Components/atoms";

interface ArtifactSelectProps {
  items: UserArtifact[];
  max: number;
  onClose: () => void;
  onConfirm: (chosenIDs: BooRecord) => void;
}
const ArtifactSelectCore = ({ items, max, onClose, onConfirm }: ArtifactSelectProps) => {
  const [chosenArtifact, setChosenArtifact] = useState<UserArtifact>();
  const [chosenIDs, setChosenIDs] = useState(
    items.reduce((map: BooRecord, item) => {
      map[item.ID] = false;
      return map;
    }, {})
  );

  const chosenCount = Object.values(chosenIDs).filter(Boolean).length;

  const onClickItem = (item: UserArtifact | UserWeapon) => {
    setChosenArtifact(item as UserArtifact);

    if (!chosenIDs[item.ID] && chosenCount < max) {
      setChosenIDs((prevChosenIDs) => {
        const newChosenIDs = { ...prevChosenIDs };
        newChosenIDs[item.ID] = true;
        return newChosenIDs;
      });
    }
  };

  const onUnchooseItem = (item: UserArtifact | UserWeapon) => {
    setChosenIDs((prevChosenIDs) => {
      const newChosenIDs = { ...prevChosenIDs };
      newChosenIDs[item.ID] = false;
      return newChosenIDs;
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <ModalHeader>
          <div className="pl-4 flex items-center md2:col-span-2">
            <Button
              className={"shadow-none " + (chosenCount !== max ? "text-black/60" : "")}
              variant="default"
              boneOnly={chosenCount !== max}
              icon={<FaCheck />}
              style={{ paddingTop: 2, paddingBottom: 0 }}
              onClick={() => onConfirm(chosenIDs)}
            >
              Confirm
            </Button>
            <span className="ml-3 text-black font-bold">
              {chosenCount}/{max} artifacts selected
            </span>
          </div>
          <ModalHeader.RightEnd onClickClose={onClose} />
        </ModalHeader>
      </div>

      <div className="p-2 pr-4 grow flex hide-scrollbar">
        <InventoryRack
          listClassName="inventory-list"
          itemClassName="inventory-item"
          chosenID={chosenArtifact?.ID || 1}
          chosenIDs={chosenIDs}
          itemType="artifact"
          items={items}
          onUnchooseItem={onUnchooseItem}
          onClickItem={onClickItem}
        />

        <div className="flex flex-col justify-between">
          <div className="p-4 rounded-lg bg-darkblue-1 grow" style={{ minHeight: "28rem" }}>
            <div className="w-68 h-full hide-scrollbar">
              <ArtifactCard space="mx-3" artifact={chosenArtifact} />
            </div>
          </div>

          <OwnerLabel owner={chosenArtifact?.owner} />
        </div>
      </div>
    </div>
  );
};

export const ArtifactSelect = ({ active, onClose, ...rest }: ModalControl & ArtifactSelectProps) => {
  return (
    <Modal withDefaultStyle {...{ active, onClose }}>
      <ArtifactSelectCore {...rest} onClose={onClose} />
    </Modal>
  );
};
