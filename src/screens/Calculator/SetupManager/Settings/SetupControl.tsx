import { FaCopy, FaTrashAlt } from "react-icons/fa";
import type { NewSetupManageInfo } from "@Store/calculatorSlice/reducer-types";

// import { CollapseSpace } from "@Components/collapse";
import { IconButton } from "@Src/styled-components";

interface SetupControlProps {
  setup: NewSetupManageInfo;
  changeSetupName: (newName: string) => void;
  removeSetup: () => void;
  copySetup: () => void;
}
export function SetupControl({
  setup,
  changeSetupName,
  removeSetup,
  copySetup,
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
        <div className="ml-1 flex space-x-6">
          <IconButton variant="negative" onClick={removeSetup}>
            <FaTrashAlt />
          </IconButton>

          <IconButton variant="positive" disabled={isNew} onClick={copySetup}>
            <FaCopy />
          </IconButton>
        </div>
      </div>

      {/* <CollapseSpace active={expanded}></CollapseSpace> */}
    </div>
  );
}
