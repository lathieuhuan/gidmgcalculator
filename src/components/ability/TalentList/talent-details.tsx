import { useRef, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import cn from "classnames";
import type { GetExtraStatsFn, StatInfo, Talent } from "@Src/types";

import { StatsTable } from "@Components/StatsTable";
import { Select } from "@Src/styled-components";
import { TALENT_LV_MULTIPLIERS } from "@Data/characters/constants";

const { Row } = StatsTable;
const styles = {
  row: "pb-1 text-subtitle-1",
  leftCol: "pr-8 text-dullyellow",
  rightCol: "align-right",
};

interface SkillAttributesProps {
  stats: StatInfo[];
  talentType: Talent;
  energyCost?: number;
  getExtraStats?: GetExtraStatsFn;
}
export function SkillAttributes({
  talentType,
  stats,
  getExtraStats,
  energyCost,
}: SkillAttributesProps) {
  const [level, setLevel] = useState(1);
  const intervalRef = useRef<NodeJS.Timer>();

  const adjustLevel = (goUp: boolean) => {
    const adjust = () =>
      setLevel((prev) => (goUp ? Math.min(prev + 1, 15) : Math.max(prev - 1, 1)));
    adjust();
    intervalRef.current = setInterval(adjust, 200);
  };
  const isStatic = talentType === "altSprint";

  return (
    <div className="mt-2">
      <div
        className={cn("py-2 flex-center bg-darkblue-1 sticky -top-1", isStatic ? "pr-4" : "pl-4")}
      >
        {!isStatic && (
          <>
            <LevelButton
              levelUp
              onMouseDown={adjustLevel}
              onMouseUp={() => clearInterval(intervalRef.current)}
            />
            <LevelButton
              levelUp={false}
              onMouseDown={adjustLevel}
              onMouseUp={() => clearInterval(intervalRef.current)}
            />
          </>
        )}
        <p className="mr-1 text-h6">Lv.</p>
        {isStatic ? (
          <p className="px-1 text-h6 font-bold">1</p>
        ) : (
          <Select
            className="pr-2 text-lg font-bold text-white"
            value={level}
            onChange={(e) => setLevel(+e.target.value)}
          >
            {[...Array(15).keys()].map((_, i) => (
              <option key={i}>{i + 1}</option>
            ))}
          </Select>
        )}
      </div>
      <StatsTable>
        {stats.map((stat, i) => {
          const { baseMult, multType, baseStatType, flat } = stat;

          return stat.conditional ? null : (
            <Row key={i} className={styles.row}>
              <p className={styles.leftCol}>{stat.name}</p>
              <p className={styles.rightCol}>
                <b>
                  {Array.isArray(baseMult)
                    ? baseMult
                        .map((mult) => getValue(mult, multType, level, true, baseStatType))
                        .join("+")
                    : baseMult
                    ? getValue(baseMult, multType, level, true, baseStatType)
                    : null}
                  {baseMult && flat && " + "}
                  {flat && getValue(flat.base, flat.type, level, false)}
                </b>
              </p>
            </Row>
          );
        })}
        {getExtraStats
          ? getExtraStats(level).map((stat, j) => (
              <Row key={"extra-" + j} className={styles.row}>
                <p className={styles.leftCol}>{stat.name}</p>
                <p className={styles.rightCol}>{stat.value}</p>
              </Row>
            ))
          : null}
        {energyCost && (
          <Row className={styles.row}>
            <p className={styles.leftCol}>Energy Cost</p>
            <p className={styles.rightCol}>{energyCost}</p>
          </Row>
        )}
      </StatsTable>
    </div>
  );
}

function getValue(
  base: number,
  type: number,
  level: number,
  isPct: boolean,
  baseStatType?: "base_atk" | "hp" | "atk" | "def"
) {
  let result = base * TALENT_LV_MULTIPLIERS[type][level];
  if (isPct) {
    result = Math.round(result * 100) / 100;
  } else {
    result = Math.round(result);
  }
  return cn(result, isPct && "%", baseStatType);
}

interface LevelButtonProps {
  levelUp: boolean;
  onMouseDown: (goUp: boolean) => void;
  onMouseUp: () => void;
}
export const LevelButton = ({ levelUp, onMouseDown, onMouseUp }: LevelButtonProps) => {
  const Icon = levelUp ? FaCaretUp : FaCaretDown;
  return (
    <button
      className={cn(
        "absolute top-2 flex px-2 rounded border-2 border-darkblue-3 text-darkblue-3 text-1.5xl hover:border-green hover:text-green",
        levelUp ? "right-10" : "left-10"
      )}
      onMouseDown={() => onMouseDown(levelUp)}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <Icon />
    </button>
  );
};
