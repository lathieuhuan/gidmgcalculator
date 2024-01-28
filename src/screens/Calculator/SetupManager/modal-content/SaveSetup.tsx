import { FormEvent, useState } from "react";

import type { CalcSetupManageInfo } from "@Src/types";
import { $AppData } from "@Src/services";
import { findById } from "@Src/utils";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { saveSetupThunk } from "@Store/thunks";
import { selectChar } from "@Store/calculatorSlice/selectors";
import { selectUserSetups } from "@Store/userDatabaseSlice/selectors";
import { useStoreSnapshot } from "@Store/store-snapshot";

// Component
import { Input } from "@Src/pure-components";

interface SaveSetupProps {
  manageInfo: CalcSetupManageInfo;
  onClose: () => void;
}
export function SaveSetup({ manageInfo, onClose }: SaveSetupProps) {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);

  const charData = $AppData.getCharData(char.name);
  const existedSetup = findById(useStoreSnapshot(selectUserSetups), manageInfo.ID);

  const [input, setInput] = useState(existedSetup ? existedSetup.name : `${charData.name} setup`);

  const saveSetup = () => {
    dispatch(saveSetupThunk(manageInfo.ID, input));
    onClose();
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveSetup();
  };

  return (
    <form id="save-calc-setup" className="flex flex-col" onSubmit={onSubmit}>
      <p className="mb-2 text-light-800">
        {existedSetup ? "Update name for this existing setup" : "Enter name for this new setup"}
      </p>
      <Input
        className="px-4 py-2 text-1.5xl text-center font-semibold"
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
    </form>
  );
}
