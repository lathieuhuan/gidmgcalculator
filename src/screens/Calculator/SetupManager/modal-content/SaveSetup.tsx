import { useState } from "react";
import type { CalcSetupManageInfo } from "@Src/types";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Thunk
import { saveSetupThunk } from "@Store/thunks";

// Util
import { findById } from "@Src/utils";

// Selector
import { selectCharData } from "@Store/calculatorSlice/selectors";
import { selectUserSetups } from "@Store/userDatabaseSlice/selectors";

// Component
import { Input } from "@Components/atoms";
import { ButtonBar } from "@Components/molecules";

interface SaveSetupProps {
  manageInfo: CalcSetupManageInfo;
  onClose: () => void;
}
export function SaveSetup({ manageInfo, onClose }: SaveSetupProps) {
  const dispatch = useDispatch();
  const charData = useSelector(selectCharData);
  const existed = findById(useSelector(selectUserSetups), manageInfo.ID);

  const [input, setInput] = useState(existed ? existed.name : `${charData.name} setup`);

  const saveSetup = () => {
    dispatch(saveSetupThunk(manageInfo.ID, input));
    onClose();
  };

  return (
    <div className="h-full px-8 py-6 rounded-lg flex flex-col bg-darkblue-1 shadow-white-glow">
      <p className="mb-2 mx-auto text-xl text-orange font-bold">{existed ? "Update OLD" : "Save NEW"} Setup</p>
      <Input
        className="mt-1 mb-8 px-4 pt-4 pb-2 text-1.5xl text-center font-semibold"
        autoFocus
        value={input}
        maxLength={34}
        onChange={setInput}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            saveSetup();
          }
        }}
      />
      <ButtonBar
        buttons={[
          { text: "Cancel", onClick: onClose },
          { text: "Confirm", onClick: saveSetup },
        ]}
      />
    </div>
  );
}
