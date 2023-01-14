import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import type { Vision } from "@Src/types";
import type { DataMonster } from "@Data/monsters/types";

// Data
import monsters from "@Data/monsters";

// Util
import { turnArray } from "@Src/utils";

interface IComboBoxProps {
  className: string;
  targetCode: number;
  targetTitle: string;
  onSelectMonster: (args: { monsterCode: number; inputs: number[]; variantType?: Vision }) => void;
}
export const ComboBox = ({
  className,
  targetCode,
  targetTitle,
  onSelectMonster,
}: IComboBoxProps) => {
  const [keyword, setKeyword] = useState("");

  const onFocusSearchInput = () => {
    document.querySelector(`#monster-${targetCode}`)?.scrollIntoView();
  };

  const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);

    const monsterList = document.querySelector("#monster-list");

    if (monsterList) {
      monsterList.scrollTop = 0;
    }
  };

  const onClickMonster = (monster: DataMonster) => () => {
    if (monster.code !== targetCode) {
      let newVariantType;
      let newInputs = monster.inputConfigs
        ? turnArray(monster.inputConfigs).map((config) => (config.type === "select" ? -1 : 0))
        : [];

      if (monster.variant) {
        const firstVariant = monster.variant.types[0];
        newVariantType = typeof firstVariant === "string" ? firstVariant : firstVariant.value;
      }

      setKeyword("");

      onSelectMonster({
        monsterCode: monster.code,
        inputs: newInputs,
        variantType: newVariantType,
      });
    }

    (document.activeElement as HTMLInputElement)?.blur();
  };

  return (
    <div className={"relative " + (className || "")}>
      <label className="px-2 w-full text-black bg-default rounded font-semibold flex items-center peer">
        <input
          className="p-2 bg-transparent grow placeholder:text-black focus:placeholder:text-rarity-1"
          placeholder={targetTitle}
          value={keyword}
          maxLength={10}
          onFocus={onFocusSearchInput}
          onBlur={() => setKeyword("")}
          onChange={onChangeSearchInput}
        />
        <FaChevronDown />
      </label>

      <div
        id="monster-list"
        className="absolute top-full z-10 mt-1 w-full text-black bg-default custom-scrollbar cursor-default hidden peer-focus-within:block"
        style={{ maxHeight: "50vh" }}
      >
        {monsters.map((monster, i) => {
          if (
            keyword &&
            !monster.title.toLowerCase().includes(keyword) &&
            (!monster.names || monster.names.every((name) => !name.toLowerCase().includes(keyword)))
          ) {
            return null;
          }

          return (
            <div
              key={monster.code}
              id={`monster-${monster.code}`}
              className={clsx(
                "px-2 py-1 flex flex-col font-medium",
                monster.code === targetCode
                  ? "bg-lesser"
                  : "hover:text-default hover:bg-darkblue-3 hover:font-bold"
              )}
              onMouseDown={(e) => e.preventDefault()}
              onClick={onClickMonster(monster)}
            >
              <p>{monster.title}</p>
              {monster.subtitle && <p className="text-sm italic">* {monster.subtitle}</p>}
              {monster.names?.length && (
                <p className="text-sm italic">{monster.names.join(", ")}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
