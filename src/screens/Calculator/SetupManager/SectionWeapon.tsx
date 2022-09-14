import { useState } from "react";
import { useDispatch } from "react-redux";
import type { Level } from "@Src/types";
import { LEVELS } from "@Src/constants";

import { changeWeapon, updateWeapon } from "@Store/calculatorSlice";
import { selectWeapon } from "@Store/calculatorSlice/selectors";
import { useSelector } from "@Store/hooks";
import { findWeapon } from "@Data/controllers";
import { wikiImg } from "@Src/utils";

import { Picker } from "@Components/Picker";
import { BetaMark } from "@Components/minors";
import { Select } from "@Src/styled-components";
import { pedestalStyles } from "./tw-compound";

export default function SectionWeapon() {
  const weapon = useSelector(selectWeapon);
  const [pickerOn, setPickerOn] = useState(false);
  const dispatch = useDispatch();

  const weaponData = findWeapon(weapon);
  if (!weaponData) {
    return null;
  }
  const { beta, rarity, icon, name } = weaponData;

  return (
    <div className={pedestalStyles}>
      <div className="px-2 flex items-center">
        <div
          className={`shrink-0 relative bg-gradient-${rarity} cursor-pointer rounded-md`}
          onClick={() => setPickerOn(true)}
        >
          <img
            src={beta ? icon : wikiImg(icon)}
            alt=""
            style={{ width: "5.625rem" }}
            draggable={false}
          />
          {beta && <BetaMark className="absolute -top-1 -left-1" />}
        </div>
        <div className="ml-2 overflow-hidden">
          <p className={`text-h4 text-rarity-${rarity} font-bold text-ellipsis`}>{name}</p>
          <div className="mt-1 pl-1 flex flex-wrap">
            <p className="mr-1">Level</p>
            <Select
              className={`text-rarity-${rarity} text-right`}
              value={weapon.level}
              onChange={(e) => dispatch(updateWeapon({ level: e.target.value as Level }))}
            >
              {(rarity < 3 ? LEVELS.slice(0, -4) : LEVELS).map((level) => (
                <option key={level}>{level}</option>
              ))}
            </Select>
          </div>
          {rarity >= 3 && (
            <div className="mt-1 pl-1 flex flex-wrap">
              <p className="mr-2">Refinement rank</p>
              <Select
                className={`text-rarity-${rarity}`}
                value={weapon.refi}
                onChange={(e) => dispatch(updateWeapon({ refi: +e.target.value }))}
              >
                {[1, 2, 3, 4, 5].map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </Select>
            </div>
          )}
        </div>
      </div>

      <Picker.Weapon
        active={pickerOn}
        weaponType={weapon.type}
        onPickWeapon={(item) => dispatch(changeWeapon({ ID: Date.now(), ...item }))}
        onClose={() => setPickerOn(false)}
      />
    </div>
  );
}
