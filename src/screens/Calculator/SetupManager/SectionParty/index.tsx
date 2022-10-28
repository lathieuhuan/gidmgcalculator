import cn from "classnames";
import { useState } from "react";
import { FaPlus, FaSyncAlt, FaTimes, FaUserSlash } from "react-icons/fa";
import type { Teammate } from "@Src/types";

import { useDispatch, useSelector } from "@Store/hooks";
import {
  addTeammate,
  removeTeammate,
  updateTeammateArtifact,
  updateTeammateWeapon,
} from "@Store/calculatorSlice";
import {
  selectCharData,
  selectActiveId,
  selectSetupManageInfos,
  selectParty,
} from "@Store/calculatorSlice/selectors";

import { findById, wikiImg } from "@Src/utils";
import { findArtifactSet, findCharacter, findWeapon } from "@Data/controllers";

import { Picker } from "@Components/Picker";
import { CollapseSpace } from "@Components/collapse";
import { CopySelect } from "./CopySelect";
import { EModAffect } from "@Src/constants";
import { Select } from "@Src/styled-components";

interface IModal {
  type: "" | "CHARACTER" | "WEAPON" | "ARTIFACT";
  teammateIndex: number | null;
}

export default function SectionParty() {
  const dispatch = useDispatch();

  const charData = useSelector(selectCharData);
  const activeId = useSelector(selectActiveId);
  const setupManageInfos = useSelector(selectSetupManageInfos);
  const party = useSelector(selectParty);

  const [modal, setModal] = useState<IModal>({
    type: "",
    teammateIndex: null,
  });
  const [detailSlot, setDetailSlot] = useState<number | null>(null);

  const isOriginalSetup = findById(setupManageInfos, activeId)?.type === "original";
  const detailTeammate = detailSlot === null ? undefined : party[detailSlot];
  const detailWeaponType = detailTeammate
    ? findCharacter(detailTeammate)?.weapon || "sword"
    : "sword";

  const closeModal = () => {
    setModal({ type: "", teammateIndex: null });
  };

  const onClickChangeTeammate = (teammateIndex: number) => () => {
    setModal({
      type: "CHARACTER",
      teammateIndex,
    });
  };

  const onClickRemoveTeammate = () => {
    if (detailSlot !== null) {
      dispatch(removeTeammate(detailSlot));
      setDetailSlot(null);
    }
  };

  return (
    <div className="pb-3 border-2 border-lesser rounded-xl bg-darkblue-2">
      {party.length && party.every((teammate) => !teammate) ? <CopySelect /> : null}

      <div className="w-full grid grid-cols-3 relative">
        {party.map((teammate, teammateIndex) => {
          const isExpanded = teammateIndex === detailSlot;
          let button;

          if (teammate) {
            const { icon, vision } = findCharacter(teammate)!;

            button = (
              <div
                className={cn(
                  "overflow-hidden",
                  !isExpanded && "h-full zoomin-on-hover rounded-circle"
                )}
              >
                <div
                  className={cn(
                    "grid grid-cols-2 text-xl transition-size",
                    isExpanded ? "h-10" : "h-0"
                  )}
                >
                  <button
                    className={"text-darkred " + (isExpanded ? "flex-center" : "hidden")}
                    onClick={onClickRemoveTeammate}
                  >
                    <FaUserSlash />
                  </button>
                  <button
                    className={"text-lightgold " + (isExpanded ? "flex-center" : "hidden")}
                    onClick={onClickChangeTeammate(teammateIndex)}
                  >
                    <FaSyncAlt />
                  </button>
                </div>
                <button
                  className={`w-full h-full bg-${vision} rounded-md`}
                  onClick={() => setDetailSlot(isExpanded ? null : teammateIndex)}
                >
                  <img
                    className={cn("w-full h-full", isExpanded ? "pt-1 px-1" : "rounded-circle")}
                    src={icon.split("/")[0].length === 1 ? wikiImg(icon) : icon}
                    alt=""
                    draggable={false}
                  />
                </button>
              </div>
            );
          } else {
            button = (
              <button
                className="w-full h-full rounded-circle flex-center text-2xl leading-6 bg-darkblue-3 glow-on-hover"
                onClick={onClickChangeTeammate(teammateIndex)}
              >
                <FaPlus className="text-default opacity-80" />
              </button>
            );
          }

          return (
            <div
              key={teammateIndex}
              className={cn("transition-spacing", isExpanded ? "pt-1" : "pt-3")}
            >
              <div className={cn("mx-auto h-18 relative", isExpanded ? "w-20" : "w-18")}>
                {button}
              </div>
            </div>
          );
        })}
      </div>

      <CollapseSpace
        active={detailSlot !== null}
        className={cn("bg-darkblue-1", detailSlot !== null && "mt-2")}
      >
        {detailTeammate && (
          <TeammateDetail
            teammate={detailTeammate}
            onClickWeapon={() => setModal({ type: "WEAPON", teammateIndex: detailSlot })}
            onChangeWeaponRefinement={(refi: number) => {
              if (detailSlot !== null) {
                dispatch(
                  updateTeammateWeapon({
                    teammateIndex: detailSlot,
                    refi,
                  })
                );
              }
            }}
            onClickArtifact={() => setModal({ type: "ARTIFACT", teammateIndex: detailSlot })}
            onClickRemoveArtifact={() => {
              if (detailSlot !== null) {
                dispatch(
                  updateTeammateArtifact({
                    teammateIndex: detailSlot,
                    code: -1,
                  })
                );
              }
            }}
          />
        )}
      </CollapseSpace>

      <Picker.Character
        active={modal.type === "CHARACTER" && modal.teammateIndex !== null}
        sourceType="appData"
        filter={({ name }) => {
          return name !== charData.name && party.every((tm) => name !== tm?.name);
        }}
        onPickCharacter={({ name, vision, weapon }) => {
          const { teammateIndex } = modal;

          if (vision && weapon && teammateIndex !== null) {
            dispatch(addTeammate({ name, vision, weapon, teammateIndex }));
            setDetailSlot(teammateIndex);
          }
        }}
        onClose={closeModal}
      />

      <Picker.Weapon
        active={modal.type === "WEAPON" && modal.teammateIndex !== null}
        weaponType={detailWeaponType}
        onPickWeapon={({ code }) => {
          if (detailSlot !== null) {
            dispatch(
              updateTeammateWeapon({
                teammateIndex: detailSlot,
                code,
              })
            );
          }
        }}
        onClose={closeModal}
      />

      <Picker.Artifact
        active={modal.type === "ARTIFACT" && modal.teammateIndex !== null}
        artifactType="flower"
        forFeature="TEAMMATE_MODIFIERS"
        onPickArtifact={({ code }) => {
          if (detailSlot !== null) {
            dispatch(
              updateTeammateArtifact({
                teammateIndex: detailSlot,
                code,
              })
            );
          }
        }}
        onClose={closeModal}
      />
    </div>
  );
}

interface ITeammateDetailProps {
  teammate: Teammate;
  onClickWeapon: () => void;
  onChangeWeaponRefinement: (newRefinement: number) => void;
  onClickArtifact: () => void;
  onClickRemoveArtifact: () => void;
}
function TeammateDetail({
  teammate,
  onClickWeapon,
  onChangeWeaponRefinement,
  onClickArtifact,
  onClickRemoveArtifact,
}: ITeammateDetailProps) {
  const { weapon, artifact } = teammate;
  const { weapon: weaponType } = findCharacter(teammate)!;
  const weaponData = findWeapon({ code: weapon.code, type: weaponType });
  const { name: artifactSetName, flower } = findArtifactSet(artifact) || {};
  const { icon: artifactSetIcon = "" } = flower || {};

  return (
    <div className="pt-10 px-2 pb-2">
      {weaponData && (
        <div className="flex">
          <button
            className={`w-14 h-14 mr-2 rounded bg-gradient-${weaponData.rarity} shrink-0`}
            onClick={onClickWeapon}
          >
            <img src={wikiImg(weaponData.icon)} alt="" />
          </button>

          <div>
            <p className={`text-rarity-${weaponData.rarity} text-lg font-bold truncate`}>
              {weaponData.name}
            </p>
            {weaponData.rarity >= 3 && (
              <div className="flex items-center">
                <span>Refinement</span>
                <Select
                  className={`ml-2 text-rarity-${weaponData.rarity} text-right`}
                  value={weapon.refi}
                  onChange={(e) => onChangeWeaponRefinement(+e.target.value)}
                >
                  {[...Array(5)].map((_, index) => {
                    return (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    );
                  })}
                </Select>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-2 flex space-x-2">
        <button className="w-14 h-14 shrink-0" onClick={onClickArtifact}>
          {artifactSetIcon ? (
            <img className="bg-darkblue-2 rounded" src={wikiImg(artifactSetIcon)} alt="" />
          ) : (
            <img
              className="p-1"
              src={wikiImg("6/6a/Icon_Inventory_Artifacts")}
              alt="artifact"
              draggable={false}
            />
          )}
        </button>

        <p
          className={cn(
            "grow text-lg font-medium truncate",
            artifactSetName ? "text-default" : "text-lesser"
          )}
        >
          {artifactSetName || "No artifact buff"}
        </p>
        {artifactSetName && (
          <button
            className="self-start pt-1 shrink-0 text-xl hover:text-darkred"
            onClick={onClickRemoveArtifact}
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
}
