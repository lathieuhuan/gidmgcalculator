import { FaBalanceScaleLeft, FaCopy, FaTrashAlt } from "react-icons/fa";
import { SiTarget } from "react-icons/si";
import type { NewSetupManageInfo } from "@Store/calculatorSlice/reducer-types";

// Component
import { Button, Input, ToggleButton } from "@Src/pure-components";

interface SetupControlProps {
  setup: NewSetupManageInfo;
  isStandard: boolean;
  choosableAsStandard: boolean;
  copiable?: boolean;
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
  copiable,
  onChangeSetupName,
  onRemoveSetup,
  onCopySetup,
  onToggleCompared,
  onChooseStandard,
}: SetupControlProps) {
  return (
    <div className="px-2 py-3 rounded-lg bg-dark-900" onDoubleClick={() => console.log(setup)}>
      <Input
        placeholder="Enter Setup's name"
        className="w-full px-4 pt-1 text-lg text-center rounded-md font-medium"
        value={setup.name}
        maxLength={20}
        onChange={onChangeSetupName}
      />
      <div className="mt-4 flex justify-between">
        <div className="ml-1 flex space-x-4">
          <Button variant="negative" icon={<FaTrashAlt />} onClick={onRemoveSetup} />
          <Button
            variant="positive"
            icon={<FaCopy />}
            disabled={!copiable || setup.status === "NEW"}
            onClick={onCopySetup}
          />
        </div>

        <div className="flex space-x-3">
          <ToggleButton
            className="w-8 h-8"
            size="custom"
            variant="neutral"
            active={isStandard}
            disabled={!choosableAsStandard}
            icon={<SiTarget className="text-2xl" />}
            onClick={onChooseStandard}
          />

          <ToggleButton
            className="w-8 h-8"
            size="custom"
            variant="neutral"
            active={setup.isCompared}
            icon={<FaBalanceScaleLeft className="text-xl" />}
            onClick={onToggleCompared}
          />
        </div>
      </div>
    </div>
  );
}
