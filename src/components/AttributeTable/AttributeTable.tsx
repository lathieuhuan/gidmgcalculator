import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import cn from "classnames";
import { ATTACK_ELEMENTS, CORE_STAT_TYPES } from "@Src/constants";
import type { CoreStat, PartiallyRequired, TotalAttribute } from "@Src/types";
import { getRxnBonusesFromEM } from "@Calculators/utils";

import { Green } from "@Src/styled-components";
import { StatsTable } from "@Components/StatsTable";
import { CollapseSpace } from "@Components/collapse";
import { useTranslation } from "@Hooks/useTranslation";

interface AttributeTableProps {
  attributes: PartiallyRequired<Partial<TotalAttribute>, CoreStat>;
}
export function AttributeTable({ attributes }: AttributeTableProps) {
  const { t } = useTranslation();

  if (!attributes) {
    return null;
  }
  const em = attributes.em || 0;

  return (
    <StatsTable>
      {CORE_STAT_TYPES.map((type) => {
        const baseAttr = attributes[`base_${type}`];

        return (
          <StatsTable.Row key={type} className="group">
            <p>{t(type)}</p>
            <div className="relative">
              <p className={cn("mr-2", { "group-hover:hidden": baseAttr })}>
                {Math.round(attributes[type])}
              </p>
              {baseAttr && (
                <p className="mr-2 hidden whitespace-nowrap group-hover:block group-hover:absolute group-hover:top-0 group-hover:right-0">
                  {baseAttr} + <Green>{Math.round(attributes[type] - baseAttr)}</Green>
                </p>
              )}
            </div>
          </StatsTable.Row>
        );
      })}
      <EmSection em={em} />
      {(["cRate", "cDmg", "healBn", "er", "shStr"] as const).map((type) => {
        return (
          <StatsTable.Row key={type}>
            <p>{t(type)}</p>
            <p className="mr-2">{Math.round((attributes[type] || 0) * 10) / 10}%</p>
          </StatsTable.Row>
        );
      })}
      {ATTACK_ELEMENTS.map((type) => {
        return (
          <StatsTable.Row key={type}>
            <p>{t(type)}</p>
            <p className="mr-2">{Math.round((attributes[type] || 0) * 10) / 10}%</p>
          </StatsTable.Row>
        );
      })}
      {(["naAtkSpd", "caAtkSpd"] as const).map((type) => {
        return (
          <StatsTable.Row key={type}>
            <p>{t(type)}</p>
            <p className="mr-2">{Math.round((attributes[type] || 0) * 10) / 10}%</p>
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
  const quickenBonus = Math.round((5000 * em) / (em + 1200)) / 10;

  return (
    <div>
      <StatsTable.Row
        className="cursor-pointer !bg-transparent hover:!bg-darkerred"
        onClick={() => setDropped(!dropped)}
      >
        <div className="flex items-center">
          <p className="mr-1">Elemental Mastery</p>
          <FaCaretDown
            className={cn(
              "duration-150 ease-linear",
              dropped ? "text-green" : "text-default rotate-90"
            )}
          />
        </div>
        <p className="mr-2">{em}</p>
      </StatsTable.Row>
      <CollapseSpace active={dropped}>
        <ul className="px-2 pb-1 text-subtitle-1 flex flex-col space-y-1">
          <li>
            - Increases damage dealt by Vaporize and Melt by{" "}
            <Green>{rxnBonusFromEM.amplifying}%</Green>.
          </li>
          <li>
            - Increases damage dealt by Overloaded, Superconduct, Electro-Charged, Burning,
            Shattered, Swirl, Bloom, Hyperbloom, and Burgeon by{" "}
            <Green>{rxnBonusFromEM.transformative}%</Green>.
          </li>
          <li>
            - Increases the DMG Bonus provided by Aggravate and Spread by{" "}
            <Green>{quickenBonus}%</Green>.
          </li>
          <li>
            - Increases the damage absorption power of shields created through Crystallize by{" "}
            <Green>{rxnBonusFromEM.shield}%</Green>.
          </li>
        </ul>
      </CollapseSpace>
    </div>
  );
}
