import clsx from "clsx";
import { useMemo, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";

import type { ArtifactType, CalcArtifact, UserArtifact } from "@Src/types";
import { ARTIFACT_TYPES } from "@Src/constants";
import { useSelector } from "@Store/hooks";
import { selectUserArts } from "@Store/userDatabaseSlice/selectors";

// Conponent
import { ButtonGroup, CollapseAndMount, Modal, ModalHeader } from "@Src/pure-components";
import { ArtifactCard } from "../ArtifactCard";
import { OwnerLabel } from "../OwnerLabel";
import { ArtifactFilter, ArtifactFilterCondition } from "../ArtifactFilter";
import { InventoryRack } from "./InventoryRack";

const selectArtifactsByType = createSelector(
  selectUserArts,
  (_: unknown, type: ArtifactType) => type,
  (userArts, type) => userArts.filter((p) => p.type === type)
);

interface ArtifactInventoryProps {
  artifactType: ArtifactType;
  currentArtifacts: (CalcArtifact | null)[];
  owner?: string | null;
  buttonText: string;
  onClickButton: (chosen: UserArtifact) => void;
  onClose: () => void;
}
const ArtifactInventory = ({
  artifactType,
  currentArtifacts,
  owner,
  buttonText,
  onClickButton,
  onClose,
}: ArtifactInventoryProps) => {
  const [filterActive, setFilterActive] = useState(false);
  const [showingCurrent, setShowingCurrent] = useState(false);
  const [chosenArtifact, setChosenArtifact] = useState<UserArtifact>();
  const [filterCondition, setFilterCondition] = useState<ArtifactFilterCondition>(ArtifactFilter.DEFAULT_CONDITION);

  const artifacts = useSelector((state) => selectArtifactsByType(state, artifactType));

  const filteredArtifacts = useMemo(
    () => ArtifactFilter.filterArtifacts(artifacts, filterCondition),
    [artifacts, filterCondition]
  );

  const currentArtifact = currentArtifacts[ARTIFACT_TYPES.indexOf(artifactType)];

  return (
    <div className="h-full flex flex-col">
      <div className="pt-2 px-2">
        <ModalHeader>
          <div className="pl-4 flex items-center space-x-2">
            <ModalHeader.FilterButton active={filterActive} onClick={() => setFilterActive(!filterActive)} />
            {filterActive && <span className="font-bold text-black">Filter</span>}
          </div>
          <ModalHeader.Text>{artifactType}</ModalHeader.Text>
          <ModalHeader.RightEnd onClickClose={onClose} />
        </ModalHeader>
      </div>

      <div className="p-2 pt-4 pr-4 grow hide-scrollbar relative">
        <CollapseAndMount
          className="absolute top-0 left-0 z-20 w-full px-2"
          active={filterActive}
          activeHeight="100%"
          moveDuration={150}
        >
          <div className="h-full bg-dark-500 rounded-b-lg flex justify-center">
            <ArtifactFilter
              artifactType={artifactType}
              artifacts={artifacts}
              initialCondition={filterCondition}
              onConfirm={setFilterCondition}
              onClose={() => setFilterActive(false)}
            />
          </div>
        </CollapseAndMount>

        <div className="h-full flex hide-scrollbar">
          <InventoryRack
            listClassName="inventory-list"
            itemClassName="inventory-item"
            chosenID={chosenArtifact?.ID || 0}
            itemType="artifact"
            items={filteredArtifacts}
            onClickItem={(item) => setChosenArtifact(item as UserArtifact)}
          />

          <div className="flex flex-col">
            <div className={clsx("p-4 rounded-lg bg-dark-900 flex flex-col relative", !chosenArtifact && "h-full")}>
              {currentArtifact ? (
                <div
                  className="absolute top-0 z-10 h-full hide-scrollbar transition-size duration-200"
                  style={{ width: showingCurrent ? "15.75rem" : 0, right: "calc(100% - 1rem)" }}
                >
                  <div className="pl-4 pr-2 py-4 h-full flex flex-col w-64 bg-dark-900 rounded-l-lg">
                    <ArtifactCard mutable={false} artifact={currentArtifact} space="mx-3" />

                    <div className="pt-4 grow flex-center">
                      <p className="text-orange-500 text-center">Current equipment</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="w-64 hide-scrollbar">
                {chosenArtifact ? <ArtifactCard mutable={false} artifact={chosenArtifact} space="mx-3" /> : null}
              </div>

              {chosenArtifact && chosenArtifact.owner !== owner ? (
                <ButtonGroup
                  className="mt-6"
                  buttons={[
                    {
                      text: "Compare",
                      variant: showingCurrent ? "neutral" : "default",
                      disabled: !currentArtifact,
                      onClick: () => setShowingCurrent(!showingCurrent),
                    },
                    {
                      text: buttonText,
                      variant: "positive",
                      onClick: () => {
                        onClickButton(chosenArtifact);
                        onClose();
                      },
                    },
                  ]}
                />
              ) : null}
            </div>

            <OwnerLabel item={chosenArtifact} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const InventoryArtifact = Modal.wrap(ArtifactInventory, { preset: "large" });
