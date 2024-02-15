import { useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { FaSave, FaSyncAlt, FaTrashAlt, FaChevronDown } from "react-icons/fa";

import type { CalcArtifact, AttributeStat } from "@Src/types";
import { calcItemToUserItem, findById, percentSign, userItemToCalcItem } from "@Src/utils";

// Constant
import { MAX_USER_ARTIFACTS } from "@Src/constants";
import { ARTIFACT_MAIN_STATS } from "@Src/constants/artifact-stats";

// Store
import { changeArtifact, updateArtifact } from "@Store/calculatorSlice";
import { addUserArtifact, updateUserArtifact } from "@Store/userDatabaseSlice";
import { selectUserArts } from "@Store/userDatabaseSlice/selectors";

// Hook
import { useDispatch } from "@Store/hooks";
import { useTranslation } from "@Src/pure-hooks";
import { useStoreSnapshot } from "@Src/features";

// Component
import { Modal, ConfirmModalBody, Button } from "@Src/pure-components";
import { ArtifactLevelSelect, ArtifactSubstatsControl } from "@Src/components";

interface ArtifactInfoProps {
  artifact: CalcArtifact;
  pieceIndex: number;
  onClickRemovePiece: () => void;
  onClickChangePiece: () => void;
}
export function ArtifactInfo({ artifact, pieceIndex, onClickRemovePiece, onClickChangePiece }: ArtifactInfoProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isSaving, setIsSaving] = useState(false);

  const { type, rarity = 5, level, mainStatType } = artifact;
  const availableMainStatTypes = ARTIFACT_MAIN_STATS[type];
  const mainStatValue = availableMainStatTypes[mainStatType]?.[rarity]?.[level] ?? 0;
  const maxLevel = rarity === 5 ? 20 : 16;

  const closeModal = () => {
    setIsSaving(false);
  };

  return (
    <div className="pt-4 px-2 space-y-2" onDoubleClick={() => console.log(artifact)}>
      <div className="pl-2 flex items-start">
        <ArtifactLevelSelect
          mutable
          rarity={rarity}
          level={level}
          maxLevel={rarity === 5 ? 20 : 16}
          onChangeLevel={(level) => {
            dispatch(updateArtifact({ pieceIndex, level }));
          }}
        />

        <div className="ml-4">
          {type === "flower" || type === "plume" ? (
            <p className="pl-6 py-1 text-lg">{t(mainStatType)}</p>
          ) : (
            <div className="py-1 relative">
              <FaChevronDown className="absolute top-1/2 -translate-y-1/2 left-0" />
              <select
                className="pl-6 text-lg text-light-400 appearance-none relative z-10"
                value={mainStatType}
                onChange={(e) =>
                  dispatch(
                    updateArtifact({
                      pieceIndex,
                      mainStatType: e.target.value as AttributeStat,
                    })
                  )
                }
              >
                {Object.keys(availableMainStatTypes).map((type) => (
                  <option key={type} value={type}>
                    {t(type)}
                  </option>
                ))}
              </select>
            </div>
          )}
          <p className={`pl-6 text-2xl leading-7 text-rarity-${rarity} font-bold`}>
            {mainStatValue + percentSign(mainStatType)}
          </p>
        </div>
      </div>

      <ArtifactSubstatsControl
        key={artifact.ID}
        mutable
        rarity={rarity}
        mainStatType={mainStatType}
        subStats={artifact.subStats}
        onChangeSubStat={(subStatIndex, changeInfo) => {
          dispatch(
            updateArtifact({
              pieceIndex,
              subStat: {
                index: subStatIndex,
                newInfo: changeInfo,
              },
            })
          );
        }}
      />

      <div className="pt-4 pb-1 flex justify-evenly items-center">
        <Button
          icon={<FaTrashAlt />}
          onClick={() => {
            dispatch(changeArtifact({ pieceIndex, newPiece: null }));
            onClickRemovePiece();
          }}
        />

        <Button icon={<FaSave />} onClick={() => setIsSaving(true)} />

        <Button icon={<FaSyncAlt />} onClick={onClickChangePiece} />
      </div>

      <Modal.Core active={isSaving} preset="small" onClose={closeModal}>
        <ConfirmSaving artifact={artifact} onClose={closeModal} />
      </Modal.Core>
    </div>
  );
}

interface ConfirmSavingProps {
  artifact: CalcArtifact;
  onClose: () => void;
}
function ConfirmSaving({ artifact, onClose }: ConfirmSavingProps) {
  const dispatch = useDispatch();
  const state = useRef<"SUCCESS" | "PENDING" | "EXCEED_MAX" | "">("");

  const userArtifacts = useStoreSnapshot(selectUserArts);
  const existedArtifact = findById(userArtifacts, artifact.ID);

  if (state.current === "") {
    if (userArtifacts.length + 1 > MAX_USER_ARTIFACTS) {
      state.current = "EXCEED_MAX";
    } else if (existedArtifact) {
      state.current = "PENDING";
    } else {
      dispatch(addUserArtifact(calcItemToUserItem(artifact)));
      state.current = "SUCCESS";
    }
  }

  switch (state.current) {
    case "SUCCESS":
    case "EXCEED_MAX":
      return (
        <ConfirmModalBody
          message={
            state.current === "SUCCESS"
              ? "Successfully saved to My Artifacts."
              : "You're having to many Artifacts. Please remove some of them first."
          }
          focusConfirm
          showCancel={false}
          onConfirm={onClose}
        />
      );
    case "PENDING":
      const inform = (
        <>
          This artifact is already saved
          {existedArtifact?.owner ? (
            <>
              , and currently used by <b>{existedArtifact.owner}</b>
            </>
          ) : null}
          .
        </>
      );
      const noChange = existedArtifact
        ? isEqual(artifact, {
            ...userItemToCalcItem(existedArtifact),
            ID: artifact.ID,
          })
        : false;

      const addNew = () => {
        dispatch(addUserArtifact(calcItemToUserItem(artifact, { ID: Date.now() })));
        onClose();
      };

      if (noChange) {
        return (
          <ConfirmModalBody
            message={<>{inform} Nothing has changed.</>}
            showCancel={false}
            focusConfirm
            moreActions={[
              {
                text: "Duplicate",
                onClick: addNew,
              },
            ]}
            onConfirm={onClose}
          />
        );
      }

      const overwrite = () => {
        dispatch(updateUserArtifact(calcItemToUserItem(artifact)));
        onClose();
      };

      return (
        <ConfirmModalBody
          message={<>{inform} Their stats are different. Do you want to overwrite?</>}
          moreActions={[
            {
              text: "Add new",
              onClick: addNew,
            },
          ]}
          confirmText="Overwrite"
          onConfirm={overwrite}
          onCancel={onClose}
        />
      );
    default:
      return null;
  }
}
