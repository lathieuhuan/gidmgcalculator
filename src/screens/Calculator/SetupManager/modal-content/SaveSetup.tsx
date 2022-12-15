import { useState } from "react";
import type { CalcSetupManageInfo } from "@Src/types";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Thunk
import { saveSetupThunk } from "@Store/thunks";

// Selector
import { selectCharData } from "@Store/calculatorSlice/selectors";
import { selectMySetups } from "@Store/userDatabaseSlice/selectors";

// Component
import { ButtonBar } from "@Src/styled-components";

// Util
import { findById } from "@Src/utils";

interface SaveSetupProps {
  setup: CalcSetupManageInfo;
  onClose: () => void;
}
export function SaveSetup({ setup: { name, ID }, onClose }: SaveSetupProps) {
  const dispatch = useDispatch();
  const charData = useSelector(selectCharData);
  const existed = findById(useSelector(selectMySetups), ID);

  const [input, setInput] = useState(existed ? existed.name : charData.name + " - " + name);

  return (
    <div className="h-full px-8 py-6 rounded-lg flex flex-col bg-darkblue-1 shadow-white-glow">
      <p className="mb-2 mx-auto text-xl text-orange font-bold">
        {existed ? "Modify OLD" : "Save NEW"} Setup
      </p>
      <input
        type="text"
        className="mt-1 mb-8 px-4 pt-4 pb-2 text-1.5xl text-center textinput-common font-semibold"
        autoFocus
        value={input}
        onChange={(e) => {
          const { value } = e.target;
          value.length <= 34 && setInput(value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            dispatch(saveSetupThunk(ID, input));
            onClose();
          }
        }}
      />
      <ButtonBar
        buttons={[
          { text: "Cancel", onClick: onClose },
          {
            text: "Confirm",
            onClick: () => {
              dispatch(saveSetupThunk(ID, input));
              onClose();
            },
          },
        ]}
      />
    </div>
  );
}
