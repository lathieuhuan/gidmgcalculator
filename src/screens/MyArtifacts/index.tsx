import clsx from "clsx";
import { useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { FaTimes } from "react-icons/fa";
import type { ArtifactType, AttributeStat, UserArtifact } from "@Src/types";

// Constant
import { ARTIFACT_ICONS, MAX_USER_ARTIFACTS } from "@Src/constants";

// Action
import {
  addUserArtifact,
  updateUserArtifactSubStat,
  removeArtifact,
  sortArtifacts,
  swapArtifactOwner,
  updateUserArtifact,
} from "@Store/userDatabaseSlice";
import { updateMessage } from "@Store/calculatorSlice";

// Selector
import { selectUserArts } from "@Store/userDatabaseSlice/selectors";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useTypeFilter } from "@Components/inventory/hooks";

// Util
import { findById, indexById } from "@Src/utils";
import { filterArtifactsBySetsAndStats, initArtifactStatsFilter, type StatsFilter } from "@Components/inventory/utils";
import { findDataArtifact } from "@Data/controllers";

// Component
import { PickerArtifact, PickerCharacter } from "@Src/features";
import {
  ButtonGroup,
  OwnerLabel,
  ArtifactCard,
  TypeSelect,
  InventoryRack,
  WareHouse,
  ConfirmModal,
  ItemRemoveConfirm,
} from "@Src/components";
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

type ModalType = "" | "PICK_ARTIFACT_TYPE" | "EQUIP_CHARACTER" | "REMOVE_ARTIFACT" | "FITLER";

export default function MyArtifacts() {
  const dispatch = useDispatch();

  const [chosenID, setChosenID] = useState(0);
  const [codes, setCodes] = useState<number[]>([]);
  const [stats, setStats] = useState(initArtifactStatsFilter());

  const [modalType, setModalType] = useState<ModalType>("");
  const [artifactPicker, setArtifactPicker] = useState<{ active: boolean; type: ArtifactType }>({
    active: false,
    type: "flower",
  });
  const [newOwner, setNewOwner] = useState<string | null>(null);

  const { filteredTypes, setFilteredType, renderTypeFilter } = useTypeFilter({
    itemType: "artifact",
  });

  const { filteredArtifacts, totalCount } = useSelector((state) =>
    selectArtifactInventory(state, filteredTypes as ArtifactType[], codes, stats)
  );
  const chosenArtifact = findById(filteredArtifacts, chosenID);

  const checkIfMaxArtifactsReached = () => {
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

  const swapOwner = (name: string) => {
    if (chosenID) {
      dispatch(swapArtifactOwner({ newOwner: name, artifactID: chosenID }));
    }
  };

  const closeModal = () => setModalType("");

  const isFiltered =
    filteredTypes.length || codes.length || stats.main !== "All" || stats.subs.some((s) => s !== "All");

  return (
    <WareHouse.Wrapper>
      <WareHouse>
        <WareHouse.ButtonBar>
          <ButtonGroup
            className="mr-4"
            space="space-x-4"
            buttons={[
              {
                text: "Add",
                variant: "positive",
                onClick: () => {
                  if (!checkIfMaxArtifactsReached()) {
                    setModalType("PICK_ARTIFACT_TYPE");
                  }
                },
              },
              { text: "Sort", onClick: () => dispatch(sortArtifacts()) },
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
        </WareHouse.ButtonBar>

        <WareHouse.Body className="hide-scrollbar">
          <InventoryRack
            listClassName={styles.list}
            itemClassName={styles.item}
            chosenID={chosenID || 0}
            itemType="artifact"
            items={filteredArtifacts}
            onClickItem={(item) => setChosenID(item.ID)}
          />

          <div>
            <div className="p-4 rounded-lg bg-darkblue-1 flex flex-col">
              <div className="w-75 hide-scrollbar" style={{ height: "26rem" }}>
                {chosenArtifact ? (
                  <ArtifactCard
                    artifact={chosenArtifact}
                    mutable
                    onEnhance={(level) => {
                      dispatch(updateUserArtifact({ ID: chosenID, level }));
                    }}
                    onChangeMainStatType={(type) =>
                      dispatch(
                        updateUserArtifact({
                          ID: chosenID,
                          mainStatType: type as AttributeStat,
                        })
                      )
                    }
                    onChangeSubStat={(subStatIndex, changes) => {
                      dispatch(
                        updateUserArtifactSubStat({
                          ID: chosenID,
                          subStatIndex,
                          ...changes,
                        })
                      );
                    }}
                  />
                ) : null}
              </div>

              {chosenArtifact ? (
                <ButtonGroup
                  className="mt-4"
                  buttons={[
                    {
                      text: "Remove",
                      onClick: () => {
                        if (chosenArtifact.setupIDs?.length) {
                          dispatch(
                            updateMessage({
                              type: "info",
                              content: "This artifact cannot be deleted. It is used by some Setups.",
                            })
                          );
                        } else {
                          setModalType("REMOVE_ARTIFACT");
                        }
                      },
                    },
                    { text: "Equip", onClick: () => setModalType("EQUIP_CHARACTER") },
                  ]}
                />
              ) : null}
            </div>

            <OwnerLabel
              key={chosenArtifact?.ID}
              className="mt-4"
              owner={chosenArtifact?.owner}
              setupIDs={chosenArtifact?.setupIDs}
            />
          </div>
        </WareHouse.Body>
      </WareHouse>

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
        choices={ARTIFACT_ICONS}
        onClickChoice={(artType) => {
          setArtifactPicker({
            active: true,
            type: artType as ArtifactType,
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
          if (checkIfMaxArtifactsReached()) {
            return {
              shouldStopPicking: true,
            };
          }

          const newArtifact = {
            ID: Date.now(),
            ...item,
            owner: null,
          };

          dispatch(addUserArtifact(newArtifact));
          setChosenID(newArtifact.ID);
        }}
        onClose={() => setArtifactPicker((prev) => ({ ...prev, active: false }))}
      />

      <PickerCharacter
        active={modalType === "EQUIP_CHARACTER" && !!chosenArtifact}
        sourceType="userData"
        filter={({ name }) => name !== chosenArtifact?.owner}
        onPickCharacter={({ name }) => {
          if (chosenArtifact?.owner) {
            setNewOwner(name);
          } else {
            swapOwner(name);
          }
        }}
        onClose={closeModal}
      />

      {chosenArtifact && (
        <ItemRemoveConfirm
          active={modalType === "REMOVE_ARTIFACT"}
          item={chosenArtifact}
          itemType="artifact"
          onConfirm={() => {
            dispatch(removeArtifact(chosenArtifact));

            const removedIndex = indexById(filteredArtifacts, chosenArtifact.ID);

            if (removedIndex !== -1) {
              if (filteredArtifacts.length > 1) {
                const move = removedIndex === filteredArtifacts.length - 1 ? -1 : 1;

                setChosenID(filteredArtifacts[removedIndex + move].ID);
              } else {
                setChosenID(0);
              }
            }
          }}
          onClose={closeModal}
        />
      )}

      {chosenArtifact && (
        <ConfirmModal
          active={!!newOwner}
          message={
            <>
              <b>{chosenArtifact.owner}</b> is currently using "
              <b>{findDataArtifact(chosenArtifact)?.name || "<name missing>"}</b>
              ". Swap?
            </>
          }
          buttons={[undefined, { onClick: () => swapOwner(newOwner!) }]}
          onClose={() => setNewOwner(null)}
        />
      )}
    </WareHouse.Wrapper>
  );
}
