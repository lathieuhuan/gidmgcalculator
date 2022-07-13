import { FaCaretDown } from "react-icons/fa";
import cn from "classnames";
import { ATTACK_ELEMENTS, CORE_STAT_TYPES, VISION_TYPES } from "@Src/constants";
import type { AttackElementBonus, CoreStat, PartiallyRequired, TotalAttribute } from "@Src/types";
import { Green } from "@Styled/DataDisplay";
import StatsTable from "./StatsTable";
import { useState } from "react";
import { CollapseSpace } from "./Collapse";
import { getRxnBonusesFromEM } from "@Src/calculators/utils";

interface AttributeTableProps {
  attributes: PartiallyRequired<Partial<TotalAttribute>, CoreStat>;
}
export default function AttributeTable({ attributes }: AttributeTableProps) {
  const em = attributes.em || 0;
  const rxnBonusFromEM = getRxnBonusesFromEM(em);

  return (
    <StatsTable>
      {CORE_STAT_TYPES.map((type) => {
        const baseAttr = attributes[`base_${type}`];
        return (
          <StatsTable.Row key={type} className="group">
            <p>{type}</p>
            <div className="relative">
              <p className={cn("mr-2", { "group-hover:hidden": baseAttr })}>{attributes[type]}</p>
              {baseAttr && (
                <p className="mr-2 hidden whitespace-nowrap group-hover:block group-hover:absolute group-hover:top-0 group-hover:right-0">
                  {baseAttr} + <Green>{attributes[type] - baseAttr}</Green>
                </p>
              )}
            </div>
          </StatsTable.Row>
        );
      })}
      <EmSection em={em} rxnBonusFromEM={rxnBonusFromEM} />
      {(["cRate", "cDmg", "healBn", "er", "shStr"] as const).map((type) => {
        return (
          <StatsTable.Row key={type}>
            <p>{type}</p>
            <p className="mr-2">{Math.round((attributes[type] || 0) * 10) / 10}%</p>
          </StatsTable.Row>
        );
      })}
      {ATTACK_ELEMENTS.map((type) => {
        return (
          <StatsTable.Row key={type}>
            <p>{type}</p>
            <p className="mr-2">{Math.round((attributes[type] || 0) * 10) / 10}%</p>
          </StatsTable.Row>
        );
      })}
      {(["naAtkSpd", "caAtkSpd"] as const).map((type) => {
        return (
          <StatsTable.Row key={type}>
            <p>{type}</p>
            <p className="mr-2">{Math.round((attributes[type] || 0) * 10) / 10}%</p>
          </StatsTable.Row>
        );
      })}
    </StatsTable>
  );
}

interface EmSectionProps {
  em: number;
  rxnBonusFromEM: {
    amplifying: number;
    transformative: number;
    shield: number;
  };
}
function EmSection({ em, rxnBonusFromEM }: EmSectionProps) {
  const [dropped, setDropped] = useState(false);

  return (
    <div>
      <StatsTable.Row
        className="cursor-pointer !bg-transparent"
        onClick={() => setDropped(!dropped)}
      >
        <div className="flex align-center">
          <p className="mr-1">Elemental Mastery</p>
          <FaCaretDown
            className={cn("relative -bottom-0.5 text-white duration-150 ease-linear", {
              "text-green rotate-180": dropped,
            })}
          />
        </div>
        <p className="mr-2">{em}</p>
      </StatsTable.Row>
      <CollapseSpace active={dropped}>
        <div className="px-2 py-1 flex flex-col gap-1">
          <p className="text-subtitle-1">
            Increases damage caused by Vaporize and Melt by{" "}
            <Green>{rxnBonusFromEM.amplifying}%</Green>.
          </p>
          <p className="text-subtitle-1">
            Increases damage caused by Overloaded, Superconduct, Electro-Charged, Shattered, and
            Swirl by <Green>{rxnBonusFromEM.transformative}%</Green>.
          </p>
          <p className="text-subtitle-1">
            Increases damage absorption power of shields created through Crystallize by{" "}
            <Green>{rxnBonusFromEM.shield}%</Green>.
          </p>
        </div>
      </CollapseSpace>
    </div>
  );
}
