import { useDispatch, useSelector } from "@Store/hooks";
import { updateCalcSetup } from "@Store/calculatorSlice";
import { selectCalcSetupsById, selectSetupManageInfos } from "@Store/calculatorSlice/selectors";

import { CopySection } from "@Screens/Calculator/components";

export function CopySelect() {
  const dispatch = useDispatch();

  const setupManageInfos = useSelector(selectSetupManageInfos);
  const setupsById = useSelector(selectCalcSetupsById);

  const allArtInfos = setupManageInfos.map(({ ID }) => setupsById[ID].artInfo);
  const copyOptions = [];

  for (const index in allArtInfos) {
    if (allArtInfos[index].pieces.some((piece) => piece !== null)) {
      copyOptions.push({
        label: setupManageInfos[index].name,
        value: setupManageInfos[index].ID,
      });
    }
  }

  const onClickCopyArtifacts = ({ value: sourceId }: { value: number }) => {
    const { artInfo, artBuffCtrls } = setupsById[sourceId];

    dispatch(updateCalcSetup({ artInfo, artBuffCtrls }));
  };

  return copyOptions.length ? (
    <CopySection className="mb-4 px-4" options={copyOptions} onClickCopy={onClickCopyArtifacts} />
  ) : null;
}
