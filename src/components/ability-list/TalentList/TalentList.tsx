import { useState } from "react";

import type { CharInfo, Party } from "@Src/types";
import { $AppData } from "@Src/services";

// Component
import { SharedSpace } from "@Src/pure-components";
import { TalentDetail } from "./TalentDetail";
import { TalentOverview } from "./TalentOverview";

interface TalentListProps {
  char: CharInfo;
  party?: Party;
  onChangeTalentLevel: (talentType: "NAs" | "ES" | "EB", newLevel: number) => void;
}
export const TalentList = ({ char, party, onChangeTalentLevel }: TalentListProps) => {
  const [atDetail, setAtDetail] = useState(false);
  const [detailIndex, setDetailIndex] = useState(-1);

  const appChar = $AppData.getCharacter(char.name);
  const numOfActives = Object.keys(appChar.activeTalents).length;

  return (
    <SharedSpace
      atLeft={!atDetail}
      leftPart={
        <TalentOverview
          char={char}
          appChar={appChar}
          party={party}
          onChangeLevel={onChangeTalentLevel}
          onClickInfoSign={(newIndex) => {
            setAtDetail(true);
            setDetailIndex(newIndex);
          }}
        />
      }
      rightPart={
        detailIndex !== -1 && detailIndex < numOfActives + appChar.passiveTalents.length ? (
          <TalentDetail
            appChar={appChar}
            detailIndex={detailIndex}
            onChangeDetailIndex={setDetailIndex}
            onClose={() => {
              setAtDetail(false);
              setTimeout(() => setDetailIndex(-1), 200);
            }}
          />
        ) : null
      }
    />
  );
};
