import cn from "classnames";
import { RefObject, useEffect, useState } from "react";
import { FaSort, FaTh } from "react-icons/fa";

import { findCharacter } from "@Data/controllers";
import { wikiImg } from "@Src/utils";
import { chooseCharacter } from "@Store/usersDatabaseSlice";
import { selectChosenChar, selectMyChars } from "@Store/usersDatabaseSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";

import { IconButton } from "@Src/styled-components";
import { Picker } from "@Components/Picker";

import styles from "../styles.module.scss";

interface TopBarProps {
  characterNames: string[];
  characterListRef: RefObject<HTMLDivElement>;
  onCliceSort: () => void;
  onClickWish: () => void;
}
export default function SideIconCarousel({
  characterNames,
  characterListRef,
  onCliceSort,
  onClickWish,
}: TopBarProps) {
  const [gridviewOn, setGridviewOn] = useState(false);
  const chosenChar = useSelector(selectChosenChar);
  const dispatch = useDispatch();

  console.log(characterNames);

  const scrollList = (name: string) => () => {
    if (characterListRef.current) {
      characterListRef.current.scrollLeft = characterNames.indexOf(name) * 84;
    }
  };

  useEffect(() => {
    scrollList(chosenChar);
    const thisCpn = characterListRef.current;

    const scrollHorizontally = (e: any) => {
      const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
      if (thisCpn) {
        thisCpn.scrollLeft -= delta * 50;
      }
      e.preventDefault();
    };

    thisCpn?.addEventListener("wheel", scrollHorizontally);
    return () => thisCpn?.removeEventListener("wheel", scrollHorizontally);
  }, []);

  return (
    <div className="w-full flex justify-center bg-darkblue-2">
      <div className={cn(styles["side-icon-carousel"])}>
        {characterNames.length ? (
          <div className="absolute top-8 right-full flex">
            <IconButton className="mr-4 text-xl" variant="positive" onClick={onCliceSort}>
              <FaSort />
            </IconButton>
            <IconButton className="mr-4" variant="positive" onClick={() => setGridviewOn(true)}>
              <FaTh />
            </IconButton>
          </div>
        ) : null}

        <div ref={characterListRef} className="mt-2 flex w-full hide-scrollbar">
          {characterNames.length ? (
            characterNames.map((name) => {
              const databaseChar = findCharacter({ name });
              if (!databaseChar) {
                return null;
              }
              const { beta, sideIcon, icon } = databaseChar;

              return (
                <div
                  key={name}
                  className={cn(
                    "mx-1 border-b-3 border-transparent cursor-pointer",
                    name === chosenChar && styles["active-cell"]
                  )}
                  onClick={() => dispatch(chooseCharacter(name))}
                >
                  <div
                    className={cn(
                      "rounded-circle border-3 border-lesser/30  bg-black/30",
                      styles["icon-wrapper"],
                      sideIcon
                        ? cn("m-2", styles["side-icon-wrapper"])
                        : cn("m-1 overflow-hidden", styles["beta-icon-wrapper"])
                    )}
                  >
                    <img
                      src={beta ? icon : wikiImg(sideIcon || icon)}
                      alt="icon"
                      draggable={false}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full h-20 flex justify-end items-center">
              <p className="text-h2 font-bold text-lightgold">Add New Characters {">>"}</p>
            </div>
          )}
        </div>

        <button
          className="absolute top-4 left-full ml-6 w-15 rounded-circle hover:shadow-3px-3px hover:shadow-white"
          onClick={onClickWish}
        >
          <img src={wikiImg("4/48/System_Wish")} alt="wish" draggable={false} />
        </button>
      </div>

      {gridviewOn && (
        <CharacterPicker scrollList={scrollList} onClose={() => setGridviewOn(false)} />
      )}
    </div>
  );
}

interface CharacterPickerProps {
  scrollList: (name: string) => void;
  onClose: () => void;
}
function CharacterPicker({ scrollList, onClose }: CharacterPickerProps) {
  const myChars = useSelector(selectMyChars);
  const dispatch = useDispatch();

  const data: any[] = [];
  myChars.forEach(({ name, cons }) => {
    const databaseChar = findCharacter({ name });

    if (databaseChar) {
      const { code, icon, rarity, vision, weapon } = databaseChar;
      data.push({ name, cons, code, icon, rarity, vision, weapon });
    }
  });

  return (
    <Picker
      data={data}
      dataType="character"
      onPickItem={({ name }) => {
        dispatch(chooseCharacter(name));
        scrollList(name);
      }}
      onClose={onClose}
    />
  );
}
