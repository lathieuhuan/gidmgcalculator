import { ItemThumb } from "@Components/molecules";
import { findDataArtifact, findDataWeapon } from "@Data/controllers";
import { UserArtifact, UserWeapon } from "@Src/types";
import { useRef, useState } from "react";
import { FaCaretRight } from "react-icons/fa";

const PAGE_SIZE = 60;

interface InventoryRackCommonProps {
  listClassName?: string;
  itemClassName?: string;
  chosenID: number;
}

interface WeaponInventoryRackProps extends InventoryRackCommonProps {
  items: UserWeapon[];
  itemType: "weapon";
  onClickItem?: (weapon: UserWeapon) => void;
}
interface ArtifactInventoryRackProps extends InventoryRackCommonProps {
  itemType: "artifact";
  items: UserArtifact[];
  onClickItem?: (weapon: UserArtifact) => void;
}

function getWeaponInfo({ type, code, owner, refi, level, setupIDs }: UserWeapon) {
  const { beta, name, icon = "", rarity = 5 } = findDataWeapon({ type, code }) || {};
  return { beta, name, icon, rarity, level, refi, owner, setupIDs };
}

function getArtifactInfo({ code, type, owner, rarity, level, setupIDs }: UserArtifact) {
  const { beta, name, icon = "" } = findDataArtifact({ code, type }) || {};
  return { beta, name, icon, rarity, level, owner, setupIDs };
}

export function InventoryRack({
  listClassName = "",
  itemClassName = "",
  chosenID,
  itemType,
  items,
  onClickItem,
}: WeaponInventoryRackProps | ArtifactInventoryRackProps) {
  const intersectionObserverRef = useRef<HTMLDivElement>(null);

  const [pageNo, setPageNo] = useState(0);

  const deadEnd = Math.ceil(items.length / PAGE_SIZE) - 1;

  const isHidden = (i: number) => i < PAGE_SIZE * pageNo || i >= PAGE_SIZE * (pageNo + 1);

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

  return (
    <div className="pr-2 w-full flex flex-col" style={{ minWidth: "22rem" }}>
      <div ref={intersectionObserverRef} className={"custom-scrollbar " + listClassName}>
        {items.length ? (
          <div className="flex flex-wrap">
            {itemType === "weapon"
              ? items.map((item, i) => {
                  if (isHidden(i)) {
                    return null;
                  }

                  return (
                    <div key={item.ID} className={"inventory-item " + itemClassName}>
                      <div onClick={() => onClickItem?.(item)}>
                        <ItemThumb item={getWeaponInfo(item)} chosen={item.ID === chosenID} />
                      </div>
                    </div>
                  );
                })
              : items.map((item, i) => {
                  if (isHidden(i)) {
                    return null;
                  }

                  return (
                    <div key={item.ID} className={"inventory-item " + itemClassName}>
                      <div onClick={() => onClickItem?.(item)}>
                        <ItemThumb item={getArtifactInfo(item)} chosen={item.ID === chosenID} />
                      </div>
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

      {items.length ? (
        <div className="pt-2 pb-1 flex-center space-x-2">
          <button onClick={goBack}>
            <FaCaretRight
              className={"rotate-180 " + (pageNo > 0 ? "glow-on-hover" : "opacity-50")}
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
}
