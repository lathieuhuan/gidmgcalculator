import { updateCharacter, updateWeapon } from "@Store/calculatorSlice";
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
          mutable
          upgrade={(level) => dispatch(updateWeapon({ level }))}
          refine={(refi) => dispatch(updateWeapon({ refi }))}
        />
      </div>
    );
  },
  Artifacts() {
    const artAttr = useSelector((state) => {
      return state.calculator.allartAttr[state.calculator.currentIndex];
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
                <AttributeTable attributes={artAttr} />
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
        onClickIcon={(i) => dispatch(updateCharacter({ cons: char.cons === i + 1 ? i : i + 1 }))}
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
          dispatch(updateCharacter({ [type]: level }));
        }}
        party={party}
      />
    );
  },
};

export default contentByTab;
