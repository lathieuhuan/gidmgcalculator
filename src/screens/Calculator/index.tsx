import { selectCharData } from "@Store/calculatorSlice/selectors";
import { useSelector } from "@Store/hooks";
import cn from "classnames";
import { memo } from "react";
import styles from "./styles.module.scss";

function Calculator() {
  const charData = useSelector(selectCharData);
  return (
    <div
      className={cn("pb-2 flex items-center overflow-auto", styles.calculator)}
    >
      <div className="flex"></div>

    </div>
  );
}

export default memo(Calculator);
