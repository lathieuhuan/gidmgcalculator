import { useRef, useState } from "react";
import { FaCog } from "react-icons/fa";
import type { Artifact } from "@Src/types";

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
import { MainSelect } from "../components";
import Settings from "../Settings";

export default function SetupManager() {
  const dispatch = useDispatch();

  const setupManageInfos = useSelector(selectSetupManageInfos);
  const activeId = useSelector(selectActiveId);
  const charData = useSelector(selectCharData);
  const artPieces = useSelector(selectArtInfo)?.pieces;

  const [modalType, setModalType] = useState<"weapon" | Artifact | "character" | "">("");
  const [prePickerOn, setPrePickerOn] = useState(false);
  const [ref, height] = useHeight();
  const bodyRef = useRef(null);

  const onCloseModal = () => setModalType("");

  return (
    <div ref={ref} className="h-full flex flex-col overflow-hidden">
      <MainSelect
        value={activeId}
        options={setupManageInfos.map((info) => {
          return {
            label: info.name,
            value: info.ID,
          };
        })}
        onChangeTab={({ value }) => {
          dispatch(changeActiveSetup(value));
        }}
      />

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
            onClick={() => setModalType("weapon")}
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
          setModalType(artifactType as Artifact);
          setPrePickerOn(false);
        }}
        onClose={() => setPrePickerOn(false)}
        footer={
          <div className="mt-6 flex justify-center">
            <Button
              variant="positive"
              onClick={() => {
                setModalType("character");
                setPrePickerOn(false);
              }}
            >
              Pick Equipped Set
            </Button>
          </div>
        }
      />

      <InventoryWeapon
        active={modalType === "weapon"}
        weaponType={charData.weapon}
        buttonText="Pick"
        onClickButton={({ owner, ...wpInfo }) => {
          dispatch(pickWeaponInUsersDatabase(wpInfo));
        }}
        onClose={onCloseModal}
      />

      <InventoryArtifact
        active={modalType !== "" && modalType !== "weapon" && modalType !== "character"}
        owner={charData.name}
        artifactType={modalType as Artifact}
        currentPieces={artPieces}
        buttonText="Pick"
        onClickButton={({ owner, ...pieceInfo }) => {
          dispatch(
            changeArtPiece({
              pieceIndex: ARTIFACT_TYPES.indexOf(modalType as Artifact),
              newPiece: pieceInfo,
            })
          );
        }}
        onClose={onCloseModal}
      />

      <Picker.Character
        active={modalType === "character"}
        sourceType="usersData"
        onPickCharacter={({ artifactIDs }) => {
          if (artifactIDs) {
            dispatch(pickEquippedArtSet(artifactIDs));
          }
        }}
        onClose={onCloseModal}
      />
    </div>
  );
}
