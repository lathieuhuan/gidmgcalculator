import clsx from "clsx";
import { useState } from "react";

// Type
import type { ArtifactAttribute, UserArtifacts, UserWeapon } from "@Src/types";
import type { DetailsType } from "./types";

import { ARTIFACT_TYPES } from "@Src/constants";
import { getArtifactSetBonuses } from "@Src/utils/calculation";

// Store
import { useDispatch } from "@Store/hooks";
import { switchArtifact, switchWeapon, unequipArtifact } from "@Store/userDatabaseSlice";

// Component
import { CloseButton, SharedSpace } from "@Src/pure-components";
import { WeaponInventory, ArtifactInventory } from "@Src/components";
import { GearsOverview } from "./GearsOverview";
import { GearsDetails } from "./GearsDetails";

interface GearsProps {
  weapon: UserWeapon;
  artifacts: UserArtifacts;
  artAttr: ArtifactAttribute;
}
export default function Gears(props: GearsProps) {
  const { weapon, artifacts } = props;
  const setBonuses = getArtifactSetBonuses(artifacts);

  const [activeDetails, setActiveDetails] = useState<DetailsType>(-1);
  const [showingDetail, setShowingDetail] = useState(false);
  const [inventoryCode, setInventoryCode] = useState(-1);

  const dispatch = useDispatch();
  const oldOwner = weapon.owner;
  const onSmallDevice = window.innerWidth < 686;

  const toggleDetails = (type: DetailsType) => {
    if (activeDetails === type) {
      setShowingDetail(false);
      setTimeout(() => setActiveDetails(-1), 200);
    } else {
      setShowingDetail(true);
      setActiveDetails(type);
    }
  };

  const overviewComponent = (
    <GearsOverview
      weapon={weapon}
      artifacts={artifacts}
      setBonuses={setBonuses}
      activeDetails={activeDetails}
      toggleDetails={toggleDetails}
      onClickEmptyArtIcon={setInventoryCode}
    />
  );

  const detailComponent = activeDetails !== -1 && (
    <GearsDetails
      className={clsx(
        "h-full",
        onSmallDevice ? "" : "px-3 py-4 border-l-2 border-dark-700 rounded-r-lg bg-dark-900"
      )}
      style={{ width: onSmallDevice ? undefined : "20.25rem" }}
      activeDetails={activeDetails}
      {...props}
      setBonuses={setBonuses}
      onClickSwitchWeapon={() => setInventoryCode(5)}
      onClickSwitchArtifact={() => {
        if (typeof activeDetails === "number") {
          setInventoryCode(activeDetails);
        }
      }}
      onClickUnequipArtifact={() => {
        if (typeof activeDetails === "number") {
          const activeArtifact = artifacts[activeDetails];

          if (activeArtifact) {
            setShowingDetail(false);
            setTimeout(() => {
              setActiveDetails(-1);
              dispatch(
                unequipArtifact({
                  owner: activeArtifact.owner,
                  artifactID: activeArtifact.ID,
                  artifactIndex: activeDetails,
                })
              );
            }, 200);
          }
        }
      }}
      onCloseDetails={() => toggleDetails(activeDetails)}
    />
  );

  return (
    <>
      {onSmallDevice ? (
        <div className="w-75 h-full px-4 shrink-0 rounded-lg bg-dark-900 box-content">
          <SharedSpace
            atLeft={!showingDetail}
            leftPart={overviewComponent}
            rightPart={
              <div className="h-full py-4 flex flex-col">
                <div className="flex justify-center">
                  <CloseButton size="small" onClick={() => toggleDetails(activeDetails)} />
                </div>
                <div className="pt-3 grow hide-scrollbar">{detailComponent}</div>
              </div>
            }
          />
        </div>
      ) : (
        <div className="h-full flex">
          <div className="w-75 px-4 rounded-lg bg-dark-900 box-content">{overviewComponent}</div>
          <div
            className="py-2 hide-scrollbar transition-size duration-200 ease-in-out"
            style={{ width: showingDetail ? "20.25rem" : 0 }}
          >
            {detailComponent}
          </div>
        </div>
      )}

      <WeaponInventory
        active={inventoryCode === 5}
        owner={oldOwner}
        weaponType={weapon.type}
        buttonText="Switch"
        onClickButton={({ owner, ID }) => {
          if (oldOwner) {
            dispatch(switchWeapon({ newOwner: owner, newID: ID, oldOwner, oldID: weapon.ID }));
          }
        }}
        onClose={() => setInventoryCode(-1)}
      />

      <ArtifactInventory
        active={inventoryCode >= 0 && inventoryCode < 5}
        currentArtifacts={artifacts}
        artifactType={ARTIFACT_TYPES[inventoryCode]}
        owner={oldOwner}
        buttonText="Switch"
        onClickButton={({ owner, ID }) => {
          if (oldOwner) {
            dispatch(
              switchArtifact({
                newOwner: owner,
                newID: ID,
                oldOwner,
                oldID: artifacts[inventoryCode]?.ID || 0,
                artifactIndex: inventoryCode,
              })
            );
          }
        }}
        onClose={() => setInventoryCode(-1)}
      />
    </>
  );
}
