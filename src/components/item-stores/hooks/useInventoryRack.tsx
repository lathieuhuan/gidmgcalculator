import cn from "classnames";
import { useEffect, useState } from "react";
import { FaCaretRight } from "react-icons/fa";
import { Artifact, UsersArtifact, UsersWeapon, Level, Rarity, Weapon } from "@Src/types";
import { findArtifactPiece, findWeapon } from "@Data/controllers";
import { ItemThumb } from "@Components/ItemThumb";
import { renderNoItems } from "@Components/minors";

interface GetItemInfoArgs {
  code: number;
  owner: string | null;
  level: Level | number;
}

interface GetWeaponInfoArgs extends GetItemInfoArgs {
  type: Weapon;
  refi: number;
}
function getWeaponInfo({ type, code, owner, refi, level }: GetWeaponInfoArgs) {
  const { beta, name, icon, rarity } = findWeapon({ type, code })!;
  return { beta, name, icon, rarity, level, owner, refi };
}

interface GetArtifactInfoArgs extends GetItemInfoArgs {
  type: Artifact;
  rarity: Rarity;
}
function getArtifactInfo({ code, type, owner, rarity, level }: GetArtifactInfoArgs) {
  const { beta, name, icon } = findArtifactPiece({ code, type });
  return { beta, name, icon, rarity, level, owner };
}

function isWeapon(item: GetWeaponInfoArgs | GetArtifactInfoArgs): item is GetWeaponInfoArgs {
  return !!(item as GetWeaponInfoArgs).refi;
}

const itemLimit = 120;

interface UseInventoryRackArgs {
  listClassName?: string;
  itemClassName?: string;
  items: UsersWeapon[] | UsersArtifact[];
  itemType: "weapon" | "artifact";
  filteredIds: number[];
}
export default function useInventoryRack({
  listClassName,
  itemClassName,
  items,
  itemType,
  filteredIds,
}: UseInventoryRackArgs) {
  const [chosenID, setChosenID] = useState(0);
  const [clickedID, setClickedID] = useState<number>(0);
  const [pageNo, setPageNo] = useState(0);

  const deadEnd = Math.ceil(filteredIds.length / itemLimit) - 1;

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

  const rack = (
    <div className="w-full flex flex-col" style={{ minWidth: "22rem" }}>
      <div className={cn("hide-scrollbar", listClassName)}>
        {filteredIds.length ? (
          <div className="flex flex-wrap">
            {items.map((item) => {
              return (
                <div
                  key={item.ID}
                  className={cn(itemClassName, { hidden: !IDsOnPage.includes(item.ID) })}
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
        <div className="pt-2 pb-1 flex-center space-x-2">
          <button onClick={goBack}>
            <FaCaretRight
              className={cn("rotate-180", pageNo > 0 ? "glow-on-hover" : "opacity-50")}
              size="1.75rem"
            />
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
    </div>
  );

  return [rack, chosenID, setChosenID] as const;
}
