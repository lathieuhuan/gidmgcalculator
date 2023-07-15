import { useMemo, useState } from "react";
import { FaLink, FaPlus, FaShareAlt, FaTrashAlt, FaUnlink, FaWrench } from "react-icons/fa";
import type { UserArtifacts, UserSetup, UserWeapon } from "@Src/types";
import type { MySetupModalType } from "../types";

// Constant
import { ARTIFACT_ICONS, ARTIFACT_TYPES } from "@Src/constants";

// Store
import { useDispatch } from "@Store/hooks";
import { updateImportInfo } from "@Store/uiSlice";
import { makeTeammateSetup } from "@Store/thunks";
import { chooseUserSetup, switchShownSetupInComplex, uncombineSetups } from "@Store/userDatabaseSlice";

// Util
import { finalTalentLv } from "@Src/utils/calculation";
import { userSetupToCalcSetup } from "@Src/utils/setup";
import { appData } from "@Data/index";
import { findDataArtifact, findDataWeapon } from "@Data/controllers";

// Component
import { Button, Image, Modal } from "@Src/pure-components";
import { CharacterPortrait } from "@Src/components";
import { TeammateDetail } from "../modal-content/TeammateDetail";
import { GearIcon } from "./GearIcon";

interface SetupLayoutProps {
  ID: number;
  setup: UserSetup;
  setupName?: string;
  weapon: UserWeapon | null;
  artifacts?: UserArtifacts;
  allIDs?: Record<string, number>;
  openModal: (type: MySetupModalType, ID?: number) => () => void;
}
export function SetupTemplate({ ID, setup, setupName, weapon, artifacts = [], allIDs, openModal }: SetupLayoutProps) {
  const { type, char, party } = setup;
  const dispatch = useDispatch();

  const [teammateDetail, setTeammateDetail] = useState({
    index: -1,
    isCalculated: false,
  });

  const teammateInfo = party[teammateDetail.index];
  const isOriginal = type === "original";

  const closeTeammateDetail = () => {
    setTeammateDetail({
      index: -1,
      isCalculated: false,
    });
  };

  const uncombine = () => {
    dispatch(uncombineSetups(ID));

    setTimeout(() => {
      dispatch(chooseUserSetup(setup.ID));
    }, 10);
  };

  const onCalculateTeammateSetup = () => {
    if (weapon) {
      dispatch(
        makeTeammateSetup({
          setup,
          mainWeapon: weapon,
          teammateIndex: teammateDetail.index,
        })
      );
    }
  };

  const display = useMemo(() => {
    let mainCharacter = null;
    const charData = appData.getCharData(char.name);
    const weaponData = weapon ? findDataWeapon(weapon) : undefined;

    if (charData) {
      const talents = (["NAs", "ES", "EB"] as const).map((talentType) => {
        return finalTalentLv({
          char,
          charData,
          talentType,
          partyData: appData.getPartyData(party),
        });
      });

      const renderSpan = (text: string | number) => (
        <span className={`font-medium text-${charData.vision}`}>{text}</span>
      );

      mainCharacter = (
        <div className="mx-auto lg:mx-0 flex">
          <Image size="w-20 h-20" src={charData.icon} imgType="character" />

          <div className="ml-4 flex-col justify-between">
            <p className="text-lg">Level {renderSpan(char.level)}</p>
            <p>Constellation {renderSpan(char.cons)}</p>
            <p>
              Talents: {renderSpan(talents[0])} / {renderSpan(talents[1])} / {renderSpan(talents[2])}
            </p>
          </div>
        </div>
      );
    }

    const teammate = (
      <div className={"flex space-x-4 " + (party.filter(Boolean).length ? "mt-4" : "")} style={{ width: "15.5rem" }}>
        {party.map((teammate, teammateIndex) => {
          const dataTeammate = teammate && appData.getCharData(teammate.name);
          if (!dataTeammate) return null;

          const isCalculated = !isOriginal && !!allIDs?.[teammate.name];

          return (
            <div
              key={teammateIndex}
              className={
                "w-18 h-18 cursor-pointer" +
                (isCalculated ? " rounded-circle shadow-3px-3px shadow-lightgold cursor-pointer" : "")
              }
            >
              <CharacterPortrait
                code={dataTeammate.code}
                icon={dataTeammate.icon}
                onClickIcon={() => {
                  setTeammateDetail({
                    index: teammateIndex,
                    isCalculated,
                  });
                }}
              />
            </div>
          );
        })}
      </div>
    );

    const gears = (
      <div className="mt-4 mx-auto grid grid-cols-3 gap-2">
        {weaponData ? (
          <GearIcon item={weaponData} onClick={openModal("WEAPON")} />
        ) : (
          <GearIcon item={{ icon: "7/7b/Icon_Inventory_Weapons" }} />
        )}

        {artifacts.map((artifact, i) => {
          if (artifact) {
            const artifactData = findDataArtifact(artifact);

            return artifactData ? (
              <GearIcon
                key={i}
                item={{
                  icon: artifactData.icon,
                  beta: artifactData.beta,
                  rarity: artifact.rarity || 5,
                }}
                onClick={openModal("ARTIFACTS")}
              />
            ) : null;
          }

          return <GearIcon key={i} item={{ icon: ARTIFACT_ICONS[ARTIFACT_TYPES[i]] }} />;
        })}
      </div>
    );

    return { mainCharacter, teammate, gears };
  }, [`${ID}-${setup.ID}`]);

  return (
    <>
      <div className="pr-1 flex justify-between flex-col lg:flex-row" onDoubleClick={() => console.log(setup)}>
        <div className="flex items-center" style={{ maxWidth: "22.5rem" }}>
          {isOriginal ? null : window.innerWidth > 1025 ? (
            <Button
              className="hover:text-darkred group"
              variant="custom"
              icon={
                <>
                  <FaUnlink className="hidden group-hover:block" />
                  <FaLink className="block group-hover:hidden" />
                </>
              }
              onClick={uncombine}
            />
          ) : (
            <Button variant="negative" boneOnly icon={<FaUnlink />} onClick={uncombine} />
          )}
          <p className="px-1 text-xl text-orange font-semibold truncate">{setupName || setup.name}</p>
        </div>

        <div className="mt-2 lg:mt-0 pb-2 flex space-x-4 justify-end">
          <Button
            variant="positive"
            icon={<FaWrench />}
            disabled={!weapon}
            onClick={() => {
              if (weapon) {
                const { ID, name, type, target } = setup;
                dispatch(
                  updateImportInfo({
                    ID,
                    name,
                    type,
                    calcSetup: userSetupToCalcSetup(setup, weapon, artifacts, true),
                    target,
                  })
                );
              }
            }}
          />

          <Button variant="neutral" icon={<FaShareAlt />} onClick={openModal("SHARE_SETUP", setup.ID)} />

          {isOriginal ? (
            <Button variant="negative" icon={<FaTrashAlt />} onClick={openModal("REMOVE_SETUP", setup.ID)} />
          ) : (
            <Button
              variant="neutral"
              icon={<FaPlus />}
              disabled={!allIDs || Object.keys(allIDs).length >= 4}
              onClick={openModal("COMBINE_MORE", ID)}
            />
          )}
        </div>
      </div>

      <div className="px-4 pt-4 pb-3 rounded-lg bg-darkblue-1 flex flex-col lg:flex-row">
        <div className="flex flex-col">
          {display.mainCharacter}
          {display.teammate}
        </div>

        <div className="hidden lg:block w-0.5 mx-4 bg-darkblue-3" />

        <div className="mt-4 lg:mt-0 flex flex-col">
          <div className="flex justify-center space-x-4">
            <button
              className="px-4 py-1 bg-darkblue-3 font-semibold glow-on-hover leading-base rounded-2xl"
              onClick={openModal("STATS")}
            >
              Stats
            </button>
            <button
              className="px-4 py-1 bg-darkblue-3 font-semibold glow-on-hover leading-base rounded-2xl"
              onClick={openModal("MODIFIERS")}
            >
              Modifiers
            </button>
          </div>

          {display.gears}
        </div>
      </div>

      <Modal active={teammateDetail.index !== -1} onClose={closeTeammateDetail}>
        {teammateInfo && (
          <TeammateDetail
            teammate={teammateInfo}
            isCalculated={teammateDetail.isCalculated}
            onSwitchSetup={() => {
              const { name } = teammateInfo || {};
              const shownID = allIDs && name ? allIDs[name] : undefined;

              if (shownID) {
                dispatch(
                  switchShownSetupInComplex({
                    complexID: ID,
                    shownID,
                  })
                );
              }
            }}
            onCalculateTeammateSetup={onCalculateTeammateSetup}
            onClose={closeTeammateDetail}
          />
        )}
      </Modal>
    </>
  );
}
