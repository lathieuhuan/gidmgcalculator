import { useState } from "react";
import classNames from "classnames";

import { initArtPiece, initWeapon } from "@Store/calculatorSlice/initiators";
import { Artifact, Weapon } from "@Src/types";
import type { DataType, Filter, PickerItem } from "./types";
import weapons from "@Data/weapons";
import artifacts from "@Data/artifacts";

import { CollapseSpace } from "@Components/Collapse";
import { Checkbox, ModalHeader } from "@Src/styled-components";
import { Modal } from "../modals";
import CharFilter from "./CharFilter";
import MemoItem from "./Item";

const { FilterButton, CloseButton } = ModalHeader;

const DEFAULT_FILTER: Filter = { type: "", value: "" };

interface PickerProps {
  data: PickerItem[];
  dataType: DataType;
  needMassAdd?: boolean;
  onPickItem: (item: PickerItem) => void;
  onClose: () => void;
}
function Picker({ data, dataType, needMassAdd, onPickItem, onClose }: PickerProps) {
  //
  const [filterOn, setFilterOn] = useState(false);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [massAdd, setMassAdd] = useState(false);
  const [amount, setAmount] = useState({
    total: 0,
    each: data.map(() => 0),
  });

  let filteredNames: string[] = [];
  if (dataType === "character" && filter.type) {
    for (const char of data) {
      if (char[filter.type] === filter.value) {
        filteredNames.push(char.name);
      }
    }
  }
  return (
    <Modal standard onClose={onClose}>
      <div className="p-2 h-[10%]">
        <ModalHeader>
          {dataType === "character" && (
            <>
              <FilterButton active={filterOn} onClick={() => setFilterOn(!filterOn)} />
              <div className="absolute w-full top-full left-0 z-10">
                <div className="rounded-b-lg bg-darkblue-3 shadow-common">
                  <CollapseSpace active={filterOn}>
                    <CharFilter
                      {...filter}
                      onClickOption={(isChosen, newFilter) => {
                        setFilter(isChosen ? DEFAULT_FILTER : newFilter);
                        setFilterOn(false);
                      }}
                    />
                  </CollapseSpace>
                </div>
              </div>
            </>
          )}
          {needMassAdd && (
            <div className="absolute right-16 flex items-center">
              <Checkbox checked={massAdd} onChange={() => setMassAdd((prev) => !prev)} />
              <p className="mt-1 ml-2 font-bold text-black">Mass Add ({amount.total})</p>
            </div>
          )}

          <CloseButton onClick={onClose} />
        </ModalHeader>
      </div>

      <div className="px-4 pt-2 pb-4 h-[90%]">
        <div className="pr-4 full-h overflow-auto custom-scrollbar">
          <div className="flex flex-wrap">
            {data.map((item, i) => {
              return (
                <div
                  key={item.code.toString() + item.rarity}
                  className={classNames(
                    "grow-0 max-w-1/3 basis-1/3 md1:max-w-1/5 md1:basis-1/5 md2:max-w-1/6 md2:basis-1/6 lg:max-w-1/8 lg:basis-[12.5%]",
                    { hidden: filter.type && !filteredNames.includes(item.name) }
                  )}
                >
                  <MemoItem
                    item={item}
                    massAdd={massAdd}
                    pickedAmount={amount.each[i]}
                    onClickItem={() => {
                      onPickItem(item);
                      if (!massAdd) {
                        close();
                      } else {
                        setAmount((prev) => {
                          const each = [...prev.each];
                          if (dataType !== "character") {
                            each[i] += 1;
                          }
                          return { total: prev.total + 1, each };
                        });
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

interface PickerWeaponProps {
  wpType: Weapon;
  needMassAdd?: boolean;
  onPickItem: (info: ReturnType<typeof initWeapon>) => void;
  onClose: () => void;
}
Picker.Weapon = ({ wpType, needMassAdd, onPickItem, onClose }: PickerWeaponProps) => {
  const data = weapons[wpType].map(({ code, name, beta, icon, rarity }) => ({
    code,
    name,
    beta,
    icon,
    rarity,
  }));
  return (
    <Picker
      needMassAdd={needMassAdd}
      data={data}
      dataType="weapon"
      onPickItem={({ code }) => onPickItem(initWeapon({ type: wpType, code }))}
      onClose={onClose}
    />
  );
};

interface PickerArtifactProps {
  artType: Artifact;
  needMassAdd?: boolean;
  onPickItem: (info: ReturnType<typeof initArtPiece>) => void;
  onClose: () => void;
}
Picker.Artifact = ({ artType, needMassAdd, onPickItem, onClose }: PickerArtifactProps) => {
  const gold = [];
  const purple = [];
  for (const set of artifacts) {
    const { code, beta, name } = set;
    for (const rarity of set.variants) {
      const { icon } = set[artType];
      if (rarity === 5) {
        gold.push({ code, beta, name, icon, rarity });
      } else {
        purple.push({ code, beta, name, icon, rarity });
      }
    }
  }
  return (
    <Picker
      needMassAdd={needMassAdd}
      data={[...gold, ...purple]}
      dataType="artifact"
      onPickItem={({ code, rarity }) => onPickItem(initArtPiece({ type: artType, code, rarity }))}
      onClose={onClose}
    />
  );
};

export default Picker;
