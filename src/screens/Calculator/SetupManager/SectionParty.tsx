import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { createSelector } from "@reduxjs/toolkit";

import { useDispatch, useSelector } from "@Store/hooks";
import { addTeammate, copyParty, removeTeammate } from "@Store/calculatorSlice";
import {
  selectCalcSetupsById,
  selectCharData,
  selectActiveId,
  selectSetupManageInfos,
} from "@Store/calculatorSlice/selectors";

import { CharFilledSlot } from "@Components/minors";
import { Picker } from "@Components/Picker";
import { CopySection } from "../components";
import { pedestalStyles } from "./tw-compound";
import { indexById } from "@Src/utils";

const selectAllParties = createSelector(
  selectSetupManageInfos,
  selectCalcSetupsById,
  (setupManageInfos, setupsById) => setupManageInfos.map(({ ID }) => setupsById[ID].party)
);

export default function SectionParty() {
  const dispatch = useDispatch();

  const charData = useSelector(selectCharData);
  const activeId = useSelector(selectActiveId);
  const setupManageInfos = useSelector(selectSetupManageInfos);
  const allParties = useSelector(selectAllParties);

  const [pendingSlot, setPendingSlot] = useState<number | null>(null);

  const activeIndex = indexById(setupManageInfos, activeId);
  const party = allParties[activeIndex];
  const isOriginal = setupManageInfos[activeIndex].type === "original";

  const copyOptions = [];
  if (party.every((teammate) => !teammate)) {
    for (const partyIndex in allParties) {
      if (allParties[partyIndex].some((tm) => tm)) {
        copyOptions.push({
          label: setupManageInfos[partyIndex].name,
          value: setupManageInfos[partyIndex].ID,
        });
      }
    }
  }

  return (
    <div className={pedestalStyles}>
      {copyOptions.length ? (
        <CopySection
          options={copyOptions}
          onClickCopy={({ value }) => dispatch(copyParty(value))}
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
                  onClickSlot={() => isOriginal && setPendingSlot(tmIndex)}
                  onClickRemove={() => dispatch(removeTeammate(tmIndex))}
                />
              ) : (
                <button
                  className="w-full h-full rounded-circle flex-center text-2xl leading-6 bg-darkblue-3 outline-none glow-on-hover"
                  onClick={() => setPendingSlot(tmIndex)}
                >
                  <FaPlus className="text-default opacity-80" />
                </button>
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
