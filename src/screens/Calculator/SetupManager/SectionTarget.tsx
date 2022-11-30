import cn from "classnames";
import { Fragment, useState } from "react";
import { FaChevronDown, FaEdit, FaTimes } from "react-icons/fa";

import { findMonster } from "@Data/controllers";

import { useDispatch, useSelector } from "@Store/hooks";
import { selectTarget } from "@Store/calculatorSlice/selectors";

import { Modal } from "@Components/modals";
import { TargetConfig } from "./modal-content";
import { Select } from "@Src/styled-components";
import { updateTarget } from "@Store/calculatorSlice";

interface SectionTargetProps {
  isAtFront?: boolean;
  onMove: () => void;
}
export default function SectionTarget({ isAtFront, onMove }: SectionTargetProps) {
  const dispatch = useDispatch();
  const target = useSelector(selectTarget);
  const monster = useSelector((state) => state.calculator.monster);
  const monsterData = findMonster(monster);

  const [configOn, setConfigOn] = useState(false);

  let variantLabel = "";

  if (monsterData?.variant) {
    const { types } = monsterData.variant;

    for (const type of types) {
      if (typeof type === "string" && type === monster.variantType) {
        variantLabel = `(${type})`;
      } else if (typeof type === "object" && type.value === monster.variantType) {
        variantLabel = type.label;
      }
    }
  }

  return (
    <Fragment>
      <div
        className={cn(
          "px-4 py-3 rounded-xl bg-darkblue-1 cursor-default relative",
          isAtFront && "border-2 border-lesser"
        )}
      >
        <div className="absolute top-2 bottom-0 right-2 flex flex-col text-xl text-lesser space-y-1">
          <button className="w-8 h-8 flex-center hover:text-darkred" onClick={onMove}>
            <FaTimes />
          </button>
          <button
            className="w-8 h-8 pl-1 flex-center hover:text-lightgold"
            onClick={() => setConfigOn(true)}
          >
            <FaEdit />
          </button>
        </div>
        <p className="text-sm text-lightred">Target</p>

        <div className="mt-2 pr-6 flex flex-col items-start">
          {monsterData?.names ? (
            <div className="flex items-center relative">
              <FaChevronDown className="absolute top-1 left-0" />
              <Select className="pl-6 pr-2 py-1 leading-none relative z-10 appearance-none text-lg ">
                {monsterData.names.map((name, i) => {
                  return <option key={i}>{name}</option>;
                })}
              </Select>
            </div>
          ) : (
            <p className="text-lg">{monsterData?.title}</p>
          )}

          {variantLabel && <p className="mt-1">{variantLabel}</p>}

          <label className="mt-3 flex items-center">
            <span>Level</span>
            <input
              className="ml-4 w-14 px-2 py-1 leading-none text-right font-semibold textinput-common"
              value={target.level}
              onChange={(e) => {
                const value = +e.target.value;

                if (!isNaN(value) && value >= 0 && value <= 100) {
                  dispatch(updateTarget({ level: value }));
                }
              }}
            />
          </label>
        </div>
      </div>

      <Modal active={configOn} className="max-w-95" onClose={() => setConfigOn(false)}>
        <TargetConfig onClose={() => setConfigOn(false)} />
      </Modal>
    </Fragment>
  );
}
