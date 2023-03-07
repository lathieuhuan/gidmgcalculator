import clsx from "clsx";
import { Fragment, useState, useRef } from "react";
import type { CustomBuffCtrl, CustomBuffCtrlType } from "@Src/types";

// Constant
import {
  ATTACK_ELEMENTS,
  ATTACK_ELEMENT_INFO_KEYS,
  ATTACK_PATTERNS,
  REACTION_BONUS_INFO_KEYS,
  REACTIONS,
} from "@Src/constants";

// Action
import { updateCustomBuffCtrls } from "@Store/calculatorSlice";

// Util
import { percentSign, toCustomBuffLabel } from "@Src/utils";

// Hook
import { useDispatch } from "@Store/hooks";
import { useTranslation } from "@Src/hooks";

// Component
import { Input } from "@Components/atoms";
import { ButtonBar } from "@Components/molecules";
import { FaChevronDown } from "react-icons/fa";

type CustomBuffCategory = CustomBuffCtrl["category"];

const CATEGORIES: Record<
  CustomBuffCategory,
  { label: string; types: readonly CustomBuffCtrlType[]; subTypes?: readonly string[] }
> = {
  totalAttr: {
    label: "Attributes",
    types: ["hp", "hp_", "atk", "atk_", "def", "def_", "em", "er_", "cRate_", "cDmg_", "shieldS_", "healB_"],
  },
  attElmtBonus: {
    label: "Elements",
    types: ATTACK_ELEMENTS,
    subTypes: ["pct_", ...ATTACK_ELEMENT_INFO_KEYS],
  },
  attPattBonus: {
    label: "Talents",
    types: ["all", ...ATTACK_PATTERNS],
    subTypes: ["pct_", "flat", "cRate_", "cDmg_", "defIgn_"],
  },
  rxnBonus: {
    label: "Reactions",
    types: REACTIONS,
    subTypes: REACTION_BONUS_INFO_KEYS,
  },
};

interface BuffCtrlCreatorProps {
  onClose: () => void;
}
const BuffCtrlCreator = ({ onClose }: BuffCtrlCreatorProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const [config, setConfig] = useState<CustomBuffCtrl>({
    category: "totalAttr",
    type: "atk_",
    value: 0,
  });

  const subTypes = CATEGORIES[config.category].subTypes;
  const sign = percentSign(config.subType || config.type);

  const onChangeCategory = (category: CustomBuffCategory) => {
    const subType = CATEGORIES[category].subTypes?.[0] as CustomBuffCtrl["subType"];

    setConfig({
      category,
      type: CATEGORIES[category].types[0] as CustomBuffCtrlType,
      ...(subType ? { subType } : undefined),
      value: 0,
    });
  };

  const onChangeType = (type: string) => {
    setConfig({
      ...config,
      type: type as CustomBuffCtrlType,
    });

    inputRef.current?.focus();
  };

  const onChangeSubType = (subType: string) => {
    setConfig({
      ...config,
      subType: subType as CustomBuffCtrl["subType"],
      value: 0,
    });

    inputRef.current?.focus();
  };

  const onConfirm = () => {
    dispatch(updateCustomBuffCtrls({ actionType: "add", ctrls: config }));
    onClose();
  };

  return (
    <Fragment>
      <div className="flex flex-col md1:flex-row">
        {Object.entries(CATEGORIES).map(([category, { label }], index) => {
          const chosen = config.category === category;

          return (
            <button
              key={category}
              className={clsx(
                "px-4 py-1",
                !index && "rounded-t-lg md1:rounded-tr-none md1:rounded-l-lg",
                index === 3 && "rounded-b-lg md1:rounded-bl-none md1:rounded-r-lg",
                chosen ? "bg-default" : "bg-darkblue-3"
              )}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (!chosen) {
                  onChangeCategory(category as CustomBuffCategory);
                }
              }}
            >
              <p className={clsx("text-lg font-semibold text-center", chosen && "text-black")}>{label}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-4 mx-auto flex-center flex-col md1:flex-row md1:space-x-3">
        <div className="mt-4 flex items-center relative">
          <FaChevronDown className="absolute -z-10" />
          <select
            className="pl-6 pr-2 text-default appearance-none capitalize"
            value={config.type}
            onChange={(e) => onChangeType(e.target.value)}
          >
            {CATEGORIES[config.category].types.map((option) => (
              <option key={option} className="pr-2" value={option}>
                {toCustomBuffLabel(config.category, option, t)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex items-center">
          {subTypes ? (
            ["melt", "vaporize"].includes(config.type) ? (
              <span className="px-2">{t("pct_")}</span>
            ) : (
              <div className="flex items-center relative">
                <FaChevronDown className="absolute -z-10" />
                <select
                  className="pl-6 pr-2 text-default appearance-none"
                  value={config.subType}
                  onChange={(e) => onChangeSubType(e.target.value)}
                >
                  {subTypes.map((subType, i) => (
                    <option key={i} className="disabled:bg-lesser" value={subType}>
                      {t(subType)}
                    </option>
                  ))}
                </select>
              </div>
            )
          ) : null}

          <Input
            ref={inputRef}
            type="number"
            className="w-16 ml-3 px-2 py-1 text-lg text-right font-semibold"
            autoFocus
            value={config.value}
            min={sign ? -99 : -9999}
            max={sign ? 999 : 99_999}
            onChange={(value) => {
              setConfig((prev) => ({ ...prev, value }));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onConfirm();
              }
            }}
          />
          <span className="ml-2">{sign}</span>
        </div>
      </div>
      <ButtonBar
        className="mt-8"
        buttons={[
          { text: "Cancel", onClick: onClose },
          { text: "Confirm", onClick: onConfirm },
        ]}
      />
    </Fragment>
  );
};

export default BuffCtrlCreator;
