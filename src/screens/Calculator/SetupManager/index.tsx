import cn from "classnames";
import { useRef, useState } from "react";
import { FaCog, FaCopy, FaSave } from "react-icons/fa";
import type { Artifact } from "@Src/types";
import type { ModalInfo } from "./types";

import { pickEquippedArtSet } from "@Store/thunks";
import {
  changeActiveSetup,
  pickWeaponInUsersDatabase,
  changeArtPiece,
  duplicateCalcSetup,
} from "@Store/calculatorSlice";
import { toggleSettings } from "@Store/uiSlice";
import {
  selectArtInfo,
  selectCharData,
  selectActiveId,
  selectSetupManageInfos,
} from "@Store/calculatorSlice/selectors";

import { useDispatch, useSelector } from "@Store/hooks";
import useHeight from "@Src/hooks/useHeight";
import { wikiImg } from "@Src/utils";
import { ARTIFACT_ICONS, ARTIFACT_TYPES, MAX_CALC_SETUPS } from "@Src/constants";

import { Button, IconButton } from "@Src/styled-components";
import { PrePicker, Picker } from "@Components/Picker";
import { ComplexSelect } from "@Components/ComplexSelect";
import { Modal } from "@Components/modals";
import { InventoryWeapon } from "@Components/item-stores/InventoryWeapon";
import { InventoryArtifact } from "@Components/item-stores/InventoryArtifact";
import { ConfirmModal } from "@Components/minors";
import SectionParty from "./SectionParty";
import SectionWeapon from "./SectionWeapon";
import SectionArtifacts from "./SectionArtifacts";
import SectionTarget from "./SectionTarget";
import Settings from "./Settings";
import { SaveSetup } from "./modal-content";

export default function SetupManager() {
  const dispatch = useDispatch();

  const setupManageInfos = useSelector(selectSetupManageInfos);
  const activeId = useSelector(selectActiveId);
  const charData = useSelector(selectCharData);
  const artPieces = useSelector(selectArtInfo)?.pieces;
  const isAtMax = setupManageInfos.length === MAX_CALC_SETUPS;

  const [modal, setModal] = useState<ModalInfo>({
    type: "",
    index: undefined,
  });
  const [prePickerOn, setPrePickerOn] = useState(false);
  const [targetAtFront, setTargetAtFront] = useState(true);

  const bodyRef = useRef(null);
  const [ref, height] = useHeight();

  const closeModal = () => setModal({ type: "", index: undefined });

  const onClickSetupName = (ID: number) => {
    if (ID !== activeId) {
      dispatch(changeActiveSetup(ID));
    }
  };

  return (
    <div ref={ref} className="h-full flex flex-col overflow-hidden">
      <ComplexSelect
        selectId="setup-select"
        value={setupManageInfos.find((setupManageInfo) => setupManageInfo.ID === activeId)?.name}
        optionHeight={2.5625}
        options={setupManageInfos.map(({ name, ID }, i) => {
          return {
            label: name,
            value: ID,
            suffix: (
              <div className="ml-auto border-b border-darkblue-1 flex text-xl">
                <button
                  className={cn(
                    "p-2.5 border-l border-darkblue-1 flex",
                    isAtMax ? "bg-lesser" : "bg-lightgold"
                  )}
                  disabled={isAtMax}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(duplicateCalcSetup(ID));
                  }}
                >
                  <FaCopy />
                </button>

                <button
                  className="p-2.5 border-l border-darkblue-1 flex bg-lightgold"
                  onClick={() => setModal({ type: "SAVE_SETUP", index: i })}
                >
                  <FaSave />
                </button>
              </div>
            ),
          };
        })}
        onChange={(newID) => onClickSetupName(+newID)}
      />

      <div ref={bodyRef} className="mt-4 grow hide-scrollbar space-y-2 scroll-smooth">
        <SectionParty />
        <SectionWeapon />
        <SectionArtifacts containerRef={bodyRef} />

        {targetAtFront && (
          <SectionTarget isAtFront onMove={() => setModal({ type: "NOTICE_MOVE_TARGET" })} />
        )}
      </div>

      <div className="mt-4 flex items-center">
        <div style={{ width: "5.425rem" }} />

        <IconButton
          className="mx-auto text-lg"
          variant="positive"
          onClick={() => dispatch(toggleSettings(true))}
        >
          <FaCog />
        </IconButton>

        <div className="flex">
          <button
            className="w-10 h-10 p-1 rounded-circle hover:bg-lightgold"
            onClick={() => setModal({ type: "WEAPONS" })}
          >
            <img src={wikiImg("7/7b/Icon_Inventory_Weapons")} alt="weapon" draggable={false} />
          </button>
          <button
            className="w-10 h-10 p-1 rounded-circle hover:bg-lightgold"
            onClick={() => setPrePickerOn(true)}
          >
            <img src={wikiImg("6/6a/Icon_Inventory_Artifacts")} alt="artifact" draggable={false} />
          </button>
        </div>
      </div>

      <Settings
        height={height}
        shouldShowTarget={!targetAtFront}
        onMoveTarget={() => setTargetAtFront(true)}
      />

      <PrePicker
        active={prePickerOn}
        choices={ARTIFACT_ICONS}
        onClickChoice={(artifactType) => {
          setModal({ type: artifactType as Artifact });
          setPrePickerOn(false);
        }}
        onClose={() => setPrePickerOn(false)}
        footer={
          <div className="mt-6 flex justify-center">
            <Button
              variant="positive"
              onClick={() => {
                setModal({ type: "CHARACTERS" });
                setPrePickerOn(false);
              }}
            >
              Pick Equipped Set
            </Button>
          </div>
        }
      />

      <InventoryWeapon
        active={modal.type === "WEAPONS"}
        weaponType={charData.weapon}
        buttonText="Pick"
        onClickButton={({ owner, ...wpInfo }) => {
          dispatch(pickWeaponInUsersDatabase(wpInfo));
        }}
        onClose={closeModal}
      />

      <InventoryArtifact
        active={["flower", "plume", "sands", "goblet", "circlet"].includes(modal.type)}
        owner={charData.name}
        artifactType={modal.type as Artifact}
        currentPieces={artPieces}
        buttonText="Pick"
        onClickButton={({ owner, ...pieceInfo }) => {
          dispatch(
            changeArtPiece({
              pieceIndex: ARTIFACT_TYPES.indexOf(modal.type as Artifact),
              newPiece: pieceInfo,
            })
          );
        }}
        onClose={closeModal}
      />

      <Picker.Character
        active={modal.type === "CHARACTERS"}
        sourceType="usersData"
        onPickCharacter={({ artifactIDs }) => {
          if (artifactIDs) {
            dispatch(pickEquippedArtSet(artifactIDs));
          }
        }}
        onClose={closeModal}
      />

      <Modal
        active={modal.type === "SAVE_SETUP"}
        isCustom
        className="rounded-lg max-w-95"
        style={{ width: "30rem" }}
        onClose={closeModal}
      >
        <SaveSetup setup={setupManageInfos[modal.index || 0]} onClose={closeModal} />
      </Modal>

      <ConfirmModal
        active={modal.type === "NOTICE_MOVE_TARGET"}
        message="Move Target Overview to Settings/Configs?"
        right={{
          onClick: () => setTargetAtFront(false),
        }}
        onClose={closeModal}
      />
    </div>
  );
}
