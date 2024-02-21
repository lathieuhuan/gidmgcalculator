import { getArtifactSetBonuses } from "@Src/utils/calculation";
import { addArtifactAttributes } from "@Src/calculation";
import { useTabs } from "@Src/pure-hooks";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import {
  selectArtifacts,
  selectChar,
  selectParty,
  selectTotalAttr,
  selectWeapon,
} from "@Store/calculatorSlice/selectors";
// Action
import { updateCharacter, updateWeapon } from "@Store/calculatorSlice";

// Component
import { SharedSpace } from "@Src/pure-components";
import { AttributeTable, SetBonusesDisplay, WeaponCard, TalentList, ConstellationList } from "@Src/components";

export const AttributesTab = () => {
  const totalAttr = useSelector(selectTotalAttr);
  return (
    <div className="h-full custom-scrollbar">
      <AttributeTable attributes={totalAttr} />
    </div>
  );
};

export const WeaponTab = () => {
  const dispatch = useDispatch();
  const weapon = useSelector(selectWeapon);
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
};

export const ArtifactsTab = () => {
  const artifacts = useSelector(selectArtifacts);
  const totalAttr = useSelector(selectTotalAttr);

  const artAttr = addArtifactAttributes(artifacts, { ...totalAttr });

  const { activeIndex, renderTabs } = useTabs({
    level: 2,
    configs: [{ text: "Details" }, { text: "Set Bonus" }],
  });

  return (
    <div className="h-full flex flex-col">
      {renderTabs()}

      <SharedSpace
        className="mt-3 grow"
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
  );
};

export const ConstellationTab = () => {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  return (
    <ConstellationList
      char={char}
      onClickIcon={(i) => dispatch(updateCharacter({ cons: char.cons === i + 1 ? i : i + 1 }))}
    />
  );
};

export const TalentsTab = () => {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const party = useSelector(selectParty);

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
};
