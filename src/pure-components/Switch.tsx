import { ReactElement, ReactNode } from "react";

type Case<T> = {
  value: T;
  element: ReactNode;
};
export interface SwitchProps<T> {
  value: T;
  cases: Case<T>[];
  default?: ReactNode;
}
export function Switch<T>(props: SwitchProps<T>): ReactElement {
  return <>{props.cases.find((item) => item.value === props.value)?.element ?? props.default}</>;
}
