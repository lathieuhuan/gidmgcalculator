import { useState } from "react";
import type { BooRecord, UserArtifact, UserWeapon } from "@Src/types";

// Component
import { Modal, ModalHeader, type ModalControl } from "@Components/molecules";
import { InventoryRack, OwnerLabel, WeaponCard } from "@Components/organisms";
import { Button } from "@Components/atoms";
import { FaCheck } from "react-icons/fa";

interface WeaponSelectProps {
  items: UserWeapon[];
  onClose: () => void;
  onConfirm: (chosenIDs: BooRecord) => void;
}
const WeaponSelectCore = ({ items, onClose, onConfirm }: WeaponSelectProps) => {
  const [chosenWeapon, setChosenWeapon] = useState<UserWeapon>();
  const [chosenIDs, setChosenIDs] = useState(
    items.reduce((map: BooRecord, item) => {
      map[item.ID] = false;
      return map;
    }, {})
  );

  const onClickItem = (item: UserWeapon | UserArtifact) => {
    setChosenWeapon(item as UserWeapon);

    if (!chosenIDs[item.ID]) {
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
          <div />
          {/* <ModalHeader.Text>Weapons</ModalHeader.Text> */}
          <div className="flex-center">
            <Button
              className="shadow-none hover:bg-lesser"
              variant="default"
              icon={<FaCheck />}
              onClick={() => onConfirm(chosenIDs)}
            >
              Confirm
            </Button>
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
