import { useState } from "react";
import type { UserWeapon, WeaponType } from "@Src/types";

import { selectUserWps } from "@Store/userDatabaseSlice/selectors";
import { useStoreSnapshot } from "@Src/features";

// Component
import { Modal } from "@Src/pure-components";
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
    <EntitySelectTemplate title="Weapon Inventory" onClose={onClose}>
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

            <WeaponCard
              wrapperCls="w-76 shrink-0"
              weapon={chosenWeapon}
              withActions={chosenWeapon && chosenWeapon.owner !== owner}
              actions={[
                {
                  text: buttonText,
                  variant: "positive",
                  onClick: (_, weapon) => {
                    onClickButton(weapon);
                    onClose();
                  },
                },
              ]}
            />
          </div>
        );
      }}
    </EntitySelectTemplate>
  );
};

export const WeaponInventory = Modal.coreWrap(WeaponInventoryCore, { preset: "large" });
