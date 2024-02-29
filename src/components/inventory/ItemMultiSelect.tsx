import { useState } from "react";
import { FaCheck } from "react-icons/fa";

import type { BooleanRecord, UserArtifact, UserWeapon } from "@Src/types";
import { isUserWeapon } from "@Src/utils";

// Component
import { Button, Modal } from "@Src/pure-components";
import { ArtifactCard } from "../ArtifactCard";
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

  const onChangeItem = (item?: UserWeapon | UserArtifact) => {
    setChosenItem(item);

    if (item?.ID && !chosenIDs[item.ID] && props.max && chosenCount < props.max) {
      setChosenIDs((prevChosenIDs) => {
        const newChosenIDs = { ...prevChosenIDs };
        newChosenIDs[item.ID] = true;
        return newChosenIDs;
      });
    }
  };

  const onUnselectItem = (item: UserWeapon | UserArtifact) => {
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
              onUnselectItem={onUnselectItem}
              onChangeItem={onChangeItem}
            />

            {chosenItem ? (
              isUserWeapon(chosenItem) ? (
                <WeaponCard wrapperCls="w-76 shrink-0" withOwnerLabel weapon={chosenItem} />
              ) : (
                <ArtifactCard wrapperCls="w-76 shrink-0" withOwnerLabel artifact={chosenItem} />
              )
            ) : (
              <div className="w-76 rounded-lg bg-dark-900 shrink-0" />
            )}
          </div>
        );
      }}
    </EntitySelectTemplate>
  );
};

export const ItemMultiSelect = Modal.coreWrap(ItemMultiSelectCore, { preset: "large" });
