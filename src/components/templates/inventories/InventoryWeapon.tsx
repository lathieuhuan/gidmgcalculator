import { useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import type { UserWeapon, WeaponType } from "@Src/types";

// Selector
import { selectWeaponInventory } from "@Store/userDatabaseSlice/selectors";

// Hook
import { useSelector } from "@Store/hooks";

// Component
import { Button, IconButton } from "@Components/atoms";
import { Modal, ModalHeader, type ModalControl } from "@Components/molecules";
import { WeaponCard, OwnerLabel } from "@Components/organisms";
import { InventoryRack } from "./organisms/InventoryRack";

import styles from "./styles.module.scss";

interface WeaponInventoryProps {
  weaponType: WeaponType;
  owner?: string | null;
  buttonText: string;
  onClickButton: (chosen: UserWeapon) => void;
  onClose: () => void;
}
const WeaponInventory = ({
  weaponType,
  owner,
  buttonText,
  onClickButton,
  onClose,
}: WeaponInventoryProps) => {
  const weaponTypeRef = useRef([weaponType]);

  const { filteredWeapons } = useSelector((state) =>
    selectWeaponInventory(state, weaponTypeRef.current)
  );

  const [chosenWeapon, setChosenWeapon] = useState<UserWeapon>();

  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <ModalHeader>
          <div />
          <ModalHeader.Text>{weaponType}</ModalHeader.Text>

          <div className="flex justify-end items-center">
            <IconButton className="mr-2 text-black text-xl" variant="custom" onClick={onClose}>
              <FaTimes />
            </IconButton>
          </div>
        </ModalHeader>
      </div>

      <div className="p-2 pr-4 grow flex hide-scrollbar">
        <InventoryRack
          listClassName={styles["inventory-list"]}
          itemClassName={styles.item}
          chosenID={chosenWeapon?.ID || 0}
          itemType="weapon"
          items={filteredWeapons}
          onClickItem={(item) => setChosenWeapon(item as UserWeapon)}
        />

        <div className="flex flex-col justify-between">
          <div
            className="p-4 rounded-lg bg-darkblue-1 flex flex-col hide-scrollbar"
            style={{ minHeight: "28rem" }}
          >
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

          <OwnerLabel owner={chosenWeapon?.owner} />
        </div>
      </div>
    </div>
  );
};

export const InventoryWeapon = ({
  active,
  onClose,
  ...rest
}: ModalControl & WeaponInventoryProps) => {
  return (
    <Modal active={active} withDefaultStyle onClose={onClose}>
      <WeaponInventory {...rest} onClose={onClose} />
    </Modal>
  );
};
