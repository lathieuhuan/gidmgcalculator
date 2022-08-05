import useHeight from "@Hooks/useHeight";
import useInventoryRack from "@Screens/item-stores/hooks/useInventoryRack";
import type { UsersWeapon, Weapon } from "@Src/types";

import {
  selectFilteredWeaponIDs,
  selectMyWps,
  selectWeaponById,
} from "@Store/usersDatabaseSlice/selectors";
import { useSelector } from "@Store/hooks";

import WeaponCard from "@Components/WeaponCard";
import { Modal } from "@Components/modals";
import { ButtonBar } from "@Components/minors";
import { ModalHeader } from "@Src/styled-components";
import { renderEquippedChar } from "../components";

import styles from "./styles.module.scss";

const { Text, CloseButton } = ModalHeader;

interface InventoryWeaponProps {
  weaponType: Weapon;
  owner?: string;
  buttonText: string;
  onClickButton: (chosen: UsersWeapon) => void;
  onClose: () => void;
}
export function InventoryWeapon({
  weaponType,
  owner = "",
  buttonText,
  onClickButton,
  onClose,
}: InventoryWeaponProps) {
  const filteredIds = useSelector((state) => selectFilteredWeaponIDs(state, [weaponType]));
  const [hRef, height] = useHeight();

  const [inventoryRack, chosenID] = useInventoryRack({
    rackClassName: styles["inventory-rack"],
    cellClassName: styles.cell,
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

          <div ref={hRef} className="flex flex-col justify-between">
            <div
              className="p-4 rounded-lg bg-darkblue-1 flex flex-col"
              style={{
                minHeight: "26rem",
                maxHeight: height / 16 - 3 + "rem",
              }}
            >
              <div className="grow hide-scrollbar" style={{ width: "17rem" }}>
                <WeaponCard weapon={chosenWp} mutable={false} />
              </div>

              {chosenWp && chosenWp.owner !== owner ? (
                <ButtonBar
                  className="mt-4"
                  variants={["positive"]}
                  texts={[buttonText]}
                  handlers={[
                    () => {
                      onClickButton(chosenWp);
                      onClose();
                    },
                  ]}
                />
              ) : null}
            </div>

            {chosenWp?.owner ? renderEquippedChar(chosenWp.owner) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
}
