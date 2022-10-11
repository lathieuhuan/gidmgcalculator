import cn from "classnames";
import { useState, useEffect } from "react";
import { FaCaretDown } from "react-icons/fa";

interface ComplexSelectProps {
  selectId: string;
  value?: string;
  options?: Array<{
    label: string;
    value?: string | number;
    suffix?: JSX.Element;
  }>;
  optionHeight?: number;
  onChange?: (value: string | number) => void;
}
export function ComplexSelect({
  selectId,
  value,
  options = [],
  optionHeight = 2.5,
  onChange,
}: ComplexSelectProps) {
  const [showingOptions, setShowingOptions] = useState(false);

  useEffect(() => {
    const handleClickOutsideSelect = (e: any) => {
      if (showingOptions && !e.target?.closest(`#gidc-${selectId}`)) {
        toggleOptions(false);
      }
    };
    document.body.addEventListener("click", handleClickOutsideSelect);

    return () => document.body.removeEventListener("click", handleClickOutsideSelect);
  }, [showingOptions]);

  const toggleOptions = (isOn: boolean) => {
    setShowingOptions(isOn);

    const setupSelect = document.querySelector(`#gidc-${selectId}`);
    if (isOn) {
      setupSelect?.classList.remove("rounded-t-2.5xl", "rounded-b-2.5xl");
      setupSelect?.classList.add("rounded-t-lg");
    } else {
      setTimeout(() => {
        setupSelect?.classList.remove("rounded-t-lg");
        setupSelect?.classList.add("rounded-t-2.5xl", "rounded-b-2.5xl");
      }, 100);
    }
  };

  const onClickOption = (value: string | number) => () => {
    toggleOptions(false);

    onChange && onChange(value);
  };

  return (
    <div id={`gidc-${selectId}_wrapper`} className="shrink-0 relative">
      <button
        id={`gidc-${selectId}`}
        className="w-full py-1 bg-orange text-black rounded-t-2.5xl rounded-b-2.5xl relative cursor-default"
        onClick={() => toggleOptions(!showingOptions)}
      >
        <span className="w-full text-xl font-bold text-center relative z-10">{value}</span>
        <FaCaretDown className="absolute top-1/2 right-4 text-3xl -translate-y-1/2" />
      </button>

      <div
        className={cn(
          "absolute top-full z-20 w-full rounded-b-md bg-default text-black overflow-hidden transition-all duration-100 ease-linear",
          showingOptions && "border border-white"
        )}
        style={{
          height: showingOptions ? `${options.length * optionHeight}rem` : 0,
        }}
      >
        {options.map(({ label, value, suffix }, i) => {
          return (
            <div key={i} className="flex">
              <button
                className="pl-3 py-1.5 grow text-lg text-left font-bold truncate hover:bg-darkblue-2 hover:text-default"
                onClick={onClickOption(value || label)}
              >
                {label}
              </button>

              {suffix}
            </div>
          );
        })}
      </div>
    </div>
  );
}
