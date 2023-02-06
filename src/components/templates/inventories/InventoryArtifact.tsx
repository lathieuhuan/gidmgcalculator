import clsx from "clsx";
import { useMemo, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { FaTimes } from "react-icons/fa";
import type { ArtifactType, CalcArtifact, UserArtifact } from "@Src/types";

// Constant
import { ARTIFACT_TYPES } from "@Src/constants";

// Selector
import { selectUserArts } from "@Store/userDatabaseSlice/selectors";

// Hook
import { useSelector } from "@Store/hooks";

// Util
import { initArtifactStatsFilter, filterArtifactsBySetsAndStats } from "./utils";

// Conponent
import { IconButton } from "@Components/atoms";
import { ButtonBar, Modal, ModalHeader, type ModalControl } from "@Components/molecules";
import { ArtifactCard, OwnerLabel } from "@Components/organisms";
import { ArtifactFilter } from "./organisms/ArtifactFilter";
import { InventoryRack } from "./organisms/InventoryRack";

import styles from "./styles.module.scss";

const { Text, FilterButton } = ModalHeader;

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
  const [stats, setStats] = useState(initArtifactStatsFilter());
  const [codes, setCodes] = useState<number[]>([]);
  const data = useSelector((state) => selectArtifactsByType(state, artifactType));

  const filteredArtifacts = useMemo(
    () => filterArtifactsBySetsAndStats(data, codes, stats),
    [data, codes, stats]
  );

  const currentArtifact = currentArtifacts[ARTIFACT_TYPES.indexOf(artifactType)];

  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <ModalHeader>
          <div className="pl-5 flex items-center">
            <FilterButton active={filterActive} onClick={() => setFilterActive(!filterActive)} />
          </div>

          <Text>{artifactType}</Text>

          <div className="flex justify-end items-center">
            <IconButton className="mr-2 text-black text-xl" variant="custom" onClick={onClose}>
              <FaTimes />
            </IconButton>
          </div>

          <ArtifactFilter
            active={filterActive}
            artifactType={artifactType}
            artifacts={data}
            filter={{ stats, codes, setStats, setCodes }}
            onClose={() => setFilterActive(false)}
          />
        </ModalHeader>
      </div>

      <div className="p-2 pr-4 grow hide-scrollbar">
        <div className="h-full flex hide-scrollbar">
          <InventoryRack
            listClassName={styles["inventory-list"]}
            itemClassName={styles.item}
            chosenID={chosenArtifact?.ID || 0}
            itemType="artifact"
            items={filteredArtifacts}
            onClickItem={(item) => setChosenArtifact(item as UserArtifact)}
          />

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
                  style={{ width: showingCurrent ? "15.75rem" : 0, right: "calc(100% - 1rem)" }}
                >
                  <div className="pl-4 pr-2 py-4 h-full flex flex-col w-64 bg-darkblue-1 rounded-l-lg">
                    <ArtifactCard mutable={false} artifact={currentArtifact} space="mx-3" />

                    <div className="pt-4 grow flex-center">
                      <p className="text-orange text-center">Current equipment</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="w-64 hide-scrollbar">
                {chosenArtifact ? (
                  <ArtifactCard mutable={false} artifact={chosenArtifact} space="mx-3" />
                ) : null}
              </div>

              {chosenArtifact && chosenArtifact.owner !== owner ? (
                <ButtonBar
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
                      onClick: () => {
                        onClickButton(chosenArtifact);
                        onClose();
                      },
                    },
                  ]}
                />
              ) : null}
            </div>

            <OwnerLabel owner={chosenArtifact?.owner} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const InventoryArtifact = ({
  active,
  onClose,
  ...rest
}: ModalControl & ArtifactInventoryProps) => {
  return (
    <Modal active={active} withDefaultStyle onClose={onClose}>
      <ArtifactInventory {...rest} onClose={onClose} />
    </Modal>
  );
};
