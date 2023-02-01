import { batch } from "react-redux";
import isEqual from "react-fast-compare";
import type { CalcArtifacts, UserSetup, UserWeapon } from "@Src/types";
import type { PickedChar } from "./calculatorSlice/reducer-types";
import type { AppThunk } from "./index";
import {
  ARTIFACT_TYPES,
  EScreen,
  MAX_USER_ARTIFACTS,
  MAX_USER_SETUPS,
  MAX_USER_WEAPONS,
} from "@Src/constants";

// Action
import { initSessionWithChar, updateAllArtifact, updateCalculator } from "./calculatorSlice";
import { updateImportInfo, updateUI } from "./uiSlice";
import {
  addUserArtifact,
  addUserWeapon,
  saveSetup,
  updateUserArtifact,
  updateUserWeapon,
} from "./userDatabaseSlice";

// Util
import {
  findById,
  calcItemToUserItem,
  userItemToCalcItem,
  findByCode,
  findByName,
  deepCopy,
} from "@Src/utils";
import { cleanupCalcSetup, isUserSetup } from "@Src/utils/setup";
import {
  createArtDebuffCtrls,
  createArtifact,
  createArtifactBuffCtrls,
  createCharInfo,
  createCharModCtrls,
  createElmtModCtrls,
  createWeapon,
  createWeaponBuffCtrls,
} from "@Src/utils/creators";
import { findDataArtifactSet } from "@Data/controllers";

export const startCalculation =
  (pickedChar: PickedChar): AppThunk =>
  (dispatch, getState) => {
    const { userWps, userArts } = getState().database;

    dispatch(initSessionWithChar({ pickedChar, userWps, userArts }));
  };

export const pickEquippedArtSet =
  (artifactIDs: (number | null)[]): AppThunk =>
  (dispatch, getState) => {
    const { userArts } = getState().database;
    const artifacts = artifactIDs.map((id) => {
      const artifact = id ? findById(userArts, id) : undefined;
      return artifact ? userItemToCalcItem(artifact) : null;
    });

    dispatch(updateAllArtifact(artifacts));
  };

export const saveSetupThunk = (setupID: number, name: string): AppThunk => {
  return (dispatch, getState) => {
    const {
      calculator,
      database: { userSetups, userWps, userArts },
    } = getState();
    let excessType = "";

    if (userSetups.filter(({ type }) => type !== "complex").length + 1 > MAX_USER_SETUPS) {
      excessType = "Setup";
    } else if (userWps.length + 1 > MAX_USER_WEAPONS) {
      excessType = "Weapon";
    } else if (userArts.length + 5 > MAX_USER_ARTIFACTS) {
      excessType = "Artifact";
    }

    if (excessType) {
      return dispatch(
        updateCalculator({
          message: {
            type: "error",
            content: `You're having to many ${excessType}s. Please remove some of them first.`,
          },
        })
      );
    }

    const { weapon, artifacts } = calculator.setupsById[setupID];
    let seedID = Date.now();
    let weaponID = weapon.ID;
    const artifactIDs = artifacts.map((artifact) => artifact?.ID ?? null);
    const userSetup = findById(userSetups, setupID);
    const userWeapon = findById(userWps, weapon.ID);
    const isOldSetup = userSetup && isUserSetup(userSetup);

    if (!userWeapon) {
      dispatch(
        addUserWeapon(
          calcItemToUserItem(weapon, {
            setupIDs: [setupID],
          })
        )
      );

      if (isOldSetup) {
        const oldWeapon = findById(userWps, userSetup.weaponID);

        if (oldWeapon) {
          dispatch(
            updateUserWeapon({
              ID: userSetup.weaponID,
              setupIDs: oldWeapon.setupIDs?.filter((ID) => ID !== setupID),
            })
          );
        }
      }
    } else {
      // Nothing changes => add setupID
      if (isEqual(weapon, userItemToCalcItem(userWeapon))) {
        const newSetupIDs = userWeapon.setupIDs || [];

        if (!newSetupIDs.includes(setupID)) {
          dispatch(
            updateUserWeapon({
              ID: userWeapon.ID,
              setupIDs: newSetupIDs.concat(setupID),
            })
          );
        }
      } else {
        // Add new weapon
        weaponID = seedID++;

        dispatch(
          addUserWeapon(
            calcItemToUserItem(weapon, {
              ID: weaponID,
              setupIDs: [setupID],
            })
          )
        );

        // Remove setupID from existed weapon
        dispatch(
          updateUserWeapon({
            ID: userWeapon.ID,
            setupIDs: userWeapon.setupIDs?.filter((ID) => ID !== setupID),
          })
        );
      }
    }

    artifacts.forEach((artifact, artifactIndex) => {
      if (!artifact) return;
      const userArtifact = findById(userArts, artifact.ID);

      if (!userArtifact) {
        dispatch(
          addUserArtifact(
            calcItemToUserItem(artifact, {
              setupIDs: [setupID],
            })
          )
        );

        if (isOldSetup) {
          const oldArtifactID = userSetup.artifactIDs[artifactIndex] || undefined;
          const oldArtifact = findById(userArts, oldArtifactID);

          if (oldArtifact) {
            dispatch(
              updateUserArtifact({
                ID: oldArtifact.ID,
                setupIDs: oldArtifact.setupIDs?.filter((ID) => ID !== setupID),
              })
            );
          }
        }
      } else {
        if (isEqual(artifact, userItemToCalcItem(userArtifact))) {
          const newSetupIDs = userArtifact.setupIDs || [];

          if (!newSetupIDs.includes(setupID)) {
            dispatch(
              updateUserArtifact({
                ID: userArtifact.ID,
                setupIDs: newSetupIDs.concat(setupID),
              })
            );
          }
        } else {
          const artifactID = seedID++;
          artifactIDs[artifactIndex] = artifactID;

          dispatch(
            addUserArtifact(
              calcItemToUserItem(artifact, {
                ID: artifactID,
                setupIDs: [setupID],
              })
            )
          );

          dispatch(
            updateUserArtifact({
              ID: userArtifact.ID,
              setupIDs: userArtifact.setupIDs?.filter((ID) => ID !== setupID),
            })
          );
        }
      }
    });

    batch(() => {
      dispatch(
        saveSetup({
          ID: setupID,
          name,
          data: cleanupCalcSetup(calculator, setupID, { weaponID, artifactIDs }),
        })
      );
      dispatch(
        updateUI({
          atScreen: EScreen.MY_SETUPS,
          highManagerWorking: false,
        })
      );
    });
  };
};

interface MakeTeammateSetupArgs {
  setup: UserSetup;
  mainWeapon: UserWeapon;
  teammateIndex: number;
}
export const makeTeammateSetup = ({
  setup,
  mainWeapon,
  teammateIndex,
}: MakeTeammateSetupArgs): AppThunk => {
  return (dispatch, getState) => {
    const teammate = setup.party[teammateIndex];

    if (teammate) {
      const { userChars, userWps } = getState().database;
      const { weapon, artifact } = teammate;
      const [selfBuffCtrls, selfDebuffCtrls] = createCharModCtrls(true, teammate.name);
      let seedID = Date.now();

      const similarWeapon = findByCode(userWps, teammate.weapon.code);
      const actualWeapon = similarWeapon
        ? userItemToCalcItem(similarWeapon)
        : {
            ID: seedID++,
            ...createWeapon({
              code: weapon.code,
              type: weapon.type,
            }),
          };

      let artifacts: CalcArtifacts = [null, null, null, null, null];

      if (artifact.code) {
        const { variants = [] } = findDataArtifactSet({ code: artifact.code }) || {};
        const maxRarity = variants[variants.length - 1];

        if (maxRarity) {
          artifacts = ARTIFACT_TYPES.map((type) => ({
            ID: seedID++,
            ...createArtifact({
              code: artifact.code,
              rarity: maxRarity,
              type,
            }),
          }));
        }
      }

      const party = deepCopy(setup.party);
      const [tmBuffCtrls, tmDebuffCtrls] = createCharModCtrls(false, teammate.name);

      party[teammateIndex] = {
        name: setup.char.name,
        weapon: {
          code: mainWeapon.code,
          type: mainWeapon.type,
          refi: mainWeapon.refi,
          buffCtrls: createWeaponBuffCtrls(false, mainWeapon),
        },
        artifact: {
          code: 0,
          buffCtrls: [],
        },
        buffCtrls: tmBuffCtrls,
        debuffCtrls: tmDebuffCtrls,
      };

      dispatch(
        updateImportInfo({
          ID: seedID++,
          name: "New setup",
          target: setup.target,
          calcSetup: {
            char: {
              name: teammate.name,
              ...createCharInfo(findByName(userChars, teammate.name)),
            },
            selfBuffCtrls,
            selfDebuffCtrls,
            weapon: actualWeapon,
            wpBuffCtrls: createWeaponBuffCtrls(true, actualWeapon),
            artifacts,
            artBuffCtrls: createArtifactBuffCtrls(true, { code: artifact.code }),
            artDebuffCtrls: createArtDebuffCtrls(),
            party,
            elmtModCtrls: createElmtModCtrls(),
            customBuffCtrls: [],
            customDebuffCtrls: [],
            customInfusion: { element: "phys" },
          },
        })
      );
    }
  };
};
