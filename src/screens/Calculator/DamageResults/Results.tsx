import { useState, useEffect } from "react";

import {
  selectChar,
  selectComparedIds,
  selectDmgResult,
  selectParty,
} from "@Store/calculatorSlice/selectors";
import { useSelector } from "@Store/hooks";

import { EStatDamageKey } from "@Src/constants";
import { findById } from "@Src/utils";

import { Select } from "@Src/styled-components";
import { DamageDisplay } from "@Components/DamageDisplay";

export function Results() {
  const dmgResult = useSelector(selectDmgResult);
  const char = useSelector(selectChar);
  const party = useSelector(selectParty);

  const activeSetupName = useSelector((state) => {
    const { activeId, setupManageInfos } = state.calculator;
    return findById(setupManageInfos, activeId)?.name || "";
  });
  const comparedIds = useSelector(selectComparedIds);

  const [focus, setFocus] = useState<EStatDamageKey>(EStatDamageKey.AVERAGE);
  const comparing = comparedIds.length > 1;

  useEffect(() => {
    if (comparing) {
      setFocus(EStatDamageKey.AVERAGE);
    }
  }, [comparing]);

  return (
    <div className="h-full flex flex-col">
      {comparing ? (
        <div className="mb-4 flex">
          <p className="mr-2">Choose a focus</p>
          <Select
            className="text-center text-lightgold"
            value={focus}
            onChange={(e) => setFocus(e.target.value as EStatDamageKey)}
          >
            {Object.values(EStatDamageKey).map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </Select>
        </div>
      ) : (
        <p className="mx-4 my-2 font-bold text-center">{activeSetupName.toUpperCase()}</p>
      )}
      <div className="grow hide-scrollbar">
        <DamageDisplay
          key={char.name}
          char={char}
          party={party}
          damageResult={dmgResult}
          focus={comparing ? focus : undefined}
        />
      </div>
    </div>
  );
}
