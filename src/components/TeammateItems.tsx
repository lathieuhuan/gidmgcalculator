import { FaTimes } from "react-icons/fa";

import type { Teammate } from "@Src/types";
import { getImgSrc } from "@Src/utils";
import { appData } from "@Data/index";

// Component
import { Button } from "@Src/pure-components";

interface TeammateItemsProps {
  className?: string;
  mutable?: boolean;
  teammate: Teammate;
  onClickWeapon?: () => void;
  onChangeWeaponRefinement?: (newRefinement: number) => void;
  onClickArtifact?: () => void;
  onClickRemoveArtifact?: () => void;
}
export const TeammateItems = ({
  className,
  mutable,
  teammate,
  onClickWeapon,
  onChangeWeaponRefinement,
  onClickArtifact,
  onClickRemoveArtifact,
}: TeammateItemsProps) => {
  const { weapon, artifact } = teammate;
  const weaponData = appData.getWeaponData(weapon.code);
  const { name: artifactSetName, flower } = appData.getArtifactSetData(artifact.code) || {};
  const { icon: artifactSetIcon = "" } = flower || {};

  return (
    <div className={className}>
      {weaponData && (
        <div className="flex">
          <button
            className={`w-14 h-14 mr-2 rounded bg-gradient-${weaponData.rarity} shrink-0`}
            disabled={!mutable}
            onClick={onClickWeapon}
          >
            <img src={getImgSrc(weaponData.icon)} alt="weapon" draggable={false} />
          </button>

          <div className="overflow-hidden">
            <p className={`text-rarity-${weaponData.rarity} text-lg font-semibold truncate`}>{weaponData.name}</p>
            {mutable ? (
              weaponData.rarity >= 3 && (
                <div className="flex items-center">
                  <span>Refinement</span>
                  <select
                    className={`ml-2 pr-1 text-rarity-${weaponData.rarity} text-right`}
                    value={weapon.refi}
                    onChange={(e) => onChangeWeaponRefinement?.(+e.target.value)}
                  >
                    {[...Array(5)].map((_, index) => {
                      return (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )
            ) : (
              <p>
                Refinement <span className={`ml-1 text-rarity-${weaponData.rarity} font-semibold`}>{weapon.refi}</span>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-2 flex space-x-2">
        <button className="w-14 h-14 shrink-0" disabled={!mutable} onClick={onClickArtifact}>
          {artifactSetIcon ? (
            <img className="bg-darkblue-3 rounded" src={getImgSrc(artifactSetIcon)} alt="artifact" draggable={false} />
          ) : (
            <img className="p-1" src={getImgSrc("6/6a/Icon_Inventory_Artifacts")} alt="artifact" draggable={false} />
          )}
        </button>

        <p className={"mt-1 grow font-medium truncate " + (artifactSetName ? "text-default text-lg" : "text-lesser")}>
          {artifactSetName || "No artifact buff / debuff"}
        </p>
        {artifactSetName && mutable && (
          <Button
            className="mt-1 self-start hover:text-darkred"
            boneOnly
            icon={<FaTimes />}
            onClick={onClickRemoveArtifact}
          />
        )}
      </div>
    </div>
  );
};
