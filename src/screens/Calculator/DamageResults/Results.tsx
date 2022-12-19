import { useState, useEffect } from "react";

// Selector
import {
  selectChar,
  selectComparedIds,
  selectDmgResult,
  selectParty,
} from "@Store/calculatorSlice/selectors";

// Hook
import { useSelector } from "@Store/hooks";

// Constant
import { EStatDamageKey } from "@Src/constants";

// Component
import { DamageDisplay } from "@Components/organisms";

interface IResultsProps {
  activeSetupName: string;
}
export function Results({ activeSetupName }: IResultsProps) {
  const dmgResult = useSelector(selectDmgResult);
  const char = useSelector(selectChar);
  const party = useSelector(selectParty);

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
          <select
            className="text-center text-lightgold"
            value={focus}
            onChange={(e) => setFocus(e.target.value as EStatDamageKey)}
          >
            {Object.values(EStatDamageKey).map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
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
