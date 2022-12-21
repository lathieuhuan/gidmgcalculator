import { useState, useRef } from "react";
import { FaCaretDown } from "react-icons/fa";
import type { BaseStatType, DataCharacter, GetExtraStatsFn, StatInfo, Talent } from "@Src/types";

// Constant
import { TALENT_LV_MULTIPLIERS } from "@Data/characters/constants";
import { NORMAL_ATTACK_ICONS } from "./constants";

// Util
import { getDefaultStatInfo } from "@Calculators/utils";

// Hook
import { useTranslation } from "@Src/hooks";

// Component
import { CloseButton, StatsTable } from "@Components/atoms";
import { SlideShow } from "../molecules";

const { Row } = StatsTable;
const styles = {
  row: "pb-1 text-sm",
  leftCol: "pr-8 text-dullyellow",
  rightCol: "font-bold text-right",
};

interface TalentDetailProps {
  dataChar: DataCharacter;
  detailIndex: number;
  onChangeDetailIndex: (newIndex: number) => void;
  onClose: () => void;
}
export function TalentDetail({
  dataChar,
  detailIndex,
  onChangeDetailIndex,
  onClose,
}: TalentDetailProps) {
  const { t } = useTranslation();
  const { weaponType, vision, NAsConfig, activeTalents } = dataChar;

  const [talentLevel, setTalentLevel] = useState(1);
  const intervalRef = useRef<NodeJS.Timer>();

  // // for when details for passiveTalents are available
  // const atActiveTalent = detailIndex < Object.keys(activeTalents).length;
  // const [switcher, tab, setTab] = useSwitcher([
  //   { text: "Talent Info", clickable: true },
  //   { text: "Skill Attributes", clickable: atActiveTalent },
  // ]);
  const { NA, CA, PA, ES, EB, altSprint } = activeTalents;
  const images = [NORMAL_ATTACK_ICONS[`${weaponType}_${vision}`]!, ES.image, EB.image];

  if (altSprint) {
    images.push(altSprint.image);
  }
  // for (const talent of passiveTalents) {
  //   images.push(talent.image);
  // }

  const talentInfoByPosition: Array<{
    talentType: Talent;
    talentName: string;
    talentStats: StatInfo[];
    getExtraStats?: GetExtraStatsFn;
  }> = [
    {
      talentType: "NAs",
      talentName: NAsConfig.name,
      talentStats: [...NA.stats, ...CA.stats, ...PA.stats],
      getExtraStats: NAsConfig.getExtraStats,
    },
    {
      talentType: "ES",
      talentName: ES.name,
      talentStats: ES.stats,
      getExtraStats: ES.getExtraStats,
    },
    {
      talentType: "EB",
      talentName: EB.name,
      talentStats: EB.stats,
      getExtraStats: EB.getExtraStats,
    },
    // { talentType: "A1 Passive", name: passiveTalents[0].name },
    // { talentType: "A4 Passive", name: passiveTalents[1].name },
  ];

  if (altSprint) {
    talentInfoByPosition.splice(3, 0, {
      talentType: "altSprint" as const,
      talentName: altSprint.name,
      talentStats: [],
    });
  }

  const {
    talentType = "NAs",
    talentName = "",
    talentStats = [],
    getExtraStats,
  } = talentInfoByPosition[detailIndex] || {};
  const isStatic = talentType === "altSprint";

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

  const getDetailValue = (
    base: number,
    type: number,
    level: number,
    isPercent: boolean,
    baseStatType?: BaseStatType
  ) => {
    let result = base * TALENT_LV_MULTIPLIERS[type][level];
    if (isPercent) {
      result = Math.round(result * 100) / 100;
    } else {
      result = Math.round(result);
    }
    return `${result}${isPercent ? "%" : ""}${baseStatType ? ` ${baseStatType}` : ""}`;
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className={"flex-grow hide-scrollbar " + (!talentName && "hidden")}>
        <SlideShow
          forTalent
          currentIndex={detailIndex}
          images={images}
          vision={vision}
          onClickBack={() => {
            if (detailIndex >= 1) onChangeDetailIndex(detailIndex - 1);
          }}
          onClickNext={() => {
            if (detailIndex < Object.keys(activeTalents).length - 1)
              onChangeDetailIndex(detailIndex + 1);
          }}
          topLeftNote={<p className="absolute top-0 left-0 w-1/4 text-sm">{t(talentType)}</p>}
        />

        <p className={`text-xl font-bold text-${vision} text-center`}>{talentName}</p>
        <div className="mt-2 py-1 flex-center bg-default rounded-2xl">
          <p className="font-bold text-black cursor-default">Skill Attributes</p>
        </div>

        <div className="mt-2">
          <div
            className={
              "py-2 flex-center bg-darkblue-1 sticky -top-1 " + (isStatic ? "pr-4" : "pl-4")
            }
          >
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
                {[...Array(15).keys()].map((_, i) => (
                  <option key={i}>{i + 1}</option>
                ))}
              </select>
            )}
          </div>

          <StatsTable>
            {!isStatic &&
              talentStats.map((stat, i) => {
                const defaultInfo = getDefaultStatInfo(talentType, weaponType, vision);
                const { multBase, multType = defaultInfo.multType, baseStatType, flat } = stat;

                return stat.isNotOfficial || stat.multType === 0 ? null : (
                  <Row key={i} className={styles.row}>
                    <p className={styles.leftCol}>{stat.name}</p>
                    <p className={styles.rightCol}>
                      {Array.isArray(multBase)
                        ? multBase
                            .map((mult) =>
                              getDetailValue(mult, multType, talentLevel, true, baseStatType)
                            )
                            .join("+")
                        : multBase
                        ? getDetailValue(multBase, multType, talentLevel, true, baseStatType)
                        : null}
                      {multBase && flat && " + "}
                      {flat && getDetailValue(flat.base, flat.type, talentLevel, false)}
                    </p>
                  </Row>
                );
              })}

            {getExtraStats
              ? getExtraStats(talentLevel).map((stat, j) => (
                  <Row key={"extra-" + j} className={styles.row}>
                    <p className={styles.leftCol}>{stat.name}</p>
                    <p className={styles.rightCol}>{stat.value}</p>
                  </Row>
                ))
              : null}

            {talentType === "EB" && (
              <Row className={styles.row}>
                <p className={styles.leftCol}>Energy Cost</p>
                <p className={styles.rightCol}>{EB.energyCost}</p>
              </Row>
            )}
          </StatsTable>
        </div>
      </div>

      <div className="mt-4">
        <CloseButton className="mx-auto glow-on-hover" onClick={onClose} />
      </div>
    </div>
  );
}
