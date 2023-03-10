import { useState } from "react";
import { useDispatch } from "react-redux";
import type { Level } from "@Src/types";

// Constant
import { LEVELS } from "@Src/constants";

// Action
import { changeWeapon, updateWeapon } from "@Store/calculatorSlice";

// Selector
import { selectWeapon } from "@Store/calculatorSlice/selectors";

// Hook
import { useSelector } from "@Store/hooks";

// Util
import { findDataWeapon } from "@Data/controllers";
import { getImgSrc } from "@Src/utils";

// Component
import { PickerWeapon } from "@Src/features";
import { BetaMark } from "@Components/atoms";

export default function SectionWeapon() {
  const dispatch = useDispatch();
  const weapon = useSelector(selectWeapon);
  const [pickerOn, setPickerOn] = useState(false);

  const { beta, name = "", icon = "", rarity = 5 } = findDataWeapon(weapon) || {};
  const selectLevels = rarity < 3 ? LEVELS.slice(0, -4) : LEVELS;

  return (
    <div className="px-2 py-3 border-2 border-lesser rounded-xl bg-darkblue-1 flex items-start">
      <div
        className={`w-20 h-20 shrink-0 relative bg-gradient-${rarity} cursor-pointer rounded-md`}
        onClick={() => setPickerOn(true)}
      >
        <img src={getImgSrc(icon)} alt={name} draggable={false} />
        {beta && <BetaMark className="absolute -top-1 -left-1" />}
      </div>

      <div className="ml-2 overflow-hidden">
        <p className={`text-xl text-rarity-${rarity} font-bold text-ellipsis`}>{name}</p>
        <div className="mt-1 pl-1 flex flex-wrap">
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
          <div className="mt-1 pl-1 flex flex-wrap">
            <p className="mr-2">Refinement rank</p>
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

      <PickerWeapon
        active={pickerOn}
        weaponType={weapon.type}
        onPickWeapon={(item) => {
          dispatch(
            changeWeapon({
              ID: Date.now(),
              ...item,
            })
          );
        }}
        onClose={() => setPickerOn(false)}
      />
    </div>
  );
}
