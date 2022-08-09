import useInventoryRack from "@Components/item-stores/hooks/useInventoryRack";
import type { UsersWeapon, Weapon } from "@Src/types";

import {
  selectFilteredWeaponIDs,
  selectMyWps,
  selectWeaponById,
} from "@Store/usersDatabaseSlice/selectors";
import { useSelector } from "@Store/hooks";

import { WeaponCard } from "@Components/WeaponCard";
import { Modal } from "@Components/modals";
import { Button, ModalHeader } from "@Src/styled-components";
import { renderEquippedChar } from "../components";

import styles from "../styles.module.scss";

const { Text, CloseButton } = ModalHeader;

interface InventoryWeaponProps {
  weaponType: Weapon;
  owner?: string | null;
  buttonText: string;
  onClickButton: (chosen: UsersWeapon) => void;
  onClose: () => void;
}
export function InventoryWeapon({
  weaponType,
  owner,
  buttonText,
  onClickButton,
  onClose,
}: InventoryWeaponProps) {
  const filteredIds = useSelector((state) => selectFilteredWeaponIDs(state, [weaponType]));

  const [inventoryRack, chosenID] = useInventoryRack({
    listClassName: styles["inventory-list"],
    itemClassName: styles.item,
    items: useSelector(selectMyWps),
    itemType: "weapon",
    filteredIds,
  });
  const chosenWp = useSelector((state) => selectWeaponById(state, chosenID));

  return (
    <Modal standard onClose={onClose}>
      <div className="p-2" style={{ height: "10%" }}>
        <ModalHeader>
          <Text className="hidden sm:block">{weaponType}</Text>
          <CloseButton onClick={onClose} />
        </ModalHeader>
      </div>

      <div className="pt-2 pr-4 pb-4 pl-2" style={{ height: "90%" }}>
        <div className="h-full flex hide-scrollbar">
          {inventoryRack}

          <div className="flex flex-col justify-between">
            <div className="p-4 grow rounded-lg bg-darkblue-1 flex flex-col hide-scrollbar">
              <div className="w-68 grow hide-scrollbar">
                <WeaponCard weapon={chosenWp} mutable={false} />
              </div>

              {chosenWp && chosenWp.owner !== owner ? (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="positive"
                    onClick={() => {
                      onClickButton(chosenWp);
                      onClose();
                    }}
                  >
                    {buttonText}
                  </Button>
                </div>
              ) : null}
            </div>

            {chosenWp?.owner ? renderEquippedChar(chosenWp.owner) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
}
