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
    <div className="setup-manager_pedestal">
      {party.length && party.every((teammate) => !teammate) ? <CopySelect /> : null}

      <div className="w-full grid grid-cols-3 relative">
        {party.map((teammate, teammateIndex) => {
          const isExpanded = teammateIndex === detailSlot;
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
              <div
                className={cn(
                  `overflow-hidden ${bgColorByCode[code] || "bg-darkblue-3"}`,
                  isExpanded ? "rounded-t-lg" : "h-full zoomin-on-hover rounded-circle"
                )}
              >
                <div
                  className={cn(
                    "grid grid-cols-2 text-xl transition-size",
                    isExpanded ? "h-10" : "h-0"
                  )}
                >
                  <button
                    className={"text-darkred " + (isExpanded ? "flex-center " : "hidden")}
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
                <img
                  className={cn("w-full h-full px-1", !isExpanded && "rounded-circle")}
                  src={icon.split("/")[0].length === 1 ? wikiImg(icon) : icon}
                  alt=""
                  draggable={false}
                  onClick={() => setDetailSlot(isExpanded ? null : teammateIndex)}
                />
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
            <div key={teammateIndex}>
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
            onClickWeapon={() => setModal({ type: "WEAPON", teammateIndex: detailSlot })}
            onClickArtifact={() => {}}
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
        onPickWeapon={() => {}}
        onClose={closeModal}
      />
    </div>
  );
}

interface ITeammateDetailProps {
  teammate: Teammate;
  onClickWeapon: () => void;
  onClickArtifact: () => void;
}
function TeammateDetail({ teammate, onClickWeapon, onClickArtifact }: ITeammateDetailProps) {
  const { weapon, artifact } = teammate;
  const { weapon: weaponType } = findCharacter(teammate)!;
  const weaponData = findWeapon({ code: weapon.code, type: weaponType });
  const artifactIcon = artifact ? findArtifactSet(artifact)?.flower.icon : undefined;

  return (
    <div className="pt-12 px-2 pb-2 flex justify-between">
      <div>
        {weaponData && (
          <div className="flex">
            <button
              className={`w-12 h-12 mr-2 rounded bg-gradient-${weaponData.rarity} shrink-0`}
              onClick={onClickWeapon}
            >
              <img src={wikiImg(weaponData.icon)} alt="" />
            </button>
            <p className={`text-rarity-${weaponData.rarity} text-lg font-bold`}>
              {weaponData.name}
            </p>
          </div>
        )}

        <div className="mt-2 flex">
          <button className="mr-2 w-12 h-12" onClick={onClickArtifact}>
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
          <p className="text-lg font-medium text-lesser">No artifact</p>
        </div>
      </div>

      {/* <div className="flex flex-col space-y-2">
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
      </div> */}
    </div>
  );
}
