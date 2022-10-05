import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { FaCaretDown, FaCog, FaCopy, FaSave } from "react-icons/fa";
import type { Artifact } from "@Src/types";
import { ModalInfo } from "./types";

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
import { Modal } from "@Components/modals";
import { PrePicker, Picker } from "@Components/Picker";
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
  const [setupListOn, setSetupListOn] = useState(false);
  const [targetAtFront, setTargetAtFront] = useState(true);

  const bodyRef = useRef(null);
  const [ref, height] = useHeight();

  useEffect(() => {
    const handleClickOutsideSelect = (e: any) => {
      if (setupListOn && !e.target?.closest("#gidc-setup-select_wrapper")) {
        toggleSetupList(false);
      }
    };
    document.body.addEventListener("click", handleClickOutsideSelect);

    return () => document.body.removeEventListener("click", handleClickOutsideSelect);
  }, [setupListOn]);

  const closeModal = () => setModal({ type: "", index: undefined });

  const toggleSetupList = (isOn: boolean) => {
    setSetupListOn(isOn);

    const setupSelect = document.querySelector("#gidc-setup-select");
    if (isOn) {
      setupSelect?.classList.remove("rounded-t-2.5xl", "rounded-b-2.5xl");
      setupSelect?.classList.add("rounded-t-lg");
    } else {
      setTimeout(() => {
        setupSelect?.classList.remove("rounded-t-lg");
        setupSelect?.classList.add("rounded-t-2.5xl", "rounded-b-2.5xl");
      }, 100);
    }
  };

  return (
    <div ref={ref} className="h-full flex flex-col overflow-hidden">
      <div id="gidc-setup-select_wrapper" className="shrink-0 relative">
        <button
          id="gidc-setup-select"
          className="w-full py-1 bg-orange text-black rounded-t-2.5xl rounded-b-2.5xl relative outline-none cursor-default"
          onClick={() => toggleSetupList(!setupListOn)}
        >
          <FaCaretDown className="absolute top-1/2 right-4 text-3xl -translate-y-1/2" />
          <span className="w-full text-xl font-bold text-center relative z-10">
            {setupManageInfos.find((setupManageInfo) => setupManageInfo.ID === activeId)?.name}
          </span>
        </button>

        <div
          className="absolute top-full z-20 w-full rounded-b-md bg-default text-black overflow-hidden transition-all duration-100 ease-linear"
          style={{
            height: setupListOn ? `${setupManageInfos.length * 2.5625}rem` : 0,
          }}
        >
          {setupManageInfos.map(({ ID, name }, i) => {
            return (
              <div key={ID} className="flex">
                <button
                  className="pl-3 grow text-lg text-left font-bold truncate hover:bg-darkblue-2 hover:text-default"
                  onClick={() => {
                    if (ID !== activeId) {
                      dispatch(changeActiveSetup(ID));
                    }
                    toggleSetupList(false);
                  }}
                >
                  {name}
                </button>

                <div className="ml-auto border-b border-darkblue-1 flex text-xl">
                  <button
                    className={cn(
                      "p-2.5 border-l border-darkblue-1 flex",
                      isAtMax ? "bg-lesser" : "bg-lightgold"
                    )}
                    disabled={isAtMax}
                    onClick={() => dispatch(duplicateCalcSetup(ID))}
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
              </div>
            );
          })}
        </div>
      </div>

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
            className="w-10 h-10 p-1 rounded-circle hover:bg-lightgold outline-none"
            onClick={() => setModal({ type: "WEAPONS" })}
          >
            <img src={wikiImg("7/7b/Icon_Inventory_Weapons")} alt="weapon" draggable={false} />
          </button>
          <button
            className="w-10 h-10 p-1 rounded-circle hover:bg-lightgold outline-none"
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
