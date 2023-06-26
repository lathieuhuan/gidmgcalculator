import { useState, useRef, useMemo } from "react";
import { FaCaretDown } from "react-icons/fa";

import type { TalentStatAttributeType, DataCharacter, Talent } from "@Src/types";
import { getTalentDefaultInfo, round, turnArray } from "@Src/utils";
import { useTranslation } from "@Src/hooks";

// Constant
import { ATTACK_PATTERNS } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { NORMAL_ATTACK_ICONS } from "./constants";

// Component
import { CloseButton, StatsTable } from "@Src/pure-components";
import { SlideShow } from "../components";

const styles = {
  row: "pb-1 text-sm",
  leftCol: "pr-6 text-dullyellow",
  rightCol: "font-bold text-right",
};

interface TalentDetailProps {
  dataChar: DataCharacter;
  detailIndex: number;
  onChangeDetailIndex: (newIndex: number) => void;
  onClose: () => void;
}
export const TalentDetail = ({ dataChar, detailIndex, onChangeDetailIndex, onClose }: TalentDetailProps) => {
  const { t } = useTranslation();
  const { weaponType, vision, activeTalents } = dataChar;

  const [talentLevel, setTalentLevel] = useState(1);
  const intervalRef = useRef<NodeJS.Timer>();

  const { ES, EB, altSprint } = activeTalents;
  const images = [NORMAL_ATTACK_ICONS[`${weaponType}_${vision}`] || "", ES.image, EB.image];

  if (altSprint) {
    images.push(altSprint.image);
  }
  // for (const talent of passiveTalents) {
  //   images.push(talent.image);
  // }

  const talents = useMemo(() => {
    return processActiveTalents(dataChar, talentLevel, {
      atk: t("atk"),
      base_atk: t("base_atk"),
      def: t("def"),
      em: t("em"),
      hp: t("hp"),
    });
  }, [talentLevel]);

  const talent = talents[detailIndex];
  const isStatic = talent.type === "altSprint";

  const onMouseDownLevelButton = (isLevelUp: boolean) => {
    const adjustLevel = () => {
      setTalentLevel((prev) => (isLevelUp ? Math.min(prev + 1, 15) : Math.max(prev - 1, 1)));
    };

    adjustLevel();
    intervalRef.current = setInterval(adjustLevel, 200);
  };

  const renderLevelButton = (isLevelUp: boolean) => {
    return (
      <button
        className={
          "absolute top-2 flex px-2 rounded border-2 border-darkblue-3 text-darkblue-3 text-1.5xl hover:border-green hover:text-green " +
          (isLevelUp ? "right-10" : "left-10")
        }
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
        <SlideShow
          forTalent
          currentIndex={detailIndex}
          images={images}
          vision={vision}
          onClickBack={() => {
            if (detailIndex >= 1) onChangeDetailIndex(detailIndex - 1);
          }}
          onClickNext={() => {
            if (detailIndex < Object.keys(activeTalents).length - 1) onChangeDetailIndex(detailIndex + 1);
          }}
          topLeftNote={<p className="absolute top-0 left-0 w-1/4 text-sm">{t(talent.type)}</p>}
        />

        <p className={`text-xl font-bold text-${vision} text-center`}>{talent.name}</p>
        {/* <div className="my-2 py-1 flex-center bg-default rounded-2xl">
          <p className="font-bold text-black cursor-default">Skill Attributes</p>
        </div> */}

        <div>
          <div className={"py-2 flex-center bg-darkblue-1 sticky -top-1 " + (isStatic ? "pr-4" : "pl-4")}>
            {!isStatic && (
              <>
                {renderLevelButton(true)}
                {renderLevelButton(false)}
              </>
            )}

            <p className="text-lg">Lv.</p>
            {isStatic ? (
              <p className="px-1 text-lg font-bold">1</p>
            ) : (
              <select
                className="pr-2 text-lg font-bold text-right text-last-right"
                value={talentLevel}
                onChange={(e) => setTalentLevel(+e.target.value)}
              >
                {Array.from({ length: 13 }).map((_, i) => (
                  <option key={i}>{i + 1}</option>
                ))}
              </select>
            )}
          </div>

          <StatsTable>
            {talent.stats.map((stat, i) => {
              return (
                <StatsTable.Row key={i} className={styles.row}>
                  <p className={styles.leftCol}>{stat.name}</p>
                  <p className={styles.rightCol}>{stat.value}</p>
                </StatsTable.Row>
              );
            })}
          </StatsTable>
        </div>
      </div>

      <div className="mt-4">
        <CloseButton className="mx-auto glow-on-hover" onClick={onClose} />
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
  dataChar: DataCharacter,
  level: number,
  label: Record<TalentStatAttributeType, string>
): ProcessedActiveTalent[] {
  const { vision, weaponType, activeTalents } = dataChar;
  const { ES, EB } = activeTalents;

  const result: Record<Exclude<Talent, "altSprint">, ProcessedActiveTalent> = {
    NAs: {
      name: dataChar.NAsConfig.name,
      type: "NAs",
      stats: [],
    },
    ES: { name: ES.name, type: "ES", stats: [] },
    EB: { name: EB.name, type: "EB", stats: [] },
  };

  for (const attPatt of ATTACK_PATTERNS) {
    const isElemental = attPatt === "ES" || attPatt === "EB";
    const resultKey = isElemental ? attPatt : "NAs";
    const defaultInfo = getTalentDefaultInfo(resultKey, weaponType, vision, attPatt);
    const { stats, multScale = defaultInfo.scale, multAttributeType } = activeTalents[attPatt];

    for (const stat of stats) {
      const multFactors = turnArray(stat.multFactors);
      const factorStrings = [];

      if (stat.isNotOfficial || multFactors.some((factor) => typeof factor !== "number" && factor.scale === 0)) {
        continue;
      }

      for (const factor of multFactors) {
        const {
          root,
          scale = multScale,
          attributeType = multAttributeType,
        } = typeof factor === "number" ? { root: factor } : factor;

        if (scale && root) {
          let string = round(root * TALENT_LV_MULTIPLIERS[scale][level], 2) + "%";

          if (attributeType) {
            string += ` ${label[attributeType]}`;
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
    value: EB.energyCost,
  });

  const results = [result.NAs, result.ES, result.EB];

  return results;
}
