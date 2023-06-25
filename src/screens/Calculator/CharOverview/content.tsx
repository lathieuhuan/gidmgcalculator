// Calculator
import { addArtAttr } from "@Calculators/baseStats";

// Action
import { updateCharacter, updateWeapon } from "@Store/calculatorSlice";

// Selector
import {
  selectArtifacts,
  selectChar,
  selectParty,
  selectTotalAttr,
  selectWeapon,
} from "@Store/calculatorSlice/selectors";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";
import { useTabs } from "@Src/hooks";

// Util
import { getArtifactSetBonuses } from "@Src/utils/calculation";

// Component
import { SharedSpace, AttributeTable, SetBonusesDisplay, WeaponCard, TalentList, ConsList } from "@Components";

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
          mutable
          weapon={weapon}
          upgrade={(level) => dispatch(updateWeapon({ level }))}
          refine={(refi) => dispatch(updateWeapon({ refi }))}
        />
      </div>
    );
  },
  Artifacts() {
    const artifacts = useSelector(selectArtifacts);
    const totalAttr = useSelector(selectTotalAttr);

    const artAttr = addArtAttr({ artifacts, totalAttr: { ...totalAttr } });

    const { activeIndex, tabs } = useTabs({
      level: 2,
      configs: [{ text: "Details" }, { text: "Set Bonus" }],
    });

    return (
      <div className="h-full flex flex-col">
        <div className="mb-3">{tabs}</div>
        <div className="grow">
          <SharedSpace
            atLeft={activeIndex === 0}
            leftPart={
              <div className="h-full custom-scrollbar">
                <AttributeTable attributes={artAttr} />
              </div>
            }
            rightPart={
              <div className="h-full hide-scrollbar">
                <SetBonusesDisplay setBonuses={getArtifactSetBonuses(artifacts)} noTitle />
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
      <ConsList char={char} onClickIcon={(i) => dispatch(updateCharacter({ cons: char.cons === i + 1 ? i : i + 1 }))} />
    );
  },
  Talents() {
    const char = useSelector(selectChar);
    const party = useSelector(selectParty);
    const dispatch = useDispatch();

    return (
      <TalentList
        key={char.name}
        char={char}
        onChangeTalentLevel={(type, level) => {
          dispatch(updateCharacter({ [type]: level }));
        }}
        party={party}
      />
    );
  },
};

export default contentByTab;
