import clsx from "clsx";
import { useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { FaTimes } from "react-icons/fa";
import { ARTIFACT_ICONS } from "@Src/constants";
import { Artifact, ArtPieceMainStat, UserArtifact } from "@Src/types";

import { useDispatch, useSelector } from "@Store/hooks";
import {
  addUserArtifact,
  updateUserArtifactSubStat,
  removeArtifact,
  sortArtifacts,
  swapArtifactOwner,
  updateUserArtifact,
} from "@Store/userDatabaseSlice";
import { selectArtifactById, selectMyArts } from "@Store/userDatabaseSlice/selectors";

import { useInventoryRack, useTypeFilter } from "@Components/item-stores/hooks";
import {
  filterArtIdsBySetsAndStats,
  initArtifactStatsFilter,
  StatsFilter,
} from "@Components/item-stores/utils";
import { findArtifactPiece } from "@Data/controllers";

import { Picker, PrePicker } from "@Components/Picker";
import { ArtifactCard } from "@Components/ArtifactCard";
import { ButtonBar, ConfirmModal } from "@Components/minors";
import { ItemConfirmRemove, renderEquippedChar } from "@Components/item-stores/components";
import { Filter } from "./Filter";

import styles from "../styles.module.scss";

const selectFilteredArtifactIds = createSelector(
  selectMyArts,
  (_: unknown, types: Artifact[]) => types,
  (_: unknown, __: unknown, codes: number[]) => codes,
  (_: unknown, __: unknown, ___: unknown, stats: StatsFilter) => stats,
  (myArts: UserArtifact[], types: Artifact[], codes: number[], stats: StatsFilter) => {
    const result = types.length ? myArts.filter((p) => types.includes(p.type)) : myArts;
    return filterArtIdsBySetsAndStats(result, codes, stats);
  }
);

type ModalType = "PICK_ARTIFACT_TYPE" | "EQUIP_CHARACTER" | "REMOVE_ARTIFACT" | "FITLER";

export default function MyArtifacts() {
  const dispatch = useDispatch();

  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [pickArtifactModal, setPickArtifactModal] = useState<{ isActive: boolean; type: Artifact }>(
    {
      isActive: false,
      type: "flower",
    }
  );
  const [newOwner, setNewOwner] = useState<string | null>(null);

  const [codes, setCodes] = useState<number[]>([]);
  const [stats, setStats] = useState(initArtifactStatsFilter());

  const { filteredTypes, setFilteredType, renderTypeFilter } = useTypeFilter({
    itemType: "artifact",
  });

  const filteredIds = useSelector((state) =>
    selectFilteredArtifactIds(state, filteredTypes as Artifact[], codes, stats)
  );
  const [invRack, chosenID, setChosenID] = useInventoryRack({
    listClassName: styles.list,
    itemClassName: styles.item,
    items: useSelector(selectMyArts),
    itemType: "artifact",
    filteredIds,
  });
  const artifact = useSelector((state) => selectArtifactById(state, chosenID));

  const openModal = (type: ModalType) => () => setModalType(type);
  const closeModal = () => setModalType(null);

  const swapOwner = (name: string) => {
    if (artifact) {
      dispatch(swapArtifactOwner({ newOwner: name, artifactID: artifact.ID }));
    }
  };

  const isFiltered =
    filteredTypes.length ||
    codes.length ||
    stats.main !== "All" ||
    stats.subs.some((s) => s !== "All");

  return (
    <div className="pt-8 h-full flex-center bg-darkblue-2">
      <div className={styles.warehouse}>
        <div className={clsx("w-full", styles["button-bar"])}>
          <ButtonBar
            className="mr-4 space-x-4"
            texts={["Add", "Sort"]}
            variants={["positive", "positive"]}
            handlers={[openModal("PICK_ARTIFACT_TYPE"), () => dispatch(sortArtifacts())]}
          />

          {window.innerWidth >= 600 && renderTypeFilter()}

          <div className="flex cursor-pointer">
            <button
              className={clsx(
                "pl-4 py-1 bg-lightgold glow-on-hover",
                isFiltered ? "pr-2 rounded-l-2xl" : "pr-4 rounded-2xl"
              )}
              onClick={openModal("FITLER")}
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
        </div>

        <div className={styles.body}>
          {invRack}

          <div className="flex flex-col justify-between">
            <div className="p-4 rounded-lg bg-darkblue-1 flex flex-col">
              <div className="w-75 hide-scrollbar" style={{ height: "26.5rem" }}>
                {artifact ? (
                  <ArtifactCard
                    artPiece={artifact}
                    mutable
                    enhance={(level) => dispatch(updateUserArtifact({ ID: artifact.ID, level }))}
                    changeMainStatType={(type) =>
                      dispatch(
                        updateUserArtifact({
                          ID: artifact.ID,
                          mainStatType: type as ArtPieceMainStat,
                        })
                      )
                    }
                    changeSubStat={(subStatIndex, changes) => {
                      dispatch(
                        updateUserArtifactSubStat({ ID: artifact.ID, subStatIndex, ...changes })
                      );
                    }}
                  />
                ) : null}
              </div>
              {artifact ? (
                <ButtonBar
                  className="mt-4"
                  texts={["Remove", "Equip"]}
                  handlers={[openModal("REMOVE_ARTIFACT"), openModal("EQUIP_CHARACTER")]}
                />
              ) : null}
            </div>

            {artifact?.owner ? renderEquippedChar(artifact.owner) : null}
          </div>
        </div>
      </div>

      <Filter
        active={modalType === "FITLER"}
        types={filteredTypes as Artifact[]}
        codes={codes}
        stats={stats}
        setTypes={setFilteredType}
        setCodes={setCodes}
        setStats={setStats}
        onClose={closeModal}
      />

      <PrePicker
        active={modalType === "PICK_ARTIFACT_TYPE"}
        choices={ARTIFACT_ICONS}
        onClickChoice={(artType) => {
          setPickArtifactModal({
            isActive: true,
            type: artType as Artifact,
          });
          closeModal();
        }}
        onClose={closeModal}
      />

      <Picker.Artifact
        active={pickArtifactModal.isActive}
        needMassAdd
        artifactType={pickArtifactModal.type}
        onPickArtifact={(newItem) => {
          const ID = Date.now();
          dispatch(addUserArtifact({ ID, ...newItem, owner: null }));
          setChosenID(ID);
        }}
        onClose={() => setPickArtifactModal((prev) => ({ ...prev, isActive: false }))}
      />

      <Picker.Character
        active={modalType === "EQUIP_CHARACTER" && !!artifact}
        sourceType="userData"
        filter={({ name }) => name !== artifact?.owner}
        onPickCharacter={({ name }) => {
          if (artifact?.owner) {
            setNewOwner(name);
          } else {
            swapOwner(name);
          }
        }}
        onClose={closeModal}
      />

      {artifact && (
        <ItemConfirmRemove
          active={modalType === "REMOVE_ARTIFACT"}
          item={artifact}
          itemType="artifact"
          filteredIds={filteredIds}
          removeItem={(item) => dispatch(removeArtifact({ ...item, type: item.type as Artifact }))}
          updateChosenID={setChosenID}
          onClose={closeModal}
        />
      )}

      {artifact && (
        <ConfirmModal
          active={!!newOwner}
          message={
            <>
              <b>{artifact.owner}</b> is currently using "
              <b>{findArtifactPiece(artifact)?.name || "<name missing>"}</b>
              ". Swap?
            </>
          }
          right={{ onClick: () => swapOwner(newOwner!) }}
          onClose={() => setNewOwner(null)}
        />
      )}
    </div>
  );
}
