import clsx from "clsx";
import { FaBalanceScaleLeft, FaCopy, FaTrashAlt } from "react-icons/fa";
import { SiTarget } from "react-icons/si";
import type { NewSetupManageInfo } from "@Store/calculatorSlice/reducer-types";

// Component
import { IconButton } from "@Src/styled-components";

interface SetupControlProps {
  setup: NewSetupManageInfo;
  isStandard: boolean;
  isStandardChoosable: boolean;
  changeSetupName: (newName: string) => void;
  removeSetup: () => void;
  copySetup: () => void;
  onToggleCompared: () => void;
  onChooseStandard: () => void;
}
export function SetupControl({
  setup,
  isStandard,
  isStandardChoosable,
  changeSetupName,
  removeSetup,
  copySetup,
  onToggleCompared,
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
        className="w-full px-4 pt-1 text-lg text-center textinput-common rounded-md font-medium"
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

        <div className="flex space-x-3">
          <button
            className={clsx(
              "w-8 h-8 rounded-circle flex-center text-2xl",
              isStandard
                ? "bg-green text-black"
                : isStandardChoosable
                ? "text-default"
                : "text-lesser"
            )}
            disabled={!isStandardChoosable}
            onClick={onChooseStandard}
          >
            <SiTarget />
          </button>
          <button
            className={clsx(
              "w-8 h-8 rounded-circle flex-center text-xl",
              setup.isCompared && "bg-green text-black"
            )}
            onClick={onToggleCompared}
          >
            <FaBalanceScaleLeft />
          </button>
        </div>
      </div>
    </div>
  );
}
