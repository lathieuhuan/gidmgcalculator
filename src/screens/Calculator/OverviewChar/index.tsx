import { useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import type { Level } from "@Src/types";

// Constant
import { LEVELS } from "@Src/constants";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Util
import { findDataCharacter } from "@Data/controllers";

// Action & Thunk
import { updateCharacter } from "@Store/calculatorSlice";
import { startCalculation } from "@Store/thunks";

// Selector
import { selectChar, selectCharData } from "@Store/calculatorSlice/selectors";

// Component
import { Button, IconButton, BetaMark, StarLine, Image } from "@Components/atoms";
import { ComplexSelect } from "@Components/molecules";
import { UnderConstructNotice } from "@Components/organisms";
import { PickerCharacter } from "@Components/templates";
import contentByTab from "./content";

type ModalType = "CHARACTER_PICKER" | "IMPORT_MANAGER" | "";

interface OverviewCharProps {
  touched: boolean;
}
export default function OverviewChar({ touched }: OverviewCharProps) {
  const dispatch = useDispatch();
  const char = useSelector(selectChar)!;
  const charData = useSelector(selectCharData);

  const [activeTab, setActiveTab] = useState("Attributes");
  const [modalType, setModalType] = useState<ModalType>("");

  const Content = contentByTab[activeTab];
  const { beta, icon, vision, rarity } = findDataCharacter(charData)!;

  const onClickCharImg = () => setModalType("CHARACTER_PICKER");

  const closeModal = () => setModalType("");

  return (
    <>
      {touched ? (
        <div className="h-full flex flex-col">
          <div className="mt-2 mb-1 pb-4 flex">
            <div className="w-24 mr-4 relative aspect-square" onClick={onClickCharImg}>
              <IconButton className="absolute -top-2.5 -left-2.5 z-10 text-xl" variant="positive">
                <FaSyncAlt />
              </IconButton>

              {beta && <BetaMark className="absolute -top-2 -right-2 z-10" />}

              <Image className="cursor-pointer" src={icon} imgType="character" />
            </div>

            <div className="overflow-hidden">
              <p className={`text-3xl truncate text-${vision} font-black`}>{char.name}</p>
              <StarLine className="mt-1" rarity={rarity} />
              <div className="mt-1 flex items-center">
                <p className="mr-1 text-lg">Level</p>
                <select
                  className={`text-lg text-${vision} font-bold text-right text-last-right`}
                  value={char.level}
                  onChange={(e) => dispatch(updateCharacter({ level: e.target.value as Level }))}
                >
                  {LEVELS.map((_, index) => (
                    <option key={index} className="text-black">
                      {LEVELS[LEVELS.length - 1 - index]}
                    </option>
                  ))}
                </select>
                <p
                  className={`ml-2 px-3 pt-2 pb-1.5 flex-center rounded-lg bg-darkblue-2 text-${vision} leading-none font-bold cursor-default`}
                >
                  <span>C{char.cons}</span>
                </p>
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
      ) : (
        <div className="w-full flex flex-col items-center space-y-2">
          <Button variant="positive" onClick={() => setModalType("CHARACTER_PICKER")}>
            Choose a character
          </Button>

          <p>or</p>

          <Button variant="positive" onClick={() => setModalType("IMPORT_MANAGER")}>
            Import a setup
          </Button>
        </div>
      )}

      <PickerCharacter
        active={modalType === "CHARACTER_PICKER"}
        sourceType="mixed"
        onPickCharacter={(pickedChar) => dispatch(startCalculation(pickedChar))}
        onClose={closeModal}
      />

      <UnderConstructNotice active={modalType === "IMPORT_MANAGER"} onClose={closeModal} />
    </>
  );
}
