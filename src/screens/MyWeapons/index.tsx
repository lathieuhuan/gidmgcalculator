import clsx from "clsx";
import { Fragment, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import type { WeaponType } from "@Src/types";
import { WEAPON_ICONS } from "@Src/constants";

import {
  addUserWeapon,
  removeWeapon,
  sortWeapons,
  swapWeaponOwner,
  updateUserWeapon,
} from "@Store/userDatabaseSlice";
import {
  selectFilteredWeaponIDs,
  selectMyWps,
  selectWeaponById,
} from "@Store/userDatabaseSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";
import { useInventoryRack, useTypeFilter } from "@Components/item-stores/hooks";

import { IconButton } from "@Src/styled-components";
import { Picker, PrePicker } from "@Components/Picker";
import { WeaponCard } from "@Components/WeaponCard";
import { ButtonBar } from "@Components/minors";
import { CollapseSpace } from "@Components/collapse";
import { ItemConfirmRemove, renderEquippedChar } from "@Components/item-stores/components";

import styles from "../styles.module.scss";

type ModalType = "PICK_WEAPON_TYPE" | "EQUIP_CHARACTER" | "REMOVE_WEAPON";

export default function MyWeapons() {
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [filterDropped, setFilterDropped] = useState(false);
  const [weaponPicker, setWeaponPicker] = useState<{ active: boolean; type: WeaponType }>({
    active: false,
    type: "sword",
  });

  const dispatch = useDispatch();

  const { filteredTypes, renderTypeFilter } = useTypeFilter({ itemType: "weapon" });
  const filteredIds = useSelector((state) =>
    selectFilteredWeaponIDs(state, filteredTypes as WeaponType[])
  );

  const [invRack, chosenID, setChosenID] = useInventoryRack({
    listClassName: styles.list,
    itemClassName: styles.item,
    items: useSelector(selectMyWps),
    itemType: "weapon",
    filteredIds,
  });
  const weapon = useSelector((state) => selectWeaponById(state, chosenID));

  const openModal = (type: ModalType) => () => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <div className="pt-8 h-full flex-center bg-darkblue-2">
      <div className={styles.warehouse}>
        <div className={clsx("w-full", styles["button-bar"])}>
          <ButtonBar
            className="mr-4 space-x-4"
            texts={["Add", "Sort"]}
            variants={["positive", "positive"]}
            handlers={[openModal("PICK_WEAPON_TYPE"), () => dispatch(sortWeapons())]}
          />
          {window.innerWidth >= 500 ? (
            renderTypeFilter()
          ) : (
            <Fragment>
              <IconButton
                className={clsx("ml-1", filterDropped ? "bg-green" : "bg-white")}
                onClick={() => setFilterDropped(!filterDropped)}
              >
                <FaEllipsisH />
              </IconButton>

              <CollapseSpace
                className="w-full absolute top-full left-0 z-20"
                active={filterDropped}
              >
                <div className="px-4 py-6 shadow-common bg-darkblue-2">{renderTypeFilter()}</div>
              </CollapseSpace>
            </Fragment>
          )}
        </div>
        <div className={styles.body}>
          {invRack}

          <div className="flex flex-col">
            <div className="p-4 grow rounded-lg bg-darkblue-1 flex flex-col hide-scrollbar">
              <div className="w-75 grow hide-scrollbar">
                {weapon ? (
                  <WeaponCard
                    weapon={weapon}
                    mutable
                    upgrade={(level) => dispatch(updateUserWeapon({ ID: weapon.ID, level }))}
                    refine={(refi) => dispatch(updateUserWeapon({ ID: weapon.ID, refi }))}
                  />
                ) : null}
              </div>
              {weapon ? (
                <ButtonBar
                  className="mt-4"
                  texts={["Remove", "Equip"]}
                  handlers={[openModal("REMOVE_WEAPON"), openModal("EQUIP_CHARACTER")]}
                />
              ) : null}
            </div>

            {weapon?.owner ? renderEquippedChar(weapon.owner) : null}
          </div>
        </div>
      </div>

      <PrePicker
        active={modalType === "PICK_WEAPON_TYPE"}
        choices={WEAPON_ICONS}
        onClickChoice={(weaponType) => {
          setWeaponPicker({
            active: true,
            type: weaponType as WeaponType,
          });
          closeModal();
        }}
        onClose={closeModal}
      />

      <Picker.Weapon
        active={weaponPicker.active}
        needMassAdd
        weaponType={weaponPicker.type}
        onPickWeapon={(item) => {
          const ID = Date.now();
          dispatch(addUserWeapon({ ID, ...item, owner: null }));
          setChosenID(ID);
        }}
        onClose={() => setWeaponPicker((prev) => ({ ...prev, active: false }))}
      />

      {weapon && (
        <Picker.Character
          active={modalType === "EQUIP_CHARACTER"}
          sourceType="userData"
          filter={({ name, weaponType }) => {
            return weaponType === weapon.type && name !== weapon.owner;
          }}
          onPickCharacter={({ name }) => {
            if (weapon.ID) {
              dispatch(swapWeaponOwner({ weaponID: weapon.ID, newOwner: name }));
            }
          }}
          onClose={closeModal}
        />
      )}

      {weapon && (
        <ItemConfirmRemove
          active={modalType === "REMOVE_WEAPON"}
          item={weapon}
          itemType="weapon"
          filteredIds={filteredIds}
          removeItem={(item) => {
            dispatch(removeWeapon({ ...item, type: item.type as WeaponType }));
          }}
          updateChosenID={setChosenID}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
