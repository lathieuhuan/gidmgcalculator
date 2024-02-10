import clsx from "clsx";
import { FaInfo } from "react-icons/fa";

// Type
import type { ArtifactSetBonus, UserArtifacts, UserWeapon } from "@Src/types";
import type { DetailsType } from "./types";

import { ARTIFACT_TYPES, ARTIFACT_TYPE_ICONS } from "@Src/constants";
import { $AppData } from "@Src/services";
import { getImgSrc } from "@Src/utils";

// Component
import { Button, CloseButton, ItemCase } from "@Src/pure-components";
import { ItemThumbnail } from "@Src/components";

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
    const dataWeapon = $AppData.getWeaponData(weapon.code);

    if (!dataWeapon) {
      return null;
    }
    const { beta, icon, rarity } = dataWeapon;

    return (
      <div className="p-1 w-1/3">
        <ItemCase
          chosen={window.innerWidth < 686 ? false : activeDetails === "weapon"}
          onClick={() => toggleDetails("weapon")}
        >
          {(className) => (
            <ItemThumbnail className={className} item={{ beta, icon, rarity, ...rest, owner: undefined }} />
          )}
        </ItemCase>
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
              <ItemCase chosen={window.innerWidth < 686 ? false : activeDetails === i} onClick={() => toggleDetails(i)}>
                {(className) => (
                  <ItemThumbnail
                    className={className}
                    item={{
                      rarity: artifact.rarity,
                      level: artifact.level,
                      icon: $AppData.getArtifactData(artifact)?.icon || "",
                      setupIDs: artifact.setupIDs,
                    }}
                  />
                )}
              </ItemCase>
            </div>
          ) : (
            <div key={i} className="p-1 w-1/3" style={{ minHeight: 124 }}>
              <button
                className="p-4 w-full h-full flex-center rounded bg-dark-500 glow-on-hover"
                onClick={() => onClickEmptyArtIcon(i)}
              >
                <img
                  className="w-full"
                  src={getImgSrc(ARTIFACT_TYPE_ICONS.find((item) => item.type === ARTIFACT_TYPES[i])?.icon)}
                  alt=""
                  draggable={false}
                />
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
          <p className="text-lg text-orange-500 font-semibold">Set bonus</p>
          <div className="mt-1 pl-2">
            {setBonuses.length ? (
              <>
                <p className="text-green-300 font-medium">
                  {$AppData.getArtifactSetData(setBonuses[0].code)?.name} ({setBonuses[0].bonusLv * 2 + 2})
                </p>
                {setBonuses[1] ? (
                  <p className="mt-1 text-green-300 font-medium">
                    {$AppData.getArtifactSetData(setBonuses[1].code)?.name} (2)
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-light-800 font-semibold">No Set bonus</p>
            )}
          </div>
        </div>

        {setBonuses.length !== 0 ? (
          activeDetails === "setBonus" ? (
            <CloseButton className="ml-auto" size="small" />
          ) : (
            <Button className="ml-auto group-hover:bg-yellow-400" size="small" icon={<FaInfo />} />
          )
        ) : null}
      </div>

      <div
        className={clsx("mt-2", bonusStyles(activeDetails === "statsBonus"))}
        onClick={() => toggleDetails("statsBonus")}
      >
        <p className="text-lg text-orange-500 font-semibold">Artifact details</p>

        {activeDetails === "statsBonus" ? (
          <CloseButton className="ml-auto" size="small" />
        ) : (
          <Button className="ml-auto group-hover:bg-yellow-400" size="small" icon={<FaInfo />} />
        )}
      </div>
    </div>
  );
}
