import cn from "classnames";
import { memo } from "react";
import { Level, Rarity } from "@Src/types";
import { findCharacter } from "@Data/controllers";
import { wikiImg } from "@Src/utils";

interface ItemThumbProps {
  noDecoration?: boolean;
  item: {
    beta?: boolean;
    icon: string;
    rarity: Rarity;
    level: Level | number;
    refi?: number;
    user: string | null;
  };
  clicked: boolean;
  chosen: boolean;
  onMouseUp: () => void;
  onMouseDown?: () => void;
}
function ItemThumb({
  noDecoration,
  item: { beta, icon, rarity, level, refi, user },
  clicked,
  chosen,
  onMouseUp,
  onMouseDown = () => {},
}: ItemThumbProps) {
  //
  const renderSideIcon = (user: string, clicked: boolean, chosen: boolean) => {
    const { beta, icon, sideIcon } = findCharacter({ name: user }) || {};
    return (
      <div
        className={cn(
          "absolute top-1.5 right-1.5 z-10 w-7 h-7 bg-black/50 border-2 border-white rounded-circle",
          clicked ? "group-hover:!top-1 group-hover:!right-1" : "hover:-top-1 hover:-right-1",
          chosen && "-top-1 -right-1",
          !sideIcon && "overflow-hidden"
        )}
      >
        <img
          className={cn("w-10 -translate-x-2 -translate-y-4", !sideIcon && "-translate-y-2")}
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
        "group",
        clicked || noDecoration ? "!scale-100" : "hover:scale-105",
        chosen && "scale-105"
      )}
    >
      {user && !noDecoration && renderSideIcon(user, clicked, chosen)}

      <div
        className={cn(
          "hover:shadow-[0_0_0_2.5px_white] bg-default rounded flex flex-col cursor-pointer relative",
          chosen ? "glowing" : "shadow-common"
        )}
      >
        {refi !== undefined ? (
          <p
            className={cn(
              "absolute top-0.5 left-0.5 rounded px-1 bg-black/60 text-default/80 text-sm font-bold",
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

export default memo(ItemThumb, (prev, next) => {
  if (prev.clicked !== next.clicked || prev.chosen !== next.chosen) return false;
  for (const field of ["icon", "level", "refi", "user"] as const) {
    if (prev.item[field] !== next.item[field]) return false;
  }
  return true;
});
