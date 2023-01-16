import clsx from "clsx";
import { RefObject, useEffect, useState } from "react";
import { FaSort, FaTh, FaArrowAltCircleUp } from "react-icons/fa";

// Util
import { getImgSrc } from "@Src/utils";
import { findDataCharacter } from "@Data/controllers";

// Action
import { chooseCharacter } from "@Store/userDatabaseSlice";

// Selector
import { selectChosenChar } from "@Store/userDatabaseSlice/selectors";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Component
import { IconButton } from "@Components/atoms";
import { PickerCharacter } from "@Components/templates";

import styles from "./styles.module.scss";

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
      <div className={clsx(styles["side-icon-carousel"])}>
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

        <div ref={characterListRef} className="mt-2 w-full hide-scrollbar">
          <div className="flex">
            {characterNames.length ? (
              characterNames.map((name) => {
                const databaseChar = findDataCharacter({ name });
                if (!databaseChar) {
                  return null;
                }
                const { sideIcon, icon } = databaseChar;

                return (
                  <div
                    key={name}
                    className={clsx(
                      "mx-1 border-b-3 border-transparent cursor-pointer",
                      name === chosenChar && styles["active-cell"]
                    )}
                    onClick={() => dispatch(chooseCharacter(name))}
                  >
                    <div
                      className={clsx(
                        "rounded-circle border-3 border-lesser/30  bg-black/30",
                        styles["icon-wrapper"],
                        sideIcon
                          ? clsx("m-2", styles["side-icon-wrapper"])
                          : clsx("m-1 overflow-hidden", styles["beta-icon-wrapper"])
                      )}
                    >
                      <img src={getImgSrc(sideIcon || icon)} alt="icon" draggable={false} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-20 flex justify-end items-center">
                <p className="text-2.5xl font-bold text-lightgold flex">
                  <span className="mr-2">Add New Characters</span>{" "}
                  <FaArrowAltCircleUp className="rotate-90" />
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          className="absolute top-4 left-full ml-6 w-15 rounded-circle hover:shadow-3px-3px hover:shadow-white"
          onClick={onClickWish}
        >
          <img src={getImgSrc("4/48/System_Wish")} alt="wish" draggable={false} />
        </button>
      </div>

      <PickerCharacter
        active={gridviewOn}
        sourceType="userData"
        onPickCharacter={({ name }) => {
          dispatch(chooseCharacter(name));
          scrollList(name);
        }}
        onClose={() => setGridviewOn(false)}
      />
    </div>
  );
}
