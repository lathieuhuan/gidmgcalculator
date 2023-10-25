import { batch } from "react-redux";
import isEqual from "react-fast-compare";
import type { CalcArtifacts, UserSetup, UserWeapon } from "@Src/types";
import type { InitNewSessionPayload } from "./calculatorSlice/reducer-types";
import type { AppThunk } from "./index";
import { ARTIFACT_TYPES, EScreen, MAX_USER_ARTIFACTS, MAX_USER_SETUPS, MAX_USER_WEAPONS } from "@Src/constants";

// Action
import { initNewSession, updateAllArtifact, updateMessage } from "./calculatorSlice";
import { updateImportInfo, updateUI } from "./uiSlice";
import { addUserArtifact, addUserWeapon, saveSetup, updateUserArtifact, updateUserWeapon } from "./userDatabaseSlice";

// Util
import { appData } from "@Src/data";
import {
  findById,
  calcItemToUserItem,
  userItemToCalcItem,
  findByCode,
  findByName,
  deepCopy,
  getAppDataError,
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
import { parseUserCharacter, type PickedChar } from "./utils";

type Option = {
  onSuccess?: () => void;
};
export const checkBeforeInitNewSession = (payload: InitNewSessionPayload, options?: Option): AppThunk => {
  return async (dispatch) => {
    const { char } = payload.calcSetup;
    const { onSuccess } = options || {};

    if (appData.getCharStatus(char.name) === "fetched") {
      dispatch(initNewSession(payload));
      onSuccess?.();
    } else {
      dispatch(updateUI({ loading: true }));

      const response = await appData.fetchCharacter(char.name);

      if (response.code === 200) {
        dispatch(initNewSession(payload));
        onSuccess?.();
      } else {
        dispatch(
          updateMessage({
            type: "error",
            content: getAppDataError("character", response.code),
          })
        );
      }

      dispatch(updateUI({ loading: false }));
    }
  };
};

export const initNewSessionWithChar = (pickedChar: PickedChar): AppThunk => {
  return (dispatch, getState) => {
    const { userWps, userArts } = getState().database;

    const ID = Date.now();
    const charData = appData.getCharData(pickedChar.name);
    const data = parseUserCharacter({
      pickedChar,
      userWps,
      userArts,
      weaponType: charData.weaponType,
      seedID: ID + 1,
    });
    const [selfBuffCtrls, selfDebuffCtrls] = createCharModCtrls(true, data.char.name);

    dispatch(
      checkBeforeInitNewSession({
        ID,
        calcSetup: {
          char: data.char,
          selfBuffCtrls: selfBuffCtrls,
          selfDebuffCtrls: selfDebuffCtrls,
          weapon: data.weapon,
          wpBuffCtrls: data.wpBuffCtrls,
          artifacts: data.artifacts,
          artBuffCtrls: data.artBuffCtrls,
          artDebuffCtrls: createArtDebuffCtrls(),
          party: [null, null, null],
          elmtModCtrls: createElmtModCtrls(),
          customBuffCtrls: [],
          customDebuffCtrls: [],
          customInfusion: { element: "phys" },
        },
      })
    );
  };
};

export const pickEquippedArtSet = (artifactIDs: (number | null)[]): AppThunk => {
  return (dispatch, getState) => {
    const { userArts } = getState().database;
    const artifacts = artifactIDs.map((id) => {
      const artifact = id ? findById(userArts, id) : undefined;
      return artifact ? userItemToCalcItem(artifact) : null;
    });

    dispatch(updateAllArtifact(artifacts));
  };
};

export const saveSetupThunk = (setupID: number, name: string): AppThunk => {
  return (dispatch, getState) => {
    const {
      calculator,
      database: { userSetups, userWps, userArts },
    } = getState();
    let excessType = "";

    if (userSetups.filter((setup) => setup.type !== "complex").length + 1 > MAX_USER_SETUPS) {
      excessType = "Setup";
    } else if (userWps.length + 1 > MAX_USER_WEAPONS) {
      excessType = "Weapon";
    } else if (userArts.length + 5 > MAX_USER_ARTIFACTS) {
      excessType = "Artifact";
    }

    if (excessType) {
      return dispatch(
        updateMessage({
          type: "error",
          content: `You're having to many ${excessType}s. Please remove some of them first.`,
        })
      );
    }

    const { weapon, artifacts } = calculator.setupsById[setupID];
    let seedID = Date.now();
    let weaponID = weapon.ID;
    const artifactIDs = artifacts.map((artifact) => artifact?.ID ?? null);
    const userSetup = findById(userSetups, setupID);
    const existedWeapon = findById(userWps, weapon.ID);
    const isOldSetup = userSetup && isUserSetup(userSetup);

    if (existedWeapon) {
      if (isEqual(weapon, userItemToCalcItem(existedWeapon))) {
        // Nothing changes => add setupID to existedWeapon
        const newSetupIDs = existedWeapon.setupIDs || [];

        if (!newSetupIDs.includes(setupID)) {
          dispatch(
            updateUserWeapon({
              ID: existedWeapon.ID,
              setupIDs: newSetupIDs.concat(setupID),
            })
          );
        }
      } else {
        // Something changes => Add new weapon with setupID
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
            ID: existedWeapon.ID,
            setupIDs: existedWeapon.setupIDs?.filter((ID) => ID !== setupID),
          })
        );
      }
    } else {
      // Weapon not found => Add new weapon with setupID
      dispatch(
        addUserWeapon(
          calcItemToUserItem(weapon, {
            setupIDs: [setupID],
          })
        )
      );

      if (isOldSetup) {
        // Remove setupID from the setup's old weapon
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
    }

    artifacts.forEach((artifact, artifactIndex) => {
      if (!artifact) return;
      const existedArtifact = findById(userArts, artifact.ID);

      if (existedArtifact) {
        if (isEqual(artifact, userItemToCalcItem(existedArtifact))) {
          // Nothing changes => add setupID to existedArtifact
          const newSetupIDs = existedArtifact.setupIDs || [];

          if (!newSetupIDs.includes(setupID)) {
            dispatch(
              updateUserArtifact({
                ID: existedArtifact.ID,
                setupIDs: newSetupIDs.concat(setupID),
              })
            );
          }
        } else {
          // Something changes => Add new artifact with setupID
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

          // Remove setupID from existed artifact
          dispatch(
            updateUserArtifact({
              ID: existedArtifact.ID,
              setupIDs: existedArtifact.setupIDs?.filter((ID) => ID !== setupID),
            })
          );
        }
      } else {
        // Artifact not found => Add new artifact with setupID
        dispatch(
          addUserArtifact(
            calcItemToUserItem(artifact, {
              setupIDs: [setupID],
            })
          )
        );

        if (isOldSetup) {
          // Remove setupID from the setup's old artifact
          const oldArtifactID = userSetup.artifactIDs[artifactIndex];
          const oldArtifact = oldArtifactID ? findById(userArts, oldArtifactID) : undefined;

          if (oldArtifact) {
            dispatch(
              updateUserArtifact({
                ID: oldArtifact.ID,
                setupIDs: oldArtifact.setupIDs?.filter((ID) => ID !== setupID),
              })
            );
          }
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
export const makeTeammateSetup = ({ setup, mainWeapon, teammateIndex }: MakeTeammateSetupArgs): AppThunk => {
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
        const { variants = [] } = appData.getArtifactSetData(artifact.code) || {};
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
