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

export function MyWeapons() {
  const [prePickerOn, setPrePickerOn] = useState(false);
  const [charPickerOn, setCharPickerOn] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [filterDropped, setFilterDropped] = useState(false);
  const [weaponType, setWeaponType] = useState<Weapon | null>(null);

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

  return (
    <div className="pt-8 h-full flex-center bg-darkblue-2">
      <div className={styles.warehouse}>
        <div className={cn("w-full", styles["button-bar"])}>
          <ButtonBar
            className="mr-4 gap-4"
            texts={["Add", "Sort"]}
            variants={["positive", "positive"]}
            handlers={[() => setPrePickerOn(true), () => dispatch(sortWeapons())]}
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
            <div className="grow flex items-start">
              <div
                className="p-4 rounded-lg bg-darkblue-1 flex flex-col"
                style={{ minHeight: "27rem", maxHeight: height / 16 - 3 + "rem" }}
              >
                <div className="grow hide-scrollbar" style={{ width: "18.75rem" }}>
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
                    handlers={[() => setRemoving(true), () => setCharPickerOn(true)]}
                  />
                ) : null}
              </div>
            </div>

            {weapon?.owner ? renderEquippedChar(weapon.owner) : null}

            {charPickerOn && weapon && (
              <CharPicker weapon={weapon} onClose={() => setCharPickerOn(false)} />
            )}

            {removing && weapon && (
              <ItemRemoveConfirm
                item={weapon}
                itemType="weapon"
                filteredIds={filteredIds}
                removeItem={(item) => {
                  dispatch(removeWeapon({ ...item, type: item.type as Weapon }));
                }}
                updateChosenID={setChosenID}
                onClose={() => setRemoving(false)}
              />
            )}
          </div>
        </div>
      </div>

      {prePickerOn && (
        <PrePicker
          choices={WEAPON_ICONS}
          onClickChoice={(weaponType) => {
            setWeaponType(weaponType as Weapon);
            setPrePickerOn(false);
          }}
          onClose={() => setPrePickerOn(false)}
        />
      )}
      {weaponType && (
        <Picker.Weapon
          needMassAdd={true}
          wpType={weaponType}
          onPickItem={(item) => {
            const ID = Date.now();
            dispatch(addWeapon({ ID, ...item }));
            setChosenID(ID);
          }}
          onClose={() => setWeaponType(null)}
        />
      )}
    </div>
  );
}

interface CharPickerProps {
  weapon: UsersWeapon;
  onClose: () => void;
}
function CharPicker({ weapon: { ID, owner, type }, onClose }: CharPickerProps) {
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
        dispatch(swapWeaponOwner({ newOwner: name, targetWeaponID: ID, oldOwner: owner }));
      }}
      onClose={onClose}
    />
  );
}
