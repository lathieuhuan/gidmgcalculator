import cn from "classnames";
import type { ReactNode } from "react";
import type { ActiveDesc } from "@Src/types";

interface TalentInfoProps {
  desc?: ReactNode;
  descs?: ActiveDesc[];
  atActiveTalent: boolean;
}
export function TalentInfo({ desc, descs, atActiveTalent }: TalentInfoProps) {
  if (!atActiveTalent) {
    return <p className="mt-2 pt-1">{desc}</p>;
  }
  return (
    <div className="flex-col">
      {descs?.map(({ heading, content }, i) => (
        <div key={i} className="mt-2">
          {heading && <p className="text-h6 text-lightgold">{heading}</p>}
          
          <p className={cn(heading && "mt-1")}>
            {heading === "Elemental Absorption" ? (
              <>
                If {content} comes into contact with {anemoIA}, it will deal additional{" "}
                <b>Elemental DMG</b> of that type.
                <br />
                Elemental Absorption may only occur once per use.
              </>
            ) : (
              content
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
