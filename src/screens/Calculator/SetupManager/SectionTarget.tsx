import { Fragment } from "react";
import { FaChevronDown, FaEdit, FaMinus } from "react-icons/fa";

import { getTargetData } from "@Data/controllers";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectTarget } from "@Store/calculatorSlice/selectors";
import { updateTarget } from "@Store/calculatorSlice";

// Component
import { IconButton, Input } from "@Src/pure-components";

interface SectionTargetProps {
  onMinimize: () => void;
  onEdit: () => void;
}
export default function SectionTarget({ onMinimize, onEdit }: SectionTargetProps) {
  const dispatch = useDispatch();
  const target = useSelector(selectTarget);
  const { title, names, variant, statuses } = getTargetData(target);

  return (
    <Fragment>
      <div className="px-4 py-3 rounded-xl bg-darkblue-1 cursor-default relative border-2 border-lesser">
        <div className="absolute top-2 bottom-0 right-2 flex flex-col text-xl text-lesser space-y-1">
          <IconButton className="hover:text-lightgold" boneOnly onClick={onMinimize}>
            <FaMinus />
          </IconButton>
          <IconButton className="pl-1 hover:text-lightgold" boneOnly onClick={onEdit}>
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
            <Input
              type="number"
              className="ml-4 w-14 px-2 py-1 leading-none text-right font-semibold"
              value={target.level}
              max={100}
              debounceTime={0}
              onChange={(value) => dispatch(updateTarget({ level: value }))}
            />
          </label>
        </div>
      </div>
    </Fragment>
  );
}
