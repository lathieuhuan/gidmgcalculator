import { useMemo, useState } from "react";
import { FaLink, FaPlus, FaShareAlt, FaTrashAlt, FaUnlink, FaWrench } from "react-icons/fa";
import type { UserArtifacts, UserSetup, UserWeapon } from "@Src/types";
import type { MySetupModalType } from "../types";

// Constant
import { ARTIFACT_ICONS, ARTIFACT_TYPES } from "@Src/constants";

// Hook
import { useDispatch } from "@Store/hooks";

// Action
import { updateImportInfo } from "@Store/uiSlice";
import { makeTeammateSetup } from "@Store/thunks";

// Selector
import {
  chooseUserSetup,
  switchShownSetupInComplex,
  uncombineSetups,
} from "@Store/userDatabaseSlice";

// Util
import { getImgSrc, userItemToCalcItem } from "@Src/utils";
import { finalTalentLv } from "@Src/utils/calculation";
import { restoreCalcSetup } from "@Src/utils/setup";
import {
  findDataArtifact,
  findDataCharacter,
  findDataWeapon,
  getPartyData,
} from "@Data/controllers";

// Component
import { CharacterPortrait, IconButton } from "@Components/atoms";
import { Modal } from "@Components/molecules";
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
export function SetupTemplate({
  ID,
  setup,
  setupName,
  weapon,
  artifacts = [],
  allIDs,
  openModal,
}: SetupLayoutProps) {
  const { type, char, party } = setup;
  const dispatch = useDispatch();

  const [teammateDetail, setTeammateDetail] = useState({
    index: -1,
    isCalculated: false,
  });

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
    const dataChar = findDataCharacter(char);
    const weaponData = weapon ? findDataWeapon(weapon) : undefined;

    if (dataChar) {
      const talents = (["NAs", "ES", "EB"] as const).map((talentType) => {
        return finalTalentLv({
          char,
          talents: dataChar.activeTalents,
          talentType,
          partyData: getPartyData(party),
        });
      });

      const renderSpan = (text: string | number) => (
        <span className={`font-medium text-${dataChar.vision}`}>{text}</span>
      );

      mainCharacter = (
        <div className="mx-auto lg:mx-0 flex">
          <img
            className="w-20 h-20"
            src={getImgSrc(dataChar.icon)}
            alt={char.name}
            draggable={false}
          />

          <div className="ml-4 flex-col justify-between">
            <p className="text-lg">Level {renderSpan(char.level)}</p>
            <p>Constellation {renderSpan(char.cons)}</p>
            <p>
              Talents: {renderSpan(talents[0])} / {renderSpan(talents[1])} /{" "}
              {renderSpan(talents[2])}
            </p>
          </div>
        </div>
      );
    }

    const teammate = (
      <div
        className={"flex space-x-4 " + (party.filter(Boolean).length ? "mt-4" : "")}
        style={{ width: "15.5rem" }}
      >
        {party.map((teammate, teammateIndex) => {
          const dataTeammate = teammate && findDataCharacter(teammate);
          if (!dataTeammate) return null;

          const isCalculated = !isOriginal && !!allIDs?.[teammate.name];

          return (
            <div
              key={teammateIndex}
              className={
                "w-18 h-18 cursor-pointer" +
                (isCalculated
                  ? " rounded-circle shadow-3px-3px shadow-lightgold cursor-pointer"
                  : "")
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
      <div className="mt-4 mx-auto grid grid-cols-3 gap-1">
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
      <div
        className="pr-1 flex justify-between flex-col lg:flex-row"
        onDoubleClick={() => console.log(setup)}
      >
        <div className="flex items-center" style={{ maxWidth: "22.5rem" }}>
          {isOriginal ? null : window.innerWidth > 1025 ? (
            <button
              className="w-8 h-8 rounded-circle text-default hover:text-darkred flex-center group"
              onClick={uncombine}
            >
              <FaUnlink className="hidden group-hover:block" />
              <FaLink className="block group-hover:hidden" />
            </button>
          ) : (
            <IconButton boneOnly variant="negative" onClick={uncombine}>
              <FaUnlink />
            </IconButton>
          )}
          <p className="px-1 text-xl text-orange font-semibold truncate">
            {setupName || setup.name}
          </p>
        </div>

        <div className="mt-2 lg:mt-0 pb-2 flex space-x-4 justify-end">
          <IconButton
            className="p-2"
            variant="positive"
            disabled={!weapon}
            onClick={() => {
              if (weapon) {
                const { weaponID, artifactIDs, ID, name, type, target, ...rest } = setup;

                const calcSetup = restoreCalcSetup({
                  ...rest,
                  weapon: userItemToCalcItem(weapon),
                  artifacts: artifacts.map((artifact) => {
                    return artifact ? userItemToCalcItem(artifact) : null;
                  }),
                });

                dispatch(
                  updateImportInfo({
                    ID,
                    name,
                    type,
                    calcSetup,
                    target,
                  })
                );
              }
            }}
          >
            <FaWrench />
          </IconButton>

          <IconButton
            className="p-2 glow-on-hover"
            variant="neutral"
            onClick={openModal("SHARE_SETUP", setup.ID)}
          >
            <FaShareAlt />
          </IconButton>

          {isOriginal ? (
            <IconButton variant="negative" onClick={openModal("REMOVE_SETUP", setup.ID)}>
              <FaTrashAlt />
            </IconButton>
          ) : (
            <IconButton
              variant="neutral"
              disabled={!allIDs || Object.keys(allIDs).length >= 4}
              onClick={openModal("COMBINE_MORE", ID)}
            >
              <FaPlus />
            </IconButton>
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
        {party[teammateDetail.index] && (
          <TeammateDetail
            teammate={party[teammateDetail.index]!}
            isCalculated={teammateDetail.isCalculated}
            onSwitchSetup={() => {
              const { name } = party[teammateDetail.index] || {};
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
