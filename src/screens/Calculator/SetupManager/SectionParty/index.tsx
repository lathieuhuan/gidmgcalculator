import { useState } from "react";
import { FaPlus } from "react-icons/fa";

import { useDispatch, useSelector } from "@Store/hooks";
import { addTeammate, removeTeammate } from "@Store/calculatorSlice";
import {
  selectCharData,
  selectActiveId,
  selectSetupManageInfos,
  selectParty,
} from "@Store/calculatorSlice/selectors";
import { findById } from "@Src/utils";

import { CharFilledSlot } from "@Components/minors";
import { Picker } from "@Components/Picker";
import { CopySelect } from "./CopySelect";

export default function SectionParty() {
  const dispatch = useDispatch();

  const charData = useSelector(selectCharData);
  const activeId = useSelector(selectActiveId);
  const setupManageInfos = useSelector(selectSetupManageInfos);
  const party = useSelector(selectParty);

  const [pendingSlot, setPendingSlot] = useState<number | null>(null);

  const isOriginal = findById(setupManageInfos, activeId)?.type === "original";

  return (
    <div className="setup-manager_pedestal">
      {party.length && party.every((teammate) => !teammate) ? <CopySelect /> : null}

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
                  className="w-full h-full rounded-circle flex-center text-2xl leading-6 bg-darkblue-3 glow-on-hover"
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
