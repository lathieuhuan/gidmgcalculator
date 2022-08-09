import cn from "classnames";
import { memo } from "react";
import { Level, Rarity } from "@Src/types";
import { findCharacter } from "@Data/controllers";
import { wikiImg } from "@Src/utils";
import styles from "./styles.module.scss";

interface ItemThumbProps {
  noDecoration?: boolean;
  item: {
    beta?: boolean;
    icon: string;
    rarity: Rarity;
    level: Level | number;
    refi?: number;
    owner: string | null;
  };
  clicked?: boolean;
  chosen: boolean;
  onMouseUp: () => void;
  onMouseDown?: () => void;
}
function ItemThumbCore({
  noDecoration,
  item: { beta, icon, rarity, level, refi, owner },
  clicked,
  chosen,
  onMouseUp,
  onMouseDown = () => {},
}: ItemThumbProps) {
  //
  const renderSideIcon = (user: string) => {
    const { beta, icon, sideIcon } = findCharacter({ name: user }) || {};
    return (
      <div
        className={cn(
          "absolute top-1.5 right-1.5 z-10 w-7 h-7 bg-black/50 border-2 border-white rounded-circle",
          styles["side-icon"],
          !sideIcon && "beta overflow-hidden"
        )}
      >
        <img
          className={cn(
            "w-10 max-w-none -translate-x-2 -translate-y-4",
            !sideIcon && "-translate-y-2"
          )}
          src={beta ? icon : wikiImg(sideIcon || icon || "")}
          alt=""
          draggable={false}
        />
      </div>
    );
  };

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      className={cn(
        styles.thumb,
        (clicked || noDecoration) && styles.clicked,
        chosen && styles.chosen
      )}
    >
      {owner && !noDecoration && renderSideIcon(owner)}

      <div
        className={cn(
          "bg-default rounded flex flex-col cursor-pointer relative",
          styles["hover-shadow-white"],
          chosen ? "glowing" : "shadow-common"
        )}
      >
        {refi !== undefined ? (
          <p
            className={cn(
              "absolute top-1 left-1 rounded px-1 bg-black/60 text-default/80 text-sm font-bold",
              refi === 5 && "bg-black text-orange"
            )}
          >
            {refi}
          </p>
        ) : null}

        <div className={`bg-gradient-${rarity || 5} rounded-t rounded-br-2xl`}>
          <img className="w-full" src={beta ? icon : wikiImg(icon)} alt="" draggable={false} />
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

export const ItemThumb = memo(ItemThumbCore, (prev, next) => {
  if (prev.clicked !== next.clicked || prev.chosen !== next.chosen) return false;
  for (const field of ["icon", "level", "refi", "owner"] as const) {
    if (prev.item[field] !== next.item[field]) return false;
  }
  return true;
});
