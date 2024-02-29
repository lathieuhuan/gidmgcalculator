import { ReactElement, ReactNode } from "react";

type Case<T> = {
  value: T;
  element: ReactNode;
};
export interface SwitchProps<T extends string | number> {
  value: T;
  cases: Case<T>[];
  default?: ReactNode;
}
export function Switch<T extends string | number>(props: SwitchProps<T>): ReactElement {
  return <>{props.cases.find((item) => item.value === props.value)?.element ?? props.default}</>;
}
