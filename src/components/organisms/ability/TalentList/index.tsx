import { useEffect, useState } from "react";
import type { CharInfo, Party } from "@Src/types";

// Util
import { findCharacter } from "@Data/controllers";

// Hook
// import { useTabs } from "@Hooks/useTabs";

// Component
import { SharedSpace } from "@Components/layout";
import { TalentDetail } from "./TalentDetail";
import { TalentOverview } from "./TalentOverview";

interface TalentListProps {
  char: CharInfo;
  party?: Party;
  onChangeLevelOf: (talentType: "NAs" | "ES" | "EB") => (newLevel: number) => void;
}
export function TalentList({ char, party, onChangeLevelOf }: TalentListProps) {
  const [position, setPosition] = useState(-1);
  const [atDetails, setAtDetails] = useState(false);

  const dataChar = findCharacter(char)!;
  const numOfActives = Object.keys(dataChar.activeTalents).length;

  const toDetailsAt = (newPosition: number) => {
    setAtDetails(true);
    setPosition(newPosition);
  };

  return (
    <SharedSpace
      atLeft={!atDetails}
      leftPart={
        <TalentOverview
          char={char}
          dataChar={dataChar}
          party={party}
          onChangeLevel={(talentType, newLevel) => onChangeLevelOf(talentType)(newLevel)}
          onClickInfoSign={toDetailsAt}
        />
      }
      rightPart={
        position === -1 || position >= numOfActives + dataChar.passiveTalents.length ? null : (
          <TalentDetail
            dataChar={dataChar}
            position={position}
            changePosition={setPosition}
            onClose={() => {
              setAtDetails(false);
              setTimeout(() => setPosition(-1), 200);
            }}
          />
        )
      }
    />
  );
}
