import cn from "classnames";
import { FaBalanceScaleLeft, FaCopy, FaTrashAlt } from "react-icons/fa";
import type { TemporarySetupInfo } from "./types";

import { IconButton } from "@Src/styled-components";

interface SetupControlProps {
  setup: TemporarySetupInfo;
  changeSetupName: (newName: string) => void;
  removeSetup: () => void;
  copySetup: () => void;
  onSelectForCompare: () => void;
}
export function SetupControl({
  setup,
  changeSetupName,
  removeSetup,
  copySetup,
  onSelectForCompare,
}: SetupControlProps) {
  const isNew = setup.status === "NEW";

  // {
  //   Icon: FaShareAlt,
  //   onClick: () => openModal("SHARE_SETUP"),
  // },
  // {
  //   Icon: FaUserEdit,
  //   onClick: () => openModal("UPDATE_USERS_DATA"),
  // },

  return (
    <div className="px-2 py-3 rounded-lg bg-darkblue-1" onDoubleClick={() => console.log(setup)}>
      <input
        type="text"
        placeholder="Enter Setup's name"
        className="w-full px-4 pt-2 pb-1 text-xl text-center textinput-common rounded-md font-medium"
        value={setup.name}
        onChange={(e) => {
          const { value } = e.target;
          if (value.length <= 16) {
            changeSetupName(value);
          }
        }}
      />
      <div className="mt-4 flex justify-between">
        <div className="ml-1 flex space-x-4">
          <IconButton variant="negative" onClick={removeSetup}>
            <FaTrashAlt />
          </IconButton>

          <IconButton variant="positive" disabled={isNew} onClick={copySetup}>
            <FaCopy />
          </IconButton>
        </div>

        <button
          className={cn(
            "w-8 h-8 rounded-circle flex-center",
            setup.isCompared ? "bg-green text-black" : "border-2 border-lesser text-lesser"
          )}
          onClick={onSelectForCompare}
        >
          <FaBalanceScaleLeft />
        </button>
      </div>
    </div>
  );
}
