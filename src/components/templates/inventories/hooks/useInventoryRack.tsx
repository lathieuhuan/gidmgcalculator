import clsx from "clsx";
import { useEffect, useState } from "react";
import { FaCaretRight } from "react-icons/fa";
import type { UserArtifact, UserWeapon } from "@Src/types";

// Util
import { findDataArtifact, findDataWeapon } from "@Data/controllers";

// Component
import { ItemThumb } from "@Components/molecules";

function getWeaponInfo({ type, code, owner, refi, level, setupIDs }: UserWeapon) {
  const { beta, name, icon = "", rarity = 5 } = findDataWeapon({ type, code }) || {};
  return { beta, name, icon, rarity, level, refi, owner, setupIDs };
}

function getArtifactInfo({ code, type, owner, rarity, level, setupIDs }: UserArtifact) {
  const { beta, name, icon = "" } = findDataArtifact({ code, type }) || {};
  return { beta, name, icon, rarity, level, owner, setupIDs };
}

function isWeapon(item: UserWeapon | UserArtifact): item is UserWeapon {
  return (item as UserWeapon).refi !== undefined;
}

const itemLimit = 60;

interface UseInventoryRackArgs {
  listClassName?: string;
  itemClassName?: string;
  items: UserWeapon[] | UserArtifact[];
  itemType: "weapon" | "artifact";
  filteredIds: number[];
}
export const useInventoryRack = ({
  listClassName,
  itemClassName,
  items,
  itemType,
  filteredIds,
}: UseInventoryRackArgs) => {
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

  const inventoryRack = (
    <div className="w-full flex flex-col" style={{ minWidth: "22rem" }}>
      <div className={clsx("hide-scrollbar", listClassName)}>
        {filteredIds.length ? (
          <div className="flex flex-wrap">
            {items.map((item) => {
              return (
                <div
                  key={item.ID}
                  className={clsx(itemClassName, { hidden: !IDsOnPage.includes(item.ID) })}
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
          <div className="w-full pt-8 flex-center">
            <p className="text-xl font-bold text-lightred">No {itemType} to display</p>
          </div>
        )}
      </div>

      {IDsOnPage.length ? (
        <div className="pt-2 pb-1 flex-center space-x-2">
          <button onClick={goBack}>
            <FaCaretRight
              className={clsx("rotate-180", pageNo > 0 ? "glow-on-hover" : "opacity-50")}
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

  return {
    inventoryRack,
    chosenID,
    setChosenID,
  };
};
