import { useMemo, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import type { Artifact, CalcArtPiece, UserArtifact } from "@Src/types";
import { ARTIFACT_TYPES } from "@Src/constants";

import { selectMyArts } from "@Store/userDatabaseSlice/selectors";
import { useSelector } from "@Store/hooks";
import { findById } from "@Src/utils";
import { useInventoryRack } from "../hooks";
import { initArtifactStatsFilter, filterArtIdsBySetsAndStats } from "../utils";

import { ArtifactCard } from "@Components/ArtifactCard";
import { ModalHeader } from "@Components/ModalHeader";
import { ButtonBar } from "@Components/minors";
import { Modal, ModalControl } from "@Components/modals";
import { renderEquippedChar } from "../components";
import { ArtifactFilter } from "../ArtifactFilter";

import styles from "../styles.module.scss";

const { Text, CloseButton, FilterButton } = ModalHeader;

const selectArtifactsByType = createSelector(
  selectMyArts,
  (_: unknown, type: Artifact) => type,
  (myArts, type) => myArts.filter((p) => p.type === type)
);

interface ArtifactInventoryProps {
  artifactType: Artifact;
  currentPieces: (CalcArtPiece | null)[];
  owner: string | null;
  buttonText: string;
  onClickButton: (chosen: UserArtifact) => void;
  onClose: () => void;
}
function ArtifactInventory({
  artifactType,
  currentPieces,
  owner,
  buttonText,
  onClickButton,
  onClose,
}: ArtifactInventoryProps) {
  const [filterOn, setFilterOn] = useState(false);
  const [comparing, setComparing] = useState(false);

  const [stats, setStats] = useState(initArtifactStatsFilter());
  const [codes, setCodes] = useState<number[]>([]);
  const data = useSelector((state) => selectArtifactsByType(state, artifactType));

  const filteredIds = useMemo(
    () => filterArtIdsBySetsAndStats(data, codes, stats),
    [data, codes, stats]
  );
  const [inventoryRack, chosenID] = useInventoryRack({
    listClassName: styles["inventory-list"],
    itemClassName: styles.item,
    items: data,
    itemType: "artifact",
    filteredIds,
  });

  const currentArt = currentPieces[ARTIFACT_TYPES.indexOf(artifactType)];
  const chosenArt = findById(data, chosenID);

  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <ModalHeader>
          <FilterButton active={filterOn} onClick={() => setFilterOn(!filterOn)} />
          <Text>{artifactType}</Text>
          <CloseButton onClick={onClose} />

          <ArtifactFilter
            filterOn={filterOn}
            artifactType={artifactType}
            artifacts={data}
            filter={{ stats, codes, setStats, setCodes }}
            onClose={() => setFilterOn(false)}
          />
        </ModalHeader>
      </div>

      <div className="pt-2 pr-4 pb-4 pl-2 flex-grow">
        <div className="h-full flex hide-scrollbar">
          {inventoryRack}

          <div className="flex flex-col justify-between">
            <div className="p-4 rounded-lg bg-darkblue-1 flex flex-col relative">
              {currentArt ? (
                <div
                  className="absolute top-0 z-10 h-full hide-scrollbar transition-size duration-200"
                  style={{ width: comparing ? "15.75rem" : 0, right: "calc(100% - 1rem)" }}
                >
                  <div className="pl-4 pr-2 py-4 h-full flex flex-col w-64 bg-darkblue-1 rounded-l-lg">
                    <ArtifactCard artPiece={currentArt} mutable={false} space="mx-3" />

                    <div className="pt-4 grow flex-center">
                      <p className="text-orange text-center">Current equipment</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="w-64 hide-scrollbar">
                {chosenArt ? (
                  <ArtifactCard artPiece={chosenArt} mutable={false} space="mx-3" />
                ) : null}
              </div>

              {chosenArt && chosenArt.owner !== owner ? (
                <ButtonBar
                  className="mt-6"
                  variants={[comparing ? "neutral" : "default", "positive"]}
                  texts={["Compare", buttonText]}
                  disabled={[!currentArt]}
                  handlers={[
                    () => {
                      if (currentArt) setComparing(!comparing);
                    },
                    () => {
                      onClickButton(chosenArt);
                      onClose();
                    },
                  ]}
                />
              ) : null}
            </div>

            {chosenArt?.owner ? renderEquippedChar(chosenArt.owner) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function InventoryArtifact({
  active,
  onClose,
  ...rest
}: ModalControl & ArtifactInventoryProps) {
  return (
    <Modal active={active} withDefaultStyle onClose={onClose}>
      <ArtifactInventory {...rest} onClose={onClose} />
    </Modal>
  );
}
