import { findArtifactSet } from "@Data/controllers";
import { CalcArtSet } from "@Store/calculatorSlice/types";

interface SetBonusProps {
  sets: CalcArtSet[];
}
export function SetBonus({ sets }: SetBonusProps) {
  return (
    <div>
      <p className="text-lg leading-relaxed text-orange font-bold">Set Bonus</p>

      {sets.length > 0 ? (
        sets.map(({ code, bonusLv }, i) => {
          const content = [];
          const artData = findArtifactSet(code)!;

          for (let i = 0; i <= bonusLv; i++) {
            const { type, desc } = artData.setBnes[i];
            content.push(
              <li key={i} className="mt-1">
                <span className="text-orange">{type}:</span> <span>{desc}</span>
              </li>
            );
          }
          return (
            <div key={i} className="mt-1">
              <p className="text-lg leading-relaxed font-bold text-green">
                {artData.name}
              </p>
              <ul className="pl-4">{content}</ul>
            </div>
          );
        })
      ) : (
        <p className="text-lesser font-bold">No Set Bonus</p>
      )}
    </div>
  );
}
