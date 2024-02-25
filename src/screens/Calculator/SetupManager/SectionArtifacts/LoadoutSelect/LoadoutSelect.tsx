import { useState } from "react";
import { Button, Modal, Switch } from "@Src/pure-components";
import { CalcArtifact, UserArtifact } from "@Src/types";
import { EquippedSetSelect } from "./EquippedSetSelect";
import { ArtifactCard, EntitySelectTemplate } from "@Src/components";
import { userItemToCalcItem } from "@Src/utils";

type LoadoutType = "EQUIPPED" | "CUSTOM";

const LOADOUT_TYPE_OPTIONS: Array<{ label: string; value: LoadoutType }> = [
  { label: "Equipped Set", value: "EQUIPPED" },
];

interface LoadoutSelectProps {
  onSelect?: (set: CalcArtifact[]) => void;
  onClose: () => void;
}
export const LoadoutSelectCore = ({ onSelect, onClose }: LoadoutSelectProps) => {
  const [chosenType, setChosenType] = useState<LoadoutType>("EQUIPPED");
  const [chosenArtifact, setChosenArtifact] = useState<UserArtifact>();

  const onSelectType = (type: LoadoutType) => {
    if (type !== chosenType) setChosenType(type);
  };

  const onSelectEquippedSet = (artifacts: UserArtifact[]) => {
    onSelect?.(artifacts.map(userItemToCalcItem));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex space-x-4">
        {LOADOUT_TYPE_OPTIONS.map((option) => {
          return (
            <Button
              key={option.value}
              variant={option.value === chosenType ? "active" : "default"}
              size="small"
              onClick={() => onSelectType(option.value)}
            >
              {option.label}
            </Button>
          );
        })}
      </div>

      <div className="pt-3 grow flex space-x-4 hide-scrollbar">
        <div className="grow hide-scrollbar">
          <Switch
            value={chosenType}
            cases={[
              {
                value: "EQUIPPED",
                element: <EquippedSetSelect onClickArtifact={setChosenArtifact} onSelectSet={onSelectEquippedSet} />,
              },
            ]}
          />
        </div>

        <div className="w-70 bg-dark-900">
          <ArtifactCard artifact={chosenArtifact} />
        </div>
      </div>
    </div>
  );
};

export const LoadoutSelect = Modal.wrap(LoadoutSelectCore, {
  title: "Artifact Loadouts",
  preset: "large",
});
