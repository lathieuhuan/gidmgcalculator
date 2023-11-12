import clsx from "clsx";
import { useEffect, useState } from "react";
import { FaSortAmountUpAlt, FaTh, FaArrowAltCircleUp } from "react-icons/fa";

import { useIntersectionObserver } from "@Src/hooks";
import { getImgSrc } from "@Src/utils";
import { appData } from "@Src/data";

// Store
import { chooseCharacter } from "@Store/userDatabaseSlice";
import { useDispatch } from "@Store/hooks";

// Component
import { PickerCharacter } from "@Src/components";
import { Button } from "@Src/pure-components";

import styles from "./styles.module.scss";

interface TopBarProps {
  characterNames: string[];
  chosenChar: string;
  onCliceSort: () => void;
  onClickWish: () => void;
}
export default function CharacterList({ characterNames, chosenChar, onCliceSort, onClickWish }: TopBarProps) {
  const dispatch = useDispatch();

  const [gridviewOn, setGridviewOn] = useState(false);

  const { observedAreaRef, observedItemCls, itemsVisible } = useIntersectionObserver<HTMLDivElement>([characterNames]);

  const scrollList = (name: string) => {
    document.querySelector(`#side-icon-${name}`)?.scrollIntoView();
  };

  useEffect(() => {
    const scrollHorizontally = (e: any) => {
      const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));

      if (observedAreaRef.current) {
        observedAreaRef.current.scrollLeft -= delta * 50;
      }
      e.preventDefault();
    };

    observedAreaRef.current?.addEventListener("wheel", scrollHorizontally);

    return () => {
      observedAreaRef.current?.removeEventListener("wheel", scrollHorizontally);
    };
  }, []);

  useEffect(() => {
    scrollList(chosenChar);
  }, [chosenChar]);

  return (
    <div className="w-full flex justify-center bg-dark-700">
      <div className={styles["side-icon-carousel"]}>
        {characterNames.length ? (
          <div className="absolute top-8 right-full flex">
            <Button className="mr-4" variant="positive" icon={<FaSortAmountUpAlt />} onClick={onCliceSort} />
            <Button className="mr-4" variant="positive" icon={<FaTh />} onClick={() => setGridviewOn(true)} />
          </div>
        ) : null}

        <div ref={observedAreaRef} className="mt-2 w-full hide-scrollbar">
          <div className="flex">
            {characterNames.length ? (
              characterNames.map((name) => {
                const charData = appData.getCharData(name);
                if (!charData) {
                  return null;
                }
                const { sideIcon, icon } = charData;
                const visible = itemsVisible[name];

                return (
                  <div
                    key={name}
                    id={`side-icon-${name}`}
                    data-id={name}
                    className={clsx(
                      observedItemCls,
                      "mx-1 border-b-3 border-transparent cursor-pointer",
                      name === chosenChar && styles["active-cell"]
                    )}
                    onClick={() => dispatch(chooseCharacter(name))}
                  >
                    <div
                      className={clsx(
                        "rounded-circle border-3 border-lesser/30 bg-black/30",
                        styles["icon-wrapper"],
                        sideIcon
                          ? "m-2 " + styles["side-icon-wrapper"]
                          : "m-1 overflow-hidden " + styles["beta-icon-wrapper"]
                      )}
                    >
                      <div
                        className={
                          "w-ful h-full transition-opacity duration-400 " + (visible ? "opacity-100" : "opacity-0")
                        }
                      >
                        {visible && <img src={getImgSrc(sideIcon || icon)} alt="icon" draggable={false} />}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-20 flex justify-end items-center">
                <p className="text-2.5xl font-bold text-yellow-400 flex">
                  <span className="mr-2">Add new characters</span> <FaArrowAltCircleUp className="rotate-90" />
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          className="absolute top-4 left-full ml-6 rounded-circle hover:shadow-3px-3px hover:shadow-light-100"
          style={{
            width: 60,
            height: 60,
          }}
          onClick={onClickWish}
        >
          <img src={getImgSrc("4/48/System_Wish")} alt="wish" draggable={false} />
        </button>
      </div>

      <PickerCharacter
        active={gridviewOn}
        sourceType="user"
        onPickCharacter={({ name }) => {
          dispatch(chooseCharacter(name));
          scrollList(name);
        }}
        onClose={() => setGridviewOn(false)}
      />
    </div>
  );
}
