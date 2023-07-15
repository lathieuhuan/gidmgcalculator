import { useState } from "react";

import type { CharInfo, Party } from "@Src/types";
import { appData } from "@Data/index";

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

  const charData = appData.getCharData(char.name);
  const numOfActives = Object.keys(charData.activeTalents).length;

  return (
    <SharedSpace
      atLeft={!atDetail}
      leftPart={
        <TalentOverview
          char={char}
          charData={charData}
          party={party}
          onChangeLevel={onChangeTalentLevel}
          onClickInfoSign={(newIndex) => {
            setAtDetail(true);
            setDetailIndex(newIndex);
          }}
        />
      }
      rightPart={
        detailIndex !== -1 && detailIndex < numOfActives + charData.passiveTalents.length ? (
          <TalentDetail
            charData={charData}
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
