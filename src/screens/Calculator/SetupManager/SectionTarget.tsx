import cn from "classnames";
import { Fragment, useState } from "react";
import { FaTimes } from "react-icons/fa";

import { findMonster } from "@Data/controllers";

import { useSelector } from "@Store/hooks";
import { selectTarget } from "@Store/calculatorSlice/selectors";

import { Modal } from "@Components/modals";
import { TargetConfig } from "./modal-content";

interface SectionTargetProps {
  isAtFront?: boolean;
  onMove: () => void;
}
export default function SectionTarget({ isAtFront, onMove }: SectionTargetProps) {
  const target = useSelector(selectTarget);
  const monster = useSelector((state) => state.calculator.monster);
  const monsterData = findMonster(monster);

  const [configOn, setConfigOn] = useState(false);

  return (
    <Fragment>
      <div
        className={cn(
          "px-4 py-3 rounded-xl bg-darkblue-1 cursor-default relative",
          isAtFront && "border-2 border-lesser"
        )}
        onClick={() => setConfigOn(true)}
      >
        <button
          className="w-8 h-8 absolute top-2 right-2 flex-center text-lesser text-xl hover:text-darkred"
          onClick={(e) => {
            e.stopPropagation();
            onMove();
          }}
        >
          <FaTimes />
        </button>
        <p className="text-sm text-lightred">Target</p>
        <p className="mt-1 flex justify-between">{monsterData?.title}</p>
        <p>Lv. {target.level}</p>
      </div>

      <Modal active={configOn} isCustom className="max-w-95 " onClose={() => setConfigOn(false)}>
        <TargetConfig onClose={() => setConfigOn(false)} />
      </Modal>
    </Fragment>
  );
}
