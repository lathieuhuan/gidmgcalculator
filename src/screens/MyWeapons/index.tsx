import cn from "classnames";
import { Fragment, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import type { UsersWeapon, Weapon } from "@Src/types";
import { WEAPON_ICONS } from "@Src/constants";

import {
  addWeapon,
  refineUsersWeapon,
  removeWeapon,
  sortWeapons,
  swapWeaponOwner,
  upgradeUsersWeapon,
} from "@Store/usersDatabaseSlice";
import {
  selectFilteredWeaponIDs,
  selectMyChars,
  selectMyWps,
  selectWeaponById,
} from "@Store/usersDatabaseSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";
import useInventoryRack from "@Components/item-stores/hooks/useInventoryRack";
import useTypeFilter from "@Components/item-stores/hooks/useTypeFilter";
import useHeight from "@Hooks/useHeight";
import { findCharacter } from "@Data/controllers";

import { Picker, PrePicker } from "@Components/Picker";
import { WeaponCard } from "@Components/WeaponCard";
import { ButtonBar } from "@Components/minors";
import { CollapseSpace } from "@Components/collapse";
import { ItemRemoveConfirm, renderEquippedChar } from "@Components/item-stores/components";
import { IconButton } from "@Src/styled-components";

import styles from "../styles.module.scss";

type ModalType = "preWeaponPicker" | "equipCharacterPicker" | "removingWeapon";

export default function MyWeapons() {
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [filterDropped, setFilterDropped] = useState(false);
  const [pickingWeaponType, setPickingWeaponType] = useState<Weapon | null>(null);

  const dispatch = useDispatch();
  const [ref, height] = useHeight();

  const [typeFilter, types] = useTypeFilter(true);
  const filteredIds = useSelector((state) => selectFilteredWeaponIDs(state, types as Weapon[]));

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
        <div className={cn("w-full", styles["button-bar"])}>
          <ButtonBar
            className="mr-4 gap-4"
            texts={["Add", "Sort"]}
            variants={["positive", "positive"]}
            handlers={[openModal("preWeaponPicker"), () => dispatch(sortWeapons())]}
          />
          {window.innerWidth >= 500 ? (
            typeFilter
          ) : (
            <Fragment>
              <IconButton
                className={cn("ml-1", filterDropped ? "bg-green" : "bg-white")}
                onClick={() => setFilterDropped(!filterDropped)}
              >
                <FaEllipsisH />
              </IconButton>

              <CollapseSpace
                className="w-full absolute top-full left-0 z-20"
                active={filterDropped}
              >
                <div className="px-4 py-6 shadow-common bg-darkblue-2">{typeFilter}</div>
              </CollapseSpace>
            </Fragment>
          )}
        </div>
        <div className={styles.body}>
          {invRack}

          <div ref={ref} className="h-full flex flex-col">
            {/* #to-check: abundant div */}
            <div className="grow flex items-start">
              <div
                className="p-4 rounded-lg bg-darkblue-1 flex flex-col"
                style={{ minHeight: "27rem", maxHeight: height / 16 - 3 + "rem" }}
              >
                <div className="grow hide-scrollbar w-75">
                  {weapon ? (
                    <WeaponCard
                      weapon={weapon}
                      mutable={true}
                      upgrade={(level) => dispatch(upgradeUsersWeapon({ ID: weapon.ID, level }))}
                      refine={(refi) => dispatch(refineUsersWeapon({ ID: weapon.ID, refi }))}
                    />
                  ) : null}
                </div>
                {weapon ? (
                  <ButtonBar
                    className="mt-4"
                    texts={["Remove", "Equip"]}
                    handlers={[openModal("removingWeapon"), openModal("equipCharacterPicker")]}
                  />
                ) : null}
              </div>
            </div>

            {weapon?.owner ? renderEquippedChar(weapon.owner) : null}
          </div>
        </div>
      </div>

      {modalType === "preWeaponPicker" && (
        <PrePicker
          choices={WEAPON_ICONS}
          onClickChoice={(weaponType) => {
            setPickingWeaponType(weaponType as Weapon);
            closeModal();
          }}
          onClose={closeModal}
        />
      )}
      {pickingWeaponType && (
        <Picker.Weapon
          needMassAdd={true}
          wpType={pickingWeaponType}
          onPickItem={(item) => {
            const ID = Date.now();
            dispatch(addWeapon({ ID, ...item, owner: null }));
            setChosenID(ID);
          }}
          onClose={() => setPickingWeaponType(null)}
        />
      )}
      {modalType === "equipCharacterPicker" && weapon && (
        <CharacterPicker weapon={weapon} onClose={closeModal} />
      )}
      {modalType === "removingWeapon" && weapon && (
        <ItemRemoveConfirm
          item={weapon}
          itemType="weapon"
          filteredIds={filteredIds}
          removeItem={(item) => {
            dispatch(removeWeapon({ ...item, type: item.type as Weapon }));
          }}
          updateChosenID={setChosenID}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

interface CharacterPickerProps {
  weapon: UsersWeapon;
  onClose: () => void;
}
function CharacterPicker({ weapon: { ID, owner, type }, onClose }: CharacterPickerProps) {
  const dispatch = useDispatch();

  const data = [];
  for (const char of useSelector(selectMyChars)) {
    const character = findCharacter(char);
    if (character) {
      const { beta, name, code, icon, rarity, vision, weapon } = character;
      if (weapon === type && name !== owner) {
        data.push({ beta, name, code, icon, rarity, vision, weapon, cons: char.cons });
      }
    }
  }

  return (
    <Picker
      data={data}
      dataType="character"
      onPickItem={({ name }) => {
        dispatch(swapWeaponOwner({ weaponID: ID, newOwner: name }));
      }}
      onClose={onClose}
    />
  );
}
