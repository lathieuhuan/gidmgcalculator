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
import { indexByName } from "@Src/utils";

import { Button, IconButton } from "@Src/styled-components";
import SectionParty from "./SectionParty";
import SectionWeapon from "./SectionWeapon";
import { MainSelect } from "../components";
import SectionArtifacts from "./SectionArtifacts";

export default function () {
  const setups = useSelector(selectSetups);
  const comparedIndexes = useSelector(selectComparedIndexes);
  const currentIndex = useSelector(selectCurrentIndex);
  const chosen = useSelector(selectStandardIndex) === currentIndex;
  const dispatch = useDispatch();

  const [modal, setModal] = useState(null);
  const [prePickerOn, setPrePickerOn] = useState(false);
  const [ref, height] = useHeight();
  const bodyRef = useRef(null);

  const onCloseInventory = useCallback(() => setModal(null), []);

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

      <div className="mt-4 flex align-center">
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
          {/* <Icon
            src={wikiImg("7/7b/Icon_Inventory_Weapons")}
            alt="weapons"
            onClick={() => setModal("weapons")}
          /> */}
          {/* <Icon
            src={wikiImg("6/6a/Icon_Inventory_Artifacts")}
            alt="artifacts"
            onClick={() => setPrePickerOn(true)}
          /> */}
        </div>
      </div>
      {/* <Settings height={height} /> */}
      {/* {modal === "weapons" && (
        <WpInventory
          wpType={charData.weapon}
          close={closeInv}
          btnText="Pick"
          btnClick={({ user, ...wpInfo }) => dispatch(PICK_WP_IN_DB(wpInfo))}
        />
      )} */}
      {/* {prePickerOn && (
        <PrePicker
          choices={artifactIcons}
          pick={(artType) => {
            setModal(artType);
            setPrePickerOn(false);
          }}
          close={() => setPrePickerOn(false)}
          pickSetOption={
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
      )} */}
      {/* {![null, "weapons", "characters"].includes(modal) && (
        <ArtPicker artType={modal} close={closeInv} />
      )} */}
      {/* {modal === "characters" && <CharPicker close={closeInv} />} */}
    </div>
  );
}
