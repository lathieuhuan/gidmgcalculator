import { updateCalcSetup } from "@Store/calculatorSlice";
import { selectCalcSetupsById, selectSetupManageInfos } from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";

// Component
import { CopySection } from "../../components";

export function CopySelect() {
  const dispatch = useDispatch();
  const setupManageInfos = useSelector(selectSetupManageInfos);
  const setupsById = useSelector(selectCalcSetupsById);

  const allParties = setupManageInfos.map(({ ID }) => setupsById[ID].party);
  const copyOptions = [];

  for (const partyIndex in allParties) {
    if (allParties[partyIndex].some((tm) => tm)) {
      copyOptions.push({
        label: setupManageInfos[partyIndex].name,
        value: setupManageInfos[partyIndex].ID,
      });
    }
  }

  const onClickCopyParty = ({ value: sourceId }: { value: number }) => {
    const { party, elmtModCtrls } = setupsById[sourceId];

    dispatch(updateCalcSetup({ party, elmtModCtrls }));
  };

  return copyOptions.length ? (
    <CopySection className="mt-3 mb-1 px-4" options={copyOptions} onClickCopy={onClickCopyParty} />
  ) : null;
}
