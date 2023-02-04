import { useState } from "react";
import type { CharInfo, Party } from "@Src/types";

// Util
import { findDataCharacter } from "@Data/controllers";

// Component
import { SharedSpace } from "@Components/atoms";
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

  const dataChar = findDataCharacter(char)!;
  const numOfActives = Object.keys(dataChar.activeTalents).length;

  return (
    <SharedSpace
      atLeft={!atDetail}
      leftPart={
        <TalentOverview
          char={char}
          dataChar={dataChar}
          party={party}
          onChangeLevel={onChangeTalentLevel}
          onClickInfoSign={(newIndex) => {
            setAtDetail(true);
            setDetailIndex(newIndex);
          }}
        />
      }
      rightPart={
        detailIndex !== -1 && detailIndex < numOfActives + dataChar.passiveTalents.length ? (
          <TalentDetail
            dataChar={dataChar}
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
