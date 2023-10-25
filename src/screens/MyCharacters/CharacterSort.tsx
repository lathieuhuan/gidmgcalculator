import { useState } from "react";
import { FaChevronDown, FaSort, FaTimes } from "react-icons/fa";
import { createSelector } from "@reduxjs/toolkit";
import type { DragEventHandler, HTMLAttributes, ReactNode } from "react";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { sortCharacters } from "@Store/userDatabaseSlice";
import { selectUserChars } from "@Store/userDatabaseSlice/selectors";

// Util
import { findByIndex, splitLv } from "@Src/utils";
import { appData } from "@Src/data";

// Component
import { ButtonGroup, Popover, SharedSpace, withModal, Button } from "@Src/pure-components";

const selectCharacterToBeSorted = createSelector(selectUserChars, (userChars) =>
  userChars.map((char, index) => {
    const { name, rarity } = appData.getCharData(char.name);
    return { name, level: char.level, rarity, index };
  })
);

interface LineProps extends HTMLAttributes<HTMLDivElement> {
  char: { name: string; level: string; rarity: number; index: number };
  marker?: ReactNode;
  visiblePlot?: boolean;
}
const Line = ({ char, marker, visiblePlot, ...rest }: LineProps) => {
  return (
    <div key={char.name} className="flex flex-col cursor-default select-none" {...rest}>
      <div className="px-2 py-1 h-10 bg-darkblue-3" hidden={!visiblePlot}></div>

      <div className="px-2 py-1 flex items-center hover:bg-darkblue-2">
        <div className="w-8 h-8 mr-2 flex-center text-default pointer-events-none">{marker}</div>

        <p className="pointer-events-none text-default">
          <span className={`text-rarity-${char.rarity} font-bold`}>{char.name}</span> (Lv. {char.level})
        </p>
      </div>
    </div>
  );
};

function SortInner({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch();

  const toBeSorted = useSelector(selectCharacterToBeSorted);

  const [list, setList] = useState(toBeSorted);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [markedList, setMarkedList] = useState<number[]>([]);
  const [inMarkingMode, setInMarkingMode] = useState(false);

  const onSortByName = () => {
    setList((prev) => {
      const newList = [...prev];
      newList.sort((a, b) => a.name.localeCompare(b.name));

      return newList;
    });
  };

  const onSortByLevel = () => {
    setList((prev) => {
      const newList = [...prev];

      return newList.sort((a, b) => {
        const [fA, sA] = splitLv(a);
        const [fB, sB] = splitLv(b);

        if (fA !== fB) {
          return fB - fA;
        }

        return sB - sA;
      });
    });
  };

  const onSortByRarity = () => {
    setList((prev) => {
      const newList = [...prev];

      return newList.sort((a, b) => b.rarity - a.rarity);
    });
  };

  const onDragStart: DragEventHandler = (e) => {
    setDragIndex(+e.currentTarget.id);
  };

  const onDragEnter: DragEventHandler = (e) => {
    setDropIndex(+e.currentTarget.id);
  };

  const onDragOver: DragEventHandler = (e) => {
    e.preventDefault();
  };
  const onDrop = () => {
    if (dropIndex !== null && dragIndex !== null && dropIndex !== dragIndex) {
      setList((prev) => {
        const newList = [...prev];
        newList.splice(dragIndex < dropIndex ? dropIndex - 1 : dropIndex, 0, newList.splice(dragIndex, 1)[0]);
        return newList;
      });
    }

    setDropIndex(null);
  };

  const onClickLine = (index: number) => {
    if (!inMarkingMode) {
      return;
    }

    setMarkedList((prevMarkedList) => {
      const exitedIndex = prevMarkedList.indexOf(index);

      if (exitedIndex !== -1) {
        return prevMarkedList.splice(0, exitedIndex);
      }

      return [...prevMarkedList, index];
    });
  };

  const onToggleMarkingMode = () => {
    setInMarkingMode(!inMarkingMode);

    if (inMarkingMode) {
      setMarkedList([]);
    }
  };

  const onConfirmOrder = () => {
    let orderedIndexes = [];

    if (inMarkingMode) {
      const remainIndexes = [];

      for (const { index } of list) {
        if (!markedList.includes(index)) {
          remainIndexes.push(index);
        }
      }

      orderedIndexes = markedList.concat(remainIndexes);
    } else {
      orderedIndexes = list.map(({ index }) => index);
    }

    dispatch(sortCharacters(orderedIndexes));
    onClose();
  };

  const quickSortOptions = [
    {
      label: "By name",
      onSelect: onSortByName,
    },
    {
      label: "By level",
      onSelect: onSortByLevel,
    },
    {
      label: "By rarity",
      onSelect: onSortByRarity,
    },
  ];

  return (
    <div className="px-2 py-4 rounded-lg bg-darkblue-1">
      <Button
        className="absolute top-1 right-1 text-xl hover:text-darkred"
        boneOnly
        icon={<FaTimes />}
        onClick={onClose}
      />

      <p className="text-1.5xl text-orange text-center">Sort characters</p>

      <div className="mt-1 h-8 flex justify-between">
        <div className="px-4 flex group relative cursor-default">
          <p className="h-full flex items-center space-x-2">
            <span>Quick sort</span>
            <FaChevronDown />
          </p>
          <Popover
            as="div"
            className="px-1 py-2 top-full bg-darkblue-2 rounded group-hover:scale-100 space-y-2"
            origin="top-left"
          >
            {quickSortOptions.map(({ label, onSelect }, i) => {
              return (
                <p key={i} className="px-2 py-1 rounded-sm hover:bg-darkblue-3" onClick={onSelect}>
                  {label}
                </p>
              );
            })}
          </Popover>
        </div>

        <div className="flex items-center">
          <span>Mode</span>
          <div className="h-full px-2 select-none" style={{ width: 120 }}>
            <SharedSpace
              className="text-center cursor-default bg-darkblue-2 rounded"
              atLeft={!inMarkingMode}
              leftPart={
                <p className="h-full flex-center" onClick={onToggleMarkingMode}>
                  Drag & drop
                </p>
              }
              rightPart={
                <p className="h-full flex-center" onClick={onToggleMarkingMode}>
                  Mark order
                </p>
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-4 custom-scrollbar" style={{ height: "60vh" }}>
        <div>
          {inMarkingMode &&
            markedList.map((index, i) => {
              const char = findByIndex(list, index);

              if (char) {
                return <Line key={char.name} char={char} marker={i + 1} onClick={() => onClickLine(char.index)} />;
              }

              return null;
            })}
          {inMarkingMode
            ? list
                .filter((char) => !markedList.includes(char.index))
                .map((char) => {
                  return <Line key={char.name} char={char} onClick={() => onClickLine(char.index)} />;
                })
            : list.map((char, i) => {
                return (
                  <Line
                    key={char.name}
                    id={i.toString()}
                    char={char}
                    visiblePlot={i === dropIndex}
                    draggable={!inMarkingMode}
                    marker={<FaSort size="1.25rem" />}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnter={onDragEnter}
                    onDrop={onDrop}
                  />
                );
              })}
        </div>
      </div>

      <ButtonGroup
        className="mt-4 flex justify-center"
        space="space-x-4"
        buttons={[
          {
            text: "Confirm",
            onClick: onConfirmOrder,
          },
        ]}
      />
    </div>
  );
}

export default withModal(SortInner, { className: "small-modal" });
