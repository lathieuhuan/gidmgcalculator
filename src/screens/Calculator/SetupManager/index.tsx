import { useCallback, useRef, useState } from "react";
import { FaCog } from "react-icons/fa";

import { changeCurrentSetup } from "@Store/calculatorSlice";
import { selectCharData, selectCurrentIndex, selectSetups } from "@Store/calculatorSlice/selectors";
import {
  changeStandardSetup,
  selectComparedIndexes,
  selectStandardIndex,
  toggleSettings,
} from "@Store/uiSlice";

import { useDispatch, useSelector } from "@Store/hooks";
import useHeight from "@Src/hooks/useHeight";
import { indexByName, wikiImg } from "@Src/utils";
import { ARTIFACT_ICONS } from "@Src/constants";
import type { Artifact } from "@Src/types";

import PrePicker from "@Components/Picker/PrePicker";
import { ButtonBar } from "@Components/minors";
import { InventoryWeapon } from "@Screens/item-stores/InventoryWeapon";
import { Button, IconButton } from "@Src/styled-components";
import SectionParty from "./SectionParty";
import SectionWeapon from "./SectionWeapon";
import SectionArtifacts from "./SectionArtifacts";
import { MainSelect } from "../components";

export default function SetupManager() {
  const setups = useSelector(selectSetups);
  const comparedIndexes = useSelector(selectComparedIndexes);
  const currentIndex = useSelector(selectCurrentIndex);
  const charData = useSelector(selectCharData);

  const isChosenSetup = useSelector(selectStandardIndex) === currentIndex;
  const dispatch = useDispatch();

  const [modalType, setModalType] = useState<"weapon" | Artifact | "character" | "">("");
  const [prePickerOn, setPrePickerOn] = useState(false);
  const [ref, height] = useHeight();
  const bodyRef = useRef(null);

  const onCloseModal = useCallback(() => setModalType(""), []);

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
            disabled={!isChosenSetup}
            variant="positive"
            onClick={() => {
              if (!isChosenSetup) dispatch(changeStandardSetup(currentIndex));
            }}
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
          <button onClick={() => setModalType("weapon")}>
            <img
              className="w-10 h-10 p-1 rounded-circle hover:bg-lightgold"
              src={wikiImg("7/7b/Icon_Inventory_Weapons")}
              alt="weapon"
              draggable={false}
            />
          </button>
          <button onClick={() => setPrePickerOn(true)}>
            <img
              className="w-10 h-10 p-1 rounded-circle hover:bg-lightgold"
              src={wikiImg("6/6a/Icon_Inventory_Artifacts")}
              alt="artifact"
              draggable={false}
            />
          </button>
        </div>
      </div>
      {/* <Settings height={height} /> */}

      {prePickerOn && (
        <PrePicker
          choices={ARTIFACT_ICONS}
          onClickChoice={(artifactType) => {
            setModalType(artifactType as Artifact);
            setPrePickerOn(false);
          }}
          onClose={() => setPrePickerOn(false)}
          footer={
            <ButtonBar
              className="mt-6"
              texts={["Pick Equipped Set"]}
              variants={["positive"]}
              handlers={[
                () => {
                  setModalType("character");
                  setPrePickerOn(false);
                },
              ]}
            />
          }
        />
      )}
      {modalType === "weapon" && (
        <InventoryWeapon
          weaponType={charData.weapon}
          buttonText="Pick"
          onClickButton={({ owner, ...wpInfo }) => {
            // dispatch(PICK_WP_IN_DB(wpInfo));
          }}
          onClose={onCloseModal}
        />
      )}
      {/* {![null, "weapons", "characters"].includes(modal) && (
        <ArtPicker artType={modal} close={closeInv} />
      )} */}
      {/* {modal === "characters" && <CharPicker close={closeInv} />} */}
    </div>
  );
}
