import cn from "classnames";
import { useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { FaTimes } from "react-icons/fa";
import { ARTIFACT_ICONS } from "@Src/constants";
import { Artifact, CalcArtPieceMainStat, UsersArtifact } from "@Src/types";

import { useDispatch, useSelector } from "@Store/hooks";
import {
  addArtifact,
  changeUsersArtifactMainStatType,
  changeUsersArtifactSubStat,
  enhanceUsersArtifact,
  removeArtifact,
  sortArtifacts,
  swapArtifactOwner,
} from "@Store/usersDatabaseSlice";
import { selectArtifactById, selectMyArts } from "@Store/usersDatabaseSlice/selectors";

import useInventoryRack from "@Components/item-stores/hooks/useInventoryRack";
import useTypeFilter from "@Components/item-stores/hooks/useTypeFilter";
import {
  filterArtIdsBySetsAndStats,
  initArtifactStatsFilter,
  StatsFilter,
} from "@Components/item-stores/utils";
import { findArtifactPiece } from "@Data/controllers";

import { Picker, PrePicker } from "@Components/Picker";
import { ArtifactCard } from "@Components/ArtifactCard";
import { ButtonBar, ConfirmModal, ConfirmTemplate } from "@Components/minors";
import { ItemConfirmRemove, renderEquippedChar } from "@Components/item-stores/components";
import { Filter } from "./Filter";

import styles from "../styles.module.scss";
import { Modal } from "@Components/modals";

const selectFilteredArtifactIds = createSelector(
  selectMyArts,
  (_: unknown, types: Artifact[]) => types,
  (_: unknown, __: unknown, codes: number[]) => codes,
  (_: unknown, __: unknown, ___: unknown, stats: StatsFilter) => stats,
  (myArts: UsersArtifact[], types: Artifact[], codes: number[], stats: StatsFilter) => {
    const result = types.length ? myArts.filter((p) => types.includes(p.type)) : myArts;
    return filterArtIdsBySetsAndStats(result, codes, stats);
  }
);

type ModalType = "PICK_ARTIFACT_TYPE" | "EQUIP_CHARACTER" | "REMOVE_ARTIFACT" | "FITLER";

export default function MyArtifacts() {
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [pickingArtifactType, setPickingArtifactType] = useState<Artifact | null>(null);
  const [newOwner, setNewOwner] = useState<string | null>(null);

  const dispatch = useDispatch();

  const [typeFilter, types, setTypes] = useTypeFilter(false);
  const [codes, setCodes] = useState<number[]>([]);
  const [stats, setStats] = useState(initArtifactStatsFilter());

  const filteredIds = useSelector((state) =>
    selectFilteredArtifactIds(state, types as Artifact[], codes, stats)
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
    types.length || codes.length || stats.main !== "All" || stats.subs.some((s) => s !== "All");

  return (
    <div className="pt-8 h-full flex-center bg-darkblue-2">
      <div className={styles.warehouse}>
        <div className={cn("w-full", styles["button-bar"])}>
          <ButtonBar
            className="mr-4 gap-4"
            texts={["Add", "Sort"]}
            variants={["positive", "positive"]}
            handlers={[openModal("PICK_ARTIFACT_TYPE"), () => dispatch(sortArtifacts())]}
          />

          {window.innerWidth >= 600 && typeFilter}

          <div className="flex cursor-pointer">
            <button
              className={cn(
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
                  setTypes([]);
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
              <div className="w-75 hide-scrollbar" style={{ height: "25rem" }}>
                {artifact ? (
                  <ArtifactCard
                    artPiece={artifact}
                    mutable={true}
                    enhance={(level) => dispatch(enhanceUsersArtifact({ ID: artifact.ID, level }))}
                    changeMainStatType={(type) =>
                      dispatch(
                        changeUsersArtifactMainStatType({
                          ID: artifact.ID,
                          type: type as CalcArtPieceMainStat,
                        })
                      )
                    }
                    changeSubStat={(subStatIndex, changes) => {
                      dispatch(
                        changeUsersArtifactSubStat({ ID: artifact.ID, subStatIndex, ...changes })
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
        types={types as Artifact[]}
        codes={codes}
        stats={stats}
        setTypes={setTypes}
        setCodes={setCodes}
        setStats={setStats}
        onClose={closeModal}
      />

      <PrePicker
        active={modalType === "PICK_ARTIFACT_TYPE"}
        choices={ARTIFACT_ICONS}
        onClickChoice={(artType) => {
          setPickingArtifactType(artType as Artifact);
          closeModal();
        }}
        onClose={closeModal}
      />

      <Picker.Artifact
        active={!!pickingArtifactType}
        needMassAdd={true}
        artifactType={pickingArtifactType || "flower"}
        onPickArtifact={(newItem) => {
          const ID = Date.now();
          dispatch(addArtifact({ ID, ...newItem, owner: null }));
          setChosenID(ID);
        }}
        onClose={() => setPickingArtifactType(null)}
      />

      <Picker.Character
        active={modalType === "EQUIP_CHARACTER" && !!artifact}
        sourceType="usersData"
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
              <b>{artifact.owner}</b> is currently using "<b>{findArtifactPiece(artifact).name}</b>
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
