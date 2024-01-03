import { useState } from "react";
import { FaSkull } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";

import type { ArtifactType } from "@Src/types";
import { ARTIFACT_ICONS, ARTIFACT_TYPES } from "@Src/constants";
import { useElementSize } from "@Src/pure-hooks";
import { $AppData } from "@Src/services";
import { getImgSrc, userItemToCalcItem } from "@Src/utils";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectArtifacts, selectChar } from "@Store/calculatorSlice/selectors";
import { changeArtifact, changeWeapon } from "@Store/calculatorSlice";
import { pickEquippedArtSet } from "@Store/thunks";
import { updateUI } from "@Store/uiSlice";

// Component
import { InventoryArtifact, InventoryWeapon, PickerCharacter, TypeSelect } from "@Src/components";
import { Button, Modal } from "@Src/pure-components";
import { SetupSelect } from "./SetupSelect";
import { TargetConfig } from "./modal-content";
import HighManager from "./HighManager";
import SectionArtifacts from "./SectionArtifacts";
import SectionParty from "./SectionParty";
import SectionTarget from "./SectionTarget";
import SectionWeapon from "./SectionWeapon";

type ModalType = "CHARACTERS_PICKER" | "WEAPONS_PICKER" | ArtifactType | "SHARE_SETUP_SUPPORTER" | "TARGET_CONFIG" | "";

export default function SetupManager() {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const artifacts = useSelector(selectArtifacts);

  const charData = $AppData.getCharData(char.name);

  const [modalType, setModalType] = useState<ModalType>("");
  const [prePickerOn, setPrePickerOn] = useState(false);
  const [targetOverviewOn, setTargetOverviewOn] = useState(true);

  const [ref, { height }] = useElementSize<HTMLDivElement>();

  const closeModal = () => setModalType("");

  return (
    <div ref={ref} className="h-full flex flex-col overflow-hidden">
      <SetupSelect />

      <div className="mt-4 grow hide-scrollbar space-y-2 scroll-smooth">
        <SectionParty />
        <SectionWeapon />
        <SectionArtifacts />

        {targetOverviewOn && (
          <SectionTarget onMinimize={() => setTargetOverviewOn(false)} onEdit={() => setModalType("TARGET_CONFIG")} />
        )}
      </div>

      <div className="mt-4 grid grid-cols-3">
        <div className="flex items-center">
          {!targetOverviewOn && <Button boneOnly icon={<FaSkull />} onClick={() => setModalType("TARGET_CONFIG")} />}
        </div>

        <div className="flex-center">
          <Button
            className="mx-auto"
            variant="positive"
            icon={<IoDocumentText />}
            onClick={() => dispatch(updateUI({ highManagerActive: true }))}
          />
        </div>

        <div className="flex justify-end space-x-1">
          <button
            className="w-10 h-10 p-1 rounded-circle hover:bg-yellow-400"
            onClick={() => setModalType("WEAPONS_PICKER")}
          >
            <img src={getImgSrc("7/7b/Icon_Inventory_Weapons")} alt="weapon" draggable={false} />
          </button>
          <button className="w-10 h-10 p-1 rounded-circle hover:bg-yellow-400" onClick={() => setPrePickerOn(true)}>
            <img src={getImgSrc("6/6a/Icon_Inventory_Artifacts")} alt="artifact" draggable={false} />
          </button>
        </div>
      </div>

      <HighManager height={height} />

      <TypeSelect
        active={prePickerOn}
        options={ARTIFACT_ICONS}
        onSelect={(artifactType) => {
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
        sourceType="user"
        onPickCharacter={({ artifactIDs }) => {
          if (artifactIDs) {
            dispatch(pickEquippedArtSet(artifactIDs));
          }
        }}
        onClose={closeModal}
      />

      <Modal active={modalType === "TARGET_CONFIG"} className="h-large-modal" onClose={closeModal}>
        <TargetConfig
          button={
            targetOverviewOn ? null : (
              <Button
                variant="positive"
                onClick={() => {
                  setTargetOverviewOn(true);
                  closeModal();
                }}
              >
                Overview mode
              </Button>
            )
          }
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
}
