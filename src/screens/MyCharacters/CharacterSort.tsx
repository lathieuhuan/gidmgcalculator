import { useState } from "react";
import { FaChevronDown, FaSort } from "react-icons/fa";
import { createSelector } from "@reduxjs/toolkit";
import type { DragEventHandler, HTMLAttributes, ReactNode } from "react";

import { findByIndex, splitLv } from "@Src/utils";
import { $AppCharacter } from "@Src/services";
import { useStoreSnapshot } from "@Src/features";

// Store
import { useDispatch } from "@Store/hooks";
import { sortCharacters } from "@Store/userDatabaseSlice";
import { selectUserChars } from "@Store/userDatabaseSlice/selectors";

// Component
import { Popover, SharedSpace, Modal } from "@Src/pure-components";

const selectCharacterToBeSorted = createSelector(selectUserChars, (userChars) =>
  userChars.map((char, index) => {
    const { name, rarity } = $AppCharacter.get(char.name);
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
      <div className="px-2 py-1 h-10 bg-dark-500" hidden={!visiblePlot}></div>

      <div className="px-2 py-1 flex items-center hover:bg-dark-700">
        <div className="w-8 h-8 mr-2 flex-center text-light-400 pointer-events-none">{marker}</div>

        <p className="pointer-events-none text-light-400">
          <span className={`text-rarity-${char.rarity}`}>{char.name}</span> (Lv. {char.level})
        </p>
      </div>
    </div>
  );
};

function SortInner({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch();

  const toBeSorted = useStoreSnapshot(selectCharacterToBeSorted);

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
    <form
      id="sort-characters-form"
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onConfirmOrder();
      }}
    >
      <div className="h-8 flex justify-between">
        <div className="px-4 flex group relative cursor-default">
          <p className="h-full flex items-center space-x-2">
            <span>Quick sort</span>
            <FaChevronDown className="text-sm" />
          </p>
          <Popover
            as="div"
            className="px-1 py-2 top-full bg-dark-700 rounded group-hover:scale-100 space-y-2"
            origin="top-left"
          >
            {quickSortOptions.map(({ label, onSelect }, i) => {
              return (
                <p key={i} className="px-2 py-1 rounded-sm hover:bg-dark-500" onClick={onSelect}>
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
              className="text-center cursor-default bg-dark-700 rounded"
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

      <div className="custom-scrollbar" style={{ height: "60vh" }}>
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
    </form>
  );
}

export default Modal.wrap(SortInner, {
  preset: "small",
  title: "Sort characters",
  className: "bg-dark-900",
  withActions: true,
  formId: "sort-characters-form",
});
