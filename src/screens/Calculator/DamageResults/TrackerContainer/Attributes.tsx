import { Tracker } from "@Calculators/types";
import { percentSign, round1 } from "@Src/utils";
import { getTotalRecord, renderHeading } from "./utils";

interface IAttributesProps extends Partial<Pick<Tracker, "totalAttr">> {
  //
}
export function Attributes({ totalAttr }: IAttributesProps) {
  console.log(totalAttr);

  return (
    <div className="columns-1 space-y-2 break-inside-avoid-column break-before-avoid-page">{}</div>
  );
}
