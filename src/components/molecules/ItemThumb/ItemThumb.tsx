import clsx from "clsx";
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
  clicked?: boolean;
  chosen: boolean;
  onMouseUp: () => void;
  onMouseDown?: () => void;
}
export function ItemThumb({
  item: { beta, icon, rarity, level, refi, owner },
  clicked,
  chosen,
  onMouseUp,
  onMouseDown = () => {},
}: ItemThumbProps) {
  //
  const renderSideIcon = (owner: string) => {
    const { icon = "", sideIcon } = findDataCharacter({ name: owner }) || {};
    return (
      <div
        className={clsx(
          "absolute top-1.5 right-1.5 z-10 w-7 h-7 bg-black/50 border-2 border-white rounded-circle",
          // isLoaded.ownerIcon ? [styles["side-icon"], !sideIcon && "beta overflow-hidden"] : "hidden"
          styles["side-icon"],
          !sideIcon && "beta overflow-hidden"
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
      className={clsx(styles.thumb, clicked && styles.clicked, chosen && styles.chosen)}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
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
}

// export const ItemThumb = memo(ItemThumbCore, (prev, next) => {
//   if (prev.clicked !== next.clicked || prev.chosen !== next.chosen) return false;
//   for (const field of ["icon", "level", "refi", "owner"] as const) {
//     if (prev.item[field] !== next.item[field]) return false;
//   }
//   return true;
// });
