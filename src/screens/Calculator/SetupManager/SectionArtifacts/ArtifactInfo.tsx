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
import { useDispatch, useSelector } from "@Store/hooks";
import { useTranslation } from "@Src/pure-hooks";

// Component
import { Modal, ConfirmModalBody, Button, ButtonGroupItem } from "@Src/pure-components";
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
  const mainStatValues = availableMainStatTypes[mainStatType]![rarity];
  const maxLevel = rarity === 5 ? 20 : 16;

  return (
    <div className="pt-4" onDoubleClick={() => console.log(artifact)}>
      <div className="pl-6 flex items-start">
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
            <p className="pl-8 py-1 text-lg">{t(mainStatType)}</p>
          ) : (
            <div className="py-1 relative">
              <FaChevronDown className="absolute top-2 left-1 scale-110" />
              <select
                className="pl-8 text-lg text-light-400 appearance-none"
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
          <p className={`pl-8 text-2xl leading-7 text-rarity-${rarity} font-bold`}>
            {mainStatValues[level] + percentSign(mainStatType)}
          </p>
        </div>
      </div>

      <div className="px-2 pb-1">
        <ArtifactSubstatsControl
          key={artifact.ID}
          mutable
          rarity={rarity}
          mainStatType={mainStatType}
          subStats={artifact.subStats}
          space="mx-4"
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
      </div>

      <div className="pt-4 pb-1 flex justify-evenly items-center">
        <Button
          variant="negative"
          icon={<FaTrashAlt />}
          onClick={() => {
            dispatch(changeArtifact({ pieceIndex, newPiece: null }));
            onClickRemovePiece();
          }}
        />

        <Button variant="neutral" icon={<FaSave />} onClick={() => setIsSaving(true)} />

        <Button
          className="w-8 h-8"
          disabled={level === maxLevel}
          variant="neutral"
          onClick={() => dispatch(updateArtifact({ pieceIndex, level: maxLevel }))}
        >
          {maxLevel}
        </Button>

        <Button variant="positive" icon={<FaSyncAlt />} onClick={onClickChangePiece} />
      </div>

      <Modal active={isSaving} preset="small" withCloseButton={false} onClose={() => setIsSaving(false)}>
        <ConfirmSaving artifact={artifact} onClose={() => setIsSaving(false)} />
      </Modal>
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

  const userArtifacts = useSelector(selectUserArts);
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
          onlyConfirm
          onClose={onClose}
        />
      );
    case "PENDING":
      const ownerInfo = existedArtifact?.owner ? (
        <>
          , and currently used by <b>{existedArtifact.owner}</b>
        </>
      ) : null;

      const noChange = existedArtifact
        ? isEqual(artifact, {
            ...userItemToCalcItem(existedArtifact),
            ID: artifact.ID,
          })
        : false;

      const buttons: ButtonGroupItem[] = [
        { text: "Cancel" },
        {
          text: "Duplicate",
          onClick: () => {
            dispatch(addUserArtifact(calcItemToUserItem(artifact, { ID: Date.now() })));
          },
        },
      ];

      if (!noChange) {
        buttons.push({
          text: "Overwrite",
          variant: "positive",
          onClick: () => dispatch(updateUserArtifact(calcItemToUserItem(artifact))),
        });
      }

      return (
        <ConfirmModalBody
          message={
            <>
              This artifact is already saved{ownerInfo}.{" "}
              {noChange ? "Nothing has changed." : "Their stats are different. Do you want to overwrite?"}
            </>
          }
          buttons={buttons}
          onClose={onClose}
        />
      );
    default:
      return null;
  }
}
