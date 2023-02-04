import { useState, useMemo } from "react";
import { FaChevronDown } from "react-icons/fa";
import type { CharInfo, DamageResult, Party } from "@Src/types";

// Consant
import { EStatDamageKey } from "@Src/constants";

// Hook
import { useTranslation } from "@Src/hooks";

// Util
import { finalTalentLv } from "@Src/utils/calculation";
import { getPartyData } from "@Data/controllers";
import { displayValue, getTableKeys } from "./utils";

// Component
import { CollapseSpace, Table } from "@Components/atoms";
import { CompareTable } from "./CompareTable";

const { Tr, Th, Td } = Table;

interface DamageDisplayProps {
  char: CharInfo;
  party: Party;
  damageResult: DamageResult;
  focus?: EStatDamageKey;
}
export const DamageDisplay = ({ char, party, damageResult, focus }: DamageDisplayProps) => {
  const { t } = useTranslation();

  const [closedItems, setClosedItems] = useState<boolean[]>([]);
  const { tableKeys, dataChar } = useMemo(() => getTableKeys(char.name), [char.name]);

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
          !isReactionDmg && dataChar
            ? finalTalentLv({
                char,
                dataChar,
                talentType: key.main,
                partyData: getPartyData(party),
              })
            : 0;

        return (
          <div key={key.main} className="flex flex-col">
            <button
              className="mx-auto mb-2 pt-1 pb-0.5 px-4 flex items-center rounded-2xl bg-orange text-black font-bold"
              onClick={toggleTable(index)}
            >
              <span className="text-lg leading-none">{t(key.main)}</span>
              {talentLevel ? (
                <span className="ml-2 mb-0.5 px-1 py-0.5 rounded-sm bg-black/60 text-default text-sm leading-none">
                  {talentLevel}
                </span>
              ) : null}
              <FaChevronDown
                className={
                  "ml-2 text-sm text-black duration-150 ease-linear" +
                  (closedItems[index] ? " rotate-90" : "")
                }
              />
            </button>

            <CollapseSpace active={!closedItems[index]}>
              {key.subs.length === 0 ? (
                <div className="pb-2">
                  <p className="pt-2 pb-1 bg-darkblue-2 text-center text-lesser">
                    This talent does not deal damage.
                  </p>
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
                          <Th className="text-lightgold">Avg.</Th>
                        </Tr>

                        {key.subs.map((subKey, i) => {
                          const { nonCrit, crit, average } = standardValues[subKey] || {};

                          return nonCrit === undefined ? null : (
                            <Tr key={subKey}>
                              <Td>{isReactionDmg ? t(subKey) : subKey}</Td>
                              <Td>{displayValue(nonCrit)}</Td>
                              <Td>{displayValue(crit)}</Td>
                              <Td className="text-lightgold">{displayValue(average)}</Td>
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
