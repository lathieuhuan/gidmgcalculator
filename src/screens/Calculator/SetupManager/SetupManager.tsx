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
import { ArtifactInventory, WeaponInventory, Tavern } from "@Src/components";
import { Button, Image, Modal } from "@Src/pure-components";
import { SetupSelect } from "./SetupSelect";
import { TargetConfig } from "./TargetConfig";
import HighManager from "./HighManager";
import SectionArtifacts from "./SectionArtifacts";
import SectionParty from "./SectionParty";
import SectionTarget from "./SectionTarget";
import SectionWeapon from "./SectionWeapon";

type ModalType = "CHARACTERS_SELECT" | "WEAPONS_SELECT" | ArtifactType | "SHARE_SETUP_SUPPORTER" | "TARGET_CONFIG" | "";

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
          <button className="w-10 h-10 p-1 rounded-circle hover:bg-yellow-400" onClick={() => setPrePickerOn(true)}>
            <img src={getImgSrc("6/6a/Icon_Inventory_Artifacts")} alt="artifact" draggable={false} />
          </button>
        </div>
      </div>

      <HighManager height={height} />

      <Modal
        active={prePickerOn}
        className="bg-dark-700"
        preset="small"
        title="Choose a Type"
        onClose={() => setPrePickerOn(false)}
      >
        <div className="flex space-x-2">
          {ARTIFACT_TYPE_ICONS.map((option, i) => (
            <button
              key={i}
              className="p-1 w-full rounded-full hover:bg-yellow-400"
              onClick={() => {
                setModalType(option.type);
                setPrePickerOn(false);
              }}
            >
              <Image src={option.icon} imgType="weapon" />
            </button>
          ))}
        </div>

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
      </Modal>

      <WeaponInventory
        active={modalType === "WEAPONS_SELECT"}
        weaponType={appChar.weaponType}
        buttonText="Pick"
        onClickButton={(weapon) => {
          dispatch(changeWeapon(userItemToCalcItem(weapon)));
        }}
        onClose={closeModal}
      />

      <ArtifactInventory
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
        title="Target Configuration (live)"
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
