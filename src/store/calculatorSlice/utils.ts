import type { CalculatorState } from "./types";
import { $AppData } from "@Src/services";
import { calculateAll } from "@Src/calculation";

export const getCharDataFromState = (state: CalculatorState) => {
  const setup = state.setupsById[state.activeId];
  return $AppData.getCharData(setup.char.name);
};

export function calculate(state: CalculatorState, all?: boolean) {
  try {
    const { activeId, setupManageInfos, setupsById, target } = state;
    const allIds = all ? setupManageInfos.map(({ ID }) => ID) : [activeId];

    for (const id of allIds) {
      const results = calculateAll(setupsById[id], target);
      state.statsById[id] = {
        infusedElement: results.infusedElement,
        totalAttrs: results.totalAttr,
        rxnBonuses: results.rxnBonus,
        dmgResult: results.dmgResult,
      };
    }
  } catch (err) {
    console.log(err);

    state.message = {
      active: true,
      type: "error",
      content: "An unknown error has occurred and prevented the calculation process.",
    };
  }
}
