import { useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

import type { CharInfo, DamageResult, Party } from "@Src/types";
import { EStatDamageKey } from "@Src/constants";
import { useTranslation } from "@Src/pure-hooks";
import { $AppData } from "@Src/services";

// Util
import { finalTalentLv } from "@Src/utils/calculation";
import { displayValue, getTableKeys } from "./utils";

// Component
import { CollapseSpace, Table } from "@Src/pure-components";
import { CompareTable } from "./CompareTable";

const { Tr, Th, Td } = Table;

export interface DamageDisplayProps {
  char: CharInfo;
  party: Party;
  damageResult: DamageResult;
  focus?: EStatDamageKey;
}
export const DamageDisplay = ({ char, party, damageResult, focus }: DamageDisplayProps) => {
  const { t } = useTranslation();

  const [closedItems, setClosedItems] = useState<boolean[]>([]);
  const { tableKeys, charData } = useMemo(() => getTableKeys(char.name), [char.name]);

  const toggleTable = (index: number) => () => {
    setClosedItems((prev) => {
      const newC = [...prev];
      newC[index] = !newC[index];
      return newC;
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      {tableKeys.map((key, index) => {
        const standardValues = damageResult[key.main];
        const isReactionDmg = key.main === "RXN";
        const talentLevel =
          !isReactionDmg && charData
            ? finalTalentLv({
                char,
                charData,
                talentType: key.main,
                partyData: $AppData.getPartyData(party),
              })
            : 0;

        return (
          <div key={key.main} className="flex flex-col">
            {/* <div className={"h-6 mx-auto mb-2 flex rounded-2xl bg-orange-500 overflow-hidden"}>
              <button
                className={clsx(
                  "pt-1 pb-0.5 flex items-center space-x-2 text-black font-bold",
                  talentLevel ? "pl-4 pr-2" : "px-4"
                )}
                onClick={toggleTable(index)}
              >
                <FaChevronRight
                  className={"text-sm text-black duration-150 ease-linear" + (closedItems[index] ? "" : " rotate-90")}
                />
                <span className="text-lg leading-none">{t(key.main)}</span>
              </button>

              {talentLevel ? (
                <button className="px-2 bg-black/60 text-light-400 text-sm leading-none">
                  {talentLevel}
                </button>
              ) : null}
            </div> */}
            <button
              className="mx-auto mb-2 pt-1 pb-0.5 px-4 flex items-center rounded-2xl bg-orange-500 text-black font-bold"
              onClick={toggleTable(index)}
            >
              <span className="text-lg leading-none">{t(key.main)}</span>
              {talentLevel ? (
                <span className="ml-2 mb-0.5 px-1 py-0.5 rounded-sm bg-black/60 text-light-400 text-sm leading-none">
                  {talentLevel}
                </span>
              ) : null}
              <FaChevronDown
                className={
                  "ml-2 text-sm text-black duration-150 ease-linear" + (closedItems[index] ? " rotate-90" : "")
                }
              />
            </button>

            <CollapseSpace active={!closedItems[index]}>
              {key.subs.length === 0 ? (
                <div className="pb-2">
                  <p className="pt-2 pb-1 bg-dark-700 text-center text-light-800">This talent does not deal damage.</p>
                </div>
              ) : (
                <div className="custom-scrollbar">
                  <Table
                    className="mb-2 w-full"
                    colAttrs={[
                      {
                        className: "w-34",
                        style: { width: "8.5rem" },
                      },
                      null,
                      null,
                      null,
                    ]}
                  >
                    {focus ? (
                      <CompareTable focus={focus} tableKey={key} />
                    ) : (
                      <tbody>
                        <Tr>
                          <Th />
                          <Th>Non-crit</Th>
                          <Th>Crit</Th>
                          <Th className="text-yellow-400">Avg.</Th>
                        </Tr>

                        {key.subs.map((subKey, i) => {
                          const { nonCrit, crit, average, attElmt } = standardValues[subKey] || {};

                          return nonCrit === undefined ? null : (
                            <Tr key={subKey}>
                              <Td title={attElmt?.toUpperCase()}>{isReactionDmg ? t(subKey) : subKey}</Td>
                              <Td>{displayValue(nonCrit)}</Td>
                              <Td>{displayValue(crit)}</Td>
                              <Td className="text-yellow-400">{displayValue(average)}</Td>
                            </Tr>
                          );
                        })}
                      </tbody>
                    )}
                  </Table>
                </div>
              )}
            </CollapseSpace>
          </div>
        );
      })}
    </div>
  );
};
