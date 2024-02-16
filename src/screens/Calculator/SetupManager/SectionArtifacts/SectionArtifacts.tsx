import clsx from "clsx";
import { useState, useLayoutEffect } from "react";
import { MdInventory } from "react-icons/md";
import { GiAnvil } from "react-icons/gi";

import { ArtifactType } from "@Src/types";
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
import { ArtifactForge, ArtifactInventory, ArtifactInventoryProps, Tavern } from "@Src/components";
import { ArtifactInfo, ArtifactSourceType } from "./ArtifactInfo";
import { CopySelect } from "./CopySelect";

import styles from "../styles.module.scss";

type ModalType = "EQUIPPED_SET" | "TAVERN" | "";

type InventoryState = {
  active: boolean;
  initialType?: ArtifactType;
};

type ForgeState = {
  active: boolean;
  initialType?: ArtifactType;
};

export default function SectionArtifacts() {
  const dispatch = useDispatch();

  const artifacts = useSelector(selectArtifacts);

  const [selectingSrcType, setSelectingSrcType] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("");
  const [activeTabIndex, setActiveTabIndex] = useState(-1);

  const [inventory, setInventory] = useState<InventoryState>({
    active: false,
  });
  const [forge, setForge] = useState<ForgeState>({
    active: false,
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
        initialType: ARTIFACT_TYPES[tabIndex],
      });

      setInventory({
        active: false,
        initialType: ARTIFACT_TYPES[tabIndex],
      });
    }
  };

  const onClickSourceTye = (source: ArtifactSourceType) => {
    switch (source) {
      case "INVENTORY":
        setInventory({
          active: true,
          initialType: inventory.initialType,
        });
        break;
      case "FORGE":
        setForge({
          active: true,
          initialType: forge.initialType,
        });
        break;
    }

    setSelectingSrcType(false);
  };

  const onRequestChangePiece = (source: ArtifactSourceType, index?: number) => {
    switch (source) {
      case "INVENTORY":
        setInventory({
          active: true,
          initialType: ARTIFACT_TYPES[index ?? 0],
        });
        break;
      case "FORGE":
        setForge({
          active: true,
          initialType: ARTIFACT_TYPES[index ?? 0],
        });
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
              onRequestChangePiece(source, activeTabIndex);
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
        title="Select a source"
        className="bg-dark-700"
        onClose={() => setSelectingSrcType(false)}
      >
        <div className="flex justify-center gap-4">
          <button className="group" onClick={() => onClickSourceTye("INVENTORY")}>
            <p className="w-24 h-24 rounded bg-dark-900 font-bold flex-center flex-col opacity-90 group-hover:opacity-100">
              <span className="mb-2 block h-8 flex-center">
                <MdInventory className="text-2xl" />
              </span>
              <span>Inventory</span>
            </p>
          </button>

          <button className="group" onClick={() => onClickSourceTye("FORGE")}>
            <p className="w-24 h-24 rounded bg-dark-900 font-bold flex-center flex-col opacity-90 group-hover:opacity-100">
              <span className="mb-2 block h-8 flex-center">
                <GiAnvil className="text-3xl" />
              </span>
              <span>New</span>
            </p>
          </button>
        </div>
      </Modal>

      <ArtifactForge
        active={forge.active}
        initialTypes={forge.initialType}
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
        showTypeFilter
        currentArtifacts={artifacts}
        buttonText="Select"
        onClickButton={(artifact) => {
          dispatch(
            changeArtifact({
              pieceIndex: ARTIFACT_TYPES.indexOf(artifact.type),
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
