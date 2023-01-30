import clsx from "clsx";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import type { CoreStat, PartiallyRequired, TotalAttribute } from "@Src/types";

// Constant
import { ATTACK_ELEMENTS, CORE_STAT_TYPES } from "@Src/constants";

// Util
import { getRxnBonusesFromEM } from "@Src/utils/calculation";

// Hook
import { useTranslation } from "@Src/hooks";

// Component
import { Green, StatsTable, CollapseSpace } from "@Components/atoms";

interface AttributeTableProps {
  attributes: PartiallyRequired<Partial<TotalAttribute>, CoreStat>;
}
export function AttributeTable({ attributes }: AttributeTableProps) {
  const { t } = useTranslation();

  if (!attributes) {
    return null;
  }

  return (
    <StatsTable>
      {CORE_STAT_TYPES.map((type) => {
        const baseAttr = attributes?.[`base_${type}`] || 0;
        const totalAttr = attributes?.[type] || 0;

        return (
          <StatsTable.Row key={type} className="group">
            <p>{t(type)}</p>
            <div className="relative">
              <p className={clsx("mr-2", { "group-hover:hidden": baseAttr })}>
                {Math.round(totalAttr)}
              </p>
              {baseAttr ? (
                <p className="mr-2 hidden whitespace-nowrap group-hover:block group-hover:absolute group-hover:top-0 group-hover:right-0">
                  {baseAttr} + <Green>{Math.round(totalAttr - baseAttr)}</Green>
                </p>
              ) : null}
            </div>
          </StatsTable.Row>
        );
      })}

      <EmSection em={attributes?.em || 0} />

      {(["cRate", "cDmg", "healBn", "er", "shStr"] as const).map((type) => {
        return (
          <StatsTable.Row key={type}>
            <p>{t(type)}</p>
            <p className="mr-2">{Math.round((attributes?.[type] || 0) * 10) / 10}%</p>
          </StatsTable.Row>
        );
      })}

      {ATTACK_ELEMENTS.map((type) => {
        return (
          <StatsTable.Row key={type}>
            <p>{t(type)}</p>
            <p className="mr-2">{Math.round((attributes?.[type] || 0) * 10) / 10}%</p>
          </StatsTable.Row>
        );
      })}

      {(["naAtkSpd", "caAtkSpd"] as const).map((type) => {
        return (
          <StatsTable.Row key={type}>
            <p>{t(type)}</p>
            <p className="mr-2">{Math.round((attributes?.[type] || 0) * 10) / 10}%</p>
          </StatsTable.Row>
        );
      })}
    </StatsTable>
  );
}

interface EmSectionProps {
  em: number;
}
function EmSection({ em }: EmSectionProps) {
  const [dropped, setDropped] = useState(false);
  const rxnBonusFromEM = getRxnBonusesFromEM(em);

  return (
    <div>
      <StatsTable.Row
        className="cursor-pointer !bg-transparent hover:!bg-darkerred"
        onClick={() => setDropped(!dropped)}
      >
        <div className="flex items-center">
          <p className="mr-1">Elemental Mastery</p>
          <FaCaretDown
            className={clsx(
              "duration-150 ease-linear",
              dropped ? "text-green" : "text-default rotate-90"
            )}
          />
        </div>
        <p className="mr-2">{em}</p>
      </StatsTable.Row>
      <CollapseSpace active={dropped}>
        <ul className="px-2 pb-1 text-sm flex flex-col space-y-1">
          <li>
            • Increases damage dealt by Vaporize and Melt by{" "}
            <Green>{rxnBonusFromEM.amplifying}%</Green>.
          </li>
          <li>
            • Increases damage dealt by Overloaded, Superconduct, Electro-Charged, Burning,
            Shattered, Swirl, Bloom, Hyperbloom, and Burgeon by{" "}
            <Green>{rxnBonusFromEM.transformative}%</Green>.
          </li>
          <li>
            • Increases the DMG Bonus provided by Aggravate and Spread by{" "}
            <Green>{rxnBonusFromEM.quicken}%</Green>.
          </li>
          <li>
            • Increases the damage absorption power of shields created through Crystallize by{" "}
            <Green>{rxnBonusFromEM.shield}%</Green>.
          </li>
        </ul>
      </CollapseSpace>
    </div>
  );
}
