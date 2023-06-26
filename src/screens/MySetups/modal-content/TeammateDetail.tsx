import { FaCalculator, FaTimes, FaSyncAlt } from "react-icons/fa";
import type { Teammate } from "@Src/types";

// Util
import { findDataCharacter } from "@Data/controllers";

// Component
import { Button, IconButton, CharacterPortrait, TeammateItems } from "@Src/components";

interface TeammateDetailProps {
  teammate: Teammate;
  isCalculated: boolean;
  onSwitchSetup: () => void;
  onCalculateTeammateSetup: () => void;
  onClose: () => void;
}
export const TeammateDetail = ({
  teammate,
  isCalculated,
  onSwitchSetup,
  onCalculateTeammateSetup,
  onClose,
}: TeammateDetailProps) => {
  const data = findDataCharacter(teammate);
  if (!data) return null;

  return (
    <div className="w-75 rounded-lg bg-darkblue-2 shadow-white-glow">
      <div className="flex">
        <div className="pl-4 pt-4 flex">
          <div className="w-18 h-18 shrink-0">
            <CharacterPortrait code={data.code} icon={data.icon} />
          </div>
          <p className={`px-4 text-2xl text-${data.vision} font-bold`}>{teammate.name}</p>
        </div>

        <IconButton className="ml-auto text-xl hover:text-darkred" size="w-10 h-10" boneOnly onClick={onClose}>
          <FaTimes />
        </IconButton>
      </div>

      <div className="py-4">
        <TeammateItems className="p-4 bg-darkblue-1" teammate={teammate} />

        <div className="mt-4 flex justify-center">
          {isCalculated ? (
            <Button variant="positive" className="flex items-center" icon={<FaSyncAlt />} onClick={onSwitchSetup}>
              Switch
            </Button>
          ) : (
            <Button
              variant="positive"
              className="flex items-center"
              icon={<FaCalculator />}
              onClick={onCalculateTeammateSetup}
            >
              Calculate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
