import { useState } from "react";
import { FaCheck } from "react-icons/fa";

import type { BooleanRecord, UserArtifact, UserWeapon } from "@Src/types";
import { isUserWeapon } from "@Src/utils";

// Component
import { Button, Modal } from "@Src/pure-components";
import { ArtifactCard } from "../ArtifactCard";
import { OwnerLabel } from "../OwnerLabel";
import { WeaponCard } from "../WeaponCard";
import { EntitySelectTemplate } from "../EntitySelectTemplate";
import { InventoryRack } from "./InventoryRack";

interface ItemMultiSelectProps {
  title: string;
  items: UserWeapon[] | UserArtifact[];
  max: number;
  onClose: () => void;
  onConfirm: (chosenIDs: BooleanRecord) => void;
}

const ItemMultiSelectCore = (props: ItemMultiSelectProps) => {
  const [chosenItem, setChosenItem] = useState<UserWeapon | UserArtifact>();
  const [chosenIDs, setChosenIDs] = useState<BooleanRecord>({});

  const chosenCount = Object.values(chosenIDs).filter(Boolean).length;

  const onClickItem = (item: UserWeapon | UserArtifact) => {
    setChosenItem(item as UserWeapon);

    if (!chosenIDs[item.ID] && props.max && chosenCount < props.max) {
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
    <EntitySelectTemplate
      title={props.title}
      extra={
        <div className="flex items-center gap-3">
          <p className="text-base text-light-400 font-bold">
            {chosenCount}/{props.max} selected
          </p>
          <Button
            variant="positive"
            icon={<FaCheck />}
            disabled={chosenCount < props.max}
            onClick={() => props.onConfirm(chosenIDs)}
          >
            Confirm
          </Button>
        </div>
      }
      onClose={props.onClose}
    >
      {() => {
        return (
          <div className="h-full flex custom-scrollbar gap-2 scroll-smooth">
            <InventoryRack
              data={props.items}
              itemCls="max-w-1/3 basis-1/3 md:w-1/4 md:basis-1/4 lg:max-w-1/6 lg:basis-1/6"
              chosenID={chosenItem?.ID || 1}
              chosenIDs={chosenIDs}
              onUnchooseItem={onUnchooseItem}
              onClickItem={onClickItem}
            />

            <div className="flex flex-col justify-between">
              <div className="p-4 rounded-lg bg-dark-900 grow" style={{ minHeight: "28rem" }}>
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

              {chosenItem ? <OwnerLabel item={chosenItem} /> : null}
            </div>
          </div>
        );
      }}
    </EntitySelectTemplate>
  );
};

export const ItemMultiSelect = Modal.coreWrap(ItemMultiSelectCore, { preset: "large" });
