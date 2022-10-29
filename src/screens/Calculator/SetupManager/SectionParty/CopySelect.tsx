import { CopySection } from "@Screens/Calculator/components";
import { updateCalcSetup } from "@Store/calculatorSlice";
import { selectCalcSetupsById, selectSetupManageInfos } from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";

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
    <CopySection className="mb-4 px-4" options={copyOptions} onClickCopy={onClickCopyParty} />
  ) : null;
}
