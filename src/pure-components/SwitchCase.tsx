import { ReactElement, ReactNode } from "react";

type Case<T> = {
  value: T;
  element: ReactNode;
};
interface SwitchCaseProps<T> {
  value: T;
  cases: Case<T>[];
}
export function SwitchCase<T>(props: SwitchCaseProps<T>): ReactElement | null {
  return <>{props.cases.find((item) => item.value === props.value)?.element ?? null}</>;
}
