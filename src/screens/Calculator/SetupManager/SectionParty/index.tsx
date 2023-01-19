import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaSyncAlt, FaUserSlash } from "react-icons/fa";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Action
import {
  addTeammate,
  removeTeammate,
  updateTeammateArtifact,
  updateTeammateWeapon,
} from "@Store/calculatorSlice";

// Selector
import {
  selectCharData,
  selectActiveId,
  selectSetupManageInfos,
  selectParty,
} from "@Store/calculatorSlice/selectors";

// Util
import { findById, getImgSrc } from "@Src/utils";
import { getPartyData } from "@Data/controllers";

// Component
import { CollapseSpace } from "@Components/atoms";
import { TeammateItems } from "@Components/organisms";
import { PickerArtifact, PickerCharacter, PickerWeapon } from "@Components/templates";
import { CopySelect } from "./CopySelect";

interface ModalState {
  type: "CHARACTER" | "WEAPON" | "ARTIFACT" | "";
  teammateIndex: number | null;
}

export default function SectionParty() {
  const dispatch = useDispatch();

  const charData = useSelector(selectCharData);
  const activeId = useSelector(selectActiveId);
  const setupManageInfos = useSelector(selectSetupManageInfos);
  const party = useSelector(selectParty);

  const [modal, setModal] = useState<ModalState>({
    type: "",
    teammateIndex: null,
  });
  const [detailSlot, setDetailSlot] = useState<number | null>(null);

  const partyData = useMemo(() => getPartyData(party), [party]);

  const isOriginalSetup = findById(setupManageInfos, activeId)?.type === "original";
  const detailTeammate = detailSlot === null ? undefined : party[detailSlot];

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
        {partyData.map((data, teammateIndex) => {
          const isExpanded = teammateIndex === detailSlot;

          const button = data ? (
            <button
              className={clsx(
                `w-18 h-18 bg-${data.vision} rounded-circle shrink-0 overflow-hidden`,
                !isExpanded && "zoomin-on-hover"
              )}
              onClick={() => setDetailSlot(isExpanded ? null : teammateIndex)}
            >
              <img className="w-full h-full" src={getImgSrc(data.icon)} alt="" draggable={false} />
            </button>
          ) : (
            <button
              className="w-18 h-18 rounded-circle flex-center text-2xl shrink-0 bg-darkblue-3 glow-on-hover"
              onClick={onClickChangeTeammate(teammateIndex)}
            >
              <FaPlus className="text-default opacity-80" />
            </button>
          );

          return (
            <div
              key={teammateIndex}
              className="w-1/3 flex flex-col items-center"
              style={{ height: "5.25rem" }}
            >
              <div
                className={clsx(
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
          <div className="bg-darkblue-2 pt-2">
            <TeammateItems
              mutable
              className="bg-darkblue-1 pt-10 px-2 pb-2"
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
          </div>
        )}
      </CollapseSpace>

      <PickerCharacter
        active={modal.type === "CHARACTER" && modal.teammateIndex !== null}
        sourceType="appData"
        filter={({ name }) => {
          return name !== charData.name && party.every((tm) => name !== tm?.name);
        }}
        onPickCharacter={({ name, vision, weaponType }) => {
          const { teammateIndex } = modal;

          if (vision && weaponType && teammateIndex !== null) {
            dispatch(addTeammate({ name, vision, weaponType, teammateIndex }));
            setDetailSlot(teammateIndex);
          }
        }}
        onClose={closeModal}
      />

      {detailSlot !== null && (
        <PickerWeapon
          active={modal.type === "WEAPON" && modal.teammateIndex !== null}
          weaponType={partyData[detailSlot]?.weaponType || "sword"}
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
      )}

      <PickerArtifact
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
