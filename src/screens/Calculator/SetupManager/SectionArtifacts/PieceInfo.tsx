import { useEffect, useState } from "react";
import { FaSave, FaSyncAlt, FaTrashAlt } from "react-icons/fa";

import {
  changeArtPieceMainStatType,
  changeArtPieceSubStat,
  enhanceArtPiece,
  updateArtPiece,
} from "@Store/calculatorSlice";
import { addArtifact, overwriteArtifact } from "@Store/usersDatabaseSlice";
import { useDispatch, useSelector } from "@Store/hooks";

import type { CalcArtPiece, CalcArtPieceMainStat } from "@Src/types";
import { ARTIFACT_MAIN_STATS } from "@Data/artifacts/constants";
import { findById, isOne, percentSign } from "@Src/utils";

import { IconButton, Select } from "@Src/styled-components";
import { ArtifactSubstats } from "@Components/ArtifactCard";
import { ConfirmModal, Modal } from "@Components/modals";

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
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();

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
            value={"+" + level}
            onChange={(e) =>
              dispatch(
                enhanceArtPiece({
                  pieceIndex,
                  level: +e.target.value.slice(1),
                })
              )
            }
          >
            {[...Array(rarity === 5 ? 21 : 17)].map((_, lv) => (
              <option key={lv} className="text-base">
                +{lv}
              </option>
            ))}
          </Select>
        </div>

        <div className="ml-4">
          {["flower", "plume"].includes(type) ? (
            <p className="pl-8 pt-1 text-h6">{mainStatType}</p>
          ) : (
            <div className="py-1">
              <Select
                className="pl-8 text-lg text-white appearance-none"
                value={mainStatType}
                onChange={(e) =>
                  dispatch(
                    changeArtPieceMainStatType({
                      pieceIndex,
                      type: e.target.value as CalcArtPieceMainStat,
                    })
                  )
                }
              >
                {Object.keys(availableMainStatTypes).map((type) => (
                  <option key={type}>{type}</option>
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
          mutable={true}
          rarity={rarity}
          mainStatType={mainStatType}
          subStats={pieceInfo.subStats}
          changeSubStat={(subStatIndex, changeInfo) => {
            dispatch(changeArtPieceSubStat({ pieceIndex, subStatIndex, ...changeInfo }));
          }}
        />
      </div>

      <div className="mt-4 flex justify-evenly align-center">
        <IconButton
          variant="negative"
          onClick={() => {
            dispatch(updateArtPiece({ pieceIndex, newPiece: null }));
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
          onClick={() => dispatch(enhanceArtPiece({ pieceIndex, level: maxLevel }))}
        >
          {maxLevel}
        </IconButton>

        <IconButton className="text-xl" variant="positive" onClick={onClickChangePiece}>
          <FaSyncAlt />
        </IconButton>
      </div>

      {saving && <SavingModal pieceInfo={pieceInfo} onClose={() => setSaving(false)} />}
    </div>
  );
}

interface SavingModalProps {
  pieceInfo: CalcArtPiece;
  onClose: () => void;
}
function SavingModal({ pieceInfo, onClose }: SavingModalProps) {
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

  if (type === 0) return <Modal onClose={() => {}} />;

  const successful = type === 1;
  let noChange = false;

  if (existedArtPiece) {
    const { owner, ...info } = existedArtPiece;
    noChange = isOne(pieceInfo, info);
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
    <ConfirmModal
      message={message}
      left={successful ? { text: "Close" } : undefined}
      mid={
        !successful
          ? {
              text: "Duplicate",
              onClick: () => dispatch(addArtifact({ owner: null, ...pieceInfo, ID: Date.now() })),
            }
          : undefined
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
