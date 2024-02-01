import { useState } from "react";
import { FaSyncAlt } from "react-icons/fa";

import { Level } from "@Src/types";
import { LEVELS } from "@Src/constants";
import { $AppData } from "@Src/services";

// Util
import { getAppDataError } from "@Src/utils";
import { notification } from "@Src/utils/notification";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectChar } from "@Store/calculatorSlice/selectors";
// Action
import { updateCharacter } from "@Store/calculatorSlice";
import { updateUI } from "@Store/uiSlice";
import { initNewSessionWithChar } from "@Store/thunks";

// Component
import { Button, StarLine, Image, BetaMark, ComplexSelect } from "@Src/pure-components";
import { SetupImporter, PickerCharacter } from "@Src/components";
import contentByTab from "./content";

interface OverviewCharProps {
  touched: boolean;
}
export const CharOverview = ({ touched }: OverviewCharProps) => {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const appReady = useSelector((state) => state.ui.ready);

  const [activeTab, setActiveTab] = useState("Attributes");
  const [modalType, setModalType] = useState<"CHARACTER_PICKER" | "IMPORT_SETUP" | "">("");

  const Content = contentByTab[activeTab];

  const closeModal = () => setModalType("");

  const onClickConsLevel = (cons: number) => {
    if (cons !== char.cons) {
      dispatch(updateCharacter({ cons }));
    }
  };

  let body;

  if (touched) {
    const charData = $AppData.getCharData(char.name);
    const textVision = `text-${charData.vision}`;

    body = (
      <div className="h-full flex flex-col">
        <div className="mt-2 mb-1 pb-4 flex">
          <div
            className="mr-3 relative aspect-square shrink-0"
            onClick={() => setModalType("CHARACTER_PICKER")}
            style={{ width: 88, height: 88 }}
          >
            <Button className="absolute -top-2.5 -left-2.5 z-10" variant="positive" icon={<FaSyncAlt />} />
            {charData.beta ? <BetaMark className="absolute -top-2 -right-2 z-10" /> : null}
            <Image className="cursor-pointer" src={charData.icon} imgType="character" />
          </div>

          <div className="min-w-0 grow">
            <div className="overflow-hidden">
              <p className={`text-2.5xl truncate ${textVision} font-black`}>{char.name}</p>
              <StarLine className="mt-1" rarity={charData.rarity} />
            </div>

            <div className="mt-1 flex justify-between items-center">
              <div className="flex items-center text-lg">
                <p className="mr-1">Level</p>
                <select
                  className={`${textVision} font-bold text-right text-last-right`}
                  value={char.level}
                  onChange={(e) => dispatch(updateCharacter({ level: e.target.value as Level }))}
                >
                  {LEVELS.map((_, index) => (
                    <option key={index} className="text-black">
                      {LEVELS[LEVELS.length - 1 - index]}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={
                  "ml-4 px-3 pt-2 pb-1.5 flex-center rounded-lg bg-dark-700 " +
                  `${textVision} leading-none font-bold cursor-default relative group`
                }
              >
                <span>C{char.cons}</span>
                <div className="absolute top-full z-50 pt-1 hidden group-hover:block">
                  <ul className="bg-light-400 text-black rounded overflow-hidden">
                    {[...Array(7)].map((_, i) => {
                      return (
                        <li
                          key={i}
                          className={"px-3 pt-2 pb-1.5 " + (i === char.cons ? "bg-light-800" : "hover:bg-yellow-400")}
                          onClick={() => onClickConsLevel(i)}
                        >
                          C{i}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ComplexSelect
          selectId="character-overview-select"
          value={activeTab}
          options={[
            { label: "Attributes", value: "Attributes" },
            { label: "Weapon", value: "Weapon" },
            { label: "Artifacts", value: "Artifacts" },
            { label: "Constellation", value: "Constellation" },
            { label: "Talents", value: "Talents" },
          ]}
          onChange={(newTab) => setActiveTab(newTab.toString())}
        />

        <div className="mt-3 grow hide-scrollbar">{Content && <Content />}</div>
      </div>
    );
  } else {
    body = (
      <div className="w-full flex flex-col items-center space-y-2">
        <Button variant="positive" onClick={() => setModalType("CHARACTER_PICKER")}>
          Choose a character
        </Button>
        <p>or</p>
        <Button variant="positive" disabled={!appReady} onClick={() => setModalType("IMPORT_SETUP")}>
          Import a setup
        </Button>
      </div>
    );
  }

  return (
    <>
      {body}

      <PickerCharacter
        active={modalType === "CHARACTER_PICKER"}
        sourceType="mixed"
        onPickCharacter={async (pickedChar) => {
          if ($AppData.getCharStatus(pickedChar.name) === "fetched") {
            dispatch(initNewSessionWithChar(pickedChar));
            return;
          }
          dispatch(updateUI({ loading: true }));

          const response = await $AppData.fetchCharacter(pickedChar.name);

          if (response.code === 200) {
            dispatch(initNewSessionWithChar(pickedChar));
            dispatch(updateUI({ loading: false }));
          } else {
            notification.error({
              content: getAppDataError("character", response.code),
              duration: 0,
            });
            dispatch(updateUI({ loading: false }));

            return {
              isValid: false,
            };
          }
        }}
        onClose={closeModal}
      />

      <SetupImporter active={modalType === "IMPORT_SETUP"} onClose={closeModal} />
    </>
  );
};
