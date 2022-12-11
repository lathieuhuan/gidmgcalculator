import { useDispatch, useSelector } from "@Store/hooks";
import { updateCalcSetup } from "@Store/calculatorSlice";
import { selectCalcSetupsById, selectSetupManageInfos } from "@Store/calculatorSlice/selectors";

import { CopySection, type Option } from "@Screens/Calculator/components";

export function CopySelect() {
  const dispatch = useDispatch();

  const setupManageInfos = useSelector(selectSetupManageInfos);
  const setupsById = useSelector(selectCalcSetupsById);

  const allArtifacts = setupManageInfos.map(({ ID }) => setupsById[ID].artifacts);
  const copyOptions = allArtifacts.reduce((results: Option[], artifacts, index) => {
    if (artifacts.some((artifact) => artifact !== null)) {
      results.push({
        label: setupManageInfos[index].name,
        value: setupManageInfos[index].ID,
      });
    }
    return results;
  }, []);

  const onClickCopyArtifacts = ({ value: sourceId }: Option) => {
    const { artifacts, artBuffCtrls } = setupsById[sourceId];

    dispatch(updateCalcSetup({ artifacts, artBuffCtrls }));
  };

  return copyOptions.length ? (
    <CopySection className="mb-4 px-4" options={copyOptions} onClickCopy={onClickCopyArtifacts} />
  ) : null;
}
