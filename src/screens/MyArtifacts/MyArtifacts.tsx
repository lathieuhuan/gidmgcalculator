import clsx from "clsx";
import { useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { FaTimes } from "react-icons/fa";

import type { ArtifactType, UserArtifact } from "@Src/types";
import { ARTIFACT_ICONS, MAX_USER_ARTIFACTS } from "@Src/constants";
import { useTypeFilter } from "@Src/components/inventory/hooks";

// Action
import { addUserArtifact, sortArtifacts } from "@Store/userDatabaseSlice";
import { updateMessage } from "@Store/calculatorSlice";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectUserArts } from "@Store/userDatabaseSlice/selectors";

// Util
import { findById, indexById } from "@Src/utils";
import {
  filterArtifactsBySetsAndStats,
  initArtifactStatsFilter,
  type StatsFilter,
} from "@Src/components/inventory/utils";

// Component
import { ButtonGroup, WarehouseLayout } from "@Src/pure-components";
import { TypeSelect, InventoryRack, PickerArtifact } from "@Src/components";
import { ChosenArtifactView } from "./ChosenArtifactView";
import { Filter } from "./Filter";

import styles from "../styles.module.scss";

const selectArtifactInventory = createSelector(
  selectUserArts,
  (_: unknown, types: ArtifactType[]) => types,
  (_: unknown, __: unknown, codes: number[]) => codes,
  (_: unknown, __: unknown, ___: unknown, stats: StatsFilter) => stats,
  (userArts: UserArtifact[], types: ArtifactType[], codes: number[], stats: StatsFilter) => {
    const result = types.length ? userArts.filter((p) => types.includes(p.type)) : userArts;
    return {
      filteredArtifacts: filterArtifactsBySetsAndStats(result, codes, stats),
      totalCount: userArts.length,
    };
  }
);

export default function MyArtifacts() {
  const dispatch = useDispatch();

  const [chosenID, setChosenID] = useState(0);
  const [codes, setCodes] = useState<number[]>([]);
  const [stats, setStats] = useState(initArtifactStatsFilter());

  const [modalType, setModalType] = useState<"PICK_ARTIFACT_TYPE" | "FITLER" | "">("");
  const [artifactPicker, setArtifactPicker] = useState<{ active: boolean; type: ArtifactType }>({
    active: false,
    type: "flower",
  });

  const { filteredTypes, setFilteredType, renderTypeFilter } = useTypeFilter({
    itemType: "artifact",
  });

  const { filteredArtifacts, totalCount } = useSelector((state) =>
    selectArtifactInventory(state, filteredTypes as ArtifactType[], codes, stats)
  );
  const chosenArtifact = findById(filteredArtifacts, chosenID);

  const closeModal = () => setModalType("");

  const isMaxArtifactsReached = () => {
    if (totalCount + 1 > MAX_USER_ARTIFACTS) {
      dispatch(
        updateMessage({
          type: "error",
          content: "Number of stored artifacts has reached its limit.",
        })
      );
      return true;
    }
  };

  const onClickAddArtifact = () => {
    if (!isMaxArtifactsReached()) {
      setModalType("PICK_ARTIFACT_TYPE");
    }
  };

  const onClickSortArtifact = () => {
    dispatch(sortArtifacts());
  };

  const onRemoveArtifact = () => {
    const removedIndex = indexById(filteredArtifacts, chosenID);

    if (removedIndex !== -1) {
      if (filteredArtifacts.length > 1) {
        const move = removedIndex === filteredArtifacts.length - 1 ? -1 : 1;

        setChosenID(filteredArtifacts[removedIndex + move].ID);
      } else {
        setChosenID(0);
      }
    }
  };

  const isFiltered =
    filteredTypes.length || codes.length || stats.main !== "All" || stats.subs.some((s) => s !== "All");

  return (
    <WarehouseLayout.Wrapper>
      <WarehouseLayout>
        <WarehouseLayout.ButtonBar>
          <ButtonGroup
            className="mr-4"
            space="space-x-4"
            buttons={[
              {
                text: "Add",
                variant: "positive",
                onClick: onClickAddArtifact,
              },
              {
                text: "Sort",
                onClick: onClickSortArtifact,
              },
            ]}
          />

          {window.innerWidth >= 600 && renderTypeFilter()}

          <div className="flex cursor-pointer">
            <button
              className={clsx(
                "pl-4 py-1 bg-lightgold glow-on-hover",
                isFiltered ? "pr-2 rounded-l-2xl" : "pr-4 rounded-2xl"
              )}
              onClick={() => setModalType("FITLER")}
            >
              <p className="text-black font-bold">Filter</p>
            </button>

            {isFiltered && (
              <div
                className="pl-2 pr-3 rounded-r-2xl bg-darkred flex-center glow-on-hover"
                onClick={() => {
                  setFilteredType([]);
                  setCodes([]);
                  setStats(initArtifactStatsFilter());
                }}
              >
                <FaTimes />
              </div>
            )}
          </div>
        </WarehouseLayout.ButtonBar>

        <WarehouseLayout.Body className="hide-scrollbar">
          <InventoryRack
            listClassName={styles.list}
            itemClassName={styles.item}
            chosenID={chosenID || 0}
            itemType="artifact"
            items={filteredArtifacts}
            onClickItem={(item) => setChosenID(item.ID)}
          />
          <ChosenArtifactView artifact={chosenArtifact} onRemoveArtifact={onRemoveArtifact} />
        </WarehouseLayout.Body>
      </WarehouseLayout>

      <Filter
        active={modalType === "FITLER"}
        types={filteredTypes as ArtifactType[]}
        codes={codes}
        stats={stats}
        setTypes={setFilteredType}
        setCodes={setCodes}
        setStats={setStats}
        onClose={closeModal}
      />

      <TypeSelect
        active={modalType === "PICK_ARTIFACT_TYPE"}
        options={ARTIFACT_ICONS}
        onSelect={(artifactType) => {
          setArtifactPicker({
            active: true,
            type: artifactType as ArtifactType,
          });
          closeModal();
        }}
        onClose={closeModal}
      />

      <PickerArtifact
        active={artifactPicker.active}
        needMassAdd
        artifactType={artifactPicker.type}
        onPickArtifact={(item) => {
          if (isMaxArtifactsReached()) {
            return {
              isValid: false,
            };
          }

          const newArtifact: UserArtifact = {
            ID: Date.now(),
            ...item,
            owner: null,
          };

          dispatch(addUserArtifact(newArtifact));
          setChosenID(newArtifact.ID);
        }}
        onClose={() => setArtifactPicker((prev) => ({ ...prev, active: false }))}
      />
    </WarehouseLayout.Wrapper>
  );
}
