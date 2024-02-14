import { useState } from "react";
import { FaSkull } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";

import type { ArtifactType } from "@Src/types";
import { ARTIFACT_TYPES, ARTIFACT_TYPE_ICONS } from "@Src/constants";
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
import { ArtifactInventory, WeaponInventory, Tavern, TypeSelect } from "@Src/components";
import { Button, Modal } from "@Src/pure-components";
import { SetupSelect } from "./SetupSelect";
import { TargetConfig } from "./modal-content";
import HighManager from "./HighManager";
import SectionArtifacts from "./SectionArtifacts";
import SectionParty from "./SectionParty";
import SectionTarget from "./SectionTarget";
import SectionWeapon from "./SectionWeapon";

type ModalType =
  | "CHARACTERS_SELECT"
  | "WEAPONS_SELECT"
  | "ARTIFACTS_SELECT"
  | "SHARE_SETUP_SUPPORTER"
  | "TARGET_CONFIG"
  | "";

export default function SetupManager() {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const artifacts = useSelector(selectArtifacts);

  const appChar = $AppData.getCharacter(char.name);

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
            icon={<IoDocumentText />}
            onClick={() => dispatch(updateUI({ highManagerActive: true }))}
          />
        </div>

        <div className="flex justify-end space-x-1">
          <button
            className="w-10 h-10 p-1 rounded-circle hover:bg-yellow-400"
            onClick={() => setModalType("WEAPONS_SELECT")}
          >
            <img src={getImgSrc("7/7b/Icon_Inventory_Weapons")} alt="weapon" draggable={false} />
          </button>
          <button
            className="w-10 h-10 p-1 rounded-circle hover:bg-yellow-400"
            onClick={() => setModalType("ARTIFACTS_SELECT")}
          >
            <img src={getImgSrc("6/6a/Icon_Inventory_Artifacts")} alt="artifact" draggable={false} />
          </button>
        </div>
      </div>

      <HighManager height={height} />

      {/* <TypeSelect
        active={prePickerOn}
        options={ARTIFACT_TYPE_ICONS}
        onSelect={(artifactType) => {
          setModalType(artifactType as ArtifactType);
          setPrePickerOn(false);
        }}
        onClose={() => setPrePickerOn(false)}
        footer={
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => {
                setModalType("CHARACTERS_SELECT");
                setPrePickerOn(false);
              }}
            >
              Pick equipped set
            </Button>
          </div>
        }
      /> */}

      <WeaponInventory
        active={modalType === "WEAPONS_SELECT"}
        weaponType={appChar.weaponType}
        buttonText="Select"
        onClickButton={(weapon) => {
          dispatch(changeWeapon(userItemToCalcItem(weapon)));
        }}
        onClose={closeModal}
      />

      <ArtifactInventory
        active={modalType === "ARTIFACTS_SELECT"}
        artifactType={modalType as ArtifactType}
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
        onClose={closeModal}
      />

      <Tavern
        active={modalType === "CHARACTERS_SELECT"}
        sourceType="user"
        onSelectCharacter={(character) => {
          if (character.artifactIDs) {
            dispatch(pickEquippedArtSet(character.artifactIDs));
          }
        }}
        onClose={closeModal}
      />

      <Modal
        active={modalType === "TARGET_CONFIG"}
        className={[Modal.LARGE_HEIGHT_CLS, "bg-dark-900"]}
        title="Target Configuration (direct)"
        bodyCls="grow hide-scrollbar"
        withActions
        showCancel={false}
        confirmText="Close"
        confirmButtonProps={{ variant: "default" }}
        onConfirm={closeModal}
        cancelText="Overview mode"
        moreActions={[
          {
            text: "Overview mode",
            className: targetOverviewOn && "invisible",
            onClick: () => {
              setTargetOverviewOn(true);
              closeModal();
            },
          },
        ]}
        onClose={closeModal}
      >
        <TargetConfig />
      </Modal>
    </div>
  );
}
