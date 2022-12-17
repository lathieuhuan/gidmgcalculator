import clsx from "clsx";
import { useState } from "react";
import type { ArtifactAttribute, UserArtifacts, UserWeapon } from "@Src/types";
import type { DetailsType } from "./types";

// Constant
import { ARTIFACT_TYPES } from "@Src/constants";

// Hook
import { useDispatch } from "@Store/hooks";

// Action
import { switchArtifact, switchWeapon, unequipArtifact } from "@Store/userDatabaseSlice";

// Util
import { getArtifactSetBonuses } from "@Store/calculatorSlice/utils";

// Component
import { CloseButton } from "@Src/styled-components";
import { SharedSpace } from "@Components/minors";
import { InventoryWeapon, InventoryArtifact } from "@Components/item-stores";
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
  const [showingDetails, setShowingDetails] = useState(false);
  const [inventoryCode, setInventoryCode] = useState(-1);

  const dispatch = useDispatch();
  const oldOwner = weapon.owner;
  const onSmallDevice = window.innerWidth < 686;

  const toggleDetails = (type: DetailsType) => {
    if (activeDetails === type) {
      setShowingDetails(false);
      setTimeout(() => setActiveDetails(-1), 200);
    } else {
      setShowingDetails(true);
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

  const detailsComponent = activeDetails !== -1 && (
    <GearsDetails
      className={clsx(
        "h-full",
        onSmallDevice ? "" : "px-3 py-4 border-l-2 border-darkblue-2 rounded-r-lg bg-darkblue-1"
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
            setShowingDetails(false);
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
        <div className="ml-2 h-full w-75 px-4 rounded-lg bg-darkblue-1 box-content">
          <SharedSpace
            atLeft={!showingDetails}
            leftPart={overviewComponent}
            rightPart={
              <div className="h-full py-4 flex flex-col">
                <div className="flex justify-center">
                  <CloseButton onClick={() => toggleDetails(activeDetails)} />
                </div>
                <div className="pt-3 grow hide-scrollbar">{detailsComponent}</div>
              </div>
            }
          />
        </div>
      ) : (
        <div className="ml-2 h-full flex">
          <div className="w-75 px-4 rounded-lg bg-darkblue-1 box-content">{overviewComponent}</div>
          <div
            className="py-2 hide-scrollbar transition-size duration-200 ease-in-out"
            style={{ width: showingDetails ? "20.25rem" : 0 }}
          >
            {detailsComponent}
          </div>
        </div>
      )}

      <InventoryWeapon
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

      <InventoryArtifact
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
