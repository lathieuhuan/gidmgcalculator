import { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import { FaSave, FaSyncAlt, FaTrashAlt, FaChevronDown } from "react-icons/fa";
import type { CalcArtifact, ArtifactMainStatType } from "@Src/types";

// Constant
import { ARTIFACT_MAIN_STATS } from "@Data/artifacts/constants";

// Action
import { changeArtifact, updateArtifact } from "@Store/calculatorSlice";
import { addUserArtifact, overwriteArtifact } from "@Store/userDatabaseSlice";

// Util
import { findById, percentSign } from "@Src/utils";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useTranslation } from "@Src/hooks";

// Component
import { IconButton } from "@Components/atoms";
import { ArtifactSubstats, ConfirmModalBody, Modal } from "@Components/molecules";

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
        {/*  */}
        <div className="mb-2 rounded-circle bg-darkblue-3">
          <select
            className={`px-2 pt-2 pb-1 text-lg leading-snug text-rarity-${rarity} font-bold cursor-pointer appearance-none`}
            value={level}
            onChange={(e) => {
              dispatch(
                updateArtifact({
                  pieceIndex,
                  level: +e.target.value,
                })
              );
            }}
          >
            {[...Array(rarity === 5 ? 21 : 17)].map((_, lv) => (
              <option key={lv} className="text-base" value={lv}>
                +{lv}
              </option>
            ))}
          </select>
        </div>

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
          mutable={artifact.isNew}
          rarity={rarity}
          mainStatType={mainStatType}
          subStats={artifact.subStats}
          space="mx-4"
          changeSubStat={(subStatIndex, changeInfo) => {
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
          disabled={artifact.level === maxLevel}
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
  const [type, setType] = useState(0);
  const dispatch = useDispatch();

  const existedArtPiece = findById(
    useSelector((state) => state.database.myArts),
    artifact.ID
  );

  useEffect(() => {
    if (existedArtPiece) {
      setType(2);
    } else {
      dispatch(addUserArtifact({ owner: null, ...artifact }));
      setType(1);
    }
  }, []);

  if (type === 0) {
    return null;
  }

  const isSuccess = type === 1;
  let noChange = false;

  if (existedArtPiece) {
    const { owner, ...info } = existedArtPiece;
    noChange = isEqual(artifact, info);
  }

  const extraInfo = existedArtPiece?.owner ? (
    <>
      , currently used by <b>{existedArtPiece.owner}</b>
    </>
  ) : null;

  const message = isSuccess ? (
    <>Successfully saved to My Artifacts.</>
  ) : (
    <>
      This one is already in My Artifacts{extraInfo}.{" "}
      {noChange ? "Nothing has changed." : "Do you want to overwrite its Stats?"}
    </>
  );

  return (
    <ConfirmModalBody
      message={message}
      buttons={[
        {
          text: isSuccess ? "Close" : "Cancel",
        },
        !isSuccess && {
          text: "Duplicate",
          onClick: () => {
            dispatch(addUserArtifact({ owner: null, ...artifact, ID: Date.now() }));
          },
        },
        {
          onClick: () => {
            if (!isSuccess && !noChange) {
              dispatch(overwriteArtifact(artifact));
            }
          },
        },
      ]}
      onClose={onClose}
    />
  );
}