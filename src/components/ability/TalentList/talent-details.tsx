import clsx from "clsx";
import { useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import type {
  BaseStatType,
  GetExtraStatsFn,
  StatInfo,
  Talent,
  Vision,
  WeaponType,
} from "@Src/types";

// Constant
import { TALENT_LV_MULTIPLIERS } from "@Data/characters/constants";

// Util
import { getDefaultStatInfo } from "@Calculators/utils";

// Component
import { StatsTable } from "@Components/StatsTable";

const { Row } = StatsTable;
const styles = {
  row: "pb-1 text-sm",
  leftCol: "pr-8 text-dullyellow",
  rightCol: "font-bold text-right",
};

interface SkillAttributesProps {
  stats: StatInfo[];
  talentType: Talent;
  vision: Vision;
  weaponType: WeaponType;
  energyCost?: number;
  getExtraStats?: GetExtraStatsFn;
}
export function SkillAttributes({
  stats,
  talentType,
  vision,
  weaponType,
  energyCost,
  getExtraStats,
}: SkillAttributesProps) {
  const [level, setLevel] = useState(1);
  const intervalRef = useRef<NodeJS.Timer>();

  const adjustLevel = (goUp: boolean) => {
    const adjust = () => {
      setLevel((prev) => (goUp ? Math.min(prev + 1, 15) : Math.max(prev - 1, 1)));
    };

    adjust();
    intervalRef.current = setInterval(adjust, 200);
  };
  const isStatic = talentType === "altSprint";

  return (
    <div className="mt-2">
      <div
        className={clsx("py-2 flex-center bg-darkblue-1 sticky -top-1", isStatic ? "pr-4" : "pl-4")}
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

        <p className="text-lg">Lv.</p>
        {isStatic ? (
          <p className="px-1 text-lg font-bold">1</p>
        ) : (
          <select
            className="styled-select pr-2 text-lg font-bold text-default text-right text-last-right bg-transparent"
            value={level}
            onChange={(e) => setLevel(+e.target.value)}
          >
            {[...Array(15).keys()].map((_, i) => (
              <option key={i}>{i + 1}</option>
            ))}
          </select>
        )}
      </div>

      <StatsTable>
        {!isStatic &&
          stats.map((stat, i) => {
            const defaultInfo = getDefaultStatInfo(talentType, weaponType, vision);
            const { multBase, multType = defaultInfo.multType, baseStatType, flat } = stat;

            return stat.isNotOfficial || stat.multType === 0 ? null : (
              <Row key={i} className={styles.row}>
                <p className={styles.leftCol}>{stat.name}</p>
                <p className={styles.rightCol}>
                  {Array.isArray(multBase)
                    ? multBase
                        .map((mult) => getValue(mult, multType, level, true, baseStatType))
                        .join("+")
                    : multBase
                    ? getValue(multBase, multType, level, true, baseStatType)
                    : null}
                  {multBase && flat && " + "}
                  {flat && getValue(flat.base, flat.type, level, false)}
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
  baseStatType?: BaseStatType
) {
  let result = base * TALENT_LV_MULTIPLIERS[type][level];
  if (isPct) {
    result = Math.round(result * 100) / 100;
  } else {
    result = Math.round(result);
  }
  return clsx(result + (isPct ? "%" : ""), baseStatType);
}

interface LevelButtonProps {
  levelUp: boolean;
  onMouseDown: (goUp: boolean) => void;
  onMouseUp: () => void;
}
export const LevelButton = ({ levelUp, onMouseDown, onMouseUp }: LevelButtonProps) => {
  return (
    <button
      className={clsx(
        "absolute top-2 flex px-2 rounded border-2 border-darkblue-3 text-darkblue-3 text-1.5xl hover:border-green hover:text-green",
        levelUp ? "right-10" : "left-10"
      )}
      onMouseDown={() => onMouseDown(levelUp)}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <FaCaretDown className={clsx(levelUp && "rotate-180")} />
    </button>
  );
};
