import { useState } from "react";
import { Button, Modal, Switch } from "@Src/pure-components";
import { CalcArtifact } from "@Src/types";

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

  const onSelectType = (type: LoadoutType) => {
    if (type !== chosenType) setChosenType(type);
  };

  return (
    <div className="h-full flex flex-col hide-scrollbar space-y-4">
      <div className="flex space-x-4">
        {LOADOUT_TYPE_OPTIONS.map((option) => {
          return (
            <Button
              key={option.value}
              variant={option.value === chosenType ? "active" : "default"}
              onClick={() => onSelectType(option.value)}
            >
              {option.label}
            </Button>
          );
        })}
      </div>

      <Switch
        value={chosenType}
        cases={
          [
            //
          ]
        }
      />
      {/* <div className="mt-4 grow custom-scrollbar"></div> */}
    </div>
  );
};

export const LoadoutSelect = Modal.wrap(LoadoutSelectCore, {
  title: "Select Artifact Loadout",
  preset: "large",
});
