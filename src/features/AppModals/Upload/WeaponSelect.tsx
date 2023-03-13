import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import type { BooRecord, UserArtifact, UserWeapon } from "@Src/types";

// Component
import { Modal, ModalHeader, type ModalControl } from "@Components/molecules";
import { InventoryRack, OwnerLabel, WeaponCard } from "@Components/organisms";
import { Button } from "@Components/atoms";

interface WeaponSelectProps {
  items: UserWeapon[];
  max: number;
  onClose: () => void;
  onConfirm: (chosenIDs: BooRecord) => void;
}
const WeaponSelectCore = ({ items, max, onClose, onConfirm }: WeaponSelectProps) => {
  const [chosenWeapon, setChosenWeapon] = useState<UserWeapon>();
  const [chosenIDs, setChosenIDs] = useState(
    items.reduce((map: BooRecord, item) => {
      map[item.ID] = false;
      return map;
    }, {})
  );

  const chosenCount = Object.values(chosenIDs).filter(Boolean).length;

  const onClickItem = (item: UserWeapon | UserArtifact) => {
    setChosenWeapon(item as UserWeapon);

    if (!chosenIDs[item.ID] && chosenCount < max) {
      setChosenIDs((prevChosenIDs) => {
        const newChosenIDs = { ...prevChosenIDs };
        newChosenIDs[item.ID] = true;
        return newChosenIDs;
      });
    }
  };

  const onUnchooseItem = (item: UserWeapon | UserArtifact) => {
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
              {chosenCount}/{max} weapons selected
            </span>
          </div>
          <ModalHeader.RightEnd onClickClose={onClose} />
        </ModalHeader>
      </div>

      <div className="p-2 pr-4 grow flex hide-scrollbar">
        <InventoryRack
          listClassName="inventory-list"
          itemClassName="inventory-item"
          chosenID={chosenWeapon?.ID || 1}
          chosenIDs={chosenIDs}
          itemType="weapon"
          items={items}
          onUnchooseItem={onUnchooseItem}
          onClickItem={onClickItem}
        />

        <div className="flex flex-col justify-between">
          <div className="p-4 rounded-lg bg-darkblue-1 grow" style={{ minHeight: "28rem" }}>
            <div className="w-68 h-full hide-scrollbar">
              <WeaponCard weapon={chosenWeapon} />
            </div>
          </div>

          <OwnerLabel owner={chosenWeapon?.owner} />
        </div>
      </div>
    </div>
  );
};

export const WeaponSelect = ({ active, onClose, ...rest }: ModalControl & WeaponSelectProps) => {
  return (
    <Modal withDefaultStyle {...{ active, onClose }}>
      <WeaponSelectCore {...rest} onClose={onClose} />
    </Modal>
  );
};
