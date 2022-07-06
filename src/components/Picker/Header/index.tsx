import { useState } from "react";
import Collapse from "@Components/Collapse";
import ModalHeader from "@Styled/ModalHeader";
import CharFilter from "./CharFilter";
import { Checkbox } from "@Src/styled-components/Inputs";
import type { DataType, Filter, FilterFn } from "../types";

interface HeaderProps {
  dataType: DataType;
  needMassAdd: boolean;
  massAdd: boolean;
  toggleMassAdd: () => void;
  count: number;
  filter: Filter;
  setFilter: FilterFn;
  close: () => void;
}
export default function Header({
  dataType,
  needMassAdd,
  massAdd,
  toggleMassAdd,
  count,
  filter,
  setFilter,
  close,
}: HeaderProps) {
  const [filterOn, setFilterOn] = useState(false);

  return (
    <ModalHeader>
      {dataType === "character" && (
        <>
          <ModalHeader.FilterButton
            active={filterOn}
            onClick={() => setFilterOn(!filterOn)}
          />

          <div className="absolute w-full top-full left-0 z-10">
            <div className="rounded-b-lg bg-darkblue-3 shadow-common">
              <Collapse active={filterOn}>
                <CharFilter
                  {...filter}
                  setFilter={setFilter}
                  closeFilter={() => setFilterOn(false)}
                />
              </Collapse>
            </div>
          </div>
        </>
      )}

      {needMassAdd && (
        <div className="absolute right-16 flex items-center">
          <Checkbox checked={massAdd} onChange={toggleMassAdd} />
          <p className="mt-1 ml-2 font-bold text-black">Mass Add ({count})</p>
        </div>
      )}

      <ModalHeader.CloseButton onClick={close} />
    </ModalHeader>
  );
}
