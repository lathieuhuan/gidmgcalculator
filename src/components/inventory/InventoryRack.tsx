import clsx from "clsx";
import { useRef, useState, useEffect } from "react";
import { FaCaretRight, FaMinus } from "react-icons/fa";

import type { UserArtifact, UserWeapon } from "@Src/types";
import { INVENTORY_PAGE_SIZE } from "@Src/constants";

// Util
import { findDataArtifact, findDataWeapon } from "@Data/controllers";
import { itemIsWeapon } from "@Src/utils";

// Component
import { ItemThumb } from "../ItemThumb";

export const getWeaponInfo = ({ type, code, owner, refi, level, setupIDs }: UserWeapon) => {
  const { beta, name, icon = "", rarity = 5 } = findDataWeapon({ type, code }) || {};
  return { beta, name, icon, rarity, level, refi, owner, setupIDs };
};

export const getArtifactInfo = ({ code, type, owner, rarity, level, setupIDs }: UserArtifact) => {
  const { beta, name, icon = "" } = findDataArtifact({ code, type }) || {};
  return { beta, name, icon, rarity, level, owner, setupIDs };
};

export const getDataId = (item: UserWeapon | UserArtifact) => `${item.type}-${item.code}`;

interface InventoryRackProps {
  listClassName?: string;
  itemClassName?: string;
  chosenID: number;
  chosenIDs?: Record<string, boolean>;
  itemType: "weapon" | "artifact";
  items: UserWeapon[] | UserArtifact[];
  onUnchooseItem?: (item: UserWeapon | UserArtifact) => void;
  onClickItem?: (item: UserWeapon | UserArtifact) => void;
}
export const InventoryRack = ({
  listClassName = "",
  itemClassName = "",
  chosenID,
  chosenIDs,
  itemType,
  items,
  onUnchooseItem,
  onClickItem,
}: InventoryRackProps) => {
  const observeArea = useRef<HTMLDivElement>(null);
  const pioneerRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef(0);

  const [isReady, setIsReady] = useState(false);
  const [itemsVisible, setItemsVisible] = useState<Record<string, boolean>>({});
  const [pageNo, setPageNo] = useState(0);

  useEffect(() => {
    if (items.length && !chosenID) {
      onClickItem?.(items[0] as any);
    }
    if (pioneerRef.current) {
      heightRef.current = pioneerRef.current.clientHeight;
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (isReady) {
      const handleIntersection: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          const dataId = entry.target.getAttribute("data-id");

          if (entry.isIntersecting && dataId) {
            setItemsVisible((prevItemsVisible) => {
              const newItemVisible = { ...prevItemsVisible };
              newItemVisible[dataId] = true;
              return newItemVisible;
            });
          }
        });
      };

      const observer = new IntersectionObserver(handleIntersection, {
        root: observeArea.current,
      });

      observeArea.current?.querySelectorAll(".inventory-item").forEach((item) => {
        if (item) {
          observer.observe(item);
        }
      });

      return () => observer.disconnect();
    }
  }, [isReady, items, pageNo]);

  const deadEnd = Math.ceil(items.length / INVENTORY_PAGE_SIZE) - 1;
  const firstIndex = INVENTORY_PAGE_SIZE * pageNo;
  const nextFirstIndex = firstIndex + INVENTORY_PAGE_SIZE;

  const resetScroll = () => {
    if (observeArea.current) {
      observeArea.current.scrollTop = 0;
    }
  };

  const goBack = () => {
    if (pageNo > 0) {
      setPageNo((prev) => prev - 1);

      resetScroll();
    }
  };

  const goNext = () => {
    if (pageNo < deadEnd) {
      setPageNo((prev) => prev + 1);

      resetScroll();
    }
  };

  return (
    <div className="pr-2 w-full flex flex-col" style={{ minWidth: "22rem" }}>
      <div ref={observeArea} className={"custom-scrollbar " + listClassName}>
        {!isReady && (
          <div ref={pioneerRef} className={"opacity-0 " + itemClassName}>
            <ItemThumb item={{ icon: "", level: "1/20", rarity: 5 }} />
          </div>
        )}

        {isReady ? (
          items.length ? (
            <div className="flex flex-wrap">
              {items.map((item, index) => {
                const isOnPage = index >= firstIndex && index < nextFirstIndex;
                const dataId = getDataId(item);

                return (
                  <div
                    key={item.ID}
                    data-id={dataId}
                    className={clsx(
                      "transition-opacity duration-400",
                      itemClassName,
                      isOnPage && "inventory-item",
                      isOnPage && itemsVisible[dataId] ? "opacity-100" : "opacity-0 !p-0"
                    )}
                    style={{
                      height: isOnPage ? (itemsVisible[dataId] ? "auto" : heightRef.current) : 0,
                    }}
                  >
                    {isOnPage && itemsVisible[dataId] ? (
                      <>
                        {chosenIDs?.[item.ID] && (
                          <button
                            className="absolute z-10 top-1 left-1 w-8 h-8 flex-center bg-darkred rounded-md"
                            onClick={() => onUnchooseItem?.(item)}
                          >
                            <FaMinus />
                          </button>
                        )}
                        <div onClick={() => onClickItem?.(item)}>
                          <ItemThumb
                            item={itemIsWeapon(item) ? getWeaponInfo(item) : getArtifactInfo(item)}
                            chosen={item.ID === chosenID}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full pt-8 flex-center">
              <p className="text-xl font-bold text-lightred">No {itemType} to display</p>
            </div>
          )
        ) : null}
      </div>

      {items.length ? (
        <div className="pt-2 pb-1 flex-center space-x-2">
          <button onClick={goBack}>
            <FaCaretRight className={"rotate-180 " + (pageNo > 0 ? "glow-on-hover" : "opacity-50")} size="1.75rem" />
          </button>

          <p className="font-bold">
            <span className="text-orange">{pageNo + 1}</span> / {deadEnd + 1}
          </p>

          <button onClick={goNext}>
            <FaCaretRight className={pageNo < deadEnd ? "glow-on-hover" : "opacity-50"} size="1.75rem" />
          </button>
        </div>
      ) : null}
    </div>
  );
};
