import { ReactNode, ReactElement } from "react";

type ThisValue = undefined | null | string | number | boolean | Record<PropertyKey, any>;

interface IfElseProps {
  this: ThisValue;
  then: ReactNode;
  else: ReactNode;
}
interface IfProps {
  this: ThisValue;
  children: ReactNode;
}

const isIfElseProps = (props: IfProps | IfElseProps): props is IfElseProps => "then" in props;

export function If(props: IfElseProps): ReactElement;
export function If(props: IfProps): ReactElement;
export function If(props: IfProps | IfElseProps): ReactElement {
  return <>{isIfElseProps(props) ? (props.this ? props.then : props.else) : props.this ? props.children : null}</>;
}
