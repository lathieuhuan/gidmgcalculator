import { useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import type { Level } from "@Src/types";

// Constant
import { LEVELS } from "@Src/constants";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Util
import { getImgSrc } from "@Src/utils";
import { findCharacter } from "@Data/controllers";

// Action & Thunk
import { updateCharacter } from "@Store/calculatorSlice";
import { startCalculation } from "@Store/thunks";

// Selector
import { selectChar, selectCharData } from "@Store/calculatorSlice/selectors";

// Component
import { Button, IconButton, Select } from "@Src/styled-components";
import { Picker } from "@Components/Picker";
import { ComplexSelect } from "@Components/ComplexSelect";
import { BetaMark, StarLine } from "@Components/atoms";
import contentByTab from "./content";

interface OverviewCharProps {
  touched: boolean;
}
export default function OverviewChar({ touched }: OverviewCharProps) {
  const dispatch = useDispatch();
  const char = useSelector(selectChar)!;
  const charData = useSelector(selectCharData);

  const [activeTab, setActiveTab] = useState("Attributes");
  const [pickerOn, setPickerOn] = useState(false);

  const Content = contentByTab[activeTab];
  const { beta, icon, vision, rarity } = findCharacter(charData)!;

  const onClickCharImg = () => setPickerOn(true);

  return (
    <>
      {touched ? (
        <div className="h-full flex flex-col">
          <div className="mt-2 mb-1 pb-4 flex">
            <div className="mr-4 relative" onClick={onClickCharImg}>
              <IconButton className="absolute -top-2.5 -left-2.5 z-10 text-xl" variant="positive">
                <FaSyncAlt />
              </IconButton>

              {beta && <BetaMark className="absolute -top-2 -right-2 z-10" />}
              <img
                className="w-24 cursor-pointer"
                src={getImgSrc(icon)}
                alt={char.name}
                draggable={false}
              />
            </div>

            <div className="overflow-hidden">
              <p className={`text-3xl truncate text-${vision} font-black`}>{char.name}</p>
              <StarLine className="mt-1" rarity={rarity} />
              <div className="mt-1 flex items-center">
                <p className="mr-1 text-lg">Level</p>
                <Select
                  className={`text-lg text-${vision} font-bold text-last-right`}
                  value={char.level}
                  onChange={(e) => dispatch(updateCharacter({ level: e.target.value as Level }))}
                >
                  {LEVELS.map((_, index) => (
                    <option key={index} className="text-black">
                      {LEVELS[LEVELS.length - 1 - index]}
                    </option>
                  ))}
                </Select>
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
        <div className="w-full flex flex-col">
          <Button className="mx-auto" variant="positive" onClick={() => setPickerOn(true)}>
            Choose a Character
          </Button>
        </div>
      )}

      <Picker.Character
        active={pickerOn}
        sourceType="mixed"
        onPickCharacter={(pickedChar) => dispatch(startCalculation(pickedChar))}
        onClose={() => setPickerOn(false)}
      />
    </>
  );
}
