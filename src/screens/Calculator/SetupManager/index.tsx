import { useCallback, useRef, useState } from "react";
import { FaCog } from "react-icons/fa";

import { changeCurrentSetup } from "@Store/calculatorSlice";
import { selectCurrentIndex, selectSetups } from "@Store/calculatorSlice/selectors";
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

import PrePicker from "@Components/Picker/PrePicker";
import { ButtonBar } from "@Components/minors";
import { Button, IconButton } from "@Src/styled-components";
import SectionParty from "./SectionParty";
import SectionWeapon from "./SectionWeapon";
import SectionArtifacts from "./SectionArtifacts";
import { MainSelect } from "../components";

export default function () {
  const setups = useSelector(selectSetups);
  const comparedIndexes = useSelector(selectComparedIndexes);
  const currentIndex = useSelector(selectCurrentIndex);
  const chosen = useSelector(selectStandardIndex) === currentIndex;
  const dispatch = useDispatch();

  const [modal, setModal] = useState("");
  const [prePickerOn, setPrePickerOn] = useState(false);
  const [ref, height] = useHeight();
  const bodyRef = useRef(null);

  const onCloseInventory = useCallback(() => setModal(""), []);

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
            disabled={!chosen}
            variant="positive"
            onClick={() => {
              if (!chosen) dispatch(changeStandardSetup(currentIndex));
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
          <button onClick={() => setModal("weapon")}>
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
            setModal(artifactType);
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
                  setModal("characters");
                  setPrePickerOn(false);
                },
              ]}
            />
          }
        />
      )}
      {/* {modal === "weapons" && (
        <WpInventory
          wpType={charData.weapon}
          close={closeInv}
          btnText="Pick"
          btnClick={({ user, ...wpInfo }) => dispatch(PICK_WP_IN_DB(wpInfo))}
        />
      )} */}
      {/* {![null, "weapons", "characters"].includes(modal) && (
        <ArtPicker artType={modal} close={closeInv} />
      )} */}
      {/* {modal === "characters" && <CharPicker close={closeInv} />} */}
    </div>
  );
}
