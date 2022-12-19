import clsx from "clsx";
import { useMemo, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import type { ArtifactType, CalcArtifact, UserArtifact } from "@Src/types";

// Constant
import { ARTIFACT_TYPES } from "@Src/constants";

// Selector
import { selectMyArts } from "@Store/userDatabaseSlice/selectors";

// Hook
import { useSelector } from "@Store/hooks";
import { useInventoryRack } from "../hooks";

// Util
import { findById } from "@Src/utils";
import { initArtifactStatsFilter, filterArtIdsBySetsAndStats } from "../utils";

// Conponent
import {
  ButtonBar,
  ArtifactCard,
  Modal,
  ModalHeader,
  type ModalControl,
} from "@Components/molecules";
import { renderEquippedChar } from "../components";
import { ArtifactFilter } from "../ArtifactFilter";

import styles from "../styles.module.scss";

const { Text, CloseButton, FilterButton } = ModalHeader;

const selectArtifactsByType = createSelector(
  selectMyArts,
  (_: unknown, type: ArtifactType) => type,
  (myArts, type) => myArts.filter((p) => p.type === type)
);

interface ArtifactInventoryProps {
  artifactType: ArtifactType;
  currentArtifacts: (CalcArtifact | null)[];
  owner: string | null;
  buttonText: string;
  onClickButton: (chosen: UserArtifact) => void;
  onClose: () => void;
}
function ArtifactInventory({
  artifactType,
  currentArtifacts,
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

  const currentArtifact = currentArtifacts[ARTIFACT_TYPES.indexOf(artifactType)];
  const chosenArtifact = findById(data, chosenID);

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
            <div
              className={clsx(
                "p-4 rounded-lg bg-darkblue-1 flex flex-col relative",
                !chosenArtifact && "h-full"
              )}
            >
              {currentArtifact ? (
                <div
                  className="absolute top-0 z-10 h-full hide-scrollbar transition-size duration-200"
                  style={{ width: comparing ? "15.75rem" : 0, right: "calc(100% - 1rem)" }}
                >
                  <div className="pl-4 pr-2 py-4 h-full flex flex-col w-64 bg-darkblue-1 rounded-l-lg">
                    <ArtifactCard artifact={currentArtifact} mutable={false} space="mx-3" />

                    <div className="pt-4 grow flex-center">
                      <p className="text-orange text-center">Current equipment</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="w-64 hide-scrollbar">
                {chosenArtifact ? (
                  <ArtifactCard artifact={chosenArtifact} mutable={false} space="mx-3" />
                ) : null}
              </div>

              {chosenArtifact && chosenArtifact.owner !== owner ? (
                <ButtonBar
                  className="mt-6"
                  buttons={[
                    {
                      text: "Compare",
                      variant: comparing ? "neutral" : "default",
                      disabled: !currentArtifact,
                      onClick: () => {
                        if (currentArtifact) setComparing(!comparing);
                      },
                    },
                    {
                      text: buttonText,
                      onClick: () => {
                        onClickButton(chosenArtifact);
                        onClose();
                      },
                    },
                  ]}
                />
              ) : null}
            </div>

            {chosenArtifact?.owner ? renderEquippedChar(chosenArtifact.owner) : null}
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
