import type { CalcArtSet } from "@Src/types";
import { findArtifactSet } from "@Data/controllers";

interface SetBonusProps {
  sets: CalcArtSet[];
}
export function SetBonus({ sets }: SetBonusProps) {
  return (
    <div>
      <p className="text-lg leading-relaxed text-orange font-bold">Set Bonus</p>

      {sets.length > 0 ? (
        sets.map(({ code, bonusLv }, index) => {
          const content = [];
          const artData = findArtifactSet({ code })!;

          for (let i = 0; i <= bonusLv; i++) {
            const { desc } = artData.setBonuses[i];
            content.push(
              <li key={i} className="mt-1">
                <span className="text-orange">{(i + 1) * 2}-Piece Set:</span> <span>{desc}</span>
              </li>
            );
          }
          return (
            <div key={index} className="mt-1">
              <p className="text-lg leading-relaxed font-bold text-green">{artData.name}</p>
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
