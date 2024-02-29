import clsx from "clsx";
import { useRef, useState, useEffect } from "react";
import { FaCaretRight, FaMinus, FaSquare } from "react-icons/fa";

import type { BooleanRecord, UserArtifact, UserItem, UserWeapon } from "@Src/types";
import type { ArtifactRackProps, InventoryRackProps, MixedRackProps, WeaponRackProps } from "./types";

import { INVENTORY_PAGE_SIZE } from "@Src/constants";
import { $AppData } from "@Src/services";
import { isUserWeapon } from "@Src/utils";

// Component
import { ItemCase } from "@Src/pure-components";
import { ItemThumbnail } from "../ItemThumbnail";

export const getWeaponInfo = ({ code, owner, refi, level, setupIDs }: UserWeapon) => {
  const { beta, name, icon = "", rarity = 5 } = $AppData.getWeapon(code) || {};
  return { beta, name, icon, rarity, level, refi, owner, setupIDs };
};

export const getArtifactInfo = ({ code, type, owner, rarity, level, setupIDs }: UserArtifact) => {
  const { beta, name, icon = "" } = $AppData.getArtifact({ code, type }) || {};
  return { beta, name, icon, rarity, level, owner, setupIDs };
};

export function InventoryRack(props: WeaponRackProps): JSX.Element;
export function InventoryRack(props: ArtifactRackProps): JSX.Element;
export function InventoryRack(props: MixedRackProps): JSX.Element;
export function InventoryRack<T extends UserItem>({
  data,
  itemCls,
  emptyText = "No data",
  chosenID,
  chosenIDs,
  onUnselectItem,
  onChangeItem,
}: InventoryRackProps<T>): JSX.Element {
  const observeArea = useRef<HTMLDivElement>(null);
  const pioneerRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [itemsVisible, setItemsVisible] = useState<BooleanRecord>({});
  const [pageNo, setPageNo] = useState(0);

  useEffect(() => {
    if (pioneerRef.current) {
      heightRef.current = pioneerRef.current.clientHeight;
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) {
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
        observer.observe(item);
      });

      return () => observer.disconnect();
    }
  }, [ready, data, pageNo]);

  const deadEnd = Math.ceil(data.length / INVENTORY_PAGE_SIZE) - 1;
  const firstIndex = INVENTORY_PAGE_SIZE * pageNo;
  const nextFirstIndex = firstIndex + INVENTORY_PAGE_SIZE;

  const resetScroll = () => {
    if (observeArea.current) {
      observeArea.current.scrollTop = 0;
    }
  };

  const goBack = () => {
    setPageNo((prev) => prev - 1);
    resetScroll();
  };

  const goNext = () => {
    setPageNo((prev) => prev + 1);
    resetScroll();
  };

  return (
    <div className="w-full flex flex-col" style={{ minWidth: "21rem" }}>
      <div ref={observeArea} className="grow custom-scrollbar xm:pr-2" style={{ overflowX: "hidden" }}>
        {!ready && (
          <div ref={pioneerRef} className={clsx("opacity-0", itemCls)}>
            <ItemThumbnail item={{ icon: "", level: "1/20", rarity: 5 }} />
          </div>
        )}

        {ready && data.length ? (
          <div className="flex flex-wrap">
            {data.map((item, index) => {
              const isOnPage = index >= firstIndex && index < nextFirstIndex;
              const visible = itemsVisible[item.code];

              return (
                <div
                  key={item.ID}
                  data-id={item.code}
                  className={clsx(
                    "p-2 transition-opacity duration-400 relative",
                    isOnPage && "inventory-item",
                    isOnPage && visible ? "opacity-100" : "opacity-0 !p-0",
                    itemCls
                  )}
                  style={{
                    height: isOnPage ? (visible ? "auto" : heightRef.current) : 0,
                  }}
                >
                  {isOnPage && visible ? (
                    <>
                      {chosenIDs?.[item.ID] && (
                        <button
                          className="absolute z-10 top-1 left-1 w-8 h-8 flex-center bg-red-600 rounded-md"
                          onClick={() => onUnselectItem?.(item)}
                        >
                          <FaMinus />
                        </button>
                      )}
                      <ItemCase chosen={item.ID === chosenID} onClick={() => onChangeItem?.(item)}>
                        {(className, imgCls) => (
                          <ItemThumbnail
                            className={className}
                            imgCls={imgCls}
                            item={isUserWeapon(item) ? getWeaponInfo(item) : getArtifactInfo(item)}
                          />
                        )}
                      </ItemCase>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {ready && !data.length ? <p className="py-4 text-light-800 text-lg text-center">{emptyText}</p> : null}
      </div>

      {data.length && deadEnd ? (
        <div className="pt-2 flex-center space-x-2">
          <button
            className="w-7 h-7 flex-center glow-on-hover disabled:opacity-50"
            disabled={pageNo <= 0}
            onClick={goBack}
          >
            {pageNo > 0 ? <FaCaretRight className="rotate-180 text-2xl" /> : <FaSquare className="text-lg" />}
          </button>

          <p className="font-semibold">
            <span className="text-orange-500">{pageNo + 1}</span> / {deadEnd + 1}
          </p>

          <button
            className="w-7 h-7 flex-center glow-on-hover disabled:opacity-50"
            disabled={pageNo >= deadEnd}
            onClick={goNext}
          >
            {pageNo < deadEnd ? <FaCaretRight className="text-2xl" /> : <FaSquare className="text-lg" />}
          </button>
        </div>
      ) : null}
    </div>
  );
}
