import cn from "classnames";
import { useState, useEffect } from "react";
import { FaCaretDown } from "react-icons/fa";
import { MdMoreHoriz } from "react-icons/md";

type DropdownType = "OPTIONS" | "ACTIONS" | "";

type RenderJXS = (args: { closeSelect: () => void }) => JSX.Element;

interface ComplexSelectProps {
  selectId: string;
  value?: string | number;
  options?: Array<{
    label: string;
    value?: string | number;
    renderSuffix?: RenderJXS;
    renderMoreActions?: RenderJXS;
  }>;
  optionHeight?: number;
  onChange?: (value: string | number) => void;
  onCloseSelect?: () => void;
}
export function ComplexSelect({
  selectId,
  value,
  options = [],
  optionHeight = 2.25,
  onChange,
  onCloseSelect,
}: ComplexSelectProps) {
  const [dropdownType, setDropdownType] = useState<DropdownType>("");

  useEffect(() => {
    const handleClickOutsideSelect = (e: any) => {
      if (dropdownType !== "" && !e.target?.closest(`#gidc-complex-select-${selectId}_wrapper`)) {
        toggleDropdown("");
      }
    };
    document.body.addEventListener("click", handleClickOutsideSelect);

    return () => document.body.removeEventListener("click", handleClickOutsideSelect);
  }, [dropdownType]);

  const toggleDropdown = (dropdownType: DropdownType) => {
    setDropdownType(dropdownType);

    if (dropdownType === "") {
      onCloseSelect && onCloseSelect();
    }

    const setupSelect = document.querySelector(`#gidc-complex-select-${selectId}_select`);

    if (dropdownType !== "") {
      setupSelect?.classList.remove("rounded-t-2.5xl", "rounded-b-2.5xl");
      setupSelect?.classList.add("rounded-t-lg");
    } else {
      setTimeout(() => {
        setupSelect?.classList.remove("rounded-t-lg");
        setupSelect?.classList.add("rounded-t-2.5xl", "rounded-b-2.5xl");
      }, 100);
    }
  };

  const onClickOption = (newValue: string | number) => () => {
    toggleDropdown("");

    if (onChange && newValue !== value) {
      onChange(newValue);
    }
  };

  const { label, renderMoreActions } = options.find((option) => option.value === value) || {};

  const heightByDropdownType = {
    "": 0,
    OPTIONS: `${options.length * optionHeight + 0.0625}rem`,
    ACTIONS: `${optionHeight}rem`,
  };

  const renderKit = {
    closeSelect: () => toggleDropdown(""),
  };

  return (
    <div id={`gidc-complex-select-${selectId}_wrapper`} className="shrink-0 relative">
      <button
        id={`gidc-complex-select-${selectId}_select`}
        className="w-full py-1 bg-orange text-black rounded-t-2.5xl rounded-b-2.5xl relative cursor-default"
        onClick={() => toggleDropdown(dropdownType === "OPTIONS" ? "" : "OPTIONS")}
      >
        <span className="w-full text-xl font-bold text-center relative z-10">{label}</span>
        <FaCaretDown className="absolute top-1/2 right-4 text-3xl -translate-y-1/2" />
      </button>

      {renderMoreActions ? (
        <button
          className="absolute top-0 left-0 w-10 h-9 pl-2 pr-1 py-1 text-1.5xl text-black flex-center"
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown(dropdownType === "ACTIONS" ? "" : "ACTIONS");
          }}
        >
          <MdMoreHoriz />
        </button>
      ) : null}

      <div
        className={cn(
          "absolute top-full z-20 w-full rounded-b-md bg-default text-black overflow-hidden transition-all duration-100 ease-linear",
          dropdownType !== "" && "border border-white"
        )}
        style={{
          height: heightByDropdownType[dropdownType],
        }}
      >
        {dropdownType === "OPTIONS" &&
          options.map(({ label, value, renderSuffix }, i) => {
            return (
              <div key={i} className="flex">
                <button
                  className="px-2 py-1 grow text-lg text-left font-bold truncate hover:bg-darkblue-2 hover:text-default cursor-default"
                  onClick={onClickOption(value || label)}
                >
                  {label}
                </button>

                {renderSuffix && renderSuffix(renderKit)}
              </div>
            );
          })}

        {dropdownType === "ACTIONS" && renderMoreActions && renderMoreActions(renderKit)}
      </div>
    </div>
  );
}
