import { useState } from "react";

import type { CalcArtifact, UserArtifact } from "@Src/types";
import { EquippedSetSelect } from "./EquippedSetSelect";
import { userItemToCalcItem } from "@Src/utils";

// Component
import { Button, Modal, ModalControl, Switch } from "@Src/pure-components";
import { ArtifactCard, EntitySelectTemplate } from "@Src/components";

type LoadoutType = "EQUIPPED" | "CUSTOM";

const LOADOUT_TYPE_OPTIONS: Array<{ label: string; value: LoadoutType }> = [
  { label: "Equipped Set", value: "EQUIPPED" },
];

interface LoadoutSelectCoreProps {
  keyword?: string;
  onSelect?: (set: CalcArtifact[]) => void;
}
export const LoadoutSelectCore = ({ keyword, onSelect }: LoadoutSelectCoreProps) => {
  const [chosenType, setChosenType] = useState<LoadoutType>("EQUIPPED");
  const [chosenArtifact, setChosenArtifact] = useState<UserArtifact>();

  const onSelectType = (type: LoadoutType) => {
    if (type !== chosenType) setChosenType(type);
  };

  const onSelectEquippedSet = (artifacts: UserArtifact[]) => {
    onSelect?.(artifacts.map(userItemToCalcItem));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-dark-700">
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

      <div className="pt-3 grow flex space-x-2 hide-scrollbar">
        <div
          className="grow hide-scrollbar"
          style={{
            minWidth: "18rem",
          }}
        >
          <Switch
            value={chosenType}
            cases={[
              {
                value: "EQUIPPED",
                element: (
                  <EquippedSetSelect
                    keyword={keyword}
                    onChangeArtifact={setChosenArtifact}
                    onSelectSet={onSelectEquippedSet}
                  />
                ),
              },
            ]}
          />
        </div>

        <div className="w-68 p-4 bg-dark-900 rounded-lg shrink-0">
          <ArtifactCard artifact={chosenArtifact} />
        </div>
      </div>
    </div>
  );
};

export const LoadoutSelect = Modal.coreWrap(
  (props: Omit<LoadoutSelectCoreProps, "keyword"> & ModalControl) => {
    return (
      <EntitySelectTemplate title="Artifact Loadouts" hasSearch onClose={props.onClose}>
        {({ keyword }) => {
          return <LoadoutSelectCore keyword={keyword} onSelect={props.onSelect} />;
        }}
      </EntitySelectTemplate>
    );
  },
  { preset: "large" }
);
