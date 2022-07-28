import { useState } from "react";
import { FaSave, FaSyncAlt, FaTrashAlt } from "react-icons/fa";

import {
  changeArtPieceMainStatType,
  enhanceArtPiece,
  updateArtPiece,
} from "@Store/calculatorSlice";
import { useDispatch } from "@Store/hooks";

import type { CalcArtPiece, CalcArtPieceMainStat } from "@Src/types";
import { ARTIFACT_MAIN_STATS } from "@Data/artifacts/constants";
import { percentSign } from "@Src/utils";

import { IconButton, Select } from "@Src/styled-components";

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
        <div className="mb-2 rounded-full bg-darkblue-3">
          <Select
            className={`px-2 pt-2 pb-1 text-lg text-rarity-${rarity} font-bold cursor-pointer appearance-none`}
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
              <option key={lv}>+{lv}</option>
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
        {/* <ArtSubstats
            mutable={true}
            substats={artP.subS}
            changeSSType={(type, ssIndex) =>
              dispatch(CHANGE_ART_SS_TYPE({ pieceIndex, ssIndex, type }))
            }
            changeSSVal={(value, ssIndex) =>
              dispatch(CHANGE_ART_SS_VAL({ pieceIndex, ssIndex, value }))
            }
            msType={mainSType}
            rarity={rarity}
          /> */}
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
        <IconButton className="glow-on-hover" variant="neutral" onClick={() => setSaving(true)}>
          <FaSave />
        </IconButton>
        <IconButton
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
      {/* {saving && <SavingDialog artP={artP} close={() => setSaving(false)} />} */}
    </div>
  );
}
