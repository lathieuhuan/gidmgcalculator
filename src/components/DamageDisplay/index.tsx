import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";

import type { DamageResult } from "@Src/types";
import { findCharacter } from "@Data/controllers";
import { ATTACK_PATTERNS, TRANSFORMATIVE_REACTIONS } from "@Src/constants";

import { CollapseSpace } from "@Components/Collapse";
import StatsTable from "@Components/StatsTable";

function getKeys(charName: string) {
  const charData = findCharacter({ name: charName });
  if (!charData) {
    return [];
  }
  const result = [];
  for (const attPatt of ATTACK_PATTERNS) {
    const { stats } = charData.activeTalents[attPatt];

    result.push({
      main: attPatt,
      subs: stats.map(({ name }) => name),
    });
  }
  result.push({
    main: "Reactions DMG",
    subs: TRANSFORMATIVE_REACTIONS,
  });

  return result;
}

export enum EStatDamageKey {
  NON_CRIT = "nonCrit",
  CRIT = "crit",
  AVERAGE = "average",
}

interface DamageDisplayProps {
  charName: string;
  damageResult: DamageResult;
  focus?: EStatDamageKey;
}
export default function DamageDisplay({ charName, damageResult, focus }: DamageDisplayProps) {
  const [closedItems, setClosedItems] = useState<boolean[]>([]);
  const tableKeys = getKeys(charName);

  const toggle = (index: number) => {
    setClosedItems((prev) => {
      const newC = [...prev];
      newC[index] = !newC[index];
      return newC;
    });
  };

  return (
    <div className="flex flex-coll gap-2">
      {tableKeys.map((key, index) => {
        return (
          <div className="flex-col">
            <div
              className="mx-auto px-4 mb-2 flex items-center rounded-2xl bg-orange"
              onClick={() => toggle(index)}
            >
              <p className="text-h5 font-bold text-black">{key.main}</p>
              <FaChevronLeft className="ml-2 text-subtitle-1 text-black" />
            </div>
            <CollapseSpace active={!closedItems[index]}>
              <div className="custom-scrollbar">
                <StatsTable>
                  {/* {focus ? (
                    <MultiSetup name={name} focus={focus} />
                  ) : (
                    <OneSetup subNames={name.subs} stdValues={stdValues} />
                  )} */}
                </StatsTable>
              </div>
            </CollapseSpace>
          </div>
        );
      })}
    </div>
  );
}
