import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { createSelector } from "@reduxjs/toolkit";

import { useDispatch, useSelector } from "@Store/hooks";
import { addTeammate, copyParty, removeTeammate } from "@Store/calculatorSlice";
import {
  selectCalcSetups,
  selectCharData,
  selectCurrentIndex,
  selectSetupManageInfos,
} from "@Store/calculatorSlice/selectors";
import { indexByName } from "@Src/utils";

import { CharFilledSlot } from "@Components/minors";
import { Picker } from "@Components/Picker";
import { IconButton } from "@Src/styled-components";
import { CopySection } from "../components";
import { pedestalStyles } from "./tw-compound";

const selectAllParties = createSelector(selectCalcSetups, (setups) =>
  setups.map(({ party }) => party)
);

export default function SectionParty() {
  const charData = useSelector(selectCharData);
  const setupManageInfos = useSelector(selectSetupManageInfos);
  const allParties = useSelector(selectAllParties);
  const currentIndex = useSelector(selectCurrentIndex);
  const dispatch = useDispatch();

  const [pendingSlot, setPendingSlot] = useState<number | null>(null);
  const party = allParties[currentIndex];
  const isOriginal = setupManageInfos[currentIndex].type === "original";

  const copyOptions = [];
  if (party.every((teammate) => !teammate)) {
    for (const partyIndex in allParties) {
      if (allParties[partyIndex].some((tm) => tm)) {
        copyOptions.push(setupManageInfos[partyIndex].name);
      }
    }
  }

  return (
    <div className={pedestalStyles}>
      {copyOptions.length ? (
        <CopySection
          options={copyOptions}
          onClickCopy={(name) => dispatch(copyParty(indexByName(setupManageInfos, name)))}
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

      <Picker.Character
        active={pendingSlot !== null}
        sourceType="appData"
        filter={({ name }) => {
          return name !== charData.name && party.every((tm) => name !== tm?.name);
        }}
        onPickCharacter={({ name, vision, weapon }) => {
          if (vision && weapon && pendingSlot !== null) {
            dispatch(addTeammate({ name, vision, weapon, tmIndex: pendingSlot }));
          }
        }}
        onClose={() => setPendingSlot(null)}
      />
    </div>
  );
}
