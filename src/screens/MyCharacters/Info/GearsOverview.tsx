import cn from "classnames";
import { ItemThumb } from "@Components/ItemThumb";
import { InfoSign } from "@Components/minors";
import { findArtifactPiece, findArtifactSet, findWeapon } from "@Data/controllers";
import { ARTIFACT_ICONS, ARTIFACT_TYPES } from "@Src/constants";
import { UsersWeapon } from "@Src/types";
import { getImgSrc } from "@Src/utils";
import { ArtifactInfo, Details } from "./types";

const bonusStyles = (active: boolean) => {
  return cn("p-2 flex justify-between items-center rounded-lg group", active && "bg-darkblue-2");
};

interface GearsOverviewProps {
  wpInfo: UsersWeapon;
  artInfo: ArtifactInfo;
  activeDetails: Details;
  toggleDetails: (newDetails: Details) => void;
  onClickEmptyArtIcon: (artifactIndex: number) => void;
}
export function GearsOverview({
  wpInfo,
  artInfo: { pieces, sets },
  activeDetails,
  toggleDetails,
  onClickEmptyArtIcon,
}: GearsOverviewProps) {
  //
  const renderWeaponThumb = () => {
    const { type, code, ...rest } = wpInfo;
    const dataWeapon = findWeapon(wpInfo);

    if (!dataWeapon) {
      return null;
    }
    const { beta, icon, rarity } = dataWeapon;

    return (
      <div className="p-1 w-1/3">
        <ItemThumb
          noDecoration
          item={{ beta, icon, rarity, ...rest }}
          chosen={window.innerWidth < 686 ? false : activeDetails === "weapon"}
          onMouseUp={() => toggleDetails("weapon")}
        />
      </div>
    );
  };

  return (
    <div className="py-4">
      <div className="flex flex-wrap">
        {renderWeaponThumb()}

        {pieces.map((artP, i) =>
          artP ? (
            <div key={i} className="p-1 w-1/3">
              <ItemThumb
                noDecoration
                item={{
                  rarity: artP.rarity,
                  level: artP.level,
                  icon: findArtifactPiece(artP)?.icon || "",
                  owner: artP.owner,
                }}
                chosen={window.innerWidth < 686 ? false : activeDetails === i}
                onMouseUp={() => toggleDetails(i)}
              />
            </div>
          ) : (
            <div key={i} className="p-1 w-1/3 h-32">
              <button
                className="p-4 h-full flex-center rounded bg-darkblue-3 glow-on-hover"
                onClick={() => onClickEmptyArtIcon(i)}
              >
                <img
                  className="w-full"
                  src={getImgSrc(ARTIFACT_ICONS[ARTIFACT_TYPES[i]])}
                  alt=""
                  draggable={false}
                />
              </button>
            </div>
          )
        )}
      </div>

      <div
        className={cn("mt-3", bonusStyles(activeDetails === "setBonus"))}
        onClick={() => {
          if (sets.length) toggleDetails("setBonus");
        }}
      >
        <div>
          <p className="text-h6 text-orange font-bold">Set Bonus</p>
          <div className="mt-1 pl-2">
            {sets.length ? (
              <>
                <p className="text-green font-bold">
                  {findArtifactSet({ code: sets[0].code })?.name} ({sets[0].bonusLv * 2 + 2})
                </p>
                {sets[1] ? (
                  <p className="mt-1 text-green font-bold">
                    {findArtifactSet({ code: sets[1].code })?.name} (2)
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-lesser font-bold">No Set Bonus</p>
            )}
          </div>
        </div>
        {sets.length !== 0 && <InfoSign active={activeDetails === "setBonus"} />}
      </div>

      <div
        className={cn("mt-2", bonusStyles(activeDetails === "statsBonus"))}
        onClick={() => toggleDetails("statsBonus")}
      >
        <p className="text-h6 text-orange font-bold">Artifact Details</p>
        <InfoSign active={activeDetails === "statsBonus"} />
      </div>
    </div>
  );
}
