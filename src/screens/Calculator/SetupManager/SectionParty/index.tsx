import cn from "classnames";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!detailTeammate) {
      setDetailSlot(null);
    }
  }, [detailTeammate]);

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
    }
  };

  return (
    <div className="pb-3 border-2 border-lesser rounded-xl bg-darkblue-2">
      {party.length && party.every((teammate) => !teammate) ? <CopySelect /> : null}

      <div className="flex">
        {party.map((teammate, teammateIndex) => {
          const isExpanded = teammateIndex === detailSlot;
          let button;

          if (teammate) {
            const { icon, vision } = findCharacter(teammate)!;

            button = (
              <button
                className={cn(
                  `w-18 h-18 bg-${vision} rounded-circle shrink-0 overflow-hidden`,
                  !isExpanded && "zoomin-on-hover"
                )}
                onClick={() => setDetailSlot(isExpanded ? null : teammateIndex)}
              >
                <img
                  className="w-full h-full"
                  src={icon.split("/")[0].length === 1 ? wikiImg(icon) : icon}
                  alt=""
                  draggable={false}
                />
              </button>
            );
          } else {
            button = (
              <button
                className="w-18 h-18 rounded-circle flex-center text-2xl shrink-0 bg-darkblue-3 glow-on-hover"
                onClick={onClickChangeTeammate(teammateIndex)}
              >
                <FaPlus className="text-default opacity-80" />
              </button>
            );
          }

          return (
            <div
              key={teammateIndex}
              className="w-1/3 flex flex-col items-center"
              style={{ height: "5.25rem" }}
            >
              <div
                className={cn(
                  "flex items-end text-xl shrink-0 overflow-hidden transition-size",
                  isExpanded ? "h-11" : "h-3"
                )}
              >
                <button
                  className={
                    "w-10 h-10 text-darkred glow-on-hover " +
                    (isExpanded ? "flex-center" : "hidden")
                  }
                  onClick={onClickRemoveTeammate}
                >
                  <FaUserSlash />
                </button>
                <button
                  className={
                    "w-10 h-10 text-lightgold glow-on-hover " +
                    (isExpanded ? "flex-center" : "hidden")
                  }
                  onClick={onClickChangeTeammate(teammateIndex)}
                >
                  <FaSyncAlt />
                </button>
              </div>

              {button}
            </div>
          );
        })}
      </div>

      <CollapseSpace active={detailSlot !== null}>
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
  const weaponData = findWeapon(weapon);
  const { name: artifactSetName, flower } = findArtifactSet(artifact) || {};
  const { icon: artifactSetIcon = "" } = flower || {};

  return (
    <div className="bg-darkblue-2 pt-2">
      <div className="bg-darkblue-1 pt-10 px-2 pb-2">
        {weaponData && (
          <div className="flex">
            <button
              className={`w-14 h-14 mr-2 rounded bg-gradient-${weaponData.rarity} shrink-0`}
              onClick={onClickWeapon}
            >
              <img src={wikiImg(weaponData.icon)} alt="" />
            </button>

            <div className="overflow-hidden">
              <p className={`text-rarity-${weaponData.rarity} text-lg font-bold truncate`}>
                {weaponData.name}
              </p>
              {weaponData.rarity >= 3 && (
                <div className="flex items-center">
                  <span>Refinement</span>
                  <Select
                    className={`ml-2 pr-1 text-rarity-${weaponData.rarity} text-right`}
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
              "mt-1 grow font-medium truncate",
              artifactSetName ? "text-default text-lg" : "text-lesser"
            )}
          >
            {artifactSetName || "No artifact buff / debuff"}
          </p>
          {artifactSetName && (
            <button
              className="self-start pt-2 pr-1 shrink-0 text-xl hover:text-darkred"
              onClick={onClickRemoveArtifact}
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
