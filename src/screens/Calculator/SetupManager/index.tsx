import { useState } from "react";
import { IoDocumentText } from "react-icons/io5";
import type { ArtifactType } from "@Src/types";

// Constant
import { ARTIFACT_ICONS, ARTIFACT_TYPES } from "@Src/constants";

// Util
import { getImgSrc, userItemToCalcItem } from "@Src/utils";

// Action & Thunk
import { updateUI } from "@Store/uiSlice";
import { changeArtifact, changeWeapon } from "@Store/calculatorSlice";
import { pickEquippedArtSet } from "@Store/thunks";

// Selector
import { selectArtifacts, selectCharData } from "@Store/calculatorSlice/selectors";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useHeight } from "@Src/hooks";

// Component
import { Button, IconButton } from "@Components/atoms";
import { ConfirmModal, TypeSelect } from "@Components/organisms";
import { PickerCharacter, InventoryWeapon, InventoryArtifact } from "@Components/templates";
import SectionParty from "./SectionParty";
import SectionWeapon from "./SectionWeapon";
import SectionArtifacts from "./SectionArtifacts";
import SectionTarget from "./SectionTarget";
import HighManager from "./HighManager";
import { SetupSelect } from "./SetupSelect";

type ModalType =
  | "CHARACTERS_PICKER"
  | "WEAPONS_PICKER"
  | ArtifactType
  | "SHARE_SETUP_SUPPORTER"
  | "MOVE_TARGET_NOTICE"
  | "";

export default function SetupManager() {
  const dispatch = useDispatch();

  const charData = useSelector(selectCharData);
  const artifacts = useSelector(selectArtifacts);

  const [modalType, setModalType] = useState<ModalType>("");
  const [prePickerOn, setPrePickerOn] = useState(false);
  const [targetAtFront, setTargetAtFront] = useState(true);

  const [ref, height] = useHeight();

  const closeModal = () => setModalType("");

  return (
    <div ref={ref} className="h-full flex flex-col overflow-hidden">
      <SetupSelect />

      <div className="mt-4 grow hide-scrollbar space-y-2 scroll-smooth">
        <SectionParty />
        <SectionWeapon />
        <SectionArtifacts />

        {targetAtFront && (
          <SectionTarget isAtFront onMove={() => setModalType("MOVE_TARGET_NOTICE")} />
        )}
      </div>

      <div className="mt-4 flex items-center">
        <div style={{ width: "5.425rem" }} />

        <IconButton
          className="mx-auto text-lg"
          variant="positive"
          onClick={() => dispatch(updateUI({ highManagerWorking: true }))}
        >
          <IoDocumentText />
        </IconButton>

        <div className="flex">
          <button
            className="w-10 h-10 p-1 rounded-circle hover:bg-lightgold"
            onClick={() => setModalType("WEAPONS_PICKER")}
          >
            <img src={getImgSrc("7/7b/Icon_Inventory_Weapons")} alt="weapon" draggable={false} />
          </button>
          <button
            className="w-10 h-10 p-1 rounded-circle hover:bg-lightgold"
            onClick={() => setPrePickerOn(true)}
          >
            <img
              src={getImgSrc("6/6a/Icon_Inventory_Artifacts")}
              alt="artifact"
              draggable={false}
            />
          </button>
        </div>
      </div>

      <HighManager height={height} />

      <TypeSelect
        active={prePickerOn}
        choices={ARTIFACT_ICONS}
        onClickChoice={(artifactType) => {
          setModalType(artifactType as ArtifactType);
          setPrePickerOn(false);
        }}
        onClose={() => setPrePickerOn(false)}
        footer={
          <div className="mt-4 flex justify-center">
            <Button
              variant="positive"
              onClick={() => {
                setModalType("CHARACTERS_PICKER");
                setPrePickerOn(false);
              }}
            >
              Pick equipped set
            </Button>
          </div>
        }
      />

      <InventoryWeapon
        active={modalType === "WEAPONS_PICKER"}
        weaponType={charData.weaponType}
        buttonText="Pick"
        onClickButton={(weapon) => {
          dispatch(changeWeapon(userItemToCalcItem(weapon)));
        }}
        onClose={closeModal}
      />

      <InventoryArtifact
        active={["flower", "plume", "sands", "goblet", "circlet"].includes(modalType)}
        artifactType={modalType as ArtifactType}
        currentArtifacts={artifacts}
        buttonText="Pick"
        onClickButton={(artifact) => {
          dispatch(
            changeArtifact({
              pieceIndex: ARTIFACT_TYPES.indexOf(modalType as ArtifactType),
              newPiece: userItemToCalcItem(artifact),
            })
          );
        }}
        onClose={closeModal}
      />

      <PickerCharacter
        active={modalType === "CHARACTERS_PICKER"}
        sourceType="userData"
        onPickCharacter={({ artifactIDs }) => {
          if (artifactIDs) {
            dispatch(pickEquippedArtSet(artifactIDs));
          }
        }}
        onClose={closeModal}
      />

      <ConfirmModal
        active={modalType === "MOVE_TARGET_NOTICE"}
        message="Move Target Overview to Settings/Configs?"
        buttons={[
          undefined,
          {
            onClick: () => setTargetAtFront(false),
          },
        ]}
        onClose={closeModal}
      />
    </div>
  );
}
