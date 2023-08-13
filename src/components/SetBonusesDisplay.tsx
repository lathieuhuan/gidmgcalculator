import type { ArtifactSetBonus } from "@Src/types";
import { findDataArtifactSet } from "@Data/controllers";
import { toArray } from "@Src/utils";
import { ModifierTemplate } from "./ModifierTemplate";

interface SetBonusesDisplayProps {
  setBonuses: ArtifactSetBonus[];
  noTitle?: boolean;
}
export const SetBonusesDisplay = ({ setBonuses, noTitle }: SetBonusesDisplayProps) => {
  return (
    <div>
      {!noTitle && <p className="text-lg leading-relaxed text-orange font-semibold">Set bonus</p>}

      {setBonuses.length > 0 ? (
        setBonuses.map((bonus, index) => {
          const content = [];
          const data = findDataArtifactSet(bonus);
          if (!data) return;
          const { descriptions } = data;

          for (let i = 0; i <= bonus.bonusLv; i++) {
            const { description = i } = data.setBonuses?.[i] || {};
            const parsedDescription = toArray(description).reduce((acc, index) => {
              if (descriptions[index]) {
                const parsedText = ModifierTemplate.parseArtifactDescription(descriptions[index]);
                return `${acc} ${parsedText}`;
              }
              return acc;
            }, "");

            content.push(
              <li key={i} className="mt-1">
                <span className="text-orange">{(i + 1) * 2}-Piece Set:</span>{" "}
                <span dangerouslySetInnerHTML={{ __html: parsedDescription }} />
              </li>
            );
          }
          return (
            <div key={index} className="mt-1">
              <p className="text-lg leading-relaxed font-medium text-green">{data.name}</p>
              <ul className="pl-6 list-disc">{content}</ul>
            </div>
          );
        })
      ) : (
        <p className="text-lesser font-medium">No set bonus</p>
      )}
    </div>
  );
};
