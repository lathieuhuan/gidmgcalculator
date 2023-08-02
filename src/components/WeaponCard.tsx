import { useMemo } from "react";
import type { CalcWeapon, Level } from "@Src/types";

// Constant
import { LEVELS } from "@Src/constants";
import { useTranslation } from "@Src/hooks";

// Util
import { percentSign, getImgSrc, weaponMainStatValue, weaponSubStatValue, round } from "@Src/utils";
import { findDataWeapon } from "@Data/controllers";

// Component
import { BetaMark } from "@Src/pure-components";

const groupStyles = "bg-darkblue-2 px-2";

const wrapText = (text: string | number, dull?: boolean) => {
  return `<span${dull ? "" : ' class="text-green font-semibold"'}>${text}</span>`;
};

interface WeaponCardProps {
  weapon?: CalcWeapon;
  mutable?: boolean;
  upgrade?: (newLevel: Level) => void;
  refine?: (newRefi: number) => void;
}
export const WeaponCard = ({ weapon, mutable, upgrade, refine }: WeaponCardProps) => {
  const { t } = useTranslation();
  if (!weapon) return null;

  const wpData = findDataWeapon(weapon)!;
  const { level, refi } = weapon;
  const { rarity, subStat } = wpData;
  const selectLevels = rarity < 3 ? LEVELS.slice(0, -4) : LEVELS;

  const passiveDescription = useMemo(() => {
    if (!wpData.description) {
      return "";
    }
    const { pots, seeds } = wpData.description;

    return pots
      .map((content) => {
        return content.replace(/\{[0-9]+\}/g, (match) => {
          const seed = seeds[+match.slice(1, 2)];

          if (typeof seed === "number") {
            return wrapText(round(seed + (seed / 3) * refi, 3));
          }
          if (seed) {
            if ("base" in seed) {
              const { base, increment = base / 3 } = seed;
              const value = base + increment * refi;
              return wrapText(round(value, 3), seed.dull);
            }
            return wrapText(seed.options[refi - 1], seed.dull);
          }
          return match;
        });
      })
      .join(" ");
  }, [weapon.code, refi]);

  // const passiveDescription = useMemo(() => {
  //   if (!wpData.passive) {
  //     return "";
  //   }
  //   const { description, seeds } = wpData.passive;

  //   return description.replace(/\{[0-9]+\}/g, (match) => {
  //     const seed = seeds[+match.slice(1, 2)];

  //     if (typeof seed === "number") {
  //       return wrapText(round(seed + (seed / 3) * refi, 3));
  //     }
  //     if (seed) {
  //       if ("base" in seed) {
  //         const { base, increment = base / 3 } = seed;
  //         const value = base + increment * refi;
  //         return wrapText(round(value, 3), seed.dull);
  //       }
  //       return wrapText(seed.options[refi - 1], seed.dull);
  //     }
  //     return match;
  //   });
  // }, [weapon.code, refi]);

  return (
    <div className="w-full" onDoubleClick={() => console.log(weapon)}>
      <p className={`text-2.5xl text-rarity-${rarity} font-bold`}>{wpData.name}</p>
      <div className="mt-2 flex">
        {/* left */}
        <div className="flex flex-col grow justify-between">
          {/*  */}
          <div className={"pt-1 grow flex items-center " + groupStyles}>
            <p className="mr-2 text-lg font-semibold">Level</p>
            {mutable ? (
              <select
                className={`text-lg text-rarity-${rarity} font-bold text-last-right`}
                value={level}
                onChange={(e) => upgrade && upgrade(e.target.value as Level)}
              >
                {selectLevels.map((_, index) => (
                  <option key={index}>{selectLevels[selectLevels.length - 1 - index]}</option>
                ))}
              </select>
            ) : (
              <p className={`text-lg text-rarity-${rarity} font-bold`}>{level}</p>
            )}
          </div>

          {subStat ? (
            <div className={"grow mt-1 pt-1 flex flex-col justify-center " + groupStyles}>
              <p className="font-semibold">{t(subStat.type)}</p>
              <p className={`text-rarity-${rarity} text-2xl leading-7 font-bold`}>
                {weaponSubStatValue(subStat.scale, level)}
                {percentSign(subStat.type)}
              </p>
            </div>
          ) : null}

          <div className={"grow mt-1 pt-1 flex flex-col justify-center " + groupStyles}>
            <p className="font-semibold">Base ATK</p>
            <p className={`text-rarity-${rarity} text-2.5xl font-bold`}>
              {weaponMainStatValue(wpData.mainStatScale, level)}
            </p>
          </div>
        </div>

        {/* right */}
        <div className="ml-2">
          <div className={`rounded-lg bg-gradient-${rarity} relative`}>
            <img className="w-32 h-32" src={getImgSrc(wpData.icon)} alt="" draggable={false} />
            {wpData.beta && <BetaMark className="absolute bottom-0 right-0" />}
          </div>

          {rarity >= 3 && (
            <div className={"mt-2 py-1 flex flex-col items-center " + groupStyles}>
              <p className="text-center font-semibold">Refinement</p>
              {mutable ? (
                <select
                  className={`text-lg text-rarity-${rarity} font-bold`}
                  value={refi}
                  onChange={(e) => refine && refine(+e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((level) => (
                    <option key={level}>{level}</option>
                  ))}
                </select>
              ) : (
                <p className={`text-lg text-rarity-${rarity} font-bold`}>{refi}</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-lg font-semibold text-orange">{wpData.passiveName}</p>
        {/* <p className="indent-4">{wpData.passiveDesc({ refi }).core}</p> */}
        <p className="indent-4" dangerouslySetInnerHTML={{ __html: passiveDescription }} />
      </div>
    </div>
  );
};
