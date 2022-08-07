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
import {
  selectArtifactById,
  selectMyArts,
  selectMyChars,
} from "@Store/usersDatabaseSlice/selectors";

import useInventoryRack from "@Components/item-stores/hooks/useInventoryRack";
import useTypeFilter from "@Components/item-stores/hooks/useTypeFilter";
import {
  filterArtIdsBySetsAndStats,
  initArtifactStatsFilter,
  StatsFilter,
} from "@Components/item-stores/utils";
import { findArtifactPiece, findCharacter } from "@Data/controllers";

import { Picker, PrePicker } from "@Components/Picker";
import { ArtifactCard } from "@Components/ArtifactCard";
import { ConfirmModal } from "@Components/modals";
import { ButtonBar } from "@Components/minors";
import { ItemRemoveConfirm, renderEquippedChar } from "@Components/item-stores/components";
import { Filter } from "./Filter";

import styles from "../styles.module.scss";

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

type ModalType = "preArtifactPicker" | "equipCharacterPicker" | "removingArtifact" | "filter";

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
            handlers={[openModal("preArtifactPicker"), () => dispatch(sortArtifacts())]}
          />

          {window.innerWidth >= 600 && typeFilter}

          <div className="flex cursor-pointer">
            <button
              className={cn(
                "pl-4 py-1 bg-lightgold glow-on-hover",
                isFiltered ? "pr-2 rounded-l-2xl" : "pr-4 rounded-2xl"
              )}
              onClick={openModal("filter")}
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
          {modalType === "filter" && (
            <Filter
              types={types as Artifact[]}
              codes={codes}
              stats={stats}
              setTypes={setTypes}
              setCodes={setCodes}
              setStats={setStats}
              onClose={closeModal}
            />
          )}
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
                  handlers={[openModal("removingArtifact"), openModal("equipCharacterPicker")]}
                />
              ) : null}
            </div>

            {artifact?.owner ? renderEquippedChar(artifact.owner) : null}
          </div>
        </div>
      </div>

      {modalType === "preArtifactPicker" && (
        <PrePicker
          choices={ARTIFACT_ICONS}
          onClickChoice={(artType) => {
            setPickingArtifactType(artType as Artifact);
            closeModal();
          }}
          onClose={closeModal}
        />
      )}
      {pickingArtifactType && (
        <Picker.Artifact
          needMassAdd={true}
          artType={pickingArtifactType}
          onPickItem={(newItem) => {
            const ID = Date.now();
            dispatch(addArtifact({ ID, ...newItem, owner: null }));
            setChosenID(ID);
          }}
          onClose={() => setPickingArtifactType(null)}
        />
      )}
      {modalType === "equipCharacterPicker" && artifact && (
        <CharacterPicker
          owner={artifact.owner}
          updateOwner={setNewOwner}
          swapOwner={swapOwner}
          onClose={closeModal}
        />
      )}
      {modalType === "removingArtifact" && artifact && (
        <ItemRemoveConfirm
          item={artifact}
          itemType="artifact"
          filteredIds={filteredIds}
          removeItem={(item) => {
            dispatch(removeArtifact({ ...item, type: item.type as Artifact }));
          }}
          updateChosenID={setChosenID}
          onClose={closeModal}
        />
      )}
      {newOwner && artifact ? (
        <ConfirmModal
          message={
            <>
              <b>{artifact?.owner}</b> is currently using "<b>{findArtifactPiece(artifact).name}</b>
              ". Swap?
            </>
          }
          right={{ onClick: () => swapOwner(newOwner) }}
          onClose={() => setNewOwner(null)}
        />
      ) : null}
    </div>
  );
}

interface CharacterPickerProps {
  owner: string | null;
  updateOwner: (newOwner: string) => void;
  swapOwner: (newOwner: string) => void;
  onClose: () => void;
}
function CharacterPicker({ owner, updateOwner, swapOwner, onClose }: CharacterPickerProps) {
  const myChars = useSelector(selectMyChars);

  const data = [];
  for (const char of myChars) {
    const { name, cons } = char;
    if (owner && name !== owner) {
      const charData = findCharacter(char);
      if (charData) {
        const { beta, code, icon, rarity, vision, weapon } = charData;
        data.push({ name, cons, beta, code, icon, rarity, vision, weapon });
      }
    }
  }

  return (
    <Picker
      data={data}
      dataType="character"
      onPickItem={({ name }) => {
        if (owner) {
          updateOwner(name);
        } else {
          swapOwner(name);
        }
      }}
      onClose={onClose}
    />
  );
}
