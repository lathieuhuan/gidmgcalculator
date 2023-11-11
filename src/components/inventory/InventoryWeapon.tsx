import { useState, useRef } from "react";
import type { UserWeapon, WeaponType } from "@Src/types";

import { selectWeaponInventory } from "@Store/userDatabaseSlice/selectors";
import { useSelector } from "@Store/hooks";

// Component
import { Button, ModalHeader, withModal } from "@Src/pure-components";
import { OwnerLabel } from "../OwnerLabel";
import { WeaponCard } from "../WeaponCard";
import { InventoryRack } from "./InventoryRack";

interface WeaponInventoryProps {
  weaponType: WeaponType;
  owner?: string | null;
  buttonText: string;
  onClickButton: (chosen: UserWeapon) => void;
  onClose: () => void;
}
const WeaponInventory = ({ weaponType, owner, buttonText, onClickButton, onClose }: WeaponInventoryProps) => {
  const weaponTypeRef = useRef([weaponType]);

  const { filteredWeapons } = useSelector((state) => selectWeaponInventory(state, weaponTypeRef.current));

  const [chosenWeapon, setChosenWeapon] = useState<UserWeapon>();

  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <ModalHeader>
          <div />
          <ModalHeader.Text>{weaponType}</ModalHeader.Text>
          <ModalHeader.RightEnd onClickClose={onClose} />
        </ModalHeader>
      </div>

      <div className="p-2 pr-4 grow flex hide-scrollbar">
        <InventoryRack
          listClassName="inventory-list"
          itemClassName="inventory-item"
          chosenID={chosenWeapon?.ID || 0}
          itemType="weapon"
          items={filteredWeapons}
          onClickItem={(item) => setChosenWeapon(item as UserWeapon)}
        />

        <div className="flex flex-col">
          <div className="p-4 rounded-lg bg-dark-900 flex flex-col hide-scrollbar" style={{ minHeight: "28rem" }}>
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

          <OwnerLabel item={chosenWeapon} />
        </div>
      </div>
    </div>
  );
};

export const InventoryWeapon = withModal(WeaponInventory, { withDefaultStyle: true });
