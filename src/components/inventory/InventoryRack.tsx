import clsx from "clsx";
import { useRef, useState, useEffect } from "react";
import { FaCaretRight, FaMinus } from "react-icons/fa";

import type { BooleanRecord, UserArtifact, UserWeapon } from "@Src/types";
import { INVENTORY_PAGE_SIZE } from "@Src/constants";
import { $AppData } from "@Src/services";

// Util
import { isUserWeapon } from "@Src/utils";

// Component
import { ItemThumb } from "../ItemThumb";

export const getWeaponInfo = ({ code, owner, refi, level, setupIDs }: UserWeapon) => {
  const { beta, name, icon = "", rarity = 5 } = $AppData.getWeaponData(code) || {};
  return { beta, name, icon, rarity, level, refi, owner, setupIDs };
};

export const getArtifactInfo = ({ code, type, owner, rarity, level, setupIDs }: UserArtifact) => {
  const { beta, name, icon = "" } = $AppData.getArtifactData({ code, type }) || {};
  return { beta, name, icon, rarity, level, owner, setupIDs };
};

export const getDataId = (item: UserWeapon | UserArtifact) => `${item.type}-${item.code}`;

interface InventoryRackProps {
  data: UserWeapon[] | UserArtifact[];
  itemCls?: string;
  emptyText?: string;
  chosenID?: number;
  chosenIDs?: BooleanRecord;
  onUnchooseItem?: (item: UserWeapon | UserArtifact) => void;
  onClickItem?: (item: UserWeapon | UserArtifact) => void;
}
export const InventoryRack = ({
  data,
  itemCls,
  emptyText = "No data",
  chosenID,
  chosenIDs,
  onUnchooseItem,
  onClickItem,
}: InventoryRackProps) => {
  const observeArea = useRef<HTMLDivElement>(null);
  const pioneerRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [itemsVisible, setItemsVisible] = useState<BooleanRecord>({});
  const [pageNo, setPageNo] = useState(0);

  useEffect(() => {
    if (data.length && !chosenID) {
      onClickItem?.(data[0] as any);
    }
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
      <div ref={observeArea} className="grow custom-scrollbar xm:pr-2">
        {!ready && (
          <div ref={pioneerRef} className="opacity-0">
            <ItemThumb item={{ icon: "", level: "1/20", rarity: 5 }} />
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
                    "p-2 transition-opacity duration-400",
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
                          onClick={() => onUnchooseItem?.(item)}
                        >
                          <FaMinus />
                        </button>
                      )}
                      <div onClick={() => onClickItem?.(item)}>
                        <ItemThumb
                          item={isUserWeapon(item) ? getWeaponInfo(item) : getArtifactInfo(item)}
                          chosen={item.ID === chosenID}
                        />
                      </div>
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
          <button className="glow-on-hover disabled:opacity-50" disabled={pageNo <= 0} onClick={goBack}>
            <FaCaretRight className="rotate-180" size="1.75rem" />
          </button>

          <p className="font-semibold">
            <span className="text-orange-500">{pageNo + 1}</span> / {deadEnd + 1}
          </p>

          <button className="glow-on-hover disabled:opacity-50" disabled={pageNo >= deadEnd} onClick={goNext}>
            <FaCaretRight size="1.75rem" />
          </button>
        </div>
      ) : null}
    </div>
  );
};
