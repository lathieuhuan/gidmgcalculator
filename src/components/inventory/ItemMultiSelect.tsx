import { useState } from "react";
import { FaCheck } from "react-icons/fa";

import type { BooleanRecord, UserArtifact, UserWeapon } from "@Src/types";
import { isUserWeapon } from "@Src/utils";

// Component
import { Button, ModalHeader, withModal } from "@Src/pure-components";
import { ArtifactCard } from "../ArtifactCard";
import { OwnerLabel } from "../OwnerLabel";
import { WeaponCard } from "../WeaponCard";
import { InventoryRack } from "./InventoryRack";

interface ItemMultiSelectProps {
  itemType: "weapon" | "artifact";
  items: UserWeapon[] | UserArtifact[];
  max?: number;
  onClose: () => void;
  onConfirm: (chosenIDs: BooleanRecord) => void;
}

const ItemMultiSelectCore = (props: ItemMultiSelectProps) => {
  const { max } = props;
  const [chosenItem, setChosenItem] = useState<UserWeapon | UserArtifact>();
  const [chosenIDs, setChosenIDs] = useState<BooleanRecord>({});

  const chosenCount = Object.values(chosenIDs).filter(Boolean).length;

  const onClickItem = (item: UserWeapon | UserArtifact) => {
    setChosenItem(item as UserWeapon);

    if (!chosenIDs[item.ID] && max && chosenCount < max) {
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
        <ModalHeader className="grid-cols-5">
          <div className="pl-4 flex items-center col-span-4 md2:col-span-2">
            <Button
              className={"shadow-none " + (chosenCount !== max ? "text-black/60" : "")}
              variant="default"
              boneOnly={chosenCount !== max}
              icon={<FaCheck />}
              style={{ paddingTop: 2, paddingBottom: 0 }}
              onClick={() => props.onConfirm(chosenIDs)}
            >
              Confirm
            </Button>
            <p className="ml-3 text-black font-bold">
              {chosenCount}/{max} selected
            </p>
          </div>
          <ModalHeader.RightEnd onClickClose={props.onClose} />
        </ModalHeader>
      </div>

      <div className="p-2 pr-4 grow flex hide-scrollbar">
        <InventoryRack
          listClassName="inventory-list"
          itemClassName="inventory-item"
          chosenID={chosenItem?.ID || 1}
          chosenIDs={chosenIDs}
          itemType={props.itemType}
          items={props.items}
          onUnchooseItem={onUnchooseItem}
          onClickItem={onClickItem}
        />

        <div className="flex flex-col justify-between">
          <div className="p-4 rounded-lg bg-darkblue-1 grow" style={{ minHeight: "28rem" }}>
            <div className="w-68 h-full hide-scrollbar">
              {chosenItem ? (
                isUserWeapon(chosenItem) ? (
                  <WeaponCard weapon={chosenItem} />
                ) : (
                  <ArtifactCard artifact={chosenItem} />
                )
              ) : null}
            </div>
          </div>

          <OwnerLabel item={chosenItem} />
        </div>
      </div>
    </div>
  );
};

export const ItemMultiSelect = withModal(ItemMultiSelectCore, { withDefaultStyle: true });
