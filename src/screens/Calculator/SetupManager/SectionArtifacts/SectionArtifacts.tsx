import clsx from "clsx";
import { useState, useLayoutEffect } from "react";
import { MdInventory } from "react-icons/md";
import { GiAnvil } from "react-icons/gi";

import { ARTIFACT_TYPES, ARTIFACT_TYPE_ICONS } from "@Src/constants";
import { $AppData, $AppSettings } from "@Src/services";
import { getImgSrc, userItemToCalcItem } from "@Src/utils";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { changeArtifact } from "@Store/calculatorSlice";
import { selectArtifacts } from "@Store/calculatorSlice/selectors";
import { pickEquippedArtSet } from "@Store/thunks";

// Component
import { Button, CollapseSpace, Modal } from "@Src/pure-components";
import { ArtifactForge, ArtifactForgeProps, ArtifactInventory, ArtifactInventoryProps, Tavern } from "@Src/components";
import { ArtifactInfo, ArtifactSourceType } from "./ArtifactInfo";
import { CopySelect } from "./CopySelect";

import styles from "../styles.module.scss";

type ModalType = "EQUIPPED_SET" | "TAVERN" | "";

type InventoryState = Pick<ArtifactInventoryProps, "forcedType" | "initialTypes"> & {
  active: boolean;
};

type ForgeState = Pick<ArtifactForgeProps, "forcedType" | "initialTypes"> & {
  active: boolean;
};

export default function SectionArtifacts() {
  const dispatch = useDispatch();

  const artifacts = useSelector(selectArtifacts);

  const [selectingSrcType, setSelectingSrcType] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("");
  const [activeTabIndex, setActiveTabIndex] = useState(-1);
  const [targetIndex, setTargetIndex] = useState(-1);

  const [inventory, setInventory] = useState<InventoryState>({
    active: false,
    // artifactType: "flower",
  });
  const [forge, setForge] = useState<ForgeState>({
    active: false,
    forcedType: undefined,
    initialTypes: undefined,
  });

  const activeArtifact = artifacts[activeTabIndex];

  const closeModal = () => setModalType("");

  useLayoutEffect(() => {
    if (activeTabIndex >= 0) {
      setTimeout(() => {
        document.querySelector("#calculator-section-artifacts")?.scrollIntoView();
      }, 200);
    }
  }, [activeTabIndex]);

  const onClickTab = (tabIndex: number) => {
    // there's already an artifact at tabIndex (or activeArtifact !== null after this excution)
    if (artifacts[tabIndex]) {
      // if click on the activeTab close it, otherwise change tab
      setActiveTabIndex(tabIndex === activeTabIndex ? -1 : tabIndex);
    } else {
      setSelectingSrcType(true);

      /** reserve type for onClickSourceTye */

      setForge({
        active: false,
        forcedType: ARTIFACT_TYPES[tabIndex],
      });

      setInventory({
        active: false,
        forcedType: ARTIFACT_TYPES[tabIndex],
      });
    }
  };

  const onClickSourceTye = (source: ArtifactSourceType) => {
    switch (source) {
      case "INVENTORY":
        setInventory({
          active: true,
          forcedType: inventory.forcedType,
        });
        break;
      case "FORGE":
        setForge({
          active: true,
          forcedType: forge.forcedType,
        });
        break;
    }

    setSelectingSrcType(false);
  };

  const onRequestChangePiece = (source: ArtifactSourceType, index?: number) => {
    switch (source) {
      case "FORGE":
        const newForge: ForgeState = {
          active: true,
        };
        const key: "forcedType" | "initialTypes" = typeof index === "number" ? "forcedType" : "initialTypes";

        newForge[key] = ARTIFACT_TYPES[index ?? 0];
        setForge(newForge);
        break;
    }
  };

  const onClickRemovePiece = () => {
    setActiveTabIndex(-1);
  };

  return (
    <div id="calculator-section-artifacts" className={"py-3 bg-dark-900 " + styles.section}>
      {artifacts.length && artifacts.every((artifact) => artifact === null) ? <CopySelect /> : null}

      <div className="flex">
        {ARTIFACT_TYPES.map((type, index) => {
          const artifact = artifacts[index];
          const icon = artifact
            ? $AppData.getArtifact({ code: artifact.code, type })?.icon || ""
            : ARTIFACT_TYPE_ICONS.find((item) => item.type === type)?.icon;

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
            onClickRemovePiece={onClickRemovePiece}
            onClickChangePiece={(source) => {
              if (source === "FORGE") {
                setForge({
                  active: true,
                  forcedType: ARTIFACT_TYPES[activeTabIndex],
                });
              }
            }}
          />
        )}
      </CollapseSpace>

      {activeTabIndex < 0 ? (
        <div className="mt-4 px-4 flex justify-end gap-4">
          <Button title="Inventory" icon={<MdInventory />} onClick={() => onRequestChangePiece("INVENTORY")} />
          <Button title="New" icon={<GiAnvil />} onClick={() => onRequestChangePiece("FORGE")} />
        </div>
      ) : null}

      <Modal
        active={selectingSrcType}
        preset="small"
        title="Select a Source"
        className="bg-dark-700"
        onClose={() => setSelectingSrcType(false)}
      >
        <div className="flex justify-center gap-4">
          <button
            className="w-24 h-24 rounded bg-dark-900 flex-center flex-col"
            onClick={() => onClickSourceTye("INVENTORY")}
          >
            <span className="mb-2 block h-8 flex-center">
              <MdInventory className="text-2xl" />
            </span>
            <span>Inventory</span>
          </button>

          <button
            className="w-24 h-24 rounded bg-dark-900 flex-center flex-col"
            onClick={() => onClickSourceTye("FORGE")}
          >
            <span className="mb-2 block h-8 flex-center">
              <GiAnvil className="text-3xl" />
            </span>
            <span>New</span>
          </button>
        </div>
      </Modal>

      <ArtifactForge
        {...forge}
        hasConfigStep
        onForgeArtifact={(artifact) => {
          const pieceIndex = ARTIFACT_TYPES.indexOf(artifact.type);

          dispatch(
            changeArtifact({
              pieceIndex,
              newPiece: {
                ...artifact,
                ID: Date.now(),
              },
              shouldKeepStats: $AppSettings.get("doKeepArtStatsOnSwitch"),
            })
          );
          setActiveTabIndex(pieceIndex);
        }}
        onClose={() => setForge({ active: false })}
      />

      <ArtifactInventory
        {...inventory}
        currentArtifacts={artifacts}
        buttonText="Select"
        onClickButton={(artifact) => {
          dispatch(
            changeArtifact({
              pieceIndex: targetIndex,
              newPiece: userItemToCalcItem(artifact),
            })
          );
        }}
        onClose={() => setInventory({ active: false })}
      />

      <Tavern
        active={modalType === "TAVERN"}
        sourceType="user"
        onSelectCharacter={(character) => {
          if (character.artifactIDs) {
            dispatch(pickEquippedArtSet(character.artifactIDs));
          }
        }}
        onClose={closeModal}
      />
    </div>
  );
}
