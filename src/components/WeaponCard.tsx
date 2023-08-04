import clsx from "clsx";
import { useMemo } from "react";
import type { CalcWeapon, DescriptionSeed, DescriptionSeedType, Level } from "@Src/types";

// Constant
import { LEVELS } from "@Src/constants";
import { useTranslation } from "@Src/hooks";

// Util
import { percentSign, getImgSrc, weaponMainStatValue, weaponSubStatValue, round } from "@Src/utils";
import { findDataWeapon } from "@Data/controllers";

// Component
import { BetaMark } from "@Src/pure-components";

const groupStyles = "bg-darkblue-2 px-2";

const wrapText = (text: string | number, type: DescriptionSeedType = "dull", bold = true) => {
  return `<span class="${clsx({
    "text-green": type === "green",
    "text-rose-500": type === "red",
    "font-bold": type === "green" && bold,
  })}">${text}</span>`;
};

const scaleRefi = (base: number, refi: number, increment = base / 3) => round(base + increment * refi, 3);

const decoDescription = (pot: string, seeds: DescriptionSeed[], refi: number) => {
  return pot.replace(/\{[a-zA-Z0-9 ',-]+\}%?/g, (match) => {
    let seed: string | DescriptionSeed;
    let suffix = "";

    if (match[match.length - 1] === "%") {
      seed = seeds[+match.slice(1, -2)];
      suffix = "%";
    } else {
      const key = match.slice(1, -1);
      seed = isNaN(+key) ? key : seeds[+key];
    }

    switch (typeof seed) {
      case "number":
        return wrapText(scaleRefi(seed, refi) + suffix, "green");
      case "string":
        return wrapText(seed, "green", false);
      case "object":
        if ("base" in seed) {
          const { seedType = "green" } = seed;
          return wrapText(scaleRefi(seed.base, refi, seed.increment) + suffix, seedType);
        }
        if ("options" in seed) {
          const { seedType = "green" } = seed;
          return wrapText(seed.options[refi - 1] + suffix, seedType);
        }
        return wrapText(scaleRefi(seed.max, refi, seed.increment) + suffix, "red");
      default:
        return match;
    }
  });
};

interface WeaponCardProps {
  weapon?: CalcWeapon;
  mutable?: boolean;
  upgrade?: (newLevel: Level) => void;
  refine?: (newRefi: number) => void;
}
const WeaponCard = ({ weapon, mutable, upgrade, refine }: WeaponCardProps) => {
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
    return pots.map((content) => decoDescription(content, seeds, refi)).join(" ");
  }, [weapon.code, refi]);

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
        <p className="indent-4" dangerouslySetInnerHTML={{ __html: passiveDescription }} />
      </div>
    </div>
  );
};

WeaponCard.decoDescription = decoDescription;

export { WeaponCard };
