import { TemporarySetup } from "@Screens/Calculator/Settings/types";
import { CalcConfigurations, CalcSetup } from "@Src/types";
import { findById } from "@Src/utils";
import { batch } from "react-redux";
import {
  applySettingsOnCalculator,
  initSessionWithChar,
  updateAllArtPieces,
} from "./calculatorSlice";
import type { PickedChar } from "./calculatorSlice/reducer-types";
import { AppThunk } from "./index";
import { applySettingsOnUI, resetCalculatorUI } from "./uiSlice";

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
