import { FaCalculator, FaTimes, FaSyncAlt } from "react-icons/fa";
import type { Teammate } from "@Src/types";

// Util
import { findDataCharacter } from "@Data/controllers";

// Component
import { Button, CharacterPortrait, IconButton } from "@Components/atoms";
import { TeammateItems } from "@Components/organisms";

interface ITeammateDetailProps {
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
}: ITeammateDetailProps) => {
  const data = findDataCharacter(teammate);
  if (!data) return null;

  return (
    <div className="w-75 rounded-lg bg-darkblue-2 shadow-white-glow">
      <div className="flex">
        <div className="pl-4 pt-4 flex">
          <CharacterPortrait className="w-18 h-18" code={data.code} icon={data.icon} />
          <p className={`px-4 text-2xl text-${data.vision} font-bold`}>{teammate.name}</p>
        </div>

        <IconButton
          className="ml-auto text-xl hover:text-darkred"
          size="w-10 h-10"
          boneOnly
          onClick={onClose}
        >
          <FaTimes />
        </IconButton>
      </div>

      <div className="py-4">
        <TeammateItems className="p-4 bg-darkblue-1" teammate={teammate} />

        <div className="mt-4 flex justify-center">
          {isCalculated ? (
            <Button variant="positive" className="flex items-center" onClick={onSwitchSetup}>
              <FaSyncAlt />
              <span className="mt-1 ml-1">Switch</span>
            </Button>
          ) : (
            <Button
              variant="positive"
              className="flex items-center"
              onClick={onCalculateTeammateSetup}
            >
              <FaCalculator />
              <span className="mt-1 ml-1">Calculate</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
