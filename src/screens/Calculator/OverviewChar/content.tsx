import { changeConsLevel, refineWeapon, upgradeWeapon } from "@Store/calculatorSlice";
import {
  selectArtInfo,
  selectChar,
  selectTotalAttr,
  selectWeapon,
} from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";
import { useSwitcher } from "@Hooks/useSwitcher";

import AttributeTable from "@Components/AttributeTable";
import ConsList from "@Components/ConsList";
import { SetBonus, SharedSpace } from "@Components/minors";
import WeaponCard from "@Components/WeaponCard";

const contentByTab: Record<string, () => JSX.Element> = {
  Attributes() {
    const totalAttr = useSelector(selectTotalAttr);
    return (
      <div className="h-full custom-scrollbar">
        <AttributeTable attributes={totalAttr} />
      </div>
    );
  },
  Weapon() {
    const weapon = useSelector(selectWeapon);
    const dispatch = useDispatch();
    return (
      <div className="h-full hide-scrollbar">
        <WeaponCard
          weapon={weapon}
          mutable={true}
          upgrade={(level) => dispatch(upgradeWeapon(level))}
          refine={(refi) => dispatch(refineWeapon(refi))}
        />
      </div>
    );
  },
  Artifacts() {
    const artAttrs = useSelector((state) => {
      return state.calculator.allArtAttrs[state.calculator.currentSetup];
    });
    const sets = useSelector(selectArtInfo).sets;

    const [switcher, tab] = useSwitcher([
      { text: "Details", clickable: true },
      { text: "Set Bonus", clickable: true },
    ]);
    return (
      <div className="h-full flex-col">
        <SharedSpace
          atLeft={tab === "Details"}
          leftPart={
            <div className="h-full custom-scrollbar">
              <AttributeTable attributes={artAttrs} />
            </div>
          }
          rightPart={
            <div className="h-full hide-scrollbar">
              <SetBonus sets={sets} />
            </div>
          }
        />
        <div className="mt-3">{switcher}</div>
      </div>
    );
  },
  Constellation() {
    const char = useSelector(selectChar);
    const dispatch = useDispatch();
    return (
      <ConsList
        char={char}
        onClickIcon={(i) => dispatch(changeConsLevel(char.cons === i + 1 ? i : i + 1))}
      />
    );
  },
};

export default contentByTab;
