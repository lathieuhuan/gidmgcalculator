import useInventoryRack from "@Components/item-stores/hooks/useInventoryRack";
import type { UsersWeapon, Weapon } from "@Src/types";

import {
  selectFilteredWeaponIDs,
  selectMyWps,
  selectWeaponById,
} from "@Store/usersDatabaseSlice/selectors";
import { useSelector } from "@Store/hooks";

import { WeaponCard } from "@Components/WeaponCard";
import { Modal, ModalControl } from "@Components/modals";
import { Button, ModalHeader } from "@Src/styled-components";
import { renderEquippedChar } from "../components";

import styles from "../styles.module.scss";

const { Text, CloseButton } = ModalHeader;

interface WeaponInventoryProps {
  weaponType: Weapon;
  owner?: string | null;
  buttonText: string;
  onClickButton: (chosen: UsersWeapon) => void;
  onClose: () => void;
}
function WeaponInventory({
  weaponType,
  owner,
  buttonText,
  onClickButton,
  onClose,
}: WeaponInventoryProps) {
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
    <div className="h-full flex flex-col">
      <div className="p-2">
        <ModalHeader>
          <Text>{weaponType}</Text>
          <CloseButton onClick={onClose} />
        </ModalHeader>
      </div>

      <div className="pt-2 pr-4 pb-2 pl-2 flex-grow custom-scrollbar">
        <div className="h-full pb-2 flex custom-scrollbar">
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
    </div>
  );
}

export function InventoryWeapon({ active, onClose, ...rest }: ModalControl & WeaponInventoryProps) {
  return (
    <Modal active={active} onClose={onClose}>
      <WeaponInventory {...rest} onClose={onClose} />
    </Modal>
  );
}
