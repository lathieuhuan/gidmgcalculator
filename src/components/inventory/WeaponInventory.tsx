import { useState } from "react";
import type { UserWeapon, WeaponType } from "@Src/types";

import { selectUserWps } from "@Store/userDatabaseSlice/selectors";
import { useStoreSnapshot } from "@Src/features";

// Component
import { Button, Modal } from "@Src/pure-components";
import { OwnerLabel } from "../OwnerLabel";
import { WeaponCard } from "../WeaponCard";
import { EntitySelectTemplate } from "../EntitySelectTemplate";
import { InventoryRack } from "./InventoryRack";

interface WeaponInventoryProps {
  weaponType: WeaponType;
  owner?: string | null;
  buttonText: string;
  onClickButton: (chosen: UserWeapon) => void;
  onClose: () => void;
}
const WeaponInventoryCore = ({ weaponType, owner, buttonText, onClickButton, onClose }: WeaponInventoryProps) => {
  const items = useStoreSnapshot((state) => selectUserWps(state).filter((weapon) => weapon.type === weaponType));

  const [chosenWeapon, setChosenWeapon] = useState<UserWeapon>();

  return (
    <EntitySelectTemplate title="My Weapons" onClose={onClose}>
      {() => {
        return (
          <div className="h-full flex custom-scrollbar gap-2 scroll-smooth">
            <InventoryRack
              data={items}
              itemCls="max-w-1/3 basis-1/3 md:w-1/4 md:basis-1/4 lg:max-w-1/6 lg:basis-1/6"
              emptyText="No weapons found"
              chosenID={chosenWeapon?.ID}
              onChangeItem={setChosenWeapon}
            />

            <div className="flex flex-col">
              <div className="p-4 grow rounded-lg bg-dark-900 flex flex-col hide-scrollbar">
                <div className="w-68 grow hide-scrollbar">
                  <WeaponCard weapon={chosenWeapon} />
                </div>

                {chosenWeapon && chosenWeapon.owner !== owner ? (
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="positive"
                      onClick={() => {
                        onClickButton(chosenWeapon);
                        onClose();
                      }}
                    >
                      {buttonText}
                    </Button>
                  </div>
                ) : null}
              </div>

              {chosenWeapon ? <OwnerLabel item={chosenWeapon} /> : null}
            </div>
          </div>
        );
      }}
    </EntitySelectTemplate>
  );
};

export const WeaponInventory = Modal.coreWrap(WeaponInventoryCore, { preset: "large" });
