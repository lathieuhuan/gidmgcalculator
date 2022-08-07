import cn from "classnames";
import { DragEventHandler, useState } from "react";
import { FaSort } from "react-icons/fa";

import { createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "@Store/hooks";
import { selectMyChars } from "@Store/usersDatabaseSlice/selectors";
import { findCharacter } from "@Data/controllers";
import { splitLv } from "@Src/utils";

import { Modal } from "@Components/modals";
import { Button, CloseButton } from "@Src/styled-components";
import { ButtonBar } from "@Components/minors";

import styles from "./styles.module.scss";
import { sortCharacters } from "@Store/usersDatabaseSlice";

const selectCharacterToBeSorted = createSelector(selectMyChars, (myChars) =>
  myChars.map((char, index) => {
    const { name, rarity } = findCharacter(char)!;
    return { name, level: char.level, rarity, index };
  })
);

export function CharacterSort({ onClose }: { onClose: () => void }) {
  const toBeSorted = useSelector(selectCharacterToBeSorted);
  const dispatch = useDispatch();

  const [list, setList] = useState(toBeSorted);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

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
    if (dropIndex && dragIndex && dropIndex !== dragIndex) {
      setList((prev) => {
        const newList = [...prev];
        newList.splice(
          dragIndex < dropIndex ? dropIndex - 1 : dropIndex,
          0,
          newList.splice(dragIndex, 1)[0]
        );
        return newList;
      });
    }
    setDropIndex(null);
  };

  console.log(dropIndex);

  return (
    <Modal onClose={onClose}>
      <div
        className={cn(
          "px-2 py-4 rounded-lg bg-darkblue-2 shadow-white-glow",
          styles["character-sort"]
        )}
      >
        <CloseButton className="absolute top-2 right-2" onClick={onClose} />
        <p className="text-h4 text-orange text-center">Sort by</p>
        <ButtonBar
          className="mt-4 gap-4"
          texts={["Name", "Level", "Rarity"]}
          variants={["neutral", "neutral", "neutral"]}
          handlers={[
            () =>
              setList((prev) => {
                const newList = [...prev];
                newList.sort((a, b) => a.name.localeCompare(b.name));
                return newList;
              }),
            () =>
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
              }),
            () =>
              setList((prev) => {
                const newList = [...prev];
                return newList.sort((a, b) => {
                  return b.rarity - a.rarity;
                });
              }),
          ]}
        />

        <div className={cn("mt-4 custom-scrollbar", styles["list-wrapper"])}>
          <div>
            {list.map((char, i) => (
              <div
                key={i}
                id={i.toString()}
                className={cn(
                  "px-2 py-1 flex items-center cursor-default select-none hover:bg-darkblue-1",
                  i === dropIndex && "border-t border-white"
                )}
                draggable="true"
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnter={onDragEnter}
                onDrop={onDrop}
              >
                <button className="w-8 h-8 mr-2 text-default  pointer-events-none ">
                  <FaSort size="1.25rem" />
                </button>
                <p className="pointer-events-none">
                  <span className={`text-rarity-${char.rarity} font-bold`}>{char.name}</span> (Lv.{" "}
                  {char.level})
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <Button
            variant="positive"
            onClick={() => {
              dispatch(sortCharacters(list.map(({ index }) => index)));
              onClose();
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}
