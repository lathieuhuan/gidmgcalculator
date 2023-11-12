import { useState } from "react";

import type { CalcSetupManageInfo } from "@Src/types";
import { useDispatch, useSelector } from "@Store/hooks";
import { appData } from "@Src/data";
import { findById } from "@Src/utils";

// Store
import { saveSetupThunk } from "@Store/thunks";
import { selectChar } from "@Store/calculatorSlice/selectors";
import { selectUserSetups } from "@Store/userDatabaseSlice/selectors";

// Component
import { ButtonGroup, Input } from "@Src/pure-components";

interface SaveSetupProps {
  manageInfo: CalcSetupManageInfo;
  onClose: () => void;
}
export function SaveSetup({ manageInfo, onClose }: SaveSetupProps) {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);

  const charData = appData.getCharData(char.name);
  const existed = findById(useSelector(selectUserSetups), manageInfo.ID);

  const [input, setInput] = useState(existed ? existed.name : `${charData.name} setup`);

  const saveSetup = () => {
    dispatch(saveSetupThunk(manageInfo.ID, input));
    onClose();
  };

  return (
    <div className="h-full px-8 py-6 rounded-lg flex flex-col bg-dark-900 shadow-white-glow">
      <p className="mb-2 mx-auto text-xl text-orange-500 font-bold">{existed ? "Update OLD" : "Save NEW"} Setup</p>
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
      <ButtonGroup
        buttons={[
          { text: "Cancel", onClick: onClose },
          { text: "Confirm", onClick: saveSetup },
        ]}
      />
    </div>
  );
}
