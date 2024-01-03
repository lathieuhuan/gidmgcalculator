import { FaCalculator, FaTimes, FaSyncAlt } from "react-icons/fa";

import type { Teammate } from "@Src/types";
import { $AppData } from "@Src/services";

// Component
import { Button } from "@Src/pure-components";
import { CharacterPortrait, TeammateItems } from "@Src/components";

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
  const data = $AppData.getCharData(teammate.name);
  if (!data) return null;

  return (
    <div className="w-75 rounded-lg bg-dark-700 shadow-white-glow">
      <div className="flex">
        <div className="pl-4 pt-4 flex">
          <div className="w-18 h-18 shrink-0">
            <CharacterPortrait code={data.code} icon={data.icon} />
          </div>
          <p className={`px-4 text-2xl text-${data.vision} font-bold`}>{teammate.name}</p>
        </div>
        <span className="ml-auto p-1">
          <Button className="hover:text-red-600" boneOnly icon={<FaTimes />} onClick={onClose} />
        </span>
      </div>

      <div className="py-4">
        <TeammateItems className="p-4 bg-dark-900" teammate={teammate} />

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
