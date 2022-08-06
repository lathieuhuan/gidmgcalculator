import {
  changeConsLevel,
  changeTalentLevel,
  refineWeapon,
  upgradeWeapon,
} from "@Store/calculatorSlice";
import {
  selectArtInfo,
  selectChar,
  selectParty,
  selectTotalAttr,
  selectWeapon,
} from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";
import { useSwitcher } from "@Hooks/useSwitcher";

import { ConsList, TalentList } from "@Components/ability";
import { WeaponCard } from "@Components/WeaponCard";
import { AttributeTable } from "@Components/AttributeTable";
import { SetBonus, SharedSpace } from "@Components/minors";

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
      return state.calculator.allArtAttrs[state.calculator.currentIndex];
    });
    const sets = useSelector(selectArtInfo).sets;

    const [switcher, tab] = useSwitcher([
      { text: "Details", clickable: true },
      { text: "Set Bonus", clickable: true },
    ]);
    return (
      <div className="h-full flex flex-col">
        <div className="mb-4">{switcher}</div>
        <div className="grow">
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
        </div>
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
  Talents() {
    const char = useSelector(selectChar);
    const party = useSelector(selectParty);
    const dispatch = useDispatch();

    return (
      <TalentList
        char={char}
        onChangeLevelOf={(type) => (level) => {
          dispatch(changeTalentLevel({ type, level }));
        }}
        party={party}
      />
    );
  },
};

export default contentByTab;
