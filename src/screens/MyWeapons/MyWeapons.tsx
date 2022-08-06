import cn from "classnames";
import { useState } from "react";
import type { UsersWeapon, Weapon } from "@Src/types";
import { WEAPON_ICONS } from "@Src/constants";

import {
  selectFilteredWeaponIDs,
  selectMyChars,
  selectMyWps,
  selectWeaponById,
} from "@Store/usersDatabaseSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";
import useInventoryRack from "@Components/item-stores/hooks/useInventoryRack";
import useTypeFilter from "@Components/item-stores/hooks/useTypeFilter";

import { Picker, PrePicker } from "@Components/Picker";
import styles from "../styles.module.scss";
import { ButtonBar } from "@Components/minors";
import {
  addWeapon,
  refineUsersWeapon,
  sortWeapons,
  swapWeaponOwner,
  upgradeUsersWeapon,
} from "@Store/usersDatabaseSlice";
import useHeight from "@Hooks/useHeight";
import { WeaponCard } from "@Components/WeaponCard";
import { upgradeWeapon } from "@Store/calculatorSlice";
import { renderEquippedChar } from "@Components/item-stores/components";
import { findCharacter } from "@Data/controllers";

export function MyWeapons() {
  const [prePickerOn, setPrePickerOn] = useState(false);
  const [charPickerOn, setCharPickerOn] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [weaponType, setWeaponType] = useState<Weapon | null>(null);

  const dispatch = useDispatch();
  const [ref, height] = useHeight();

  const filteredIds = useSelector((state) => selectFilteredWeaponIDs(state, types as Weapon[]));

  const [typeFilter, types] = useTypeFilter(true);
  const [invRack, chosenID, setChosenID] = useInventoryRack({
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
          {/* {window.innerWidth >= 500 ? typeFilter : <MobileFilter typeFilter={typeFilter} />} */}
        </div>
        <div className="body">
          {invRack}

          <div ref={ref} className="full-h flex-col">
            <div className="grow-1 flex align-start">
              <div
                className="p-4 rounded-lg bg-darkblue-1 flex-col"
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

            {/* {removing && (
              <ItemRemoveDialog
                item={weapon}
                itemType="Weapon"
                filteredIds={filteredIds}
                removeItem={(item) => dispatch(REMOVE_WP(item))}
                setChosenID={setChosenID}
                close={() => setRemoving(false)}
              />
            )} */}
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
