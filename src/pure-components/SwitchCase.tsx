import { ReactElement } from "react";

type Case<T> = {
  value: T;
  element: ReactElement;
};
interface SwitchCaseProps<T> {
  value: T;
  cases: Case<T>[];
}
export function SwitchCase<T>(props: SwitchCaseProps<T>) {
  return props.cases.find((item) => item.value === props.value)?.element ?? null;
}
