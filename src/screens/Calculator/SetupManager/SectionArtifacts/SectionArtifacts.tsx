import clsx from "clsx";
import { useState, useEffect } from "react";

import { ARTIFACT_TYPES, ARTIFACT_TYPE_IMAGES } from "@Src/constants";
import { $AppData, $AppSettings } from "@Src/services";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { changeArtifact } from "@Store/calculatorSlice";
import { selectArtifacts } from "@Store/calculatorSlice/selectors";

// Util
import { getImgSrc } from "@Src/utils";

// Component
import { PickerArtifact } from "@Src/components";
import { CollapseSpace } from "@Src/pure-components";
import { ArtifactInfo } from "./ArtifactInfo";
import { CopySelect } from "./CopySelect";

export default function SectionArtifacts() {
  const dispatch = useDispatch();

  const artifacts = useSelector(selectArtifacts);

  const [activeTabIndex, setActiveTabIndex] = useState(-1);
  const [artifactPicker, setArtifactPicker] = useState({
    active: false,
    slot: 0,
  });

  const activeArtifact = artifacts[activeTabIndex];

  useEffect(() => {
    if (activeTabIndex >= 0) {
      setTimeout(() => {
        document.querySelector("#calculator-artifacts")?.scrollIntoView();
      }, 200);
    }
  }, [activeTabIndex]);

  const onClickTab = (tabIndex: number) => {
    // there's already an artifact at tabIndex (or artifact !== null after this excution)
    if (artifacts[tabIndex]) {
      // if click on the activeTab close it, otherwise change tab
      setActiveTabIndex(tabIndex === activeTabIndex ? -1 : tabIndex);
    } else {
      setArtifactPicker({
        active: true,
        slot: tabIndex,
      });
    }
  };

  return (
    <div id="calculator-artifacts" className="py-3 border-2 border-lesser rounded-xl bg-dark-900">
      {artifacts.length && artifacts.every((artifact) => artifact === null) ? <CopySelect /> : null}

      <div className="flex">
        {ARTIFACT_TYPES.map((type, index) => {
          const artifact = artifacts[index];
          const icon = artifact
            ? $AppData.getArtifactData({ code: artifact.code, type })?.icon || ""
            : ARTIFACT_TYPE_IMAGES.find((item) => item.type === type)?.src;

          return (
            <div
              key={index}
              className={clsx(
                "w-1/5",
                index === activeTabIndex ? "border-2 border-light-400" : "border border-transparent"
              )}
            >
              <div
                className={clsx(
                  `h-full bg-gradient-${artifact ? artifact.rarity || 5 : 1} cursor-pointer`,
                  !artifact && "p-2 opacity-80"
                )}
                onClick={() => onClickTab(index)}
              >
                <img src={getImgSrc(icon)} alt={type} draggable={false} />
              </div>
            </div>
          );
        })}
      </div>

      <CollapseSpace active={activeTabIndex !== -1}>
        {activeArtifact && (
          <ArtifactInfo
            artifact={activeArtifact}
            pieceIndex={activeTabIndex}
            onClickRemovePiece={() => setActiveTabIndex(-1)}
            onClickChangePiece={() => {
              setArtifactPicker({
                active: true,
                slot: activeTabIndex,
              });
            }}
          />
        )}
      </CollapseSpace>

      <PickerArtifact
        active={artifactPicker.active}
        artifactType={ARTIFACT_TYPES[artifactPicker.slot]}
        onPickArtifact={(item) => {
          dispatch(
            changeArtifact({
              pieceIndex: artifactPicker.slot,
              newPiece: {
                ID: Date.now(),
                ...item,
              },
              shouldKeepStats: $AppSettings.get("doKeepArtStatsOnSwitch"),
            })
          );
          setActiveTabIndex(artifactPicker.slot);
        }}
        onClose={() => setArtifactPicker((prev) => ({ ...prev, active: false }))}
      />
    </div>
  );
}
