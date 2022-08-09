import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "@Store/hooks";
import { addTeammate, copyParty, removeTeammate } from "@Store/calculatorSlice";
import { selectCharData, selectCurrentIndex } from "@Store/calculatorSlice/selectors";

import { Party } from "@Src/types";
import { indexByName } from "@Src/utils";
import characters from "@Data/characters";

import { CharFilledSlot } from "@Components/minors";
import { Picker } from "@Components/Picker";
import { IconButton } from "@Src/styled-components";
import { CopySection } from "../components";
import { pedestalStyles } from "./tw-compound";

export default function SectionParty() {
  const charData = useSelector(selectCharData);
  const allParties = useSelector((state) => state.calculator.allParties);
  const setups = useSelector((state) => state.calculator.setups);
  const currentIndex = useSelector(selectCurrentIndex);
  const dispatch = useDispatch();

  const [pendingSlot, setPendingSlot] = useState<number | null>(null);
  const party = allParties[currentIndex];
  const isOriginal = setups[currentIndex].type === "original";

  const copyOptions = [];
  if (party.every((teammate) => !teammate)) {
    for (const partyIndex in allParties) {
      if (allParties[partyIndex].some((tm) => tm)) {
        copyOptions.push(setups[partyIndex].name);
      }
    }
  }

  return (
    <div className={pedestalStyles}>
      {copyOptions.length ? (
        <CopySection
          options={copyOptions}
          onClickCopy={(name) => dispatch(copyParty(indexByName(setups, name)))}
        />
      ) : null}

      <div className="w-full px-2 flex justify-around">
        {party.map((teammate, tmIndex) => {
          return (
            <div key={tmIndex} className="w-18 h-18 relative">
              {teammate ? (
                <CharFilledSlot
                  mutable={isOriginal}
                  name={teammate.name}
                  onClickSlot={() => {
                    if (isOriginal) setPendingSlot(tmIndex);
                  }}
                  onClickRemove={() => dispatch(removeTeammate(tmIndex))}
                />
              ) : (
                <IconButton
                  className="w-full h-full text-2xl leading-6 !bg-darkblue-3 text-white/70"
                  onClick={() => setPendingSlot(tmIndex)}
                >
                  <FaPlus />
                </IconButton>
              )}
            </div>
          );
        })}
      </div>
      {pendingSlot !== null && (
        <TeammatePicker
          charName={charData.name}
          party={party}
          pendingSlot={pendingSlot}
          onClose={() => setPendingSlot(null)}
        />
      )}
    </div>
  );
}

interface TeammatePickerProps {
  charName: string;
  party: Party;
  pendingSlot: number;
  onClose: () => void;
}
function TeammatePicker({ charName, party, pendingSlot, onClose }: TeammatePickerProps) {
  const dispatch = useDispatch();
  const remains = [];

  for (const { code, beta, name, icon, rarity, vision, weapon } of characters) {
    // not main char and not in party
    if (name !== charName && !party.find((tm) => tm?.name === name)) {
      remains.push({ code, beta, name, icon, rarity, vision, weapon });
    }
  }
  return (
    <Picker
      data={remains}
      dataType="character"
      onPickItem={({ name, vision, weapon }) => {
        if (vision && weapon) {
          dispatch(addTeammate({ name, vision, weapon, tmIndex: pendingSlot }));
        }
      }}
      onClose={onClose}
    />
  );
}
