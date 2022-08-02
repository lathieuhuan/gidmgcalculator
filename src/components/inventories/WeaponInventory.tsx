import useHeight from "@Hooks/useHeight";
import useInventoryRack from "@Hooks/useInventoryRack";
import { DatabaseWp, Weapon } from "@Src/types";

import {
  selectFilteredWeaponIDs,
  selectMyWps,
  selectWeaponById,
} from "@Store/databaseSlice/selectors";
import { useSelector } from "@Store/hooks";

import { ButtonBar } from "@Components/minors";
import WeaponCard from "@Components/WeaponCard";
import { ModalHeader } from "@Src/styled-components";
import { Modal } from "../modals";
import { renderEquippedChar } from "./minors";

import styles from "./styles.module.scss";

const { Text, CloseButton } = ModalHeader;

interface WeaponInventoryProps {
  weaponType: Weapon;
  owner?: string;
  buttonText: string;
  onClickButton: (chosen: DatabaseWp) => void;
  onClose: () => void;
}

const ID = Date.now();

export default function WeaponInventory({
  weaponType,
  owner = "",
  buttonText,
  onClickButton,
  onClose,
}: WeaponInventoryProps) {
  const filteredIds = useSelector((state) => selectFilteredWeaponIDs(state, [weaponType]));
  const [hRef, height] = useHeight();

  const [inventoryRack, chosenID] = useInventoryRack({
    rackClassName: styles["inventory-rack"],
    cellClassName: styles.cell,
    items: [
      ...useSelector(selectMyWps),
      {
        ID,
        code: 124,
        level: "1/20",
        refi: 1,
        type: "sword",
        user: null,
      },
      {
        ID: ID + 1,
        code: 124,
        level: "1/20",
        refi: 1,
        type: "sword",
        user: "Albedo",
      },
    ],
    itemType: "weapon",
    filteredIds: [ID, ID + 1],
  });
  const chosenWp = useSelector((state) => selectWeaponById(state, chosenID));

  return (
    <Modal standard onClose={onClose}>
      <div className="p-2" style={{ height: "10%" }}>
        <ModalHeader>
          {window.innerWidth > 380 && <Text>{weaponType}</Text>}

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

              {chosenWp && chosenWp.user !== owner ? (
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

            {chosenWp?.user ? renderEquippedChar(chosenWp.user) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
}
