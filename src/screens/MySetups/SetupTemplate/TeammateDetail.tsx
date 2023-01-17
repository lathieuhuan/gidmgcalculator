import { Button, CharacterPortrait, IconButton } from "@Components/atoms";
import { TeammateItems } from "@Components/organisms";
import { findDataCharacter } from "@Data/controllers";
import { SetupType, Teammate } from "@Src/types";
import { FaCalculator, FaTimes } from "react-icons/fa";

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

      <div className="p-4">
        <TeammateItems teammate={teammate} />

        <div className="mt-4 flex justify-center">
          {isCalculated ? (
            <Button variant="positive" onClick={onSwitchSetup}>
              Switch
            </Button>
          ) : (
            <Button
              className="flex items-center"
              variant="positive"
              onClick={onCalculateTeammateSetup}
            >
              <FaCalculator />
              <span className="pt-1 pl-1">Calculate</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
