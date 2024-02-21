import { useState, useRef, useMemo } from "react";
import { FaCaretDown } from "react-icons/fa";

import type { TalentAttributeType, AppCharacter, Talent } from "@Src/types";
import { getTalentDefaultInfo, round, toArray } from "@Src/utils";
import { useTranslation } from "@Src/pure-hooks";

// Constant
import { ATTACK_PATTERNS } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import NORMAL_ATTACK_ICONS from "./normalAttackIcons";

// Component
import { CloseButton, StatsTable } from "@Src/pure-components";
import { AbilityCarousel } from "../ability-list-components";

interface TalentDetailProps {
  appChar: AppCharacter;
  detailIndex: number;
  onChangeDetailIndex: (newIndex: number) => void;
  onClose: () => void;
}
export const TalentDetail = ({ appChar, detailIndex, onChangeDetailIndex, onClose }: TalentDetailProps) => {
  const { t } = useTranslation();
  const { weaponType, vision: elementType, activeTalents } = appChar;

  const [talentLevel, setTalentLevel] = useState(1);
  const intervalRef = useRef<NodeJS.Timer>();

  const { ES, EB, altSprint } = activeTalents;
  const images = [NORMAL_ATTACK_ICONS[`${weaponType}_${elementType}`] || "", ES.image, EB.image];

  if (altSprint) {
    images.push(altSprint.image);
  }
  // for (const talent of passiveTalents) {
  //   images.push(talent.image);
  // }

  const talents = useMemo(() => {
    return processActiveTalents(appChar, talentLevel, {
      atk: t("atk"),
      base_atk: t("base_atk"),
      def: t("def"),
      em: t("em"),
      hp: t("hp"),
    });
  }, [talentLevel]);

  const talent = talents[detailIndex];
  const levelable = talent?.type !== "altSprint";

  const onMouseDownLevelButton = (isLevelUp: boolean) => {
    let level = talentLevel;

    const adjustLevel = () => {
      if (isLevelUp ? level < 15 : level > 1) {
        setTalentLevel((prev) => {
          level = isLevelUp ? prev + 1 : prev - 1;
          return level;
        });
      }
    };

    adjustLevel();
    intervalRef.current = setInterval(adjustLevel, 150);
  };

  const renderLevelButton = (isLevelUp: boolean, disabled: boolean) => {
    return (
      <button
        className={
          "w-7 h-7 flex-center rounded border-2 border-dark-500 text-dark-500 text-1.5xl " +
          (disabled ? "opacity-50" : "hover:border-blue-400 hover:text-blue-400")
        }
        disabled={disabled}
        onMouseDown={() => onMouseDownLevelButton(isLevelUp)}
        onMouseUp={() => clearInterval(intervalRef.current)}
        onMouseLeave={() => clearInterval(intervalRef.current)}
      >
        <FaCaretDown className={isLevelUp ? "rotate-180" : ""} />
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className={"flex-grow hide-scrollbar" + (talent.name ? "" : " hidden")}>
        <AbilityCarousel
          className="pt-1 pb-2"
          label={t(talent.type)}
          currentIndex={detailIndex}
          images={images}
          elementType={elementType}
          onClickBack={() => {
            if (detailIndex >= 1) onChangeDetailIndex(detailIndex - 1);
          }}
          onClickNext={() => {
            if (detailIndex < Object.keys(activeTalents).length - 1) onChangeDetailIndex(detailIndex + 1);
          }}
        />

        <p className={`text-lg font-semibold text-${elementType} text-center`}>{talent.name}</p>
        {/* <div className="my-2 py-1 flex-center bg-light-400 rounded-2xl">
          <p className="font-bold text-black cursor-default">Skill Attributes</p>
        </div> */}

        <div>
          <div className="py-2 flex-center bg-dark-900 sticky -top-1">
            {levelable ? (
              <div className="flex items-center space-x-4">
                {renderLevelButton(false, talentLevel <= 1)}
                <label className="flex items-center text-lg">
                  <p>Lv.</p>
                  <select
                    className="font-bold text-right text-last-right"
                    value={talentLevel}
                    onChange={(e) => setTalentLevel(+e.target.value)}
                  >
                    {Array.from({ length: 15 }).map((_, i) => (
                      <option key={i}>{i + 1}</option>
                    ))}
                  </select>
                </label>
                {renderLevelButton(true, talentLevel >= 15)}
              </div>
            ) : (
              <p className="text-lg">
                Lv. <span className="font-bold">1</span>
              </p>
            )}
          </div>

          <StatsTable>
            {talent.stats.map((stat, i) => {
              return (
                <StatsTable.Row key={i} className="pb-1 text-sm">
                  <p className="pr-6 text-yellow-300">{stat.name}</p>
                  <p className="font-semibold text-right">{stat.value}</p>
                </StatsTable.Row>
              );
            })}
          </StatsTable>
        </div>
      </div>

      <div className="mt-3">
        <CloseButton className="mx-auto glow-on-hover" size="small" onClick={onClose} />
      </div>
    </div>
  );
};

type ProcessedStat = {
  name: string;
  value: string | number;
};

interface ProcessedActiveTalent {
  name: string;
  type: Talent;
  stats: ProcessedStat[];
}
function processActiveTalents(
  appChar: AppCharacter,
  level: number,
  label: Record<TalentAttributeType, string>
): ProcessedActiveTalent[] {
  const { vision: elementType, weaponType, EBcost, activeTalents, multFactorConf, calcList } = appChar;
  const { NAs, ES, EB, altSprint } = activeTalents;

  const result: Record<Exclude<Talent, "altSprint">, ProcessedActiveTalent> = {
    NAs: { name: NAs.name, type: "NAs", stats: [] },
    ES: { name: ES.name, type: "ES", stats: [] },
    EB: { name: EB.name, type: "EB", stats: [] },
  };

  for (const attPatt of ATTACK_PATTERNS) {
    const resultKey = attPatt === "ES" || attPatt === "EB" ? attPatt : "NAs";
    const defaultInfo = getTalentDefaultInfo(resultKey, weaponType, elementType, attPatt, multFactorConf);

    for (const stat of calcList[attPatt]) {
      const multFactors = toArray(stat.multFactors);
      const factorStrings = [];

      if (stat.notOfficial || multFactors.some((factor) => typeof factor !== "number" && factor.scale === 0)) {
        continue;
      }

      for (const factor of multFactors) {
        const {
          root,
          scale = defaultInfo.scale,
          basedOn = defaultInfo.basedOn,
        } = typeof factor === "number" ? { root: factor } : factor;

        if (scale && root) {
          let string = round(root * TALENT_LV_MULTIPLIERS[scale][level], 2) + "%";

          if (basedOn) {
            string += ` ${label[basedOn]}`;
          }

          factorStrings.push(string);
        }
      }

      const { flatFactor } = stat;

      if (flatFactor) {
        const { root, scale = defaultInfo.flatFactorScale } =
          typeof flatFactor === "number" ? { root: flatFactor } : flatFactor;

        factorStrings.push(Math.round(root * (scale ? TALENT_LV_MULTIPLIERS[scale][level] : 1)));
      }

      result[resultKey].stats.push({
        name: stat.name,
        value: factorStrings.join(" + "),
      });
    }
  }

  result.EB.stats.push({
    name: "Energy cost",
    value: EBcost,
  });

  const talents = [result.NAs, result.ES, result.EB];

  if (altSprint) {
    talents.push({
      name: altSprint.name,
      type: "altSprint",
      stats: [],
    });
  }

  return talents;
}
