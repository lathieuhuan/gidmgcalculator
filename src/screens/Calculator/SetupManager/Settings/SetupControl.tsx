import cn from "classnames";
import { FaBalanceScaleLeft, FaCopy, FaTrashAlt } from "react-icons/fa";
import { SiTarget } from "react-icons/si";

import type { NewSetupManageInfo } from "@Store/calculatorSlice/reducer-types";
import { IconButton } from "@Src/styled-components";

interface SetupControlProps {
  setup: NewSetupManageInfo;
  isStandard: boolean;
  changeSetupName: (newName: string) => void;
  removeSetup: () => void;
  copySetup: () => void;
  onSelectForCompare: () => void;
  onChooseStandard: () => void;
}
export function SetupControl({
  setup,
  isStandard,
  changeSetupName,
  removeSetup,
  copySetup,
  onSelectForCompare,
  onChooseStandard,
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

        <div className="flex space-x-4">
          <button
            className={cn(
              "w-8 h-8 rounded-circle flex-center text-black text-2xl",
              isStandard ? "bg-green" : "bg-default"
            )}
            disabled={!setup.isCompared}
            onClick={onChooseStandard}
          >
            <SiTarget />
          </button>
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
    </div>
  );
}
