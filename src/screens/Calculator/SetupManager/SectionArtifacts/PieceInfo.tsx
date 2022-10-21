import { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import { FaSave, FaSyncAlt, FaTrashAlt, FaChevronDown } from "react-icons/fa";
import type { CalcArtPiece, ArtPieceMainStat } from "@Src/types";

import { useDispatch, useSelector } from "@Store/hooks";
import { changeArtPiece, updateArtPiece } from "@Store/calculatorSlice";
import { addArtifact, overwriteArtifact } from "@Store/usersDatabaseSlice";

import { findById, percentSign } from "@Src/utils";
import { useTranslation } from "@Hooks/useTranslation";
import { ARTIFACT_MAIN_STATS } from "@Data/artifacts/constants";

import { IconButton, Select } from "@Src/styled-components";
import { ArtifactSubstats } from "@Components/ArtifactCard";
import { Modal } from "@Components/modals";
import { ConfirmTemplate } from "@Components/minors";

interface PieceInfoProps {
  pieceInfo: CalcArtPiece;
  pieceIndex: number;
  onClickRemovePiece: () => void;
  onClickChangePiece: () => void;
}
export default function PieceInfo({
  pieceInfo,
  pieceIndex,
  onClickRemovePiece,
  onClickChangePiece,
}: PieceInfoProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [saving, setSaving] = useState(false);

  const { type, rarity = 5, level, mainStatType } = pieceInfo;
  const availableMainStatTypes = ARTIFACT_MAIN_STATS[type];
  const mainStatValues = availableMainStatTypes[mainStatType]![rarity];
  const maxLevel = rarity === 5 ? 20 : 16;

  return (
    <div className="pt-6" onDoubleClick={() => console.log(pieceInfo)}>
      <div className="pl-6 flex items-start">
        {/*  */}
        <div className="mb-2 rounded-circle bg-darkblue-3">
          <Select
            className={`px-2 pt-2 pb-1 text-lg leading-snug text-rarity-${rarity} font-bold cursor-pointer appearance-none`}
            value={level}
            onChange={(e) => {
              dispatch(
                updateArtPiece({
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
          </Select>
        </div>

        <div className="ml-4">
          {type === "flower" || type === "plume" ? (
            <p className="pl-8 pt-1 text-h6">{mainStatType}</p>
          ) : (
            <div className="py-1 relative">
              <FaChevronDown className="absolute top-2 left-1 scale-110" />
              <Select
                className="pl-8 text-lg text-default appearance-none"
                value={mainStatType}
                onChange={(e) =>
                  dispatch(
                    updateArtPiece({
                      pieceIndex,
                      mainStatType: e.target.value as ArtPieceMainStat,
                    })
                  )
                }
              >
                {Object.keys(availableMainStatTypes).map((type) => (
                  <option key={type} value={type}>
                    {t(type)}
                  </option>
                ))}
              </Select>
            </div>
          )}
          <p className={`pl-8 text-h3 text-rarity-${rarity} font-bold`}>
            {mainStatValues[level] + percentSign(mainStatType)}
          </p>
        </div>
      </div>

      <div className="px-2 pb-1">
        <ArtifactSubstats
          mutable
          rarity={rarity}
          mainStatType={mainStatType}
          subStats={pieceInfo.subStats}
          changeSubStat={(subStatIndex, changeInfo) => {
            dispatch(
              updateArtPiece({
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
            dispatch(changeArtPiece({ pieceIndex, newPiece: null }));
            onClickRemovePiece();
          }}
        >
          <FaTrashAlt />
        </IconButton>

        <IconButton variant="neutral" onClick={() => setSaving(true)}>
          <FaSave />
        </IconButton>

        <IconButton
          className="font-bold"
          disabled={pieceInfo.level === maxLevel}
          variant="neutral"
          onClick={() => dispatch(updateArtPiece({ pieceIndex, level: maxLevel }))}
        >
          {maxLevel}
        </IconButton>

        <IconButton className="text-xl" variant="positive" onClick={onClickChangePiece}>
          <FaSyncAlt />
        </IconButton>
      </div>

      <Modal active={saving} isCustom className="custom-modal" onClose={() => setSaving(false)}>
        <ConfirmSaving pieceInfo={pieceInfo} onClose={() => setSaving(false)} />
      </Modal>
    </div>
  );
}

interface ConfirmSavingProps {
  pieceInfo: CalcArtPiece;
  onClose: () => void;
}
function ConfirmSaving({ pieceInfo, onClose }: ConfirmSavingProps) {
  const [type, setType] = useState(0);
  const dispatch = useDispatch();

  const existedArtPiece = findById(
    useSelector((state) => state.database.myArts),
    pieceInfo.ID
  );

  useEffect(() => {
    if (existedArtPiece) {
      setType(2);
    } else {
      dispatch(addArtifact({ owner: null, ...pieceInfo }));
      setType(1);
    }
  }, []);

  if (type === 0) {
    return null;
  }

  const successful = type === 1;
  let noChange = false;

  if (existedArtPiece) {
    const { owner, ...info } = existedArtPiece;
    noChange = isEqual(pieceInfo, info);
  }

  const extraInfo = existedArtPiece?.owner ? (
    <>
      , currently used by <b>{existedArtPiece.owner}</b>
    </>
  ) : null;

  const message = successful ? (
    <>Successfully saved to My Artifacts.</>
  ) : (
    <>
      This one is already in My Artifacts{extraInfo}.{" "}
      {noChange ? "Nothing has changed." : "Do you want to overwrite its Stats?"}
    </>
  );

  return (
    <ConfirmTemplate
      message={message}
      left={successful ? { text: "Close" } : undefined}
      mid={
        successful
          ? undefined
          : {
              text: "Duplicate",
              onClick: () => dispatch(addArtifact({ owner: null, ...pieceInfo, ID: Date.now() })),
            }
      }
      right={{
        onClick: () => {
          successful || noChange ? onClose() : dispatch(overwriteArtifact(pieceInfo));
        },
      }}
      onClose={onClose}
    />
  );
}
