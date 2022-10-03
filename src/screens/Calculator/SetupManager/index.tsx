import cn from "classnames";
import { useRef, useState } from "react";
import { FaCaretDown, FaCog, FaCopy, FaSave } from "react-icons/fa";
import type { Artifact } from "@Src/types";
import { ModalInfo, ModalType } from "./types";

import { pickEquippedArtSet } from "@Store/thunks";
import {
  changeActiveSetup,
  pickWeaponInUsersDatabase,
  changeArtPiece,
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
import { ARTIFACT_ICONS, ARTIFACT_TYPES } from "@Src/constants";

import { Button, IconButton } from "@Src/styled-components";
import { PrePicker, Picker } from "@Components/Picker";
import { InventoryWeapon } from "@Components/item-stores/InventoryWeapon";
import { InventoryArtifact } from "@Components/item-stores/InventoryArtifact";
import SectionParty from "./SectionParty";
import SectionWeapon from "./SectionWeapon";
import SectionArtifacts from "./SectionArtifacts";
import SectionTarget from "./SectionTarget";
import Settings from "./Settings";
import { Modal } from "@Components/modals";
import { SaveSetup } from "./modal-content";

export default function SetupManager() {
  const dispatch = useDispatch();

  const setupManageInfos = useSelector(selectSetupManageInfos);
  const activeId = useSelector(selectActiveId);
  const charData = useSelector(selectCharData);
  const artPieces = useSelector(selectArtInfo)?.pieces;

  const [modal, setModal] = useState<ModalInfo>({
    type: "",
    index: undefined,
  });
  const [prePickerOn, setPrePickerOn] = useState(false);
  const [setupListOn, setSetupListOn] = useState(false);

  const bodyRef = useRef(null);
  const [ref, height] = useHeight();

  const openModal = (index?: number) => (type: ModalType) => {
    setModal({ type, index });
  };

  const closeModal = () => setModal({ type: "", index: undefined });

  const toggleSetupList = (isOn: boolean) => {
    setSetupListOn(isOn);

    const setupSelect = document.querySelector("#setup-select");
    if (!setupListOn) {
      setupSelect?.classList.remove("rounded-b-2.5xl");
    } else {
      setTimeout(() => {
        setupSelect?.classList.add("rounded-b-2.5xl");
      }, 150);
    }
  };

  return (
    <div ref={ref} className="h-full flex flex-col overflow-hidden">
      <button
        id="setup-select"
        className="w-full py-1 bg-orange text-black rounded-t-2.5xl rounded-b-2.5xl relative outline-none cursor-default"
        onClick={() => toggleSetupList(!setupListOn)}
      >
        <FaCaretDown className="absolute top-1/2 right-4 text-3xl -translate-y-1/2" />
        <span className="w-full text-xl font-bold text-center relative z-10">
          {setupManageInfos.find((setupManageInfo) => setupManageInfo.ID === activeId)?.name}
        </span>
      </button>

      <div
        className="shrink-0 rounded-b-md bg-darkblue-2 text-default overflow-hidden transition-all duration-150 ease-linear"
        style={{
          height: setupListOn ? `${setupManageInfos.length * 2.8125}rem` : 0,
        }}
      >
        {setupManageInfos.map(({ ID, name }, i) => {
          return (
            <div key={ID} className="flex border-t border-darkblue-3">
              <button
                className="pl-3 grow text-lg text-left font-bold truncate hover:text-orange"
                onClick={() => {
                  if (ID !== activeId) {
                    dispatch(changeActiveSetup(ID));
                  }
                  toggleSetupList(false);
                }}
              >
                {name}
              </button>

              <div className="ml-auto flex text-xl">
                <button
                  className="p-3 border-l border-darkblue-3 flex hover:text-lightgold"
                  onClick={() => {}}
                >
                  <FaCopy />
                </button>

                <button
                  className="p-3 border-l border-darkblue-3 flex hover:text-lightgold"
                  onClick={() => openModal(i)("SAVE_SETUP")}
                >
                  <FaSave />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div ref={bodyRef} className="mt-4 grow hide-scrollbar space-y-2 scroll-smooth">
        <SectionParty />
        <SectionWeapon />
        <SectionArtifacts containerRef={bodyRef} />
        <SectionTarget />
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
            onClick={() => openModal()("WEAPONS")}
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

      <Settings height={height} />

      <PrePicker
        active={prePickerOn}
        choices={ARTIFACT_ICONS}
        onClickChoice={(artifactType) => {
          openModal()(artifactType as Artifact);
          setPrePickerOn(false);
        }}
        onClose={() => setPrePickerOn(false)}
        footer={
          <div className="mt-6 flex justify-center">
            <Button
              variant="positive"
              onClick={() => {
                openModal()("CHARACTERS");
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
    </div>
  );
}
