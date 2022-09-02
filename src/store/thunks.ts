import { batch } from "react-redux";

import type { AppThunk } from "./index";
import type { PickedChar } from "./calculatorSlice/reducer-types";
import type { TemporarySetup } from "@Screens/Calculator/Settings/types";
import type { CalcConfigurations, CalcSetup } from "@Src/types";

import {
  applySettingsOnCalculator,
  initSessionWithChar,
  updateAllArtPieces,
} from "./calculatorSlice";
import { applySettingsOnUI, resetCalculatorUI, changeScreen, toggleSettings } from "./uiSlice";
import { saveSetup } from "./usersDatabaseSlice";
import { findById, getCurrentChar } from "@Src/utils";
import { EScreen } from "@Src/constants";

export const startCalculation =
  (pickedChar: PickedChar): AppThunk =>
  (dispatch, getState) => {
    const { myWps, myArts } = getState().database;

    batch(() => {
      dispatch(initSessionWithChar({ pickedChar, myWps, myArts }));
      dispatch(resetCalculatorUI());
    });
  };

export const pickEquippedArtSet =
  (artifactIDs: (number | null)[]): AppThunk =>
  (dispatch, getState) => {
    const { myArts } = getState().database;
    const artPieces = artifactIDs.map((id) => {
      if (id) {
        const foundArtPiece = findById(myArts, id);

        if (foundArtPiece) {
          const { owner, ...info } = foundArtPiece;
          return info;
        }
      }
      return null;
    });

    dispatch(updateAllArtPieces(artPieces));
  };

export const applySettings =
  (tempoSetups: TemporarySetup[], tempoConfigs: CalcConfigurations): AppThunk =>
  (dispatch) => {
    const setups: CalcSetup[] = [];
    const comparedIndexes: number[] = [];
    const indexes: (number | null)[] = [];
    let standardIndex = 0;
    let currentIndex = -1;

    for (const i in tempoSetups) {
      const tempoSetup = tempoSetups[i];
      const { name, ID, type } = tempoSetups[i];

      setups.push({ name, ID, type });
      indexes.push(tempoSetup.index);

      if (tempoSetup.checked) comparedIndexes.push(+i);
      if (tempoSetup.isStandard) standardIndex = +i;
      if (tempoSetup.isCurrent) currentIndex = +i;
    }
    batch(() => {
      dispatch(
        applySettingsOnCalculator({
          setups,
          indexes,
          tempoConfigs,
          standardIndex,
          currentIndex,
        })
      );
      dispatch(applySettingsOnUI({ comparedIndexes, standardIndex }));
    });
  };

export const saveSetupThunk =
  (index: number, ID: number, name: string): AppThunk =>
  (dispatch, getState) => {
    const {
      char,
      allSelfBuffCtrls,
      allSelfDebuffCtrls,

      allWeapons,
      allWpBuffCtrls,
      allSubWpComplexBuffCtrls,

      allArtInfos,
      allArtBuffCtrls,
      allSubArtBuffCtrls,
      allSubArtDebuffCtrls,

      allParties,
      allElmtModCtrls,
      allCustomBuffCtrls,
      allCustomDebuffCtrls,
      target,
    } = getState().calculator;

    batch(() => {
      dispatch(
        saveSetup({
          ID,
          name,
          data: {
            char: getCurrentChar(char, index),
            selfBuffCtrls: allSelfBuffCtrls[index],
            selfDebuffCtrls: allSelfDebuffCtrls[index],
            weapon: allWeapons[index],
            wpBuffCtrls: allWpBuffCtrls[index],
            subWpComplexBuffCtrls: allSubWpComplexBuffCtrls[index],
            artInfo: allArtInfos[index],
            artBuffCtrls: allArtBuffCtrls[index],
            subArtBuffCtrls: allSubArtBuffCtrls[index],
            subArtDebuffCtrls: allSubArtDebuffCtrls[index],
            party: allParties[index],
            elmtModCtrls: allElmtModCtrls[index],
            customBuffCtrls: allCustomBuffCtrls[index],
            customDebuffCtrls: allCustomDebuffCtrls[index],
            target,
          },
        })
      );
      dispatch(changeScreen(EScreen.MY_SETUPS));
      dispatch(toggleSettings(false));
    });
  };
