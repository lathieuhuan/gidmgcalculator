import clsx from "clsx";
import { Fragment, useState } from "react";
import { FaChevronDown, FaEdit } from "react-icons/fa";

// Util
import { getTargetData } from "@Src/utils/setup";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Selector
import { selectTarget } from "@Store/calculatorSlice/selectors";

// Action
import { updateTarget } from "@Store/calculatorSlice";

// Component
import { CloseButton, IconButton } from "@Components/atoms";
import { Modal } from "@Components/molecules";
import { TargetConfig } from "./modal-content";

interface SectionTargetProps {
  isAtFront?: boolean;
  onMove: () => void;
}
export default function SectionTarget({ isAtFront, onMove }: SectionTargetProps) {
  const dispatch = useDispatch();
  const target = useSelector(selectTarget);
  const { title, names, variant, statuses } = getTargetData(target);

  const [configOn, setConfigOn] = useState(false);

  return (
    <Fragment>
      <div
        className={clsx(
          "px-4 py-3 rounded-xl bg-darkblue-1 cursor-default relative",
          isAtFront && "border-2 border-lesser"
        )}
      >
        <div className="absolute top-2 bottom-0 right-2 flex flex-col text-xl text-lesser space-y-1">
          <CloseButton boneOnly onClick={onMove} />
          <IconButton
            className="pl-1 hover:text-lightgold"
            boneOnly
            onClick={() => setConfigOn(true)}
          >
            <FaEdit />
          </IconButton>
        </div>
        <p className="text-sm text-lightred">Target</p>

        <div className="mt-2 pr-6 flex flex-col items-start">
          {names ? (
            <div className="flex items-center relative">
              <FaChevronDown className="absolute top-1 left-0" />
              <select className="pl-6 pr-2 py-1 leading-none relative z-10 appearance-none text-lg">
                {names.map((name, i) => {
                  return <option key={i}>{name}</option>;
                })}
              </select>
            </div>
          ) : (
            <p className="text-lg">{title}</p>
          )}

          {variant && <p className="mt-1">{variant}</p>}

          {statuses.length ? (
            <ul className="mt-1 pl-4 list-disc">
              {statuses.map((status, i) => {
                return <li key={i}>{status}</li>;
              })}
            </ul>
          ) : null}

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

      <Modal active={configOn} className="h-large-modal" onClose={() => setConfigOn(false)}>
        <TargetConfig onClose={() => setConfigOn(false)} />
      </Modal>
    </Fragment>
  );
}
