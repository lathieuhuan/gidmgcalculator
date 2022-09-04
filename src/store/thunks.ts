import { batch } from "react-redux";

import type { AppThunk } from "./index";
import type { PickedChar } from "./calculatorSlice/reducer-types";
import type { TemporarySetup } from "@Screens/Calculator/Settings/types";
import type { CalcConfigurations, CalcSetup, UsersSetup } from "@Src/types";

import {
  applySettingsOnCalculator,
  importSetup,
  initSessionWithChar,
  updateAllArtPieces,
} from "./calculatorSlice";
import { applySettingsOnUI, resetCalculatorUI, changeScreen, toggleSettings } from "./uiSlice";
import { saveSetup } from "./usersDatabaseSlice";

import { EScreen } from "@Src/constants";
import { findById } from "@Src/utils";
import { cleanCalcSetup } from "@Src/utils/setup";

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

export const saveSetupThunk = (index: number, ID: number, name: string): AppThunk => {
  return (dispatch, getState) => {
    const { calculator } = getState();

    batch(() => {
      dispatch(
        saveSetup({
          ID,
          name,
          data: cleanCalcSetup(calculator, index),
        })
      );
      dispatch(changeScreen(EScreen.MY_SETUPS));
      dispatch(toggleSettings(false));
    });
  };
};
