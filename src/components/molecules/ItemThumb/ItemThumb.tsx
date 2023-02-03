import clsx from "clsx";
import { memo } from "react";
import type { Level, Rarity } from "@Src/types";

// Util
import { findDataCharacter } from "@Data/controllers";

// Component
import { Image } from "@Components/atoms";

import styles from "./styles.module.scss";

interface ItemThumbProps {
  item: {
    beta?: boolean;
    icon: string;
    rarity: Rarity;
    level: Level | number;
    refi?: number;
    owner?: string | null;
    setupIDs?: number[];
  };
  chosen: boolean;
}
const ItemThumbCore = ({
  item: { beta, icon, rarity, level, refi, owner },
  chosen,
}: ItemThumbProps) => {
  //
  const renderSideIcon = (owner: string) => {
    const { icon = "", sideIcon } = findDataCharacter({ name: owner }) || {};
    return (
      <div
        className={clsx(
          "absolute top-1.5 right-1.5 z-10 w-7 h-7 bg-black/60 border-2 border-white rounded-circle",
          styles["side-icon"],
          !sideIcon && "overflow-hidden"
        )}
      >
        <Image
          className={clsx(
            "max-w-none -translate-x-2 -translate-y-4",
            !sideIcon && "-translate-y-2"
          )}
          size="w-10 h-10"
          src={sideIcon || icon}
        />
      </div>
    );
  };

  return (
    <div
      className={clsx(styles.thumb, chosen && styles.chosen)}
      onMouseDown={(e) => e.currentTarget.classList.add(styles.clicked)}
      onMouseUp={(e) => e.currentTarget.classList.remove(styles.clicked)}
    >
      {owner && renderSideIcon(owner)}

      <div
        className={clsx(
          "bg-default rounded flex flex-col cursor-pointer relative",
          styles["hover-shadow-white"],
          chosen ? "glowing" : "shadow-common"
        )}
      >
        {refi !== undefined ? (
          <p
            className={clsx(
              "absolute top-1 left-1 rounded px-1 text-sm font-bold",
              refi === 5 ? "bg-black text-orange" : "bg-black/60 text-default"
            )}
          >
            {refi}
          </p>
        ) : null}

        <div
          className={
            `bg-gradient-${rarity || 5} ` + "rounded-t rounded-br-2xl aspect-square overflow-hidden"
          }
        >
          <Image src={icon} imgType={refi ? "weapon" : "artifact"} />
        </div>

        <div className="flex-center bg-default rounded-b">
          <p className="font-bold text-black">
            Lv. {typeof level === "string" ? level.split("/")[0] : level}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ItemThumb = memo(ItemThumbCore, (prev, next) => prev.chosen === next.chosen);
