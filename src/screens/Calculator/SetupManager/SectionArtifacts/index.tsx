import cn from "classnames";
import { type RefObject, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";

import { copyAllArtifacts, changeArtPiece } from "@Store/calculatorSlice";
import {
  selectCalcSetupsById,
  selectActiveId,
  selectSetupManageInfos,
} from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";
import { findArtifactPiece } from "@Data/controllers";
import { indexById, wikiImg } from "@Src/utils";
import { ARTIFACT_ICONS, ARTIFACT_TYPES } from "@Src/constants";

import { CopySection } from "@Screens/Calculator/components";
import { CollapseSpace } from "@Components/collapse";
import { Picker } from "@Components/Picker";
import PieceInfo from "./PieceInfo";

const selectAllArtInfos = createSelector(
  selectSetupManageInfos,
  selectCalcSetupsById,
  (setupManageInfos, setupsById) => setupManageInfos.map(({ ID }) => setupsById[ID].artInfo)
);

interface SectionArtifactsProps {
  containerRef: RefObject<HTMLDivElement>;
}
export default function SectionArtifacts({ containerRef }: SectionArtifactsProps) {
  const dispatch = useDispatch();

  const activeId = useSelector(selectActiveId);
  const setupManageInfos = useSelector(selectSetupManageInfos);
  const allArtInfos = useSelector(selectAllArtInfos);

  const [activeTabIndex, setActiveTabIndex] = useState(-1);
  const [artifactPicker, setArtifactPicker] = useState({
    active: false,
    slot: 0,
  });

  const activeIndex = indexById(setupManageInfos, activeId);
  const { pieces } = allArtInfos[activeIndex];
  const pieceInfo = pieces[activeTabIndex];

  const scrollContainer = () => {
    setTimeout(() => {
      const container = containerRef?.current;
      if (container) container.scrollTop = 9999;
    }, 200);
  };

  const onClickTab = (tabIndex: number) => {
    // there's already a piece at tabIndex (or pieceInfo !== null after this excution)
    if (pieces[tabIndex]) {
      // if click on the activeTab close it, otherwise change tab
      setActiveTabIndex(tabIndex === activeTabIndex ? -1 : tabIndex);
      scrollContainer();
    } else {
      setArtifactPicker({
        active: true,
        slot: tabIndex,
      });
    }
  };

  const copyOptions = [];
  if (pieces.every((piece) => piece === null)) {
    for (const index in allArtInfos) {
      if (allArtInfos[index].pieces.some((piece) => piece !== null)) {
        copyOptions.push({
          label: setupManageInfos[index].name,
          value: setupManageInfos[index].ID,
        });
      }
    }
  }
  return (
    <div className="setup-manager_pedestal">
      {copyOptions.length ? (
        <CopySection
          options={copyOptions}
          onClickCopy={({ value }) => dispatch(copyAllArtifacts(value))}
        />
      ) : null}

      <div className="flex">
        {ARTIFACT_TYPES.map((type, index) => {
          const artPiece = pieces[index];
          let src;

          if (artPiece) {
            const { beta, icon } = findArtifactPiece({ code: artPiece.code, type });
            src = beta ? icon : wikiImg(icon);
          } else {
            src = wikiImg(ARTIFACT_ICONS[type]);
          }
          return (
            <div
              key={index}
              className={cn(
                "w-1/5",
                index === activeTabIndex ? "border-2 border-white" : "border border-transparent"
              )}
            >
              <div
                className={cn(`bg-gradient-${artPiece ? artPiece.rarity || 5 : 1} cursor-pointer`, {
                  "p-2 opacity-80": !artPiece,
                })}
                onClick={() => onClickTab(index)}
              >
                <img
                  className={cn("full-w", !artPiece && "")}
                  src={src}
                  alt={type}
                  draggable={false}
                />
              </div>
            </div>
          );
        })}
      </div>

      <CollapseSpace active={activeTabIndex !== -1}>
        {pieceInfo && (
          <PieceInfo
            pieceInfo={pieceInfo}
            pieceIndex={activeTabIndex}
            onClickRemovePiece={() => setActiveTabIndex(-1)}
            onClickChangePiece={() =>
              setArtifactPicker({
                active: true,
                slot: activeTabIndex,
              })
            }
          />
        )}
      </CollapseSpace>

      <Picker.Artifact
        active={artifactPicker.active}
        artifactType={ARTIFACT_TYPES[artifactPicker.slot]}
        onPickArtifact={(item) => {
          dispatch(
            changeArtPiece({
              pieceIndex: artifactPicker.slot,
              newPiece: { ID: Date.now(), ...item },
              isFresh: true,
            })
          );
          setActiveTabIndex(artifactPicker.slot);
          scrollContainer();
        }}
        onClose={() => setArtifactPicker((prev) => ({ ...prev, active: false }))}
      />
    </div>
  );
}
