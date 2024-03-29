import { FaChevronDown, FaEdit, FaMinus } from "react-icons/fa";

import { $AppData } from "@Src/services";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectTarget } from "@Store/calculatorSlice/selectors";
import { updateTarget } from "@Store/calculatorSlice";

// Component
import { Button, Input } from "@Src/pure-components";

import styles from "./styles.module.scss";

interface SectionTargetProps {
  onMinimize: () => void;
  onEdit: () => void;
}
export default function SectionTarget({ onMinimize, onEdit }: SectionTargetProps) {
  const dispatch = useDispatch();
  const target = useSelector(selectTarget);
  const { title, names, variant, statuses } = $AppData.getTargetInfo(target);

  return (
    <div className={"px-4 py-3 bg-dark-900 cursor-default relative " + styles.section}>
      <div className="absolute top-2 bottom-0 right-2 flex flex-col text-xl text-light-800 space-y-1">
        <Button boneOnly icon={<FaMinus />} onClick={onMinimize} />
        <Button boneOnly icon={<FaEdit />} onClick={onEdit} />
      </div>
      <p className="text-sm text-red-100">Target</p>

      <div className="mt-2 pr-6 flex flex-col items-start">
        {names ? (
          <div className="flex items-center relative">
            <FaChevronDown className="absolute top-1/2 left-1 -translate-y-1/2 text-sm" />
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
  );
}
