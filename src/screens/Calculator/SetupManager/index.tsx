import { useRef, useState } from "react";
import { FaCog } from "react-icons/fa";
import type { Artifact } from "@Src/types";

import { pickEquippedArtSet } from "@Store/thunks";
import {
  changeCurrentSetup,
  pickWeaponInUserDatabase,
  updateArtPiece,
} from "@Store/calculatorSlice";
import {
  changeStandardSetup,
  selectComparedIndexes,
  selectStandardIndex,
  toggleSettings,
} from "@Store/uiSlice";
import {
  selectArtInfo,
  selectCharData,
  selectCurrentIndex,
  selectSetups,
} from "@Store/calculatorSlice/selectors";

import { useDispatch, useSelector } from "@Store/hooks";
import useHeight from "@Src/hooks/useHeight";
import { indexByName, wikiImg } from "@Src/utils";
import { ARTIFACT_ICONS, ARTIFACT_TYPES } from "@Src/constants";

import { Button, IconButton } from "@Src/styled-components";
import { PrePicker, Picker } from "@Components/Picker";
import { InventoryWeapon } from "@Components/item-stores/InventoryWeapon";
import { InventoryArtifact } from "@Components/item-stores/InventoryArtifact";
import SectionParty from "./SectionParty";
import SectionWeapon from "./SectionWeapon";
import SectionArtifacts from "./SectionArtifacts";
import { MainSelect } from "../components";
import Settings from "../Settings";

export default function SetupManager() {
  const setups = useSelector(selectSetups);
  const comparedIndexes = useSelector(selectComparedIndexes);
  const currentIndex = useSelector(selectCurrentIndex);
  const charData = useSelector(selectCharData);
  const artPieces = useSelector(selectArtInfo).pieces;

  const isChosenSetup = useSelector(selectStandardIndex) === currentIndex;
  const dispatch = useDispatch();

  const [modalType, setModalType] = useState<"weapon" | Artifact | "character" | "">("");
  const [prePickerOn, setPrePickerOn] = useState(false);
  const [ref, height] = useHeight();
  const bodyRef = useRef(null);

  const onCloseModal = () => setModalType("");

  return (
    <div ref={ref} className="h-full flex flex-col overflow-hidden">
      <MainSelect
        tab={setups[currentIndex].name}
        onChangeTab={(name) => dispatch(changeCurrentSetup(indexByName(setups, name)))}
        options={setups.map((st) => st.name)}
      />

      <div ref={bodyRef} className="mt-4 grow hide-scrollbar scroll-smooth">
        <SectionParty />
        <SectionWeapon />
        <SectionArtifacts containerRef={bodyRef} />
      </div>

      <div className="mt-4 flex items-center">
        {comparedIndexes.length === 1 ? (
          <div style={{ width: "5.425rem" }} />
        ) : (
          <Button
            variant="positive"
            disabled={isChosenSetup}
            onClick={() => dispatch(changeStandardSetup(currentIndex))}
          >
            Choose
          </Button>
        )}

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
          dispatch(pickWeaponInUserDatabase(wpInfo));
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
            updateArtPiece({
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
