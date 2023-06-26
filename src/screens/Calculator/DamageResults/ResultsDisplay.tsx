import { useState, useEffect } from "react";

import { selectChar, selectComparedIds, selectDmgResult, selectParty } from "@Store/calculatorSlice/selectors";
import { useSelector } from "@Store/hooks";
import { EStatDamageKey } from "@Src/constants";

// Component
import { DamageDisplay } from "@Src/components";

const FOCUS_LABELS = {
  [EStatDamageKey.AVERAGE]: "Average",
  [EStatDamageKey.CRIT]: "Crit",
  [EStatDamageKey.NON_CRIT]: "Non-crit",
};

interface ResultsDisplayProps {
  activeSetupName: string;
}
export function ResultsDisplay({ activeSetupName }: ResultsDisplayProps) {
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
          <select className="text-lightgold" value={focus} onChange={(e) => setFocus(e.target.value as EStatDamageKey)}>
            {Object.values(EStatDamageKey).map((opt) => (
              <option key={opt} value={opt}>
                {FOCUS_LABELS[opt]}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="mx-4 my-2 font-bold text-center">{activeSetupName}</p>
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
