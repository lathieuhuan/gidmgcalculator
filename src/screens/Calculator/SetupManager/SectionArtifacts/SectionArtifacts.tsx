import clsx from "clsx";
import { useState, useLayoutEffect } from "react";
import { MdInventory } from "react-icons/md";
import { GiAnvil } from "react-icons/gi";
import { FaToolbox } from "react-icons/fa";

import type { Artifact, ArtifactType, CalcArtifact } from "@Src/types";
import { ARTIFACT_TYPES, ARTIFACT_TYPE_ICONS } from "@Src/constants";
import { $AppData, $AppSettings } from "@Src/services";

// Util
import { userItemToCalcItem } from "@Src/utils";
import { notification } from "@Src/utils/notification";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { changeArtifact } from "@Store/calculatorSlice";
import { selectArtifacts } from "@Store/calculatorSlice/selectors";

// Component
import { Button, CollapseSpace, Image, Modal } from "@Src/pure-components";
import {
  ArtifactForge,
  ArtifactForgeProps,
  ArtifactInventory,
  ArtifactInventoryProps,
  LoadoutStash,
} from "@Src/components";
import { ArtifactInfo, ArtifactSourceType } from "./ArtifactInfo";
import { CopySelect } from "./CopySelect";

import styles from "../styles.module.scss";

type ModalType = "ARTIFACT_LOADOUT" | "";

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

      /** reserve type for onSelectArtifactSourceType */

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

  // Precedent event: click tab without artifact => ask select source type
  const onSelectArtifactSourceType = (source: ArtifactSourceType) => {
    switch (source) {
      case "LOADOUT":
        onRequestSelectArtifactLoadout();
        break;
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

  const replaceArtifact = (type: ArtifactType, newPiece: Artifact, shouldKeepStats = false) => {
    const pieceIndex = ARTIFACT_TYPES.indexOf(type);

    dispatch(changeArtifact({ pieceIndex, newPiece, shouldKeepStats }));
    setActiveTabIndex(pieceIndex);
  };

  // ===== CHANGE ARTIFACTS WITH LOADOUTS =====

  const onRequestSelectArtifactLoadout = () => {
    setModalType("ARTIFACT_LOADOUT");
  };

  const onSelectLoadout = (artifacts: CalcArtifact[]) => {
    for (const artifact of artifacts) {
      dispatch(
        changeArtifact({
          pieceIndex: ARTIFACT_TYPES.indexOf(artifact.type),
          newPiece: artifact,
        })
      );
    }
    closeModal();
  };

  // ===== CHANGE ARTIFACT(S) WITH INVENTORY =====

  const onRequestSelectInventoryArtifact = () => {
    setInventory({
      active: true,
      initialType: "flower",
    });
  };

  const onSelectInventoryArtifact: ArtifactInventoryProps["onClickButton"] = (artifact) => {
    replaceArtifact(artifact.type, userItemToCalcItem(artifact));

    const artifactSet = $AppData.getArtifactSet(artifact.code);

    if (artifactSet) {
      notification.destroy("all");
      notification.success({
        content: `Selected ${artifactSet.name} (${artifact.type})`,
      });
    }
  };

  // ===== CHANGE ARTIFACT(S) WITH FORGE =====

  const onRequestForgeArtifact = () => {
    setForge({
      active: true,
      initialType: "flower",
    });
  };

  const onForgeArtifact: ArtifactForgeProps["onForgeArtifact"] = (artifact) => {
    const newPiece = {
      ...artifact,
      ID: Date.now(),
    };
    const artifactSet = $AppData.getArtifactSet(artifact.code);

    replaceArtifact(artifact.type, newPiece, $AppSettings.get("doKeepArtStatsOnSwitch"));

    if (artifactSet) {
      notification.destroy("all");
      notification.success({
        content: `Forged ${artifactSet.name} (${artifact.type})`,
      });
    }
  };

  // ===== ACTIONS TOWARDS ACTIVE ARTIFACT =====

  const onRequestChangeActiveArtifact = (source: ArtifactSourceType) => {
    const newState = {
      active: true,
      initialType: ARTIFACT_TYPES[activeTabIndex],
    };
    switch (source) {
      case "LOADOUT":
        onRequestSelectArtifactLoadout();
        break;
      case "INVENTORY":
        setInventory(newState);
        break;
      case "FORGE":
        setForge(newState);
        break;
    }
  };

  const onRemoveArtifact = () => {
    setActiveTabIndex(-1);
  };

  const renderSourceOption = (label: string, value: ArtifactSourceType, icon: JSX.Element) => {
    return (
      <button className="group" onClick={() => onSelectArtifactSourceType(value)}>
        <p className="w-24 h-24 rounded bg-dark-900 font-bold flex-center flex-col opacity-90 group-hover:opacity-100">
          <span className="mb-2 block h-8 flex-center">{icon}</span>
          <span>{label}</span>
        </p>
      </button>
    );
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
                <Image src={icon} imgType="artifact" />
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
            onRequestChange={onRequestChangeActiveArtifact}
            onRemove={onRemoveArtifact}
          />
        )}
      </CollapseSpace>

      {activeTabIndex < 0 ? (
        <div className="mt-4 px-4 flex justify-end gap-4">
          <Button title="Loadout" icon={<FaToolbox />} onClick={onRequestSelectArtifactLoadout} />
          <Button title="Inventory" icon={<MdInventory />} onClick={onRequestSelectInventoryArtifact} />
          <Button title="New" icon={<GiAnvil className="text-lg" />} onClick={onRequestForgeArtifact} />
        </div>
      ) : null}

      <ArtifactForge
        active={forge.active}
        initialTypes={forge.initialType}
        hasConfigStep
        hasMultipleMode
        onForgeArtifact={onForgeArtifact}
        onClose={() => setForge({ active: false })}
      />

      <ArtifactInventory
        {...inventory}
        hasMultipleMode
        currentArtifacts={artifacts}
        buttonText="Select"
        onClickButton={onSelectInventoryArtifact}
        onClose={() => setInventory({ active: false })}
      />

      <Modal
        active={selectingSrcType}
        preset="small"
        title="Select a source"
        className="bg-dark-700"
        onClose={() => setSelectingSrcType(false)}
      >
        <div className="flex justify-center gap-4">
          {renderSourceOption("Loadout", "LOADOUT", <FaToolbox className="text-2xl" />)}
          {renderSourceOption("Inventory", "INVENTORY", <MdInventory className="text-2xl" />)}
          {renderSourceOption("New", "FORGE", <GiAnvil className="text-3xl" />)}
        </div>
      </Modal>

      <LoadoutStash active={modalType === "ARTIFACT_LOADOUT"} onSelect={onSelectLoadout} onClose={closeModal} />
    </div>
  );
}
