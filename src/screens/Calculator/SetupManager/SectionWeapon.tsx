import { useState } from "react";
import { useDispatch } from "react-redux";
import { MdInventory } from "react-icons/md";

import type { Level } from "@Src/types";
import { LEVELS } from "@Src/constants";

import { $AppData } from "@Src/services";

// Store
import { changeWeapon, updateWeapon } from "@Store/calculatorSlice";
import { selectWeapon } from "@Store/calculatorSlice/selectors";
import { useSelector } from "@Store/hooks";

// Component
import { BetaMark, Button, Image } from "@Src/pure-components";
import { WeaponForge, WeaponInventory } from "@Src/components";

import styles from "./styles.module.scss";
import { userItemToCalcItem } from "@Src/utils";

type ModalType = "MAKE_NEW_WEAPON" | "SELECT_USER_WEAPON" | "";

export default function SectionWeapon() {
  const dispatch = useDispatch();
  const weapon = useSelector(selectWeapon);
  const [modalType, setModalType] = useState<ModalType>("");

  const { beta, name = "", icon = "", rarity = 5 } = $AppData.getWeapon(weapon.code) || {};
  const selectLevels = rarity < 3 ? LEVELS.slice(0, -4) : LEVELS;

  const closeModal = () => setModalType("");

  return (
    <div className={"px-2 py-3 bg-dark-900 flex items-start relative " + styles.section}>
      <div
        className={`w-20 h-20 shrink-0 relative bg-gradient-${rarity} cursor-pointer rounded-md`}
        onClick={() => setModalType("MAKE_NEW_WEAPON")}
      >
        <Image src={icon} alt={name} imgType="weapon" />
        <BetaMark active={beta} className="absolute -top-1 -left-1" />
      </div>

      <div className="ml-2 overflow-hidden space-y-1">
        <p className={`text-xl text-rarity-${rarity} font-bold text-ellipsis`}>{name}</p>

        <div className="pl-1 flex flex-wrap">
          <p className="mr-1">Level</p>
          <select
            className={`text-rarity-${rarity} text-right`}
            value={weapon.level}
            disabled={name === ""}
            onChange={(e) => dispatch(updateWeapon({ level: e.target.value as Level }))}
          >
            {selectLevels.map((_, index) => {
              const value = selectLevels[selectLevels.length - 1 - index];
              return (
                <option key={index} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </div>

        {rarity >= 3 && (
          <div className="pl-1 flex flex-wrap">
            <p className="mr-1">Refinement rank</p>
            <select
              className={`text-rarity-${rarity}`}
              value={weapon.refi}
              disabled={name === ""}
              onChange={(e) => dispatch(updateWeapon({ refi: +e.target.value }))}
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <Button
        title="Inventory"
        className="absolute bottom-1 right-1"
        size="large"
        boneOnly
        icon={<MdInventory />}
        onClick={() => setModalType("SELECT_USER_WEAPON")}
      />

      <WeaponForge
        active={modalType === "MAKE_NEW_WEAPON"}
        forcedType={weapon.type}
        onForgeWeapon={(weapon) => {
          dispatch(
            changeWeapon({
              ...weapon,
              ID: Date.now(),
            })
          );
        }}
        onClose={closeModal}
      />

      <WeaponInventory
        active={modalType === "SELECT_USER_WEAPON"}
        weaponType={weapon.type}
        buttonText="Select"
        onClickButton={(weapon) => {
          dispatch(changeWeapon(userItemToCalcItem(weapon)));
        }}
        onClose={closeModal}
      />
    </div>
  );
}
