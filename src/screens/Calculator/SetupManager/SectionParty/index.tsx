import cn from "classnames";
import { useState } from "react";
import { FaPlus, FaSyncAlt, FaUserSlash } from "react-icons/fa";
import type { Teammate } from "@Src/types";

import { useDispatch, useSelector } from "@Store/hooks";
import { addTeammate, removeTeammate } from "@Store/calculatorSlice";
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

export default function SectionParty() {
  const dispatch = useDispatch();

  const charData = useSelector(selectCharData);
  const activeId = useSelector(selectActiveId);
  const setupManageInfos = useSelector(selectSetupManageInfos);
  const party = useSelector(selectParty);

  const [pendingSlot, setPendingSlot] = useState<number | null>(null);
  const [detailSlot, setDetailSlot] = useState<number | null>(null);

  const isOriginalSetup = findById(setupManageInfos, activeId)?.type === "original";
  const detailTeammate = detailSlot === null ? undefined : party[detailSlot];

  return (
    <div className="setup-manager_pedestal">
      {party.length && party.every((teammate) => !teammate) ? <CopySelect /> : null}

      <div className="w-full grid grid-cols-3 relative">
        {party.map((teammate, tmIndex) => {
          const isExpanded = tmIndex === detailSlot;
          let button;

          if (teammate) {
            const { code, icon } = findCharacter(teammate)!;
            const bgColorByCode: Record<number, string> = {
              1: "bg-anemo",
              12: "bg-geo",
              46: "bg-electro",
              57: "bg-dendro",
            };

            button = (
              <button
                className={cn(
                  `overflow-hidden ${
                    bgColorByCode[code] || "bg-darkblue-3"
                  } transition-all duration-150`,
                  isExpanded ? "pt-4 px-1 rounded-t-lg" : "zoomin-on-hover rounded-circle"
                )}
                onClick={() => setDetailSlot(isExpanded ? null : tmIndex)}
              >
                <img
                  className={cn("w-full", !isExpanded && "rounded-circle")}
                  src={icon.split("/")[0].length === 1 ? wikiImg(icon) : icon}
                  alt=""
                  draggable={false}
                />
              </button>
            );
          } else {
            button = (
              <button
                className="w-full h-full rounded-circle flex-center text-2xl leading-6 bg-darkblue-3 transition-all duration-150 glow-on-hover"
                onClick={() => setPendingSlot(tmIndex)}
              >
                <FaPlus className="text-default opacity-80" />
              </button>
            );
          }

          return (
            <div key={tmIndex}>
              <div className={cn("mx-auto h-18 relative", isExpanded ? "w-20" : "w-18")}>
                {button}
              </div>
            </div>
          );
        })}
      </div>

      <CollapseSpace
        active={detailSlot !== null}
        className={cn("bg-darkblue-3", detailSlot !== null && "mt-2")}
      >
        {detailTeammate && (
          <TeammateDetail
            teammate={detailTeammate}
            onClickChangeTeammate={() => setPendingSlot(detailSlot)}
            onClickRemoveTeammate={() => {
              if (detailSlot !== null) {
                dispatch(removeTeammate(detailSlot));
                setDetailSlot(null);
              }
            }}
          />
        )}
      </CollapseSpace>

      <Picker.Character
        active={pendingSlot !== null}
        sourceType="appData"
        filter={({ name }) => {
          return name !== charData.name && party.every((tm) => name !== tm?.name);
        }}
        onPickCharacter={({ name, vision, weapon }) => {
          if (vision && weapon && pendingSlot !== null) {
            dispatch(addTeammate({ name, vision, weapon, tmIndex: pendingSlot }));
            setDetailSlot(pendingSlot);
          }
        }}
        onClose={() => setPendingSlot(null)}
      />
    </div>
  );
}

interface ITeammateDetailProps {
  teammate: Teammate;
  onClickChangeTeammate: () => void;
  onClickRemoveTeammate: () => void;
}
function TeammateDetail({
  teammate,
  onClickChangeTeammate,
  onClickRemoveTeammate,
}: ITeammateDetailProps) {
  const { weapon, artifact } = teammate;
  const { weapon: weaponType } = findCharacter(teammate)!;
  const weaponData = findWeapon({ code: weapon.code, type: weaponType });
  const artifactIcon = artifact ? findArtifactSet(artifact)?.flower.icon : undefined;

  return (
    <div className="pt-6 px-2 pb-2 flex justify-between">
      <div>
        {weaponData && (
          <div className="flex">
            <button className={`w-12 h-12 mr-2 rounded bg-gradient-${weaponData.rarity} shrink-0`}>
              <img src={wikiImg(weaponData.icon)} alt="" />
            </button>
            <p className={`text-rarity-${weaponData.rarity} font-medium`}>{weaponData.name}</p>
          </div>
        )}

        <div className="mt-2 flex">
          <button className="mr-2 w-12 h-12">
            {artifactIcon ? (
              <img src={wikiImg(artifactIcon)} alt="" />
            ) : (
              <img
                className="p-1"
                src={wikiImg("6/6a/Icon_Inventory_Artifacts")}
                alt="artifact"
                draggable={false}
              />
            )}
          </button>
          <p className="font-medium text-lesser">No artifact</p>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <button
          className="w-8 h-8 text-xl flex-center text-lightgold"
          onClick={onClickChangeTeammate}
        >
          <FaSyncAlt />
        </button>
        <button
          className="w-8 h-8 text-xl flex-center text-darkred"
          onClick={onClickRemoveTeammate}
        >
          <FaUserSlash />
        </button>
      </div>
    </div>
  );
}
