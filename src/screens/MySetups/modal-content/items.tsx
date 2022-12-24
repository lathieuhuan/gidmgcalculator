import { Fragment } from "react";
import type { UserArtifacts, UserWeapon } from "@Src/types";

// Component
import { OwnerLabel } from "@Components/atoms";
import { WeaponCard, ArtifactCard } from "@Components/organisms";

export function MySetupWeapon({ weapon }: { weapon: UserWeapon }) {
  return (
    <div className="relative">
      <div className="w-75 hide-scrollbar" style={{ height: "30rem" }}>
        <WeaponCard weapon={weapon} />
      </div>
      <OwnerLabel owner={weapon?.owner} />
    </div>
  );
}

interface MySetupArtifactsProps {
  artifacts: UserArtifacts;
}
export function MySetupArtifacts({ artifacts }: MySetupArtifactsProps) {
  return (
    <Fragment>
      {artifacts.map((artifact, i) => {
        if (artifact) {
          return (
            <div key={i} className="px-1" style={{ width: "14.5rem" }}>
              <ArtifactCard artifact={artifact} space="mx-2" />
              <OwnerLabel owner={artifact?.owner} />
            </div>
          );
        }
        return null;
      })}
    </Fragment>
  );
}
