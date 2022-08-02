import cn from "classnames";
import { useEffect, useState } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

import { Artifact, DatabaseArt, DatabaseWp, Level, Rarity, Weapon } from "@Src/types";
import { findArtifactPiece, findWeapon } from "@Data/controllers";

import ItemThumb from "@Components/ItemThumb";
import { renderNoItems } from "@Components/minors";

interface GetItemInfoArgs {
  code: number;
  user: string | null;
  level: Level | number;
}

interface GetWeaponInfoArgs extends GetItemInfoArgs {
  type: Weapon;
  refi: number;
}
function getWeaponInfo({ type, code, user, refi, level }: GetWeaponInfoArgs) {
  const { beta, name, icon, rarity } = findWeapon({ type, code })!;
  return { beta, name, icon, rarity, level, user, refi };
}

interface GetArtifactInfoArgs extends GetItemInfoArgs {
  type: Artifact;
  rarity: Rarity;
}
function getArtifactInfo({ code, type, user, rarity, level }: GetArtifactInfoArgs) {
  const { beta, name, icon } = findArtifactPiece({ code, type });
  return { beta, name, icon, rarity, level, user };
}

function isWeapon(item: GetWeaponInfoArgs | GetArtifactInfoArgs): item is GetWeaponInfoArgs {
  return !!(item as GetWeaponInfoArgs).refi;
}

const itemLimit = 120;

interface UseInventoryRackArgs {
  rackClassName?: string;
  cellClassName?: string;
  items: DatabaseWp[] | DatabaseArt[];
  itemType: "weapon" | "artifact";
  filteredIds: number[];
}
export default function useInventoryRack({
  rackClassName,
  cellClassName,
  items,
  itemType,
  filteredIds,
}: UseInventoryRackArgs) {
  const [chosenID, setChosenID] = useState(0);
  const [clickedID, setClickedID] = useState<number>(0);
  const [pageNo, setPageNo] = useState(0);

  console.log(items);

  const deadEnd = Math.ceil(filteredIds.length / itemLimit) - 1;
  // const getInfo = itemType === "weapon" ? getWeaponInfo : getArtifactInfo;

  let IDsOnPage: number[];
  if (filteredIds.length > itemLimit) {
    IDsOnPage = [];
    let i = itemLimit * pageNo;
    while (IDsOnPage.length < itemLimit && filteredIds[i]) {
      IDsOnPage.push(filteredIds[i]);
      i++;
    }
  } else {
    IDsOnPage = filteredIds;
  }

  const goBack = () => {
    if (pageNo > 0) {
      setPageNo((prev) => prev - 1);
    }
  };
  const goNext = () => {
    if (pageNo < deadEnd) {
      setPageNo((prev) => prev + 1);
    }
  };

  // update chosenID after filter
  useEffect(() => {
    if (chosenID !== IDsOnPage[0] && !IDsOnPage.includes(chosenID)) {
      setChosenID(IDsOnPage[0]);
    }
  }, [IDsOnPage, chosenID]);

  // hop back when fewer result after filter
  useEffect(() => {
    if (pageNo > deadEnd && deadEnd > 0) setPageNo(deadEnd);
  }, [pageNo, deadEnd]);

  // add navigate with arrow keys
  useEffect(() => {
    const navigateWithArrow = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goBack();
      } else if (e.key === "ArrowRight") {
        goNext();
      }
    };
    document.addEventListener("keydown", navigateWithArrow);

    return () => document.removeEventListener("keydown", navigateWithArrow);
  }, [goBack, goNext]);

  return [
    <div className="w-full flex flex-col">
      <div className={cn("hide-scrollbar", rackClassName)}>
        {filteredIds.length ? (
          <div className="flex flex-wrap">
            {items.map((item) => {
              return (
                <div
                  key={item.ID}
                  className={cn(cellClassName, { hidden: !IDsOnPage.includes(item.ID) })}
                  onDoubleClick={() => console.log(item)}
                >
                  <ItemThumb
                    item={isWeapon(item) ? getWeaponInfo(item) : getArtifactInfo(item)}
                    chosen={item.ID === chosenID}
                    clicked={item.ID === clickedID}
                    onMouseDown={() => setClickedID(item.ID)}
                    onMouseUp={() => {
                      setClickedID(0);
                      setChosenID(item.ID);
                    }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          renderNoItems(itemType)
        )}
      </div>

      {IDsOnPage.length ? (
        <div className="pt-2 flex-center gap-2">
          <button onClick={goBack}>
            <FaCaretLeft className={pageNo > 0 ? "glow-on-hover" : "opacity-50"} size="1.75rem" />
          </button>

          <p className="font-bold">
            <span className="text-orange">{pageNo + 1}</span> / {deadEnd + 1}
          </p>

          <button onClick={goNext}>
            <FaCaretRight
              className={pageNo < deadEnd ? "glow-on-hover" : "opacity-50"}
              size="1.75rem"
            />
          </button>
        </div>
      ) : null}
    </div>,
    chosenID,
    setChosenID,
  ] as const;
}
