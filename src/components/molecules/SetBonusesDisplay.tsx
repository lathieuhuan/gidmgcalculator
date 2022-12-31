import type { ArtifactSetBonus } from "@Src/types";
import { findDataArtifactSet } from "@Data/controllers";

interface ISetBonusesDisplayProps {
  setBonuses: ArtifactSetBonus[];
  noTitle?: boolean;
}
export function SetBonusesDisplay({ setBonuses, noTitle }: ISetBonusesDisplayProps) {
  return (
    <div>
      {!noTitle && <p className="text-lg leading-relaxed text-orange font-semibold">Set bonus</p>}

      {setBonuses.length > 0 ? (
        setBonuses.map(({ code, bonusLv }, index) => {
          const content = [];
          const artData = findDataArtifactSet({ code })!;

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
              <p className="text-lg leading-relaxed font-medium text-green">{artData.name}</p>
              <ul className="pl-6 list-disc">{content}</ul>
            </div>
          );
        })
      ) : (
        <p className="text-lesser font-medium">No Set Bonus</p>
      )}
    </div>
  );
}
