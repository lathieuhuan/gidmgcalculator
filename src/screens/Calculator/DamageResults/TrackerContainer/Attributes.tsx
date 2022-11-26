import { Tracker } from "@Calculators/types";
import { useTranslation } from "@Hooks/useTranslation";
import { CORE_STAT_TYPES } from "@Src/constants";
import { Green } from "@Src/styled-components";
import { percentSign, round1 } from "@Src/utils";
import { getTotalRecord, renderHeading } from "./utils";

interface IAttributesProps extends Partial<Pick<Tracker, "totalAttr">> {
  //
}
export function Attributes({ totalAttr }: IAttributesProps) {
  const { t } = useTranslation();
  console.log(totalAttr);

  return (
    <div className="columns-1 space-y-2 break-inside-avoid-column break-before-avoid-page">
      {CORE_STAT_TYPES.map((statType) => {
        const stat = totalAttr?.[statType] || [];
        const percent = percentSign(statType);

        return (
          <div key={statType}>
            {renderHeading(t(statType))}{" "}
            <div className="pl-2">
              {stat.map(({ desc, value }, i) =>
                value ? (
                  <p key={i} className="text-lesser">
                    • {desc}: <Green>{round1(value) + percent}</Green>
                  </p>
                ) : null
              )}
              {/* <ExtraPct type={type} tracker={tracker} ATTRs={ATTRs} /> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}
