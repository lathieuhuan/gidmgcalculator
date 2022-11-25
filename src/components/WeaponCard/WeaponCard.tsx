import cn from "classnames";
import type { CalcWeapon, Level } from "@Src/types";
import { LEVELS } from "@Src/constants";

import { percentSign, getImgSrc } from "@Src/utils";
import { wpMainStatAtLv, wpSubStatAtLv } from "@Data/weapons/utils";
import { findWeapon } from "@Data/controllers";
import { useTranslation } from "@Hooks/useTranslation";

import { Select } from "@Src/styled-components";
import { BetaMark } from "../minors";

const groupStyles = "bg-darkblue-2 px-2";

interface WeaponCardProps {
  weapon?: CalcWeapon;
  mutable: boolean;
  upgrade?: (newLevel: Level) => void;
  refine?: (newRefi: number) => void;
}
export function WeaponCard({ weapon, mutable, upgrade, refine }: WeaponCardProps) {
  const { t } = useTranslation();

  if (!weapon) return null;

  const wpData = findWeapon(weapon)!;
  const { level, refi } = weapon;
  const { rarity, subStat } = wpData;
  const selectLevels = rarity < 3 ? LEVELS.slice(0, -4) : LEVELS;

  return (
    <div className="w-full" onDoubleClick={() => console.log(weapon)}>
      <p className={`text-h2 text-rarity-${rarity} font-bold`}>{wpData.name}</p>
      <div className="mt-2 flex">
        {/* left */}
        <div className="flex flex-col grow justify-between">
          {/*  */}
          <div className={cn("pt-1 grow flex items-center", groupStyles)}>
            <p className="mr-2 text-h6 font-bold">Level</p>
            {mutable ? (
              <Select
                className={`text-lg text-rarity-${rarity} font-bold text-last-right`}
                value={level}
                onChange={(e) => upgrade && upgrade(e.target.value as Level)}
              >
                {selectLevels.map((_, index) => (
                  <option key={index}>{selectLevels[selectLevels.length - 1 - index]}</option>
                ))}
              </Select>
            ) : (
              <p className={`text-h6 text-rarity-${rarity} font-bold`}>{level}</p>
            )}
          </div>

          {subStat ? (
            <div
              className={cn("grow mt-1 pt-1 font-bold flex flex-col justify-center", groupStyles)}
            >
              <p>{t(subStat.type)}</p>
              <p className={`text-rarity-${rarity} text-h3`}>
                {wpSubStatAtLv(subStat.scale, level)}
                {percentSign(subStat.type)}
              </p>
            </div>
          ) : null}

          <div className={cn("grow mt-1 pt-1 font-bold flex flex-col justify-center", groupStyles)}>
            <p>Base ATK</p>
            <p className={`text-rarity-${rarity} text-h2`}>
              {wpMainStatAtLv(wpData.mainStatScale, level)}
            </p>
          </div>
        </div>

        {/* right */}
        <div className="ml-2">
          <div className={`rounded-lg bg-gradient-${rarity} relative`}>
            <img className="w-32" src={getImgSrc(wpData.icon)} alt="" draggable={false} />
            {wpData.beta && <BetaMark className="absolute bottom-0 right-0" />}
          </div>

          {rarity >= 3 && (
            <div className={cn("mt-2 py-1 flex flex-col items-center", groupStyles)}>
              <p className="text-center font-bold">Refinement</p>
              {mutable ? (
                <Select
                  className={`text-lg text-rarity-${rarity} font-bold`}
                  value={refi}
                  onChange={(e) => refine && refine(+e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((level) => (
                    <option key={level}>{level}</option>
                  ))}
                </Select>
              ) : (
                <p className={`text-h6 text-rarity-${rarity} font-bold`}>{refi}</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-h6 font-bold text-orange">{wpData.passiveName}</p>
        <p className="indent-4">{wpData.passiveDesc({ refi }).core}</p>
      </div>
    </div>
  );
}
