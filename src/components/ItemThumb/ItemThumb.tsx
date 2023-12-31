import clsx from "clsx";

import type { Level, Rarity } from "@Src/types";
import { appData } from "@Src/data";

// Component
import { Image } from "@Src/pure-components";

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
  chosen?: boolean;
}
export const ItemThumb = ({ item: { beta, icon, rarity, level, refi, owner }, chosen }: ItemThumbProps) => {
  //
  const renderSideIcon = (owner: string) => {
    const { icon = "", sideIcon } = appData.getCharData(owner) || {};
    return (
      <div
        className={clsx(
          "absolute top-1.5 right-1.5 z-10 w-7 h-7 bg-black/60 border-2 border-light-400 rounded-circle",
          styles["side-icon"],
          !sideIcon && "overflow-hidden"
        )}
      >
        <Image
          className={"max-w-none -translate-x-2 -translate-y-4" + (sideIcon ? "side-image" : " -translate-y-2")}
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
          "bg-light-400 rounded flex flex-col cursor-pointer relative",
          styles["hover-shadow-white"],
          chosen ? "glowing" : "shadow-common"
        )}
      >
        {refi !== undefined ? (
          <p
            className={
              "absolute top-1 left-1 rounded px-1 text-sm font-bold " +
              (refi === 5 ? "bg-black text-orange-500" : "bg-black/60 text-light-400")
            }
          >
            {refi}
          </p>
        ) : null}

        <div className={`aspect-square bg-gradient-${rarity || 5} ` + "rounded rounded-br-2xl overflow-hidden"}>
          <Image src={icon} imgType={refi ? "weapon" : "artifact"} />
        </div>

        <div className="flex-center bg-light-400 rounded-b">
          <p className="font-bold text-black">Lv. {typeof level === "string" ? level.split("/")[0] : level}</p>
        </div>
      </div>
    </div>
  );
};
