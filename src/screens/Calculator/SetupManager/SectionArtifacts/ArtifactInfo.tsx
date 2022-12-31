import { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import { FaSave, FaSyncAlt, FaTrashAlt, FaChevronDown } from "react-icons/fa";
import type { CalcArtifact, ArtifactMainStatType } from "@Src/types";

// Constant
import { ARTIFACT_MAIN_STATS } from "@Data/artifacts/constants";

// Action
import { changeArtifact, updateArtifact } from "@Store/calculatorSlice";
import { addUserArtifact, updateUserArtifact } from "@Store/userDatabaseSlice";

// Util
import { calcItemToUserItem, findById, percentSign, userItemToCalcItem } from "@Src/utils";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useTranslation } from "@Src/hooks";

// Component
import { IconButton, ArtifactLevelSelect } from "@Components/atoms";
import { ConfirmModalBody, Modal, ArtifactSubstats } from "@Components/molecules";

interface ArtifactInfoProps {
  artifact: CalcArtifact;
  pieceIndex: number;
  onClickRemovePiece: () => void;
  onClickChangePiece: () => void;
}
export function ArtifactInfo({
  artifact,
  pieceIndex,
  onClickRemovePiece,
  onClickChangePiece,
}: ArtifactInfoProps) {
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
                className="pl-8 text-lg text-default appearance-none"
                value={mainStatType}
                onChange={(e) =>
                  dispatch(
                    updateArtifact({
                      pieceIndex,
                      mainStatType: e.target.value as ArtifactMainStatType,
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
        <ArtifactSubstats
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

      <div className="pt-4 pb-1 flex justify-evenly align-center">
        <IconButton
          variant="negative"
          onClick={() => {
            dispatch(changeArtifact({ pieceIndex, newPiece: null }));
            onClickRemovePiece();
          }}
        >
          <FaTrashAlt />
        </IconButton>

        <IconButton variant="neutral" onClick={() => setIsSaving(true)}>
          <FaSave />
        </IconButton>

        <IconButton
          className="font-bold"
          disabled={level === maxLevel}
          variant="neutral"
          onClick={() => dispatch(updateArtifact({ pieceIndex, level: maxLevel }))}
        >
          {maxLevel}
        </IconButton>

        <IconButton className="text-xl" variant="positive" onClick={onClickChangePiece}>
          <FaSyncAlt />
        </IconButton>
      </div>

      <Modal active={isSaving} className="small-modal" onClose={() => setIsSaving(false)}>
        <ConfirmSaving
          artifact={artifact}
          pieceIndex={pieceIndex}
          onClose={() => setIsSaving(false)}
        />
      </Modal>
    </div>
  );
}

interface ConfirmSavingProps {
  artifact: CalcArtifact;
  pieceIndex: number;
  onClose: () => void;
}
function ConfirmSaving({ artifact, pieceIndex, onClose }: ConfirmSavingProps) {
  const dispatch = useDispatch();
  const [state, setState] = useState<"SUCCESS" | "PENDING" | "">("");

  const existedArtifact = findById(
    useSelector((state) => state.database.userArts),
    artifact.ID
  );

  useEffect(() => {
    if (existedArtifact) {
      setState("PENDING");
    } else {
      dispatch(addUserArtifact(calcItemToUserItem(artifact)));
      setState("SUCCESS");
    }
  }, []);

  if (state === "") {
    return null;
  }

  const noChange = existedArtifact
    ? isEqual(artifact, {
        ...userItemToCalcItem(existedArtifact),
        ID: artifact.ID,
      })
    : false;

  const extraInfo = existedArtifact?.owner ? (
    <>
      , and currently used by <b>{existedArtifact.owner}</b>
    </>
  ) : null;

  const message =
    state === "SUCCESS" ? (
      "Successfully saved to My Artifacts."
    ) : (
      <>
        This artifact is already saved{extraInfo}.{" "}
        {noChange ? "Nothing has changed." : "Their stats are different. Do you want to overwrite?"}
      </>
    );

  return (
    <ConfirmModalBody
      message={message}
      buttons={[
        {
          text: state === "SUCCESS" ? "Close" : "Cancel",
        },
        state !== "SUCCESS" && {
          text: "Duplicate",
          onClick: () => {
            dispatch(addUserArtifact(calcItemToUserItem(artifact, { ID: Date.now() })));
          },
        },
        {
          onClick: () => {
            if (state !== "SUCCESS" && !noChange) {
              dispatch(updateUserArtifact(calcItemToUserItem(artifact)));
            }
          },
        },
      ]}
      onClose={onClose}
    />
  );
}
