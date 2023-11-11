import clsx from "clsx";

// Type
import type { ArtifactSetBonus, UserArtifacts, UserWeapon } from "@Src/types";
import type { DetailsType } from "./types";

// Constant
import { ARTIFACT_ICONS, ARTIFACT_TYPES } from "@Src/constants";

// Util
import { getImgSrc } from "@Src/utils";
import { appData } from "@Src/data";

// Component
import { InfoSign } from "@Src/pure-components";
import { ItemThumb } from "@Src/components";

const bonusStyles = (active: boolean) => {
  return ["p-2 flex justify-between items-center rounded-lg group", active && "bg-dark-700"];
};

interface GearsOverviewProps {
  weapon: UserWeapon;
  artifacts: UserArtifacts;
  setBonuses: ArtifactSetBonus[];
  activeDetails: DetailsType;
  toggleDetails: (newDetailsType: DetailsType) => void;
  onClickEmptyArtIcon: (artifactIndex: number) => void;
}
export function GearsOverview({
  weapon,
  artifacts,
  setBonuses,
  activeDetails,
  toggleDetails,
  onClickEmptyArtIcon,
}: GearsOverviewProps) {
  //
  const renderWeaponThumb = () => {
    const { type, code, ...rest } = weapon;
    const dataWeapon = appData.getWeaponData(weapon.code);

    if (!dataWeapon) {
      return null;
    }
    const { beta, icon, rarity } = dataWeapon;

    return (
      <div className="p-1 w-1/3">
        <div onClick={() => toggleDetails("weapon")}>
          <ItemThumb
            item={{ beta, icon, rarity, ...rest, owner: undefined }}
            chosen={window.innerWidth < 686 ? false : activeDetails === "weapon"}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="py-4">
      <div className="flex flex-wrap">
        {renderWeaponThumb()}

        {artifacts.map((artifact, i) =>
          artifact ? (
            <div key={i} className="p-1 w-1/3">
              <div onClick={() => toggleDetails(i)}>
                <ItemThumb
                  item={{
                    rarity: artifact.rarity,
                    level: artifact.level,
                    icon: appData.getArtifactData(artifact)?.icon || "",
                    setupIDs: artifact.setupIDs,
                  }}
                  chosen={window.innerWidth < 686 ? false : activeDetails === i}
                />
              </div>
            </div>
          ) : (
            <div key={i} className="p-1 w-1/3" style={{ minHeight: 124 }}>
              <button
                className="p-4 w-full h-full flex-center rounded bg-dark-500 glow-on-hover"
                onClick={() => onClickEmptyArtIcon(i)}
              >
                <img className="w-full" src={getImgSrc(ARTIFACT_ICONS[ARTIFACT_TYPES[i]])} alt="" draggable={false} />
              </button>
            </div>
          )
        )}
      </div>

      <div
        className={clsx("mt-3", bonusStyles(activeDetails === "setBonus"))}
        onClick={() => {
          if (setBonuses.length) toggleDetails("setBonus");
        }}
      >
        <div>
          <p className="text-lg text-orange font-semibold">Set bonus</p>
          <div className="mt-1 pl-2">
            {setBonuses.length ? (
              <>
                <p className="text-green font-medium">
                  {appData.getArtifactSetData(setBonuses[0].code)?.name} ({setBonuses[0].bonusLv * 2 + 2})
                </p>
                {setBonuses[1] ? (
                  <p className="mt-1 text-green font-medium">
                    {appData.getArtifactSetData(setBonuses[1].code)?.name} (2)
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-light-800 font-semibold">No Set bonus</p>
            )}
          </div>
        </div>
        {setBonuses.length !== 0 && <InfoSign active={activeDetails === "setBonus"} />}
      </div>

      <div
        className={clsx("mt-2", bonusStyles(activeDetails === "statsBonus"))}
        onClick={() => toggleDetails("statsBonus")}
      >
        <p className="text-lg text-orange font-semibold">Artifact details</p>
        <InfoSign active={activeDetails === "statsBonus"} />
      </div>
    </div>
  );
}
