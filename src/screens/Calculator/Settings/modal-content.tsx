import { useState } from "react";
import type { TemporarySetup } from "./types";

import { useDispatch, useSelector } from "@Store/hooks";
import { saveSetupThunk } from "@Store/thunks";
import { selectCharData } from "@Store/calculatorSlice/selectors";
import { selectMySetups } from "@Store/usersDatabaseSlice/selectors";

import { ButtonBar } from "@Components/minors";
import { findById } from "@Src/utils";

interface SaveSetup {
  setup: TemporarySetup;
  onClose: () => void;
}
export function SaveSetup({ setup: { name, ID, index }, onClose }: SaveSetup) {
  const dispatch = useDispatch();
  const charData = useSelector(selectCharData);
  const existed = findById(useSelector(selectMySetups), ID);

  const [input, setInput] = useState(existed ? existed.name : charData.name + " - " + name);

  return (
    <div className="h-full px-8 py-6 rounded-lg flex flex-col bg-darkblue-1">
      <p className="mb-2 mx-auto text-h5 text-orange font-bold">
        {existed ? "Modify OLD" : "Save NEW"} Setup
      </p>
      <input
        type="text"
        className="mt-1 mb-8 px-4 pt-4 pb-2 rounded text-2xl text-center text-black focus:bg-green outline-none"
        value={input}
        onChange={(e) => {
          const { value } = e.target;
          if (value.length <= 34) setInput(value);
        }}
        onKeyDown={(e) => {
          if (index !== null && e.key === "Enter") {
            dispatch(saveSetupThunk(index, ID, input));
            onClose();
          }
        }}
      />
      <ButtonBar
        texts={["Cancel", "Confirm"]}
        handlers={[
          onClose,
          () => {
            if (index !== null) {
              dispatch(saveSetupThunk(index, ID, input));
              onClose();
            }
          },
        ]}
      />
    </div>
  );
}
