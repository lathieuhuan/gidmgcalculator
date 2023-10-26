import { ReactNode, ReactElement } from "react";

interface IfElseProps {
  value: undefined | string | number | boolean | Record<PropertyKey, any>;
  then: ReactNode;
  else: ReactNode;
}
interface IfProps {
  value: undefined | string | number | boolean | Record<PropertyKey, any>;
  children: ReactNode;
}

const isIfElseProps = (props: IfProps | IfElseProps): props is IfElseProps => "then" in props;

export function If(props: IfElseProps): ReactElement | null;
export function If(props: IfProps): ReactElement | null;
export function If(props: IfProps | IfElseProps): ReactElement | null {
  return <>{isIfElseProps(props) ? (props.value ? props.then : props.else) : props.value ? props.children : null}</>;
}
