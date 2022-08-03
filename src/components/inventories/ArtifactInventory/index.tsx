import { useMemo, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import type { Artifact, CalcArtPiece, DatabaseArt } from "@Src/types";
import { ARTIFACT_TYPES } from "@Src/constants";

import { selectMyArts } from "@Store/databaseSlice/selectors";
import { useSelector } from "@Store/hooks";
import useInventoryRack from "@Hooks/useInventoryRack";
import { filterArtIdsBySetsAndStats, findById } from "@Src/utils";
import { initArtifactStatFilter } from "@Src/utils";

import { ModalHeader } from "@Src/styled-components";
import ArtifactCard from "@Components/ArtifactCard";
import { ButtonBar } from "@Components/minors";
import { Modal } from "@Components/modals";
import { renderEquippedChar } from "../minors";

const { Text, CloseButton, FilterButton } = ModalHeader;

const selectArtifactsByType = createSelector(
  selectMyArts,
  (_: unknown, type: Artifact) => type,
  (myArts, type) => myArts.filter((p) => p.type === type)
);

interface ArtifactInventory {
  artifactType: Artifact;
  currentPieces: CalcArtPiece[];
  owner: string;
  buttonText: string;
  onClickButton: (chosen: DatabaseArt) => void;
  onClose: () => void;
}
export default function ArtInventory({
  artifactType,
  currentPieces,
  owner,
  buttonText,
  onClickButton,
  onClose,
}: ArtifactInventory) {
  const [filterOn, setFilterOn] = useState(false);
  const [comparing, setComparing] = useState(false);

  const data = useSelector((state) => selectArtifactsByType(state, artifactType));

  const [stats, setStats] = useState(initArtifactStatFilter());
  const [sets, setSets] = useState([]);
  const filteredIds = useMemo(
    () => filterArtIdsBySetsAndStats(data, sets, stats),
    [data, sets, stats]
  );
  const [inventoryRack, chosenID] = useInventoryRack({
    items: data,
    itemType: "artifact",
    filteredIds,
  });
  const currentArt = currentPieces[ARTIFACT_TYPES.indexOf(artifactType)];
  const chosenArt = findById(data, chosenID);

  return (
    <Modal standard onClose={onClose}>
      <div className="p-2" style={{ height: "10%" }}>
        <ModalHeader>
          <Text className="hidden sm:block">{artifactType}</Text>
          <CloseButton onClick={onClose} />
          <FilterButton active={filterOn} onClick={() => setFilterOn(!filterOn)} />
          {/* <ArtInvFilter
            filterOn={filterOn}
            arts={data}
            artType={artType}
            filter={{ stats, setStats, sets, setSets }}
            close={() => setFilterOn(false)}
          /> */}
        </ModalHeader>
      </div>
      <div className="pt-2 pr-4 pb-4 pl-2" style={{ height: "90%" }}>
        <div className="h-full flex hide-scrollbar">
          {inventoryRack}

          <div className="flex flex-col justify-between">
            <div className="p-4 rounded-lg bg-darkblue-1 flex flex-col">
              {currentArt ? (
                <div
                  className="absolute top-0 right z-10 h-full hide-scrollbar transition-all duration-200"
                  style={{ width: comparing ? "15.75rem" : 0, right: "calc(100% - 1rem)" }}
                >
                  <div className="pl-4 pr-2 py-4 h-full flex flex-col w-64 bg-darkblue-1 rounded-l-lg">
                    <ArtifactCard artPiece={currentArt} mutable={false} space={3} />

                    <div className="pt-4 grow flex-center">
                      <p className="text-orange text-center">Current equipment</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="w-64 h-96 hide-scrollbar">
                {chosenArt ? <ArtifactCard artPiece={chosenArt} mutable={false} space={3} /> : null}
              </div>

              {chosenArt && chosenArt.user !== owner ? (
                <ButtonBar
                  className="mt-6"
                  variants={[comparing ? "neutral" : "default", "positive"]}
                  texts={["Compare", buttonText]}
                  availables={[Boolean(currentArt), true]}
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

            {chosenArt?.user ? renderEquippedChar(chosenArt.user) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
}
