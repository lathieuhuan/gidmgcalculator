import clsx from "clsx";
import { FaBalanceScaleLeft, FaCopy, FaTrashAlt } from "react-icons/fa";
import { SiTarget } from "react-icons/si";
import type { NewSetupManageInfo } from "@Store/calculatorSlice/reducer-types";

// Component
import { IconButton, Input } from "@Components/atoms";

interface SetupControlProps {
  setup: NewSetupManageInfo;
  isStandard: boolean;
  choosableAsStandard: boolean;
  onChangeSetupName: (newName: string) => void;
  onRemoveSetup: () => void;
  onCopySetup: () => void;
  onToggleCompared: () => void;
  onChooseStandard: () => void;
}
export function SetupControl({
  setup,
  isStandard,
  choosableAsStandard,
  onChangeSetupName,
  onRemoveSetup,
  onCopySetup,
  onToggleCompared,
  onChooseStandard,
}: SetupControlProps) {
  return (
    <div className="px-2 py-3 rounded-lg bg-darkblue-1" onDoubleClick={() => console.log(setup)}>
      <Input
        placeholder="Enter Setup's name"
        className="w-full px-4 pt-1 text-lg text-center rounded-md font-medium"
        value={setup.name}
        maxLength={16}
        onChange={onChangeSetupName}
      />
      <div className="mt-4 flex justify-between">
        <div className="ml-1 flex space-x-4">
          <IconButton variant="negative" onClick={onRemoveSetup}>
            <FaTrashAlt />
          </IconButton>

          <IconButton variant="positive" disabled={setup.status === "NEW"} onClick={onCopySetup}>
            <FaCopy />
          </IconButton>
        </div>

        <div className="flex space-x-3">
          <button
            className={clsx(
              "w-8 h-8 rounded-circle flex-center text-2xl",
              isStandard
                ? "bg-green text-black"
                : choosableAsStandard
                ? "text-default"
                : "text-lesser"
            )}
            disabled={!choosableAsStandard}
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
