import { useState } from "react";
import { FaCopy, FaEllipsisH, FaSave, FaShareAlt, FaTrashAlt, FaUserEdit } from "react-icons/fa";
import type { SettingsModalType, TemporarySetup } from "./types";

import { CollapseSpace } from "@Components/collapse";
import { Checkbox, IconButton } from "@Src/styled-components";

interface SetupControlProps {
  setup: TemporarySetup;
  changeSetupName: (newName: string) => void;
  removeSetup: () => void;
  copySetup: () => void;
  toggleCompareSetup: () => void;
  openModal: (type: SettingsModalType) => void;
}
export function SetupControl({
  setup,
  changeSetupName,
  removeSetup,
  copySetup,
  toggleCompareSetup,
  openModal,
}: SetupControlProps) {
  const [expanded, setExpanded] = useState(false);

  const isNew = setup.index === null;
  const { isStandard } = setup;
  const HIDDEN_TOOLS = [
    {
      Icon: FaSave,
      handler: () => openModal("SAVE_SETUP"),
    },
    // {
    //   Icon: FaShareAlt,
    //   handler: () => openModal("SHARE_SETUP"),
    // },
    // {
    //   Icon: FaUserEdit,
    //   handler: () => openModal("UPDATE_USERS_DATA"),
    // },
  ];

  return (
    <div className="px-2 py-3 rounded-lg bg-darkblue-1" onDoubleClick={() => console.log(setup)}>
      <input
        type="text"
        placeholder="Enter Setup's name"
        className="w-full px-4 pt-2 pb-1 text-lg text-center textinput-common rounded-md"
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
          <IconButton disabled={isStandard} variant="negative" onClick={removeSetup}>
            <FaTrashAlt />
          </IconButton>

          <IconButton variant="positive" disabled={isNew} onClick={copySetup}>
            <FaCopy />
          </IconButton>

          <IconButton
            variant={expanded ? "neutral" : "default"}
            disabled={isNew}
            onClick={() => setExpanded((prev) => !prev)}
          >
            <FaEllipsisH />
          </IconButton>
        </div>

        {isStandard ? (
          <span className="mr-1 font-bold self-center">Standard</span>
        ) : (
          <label className="flex items-center relative group">
            <span className="mr-8 pr-1 group-hover:text-lightgold cursor-pointer">Compared</span>
            <Checkbox
              className="absolute right-2"
              style={{ transform: "scale(2)" }}
              checked={setup.checked}
              onChange={() => !isStandard && toggleCompareSetup()}
            />
          </label>
        )}
      </div>

      <CollapseSpace active={expanded}>
        <div className="mt-4 pl-1 flex">
          {HIDDEN_TOOLS.map(({ Icon, handler }, i) => (
            <IconButton key={i} className="mr-6" variant="positive" onClick={handler}>
              <Icon />
            </IconButton>
          ))}
        </div>
      </CollapseSpace>
    </div>
  );
}
