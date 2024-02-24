import { useState } from "react";
import { Button, Modal, Switch } from "@Src/pure-components";
import { DefaultSetOptions } from "./DefaultSetOptions";
import { CalcArtifact } from "@Src/types";

type LoadoutType = "DEFAULT_5" | "DEFAULT_4" | "EQUIPPED" | "CUSTOM";

const LOADOUT_TYPE_OPTIONS: Array<{ label: string; value: LoadoutType }> = [
  { label: "Default 5-star Set", value: "DEFAULT_5" },
  { label: "Default 4-star Set", value: "DEFAULT_4" },
  { label: "Equipped Set", value: "EQUIPPED" },
];

interface LoadoutSelectProps {
  onSelect?: (set: CalcArtifact[]) => void;
  onClose: () => void;
}
export const LoadoutSelectCore = ({ onSelect, onClose }: LoadoutSelectProps) => {
  const [chosenType, setChosenType] = useState<LoadoutType>("DEFAULT_5");

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
        cases={[
          {
            value: "DEFAULT_5",
            element: (
              <DefaultSetOptions
                rarity={5}
                onSelect={(setOption) => {
                  // onSelect()
                }}
                onClose={onClose}
              />
            ),
          },
        ]}
      />
      {/* <div className="mt-4 grow custom-scrollbar"></div> */}
    </div>
  );
};

export const LoadoutSelect = Modal.wrap(LoadoutSelectCore, {
  title: "Select Artifact Loadout",
  preset: "large",
});
