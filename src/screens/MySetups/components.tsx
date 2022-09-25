import cn from "classnames";
import type { ModifierInput } from "@Src/types";
import { Checkbox } from "@Src/styled-components";

interface ModifierWrapperProps {
  className?: string;
  title: string;
  children: JSX.Element;
}
export function ModifierWrapper({ className, title, children }: ModifierWrapperProps) {
  return (
    <div className={cn("py-4 shrink-0", className)}>
      <p className="mb-2 text-h5 text-center text-orange font-bold uppercase">{title}</p>
      <div className="custom-scrollbar">{children}</div>
    </div>
  );
}

interface InputConfig {
  selfLabels?: string[];
  labels?: string[];
  renderTypes: string[];
}
export function renderSetters(
  inputConfig: InputConfig | undefined,
  inputs: ModifierInput[] | undefined,
  useSelfLabels?: boolean
) {
  if (!inputConfig || !inputs) {
    return [];
  }

  const { renderTypes } = inputConfig;
  const labels = (useSelfLabels ? inputConfig.selfLabels : inputConfig.labels) || [];

  return labels.map((label, i) => (
    <div key={i} className="flex justify-end align-center">
      <p className={cn(renderTypes[i] === "check" ? "mr-4" : "mr-2", "text-right")}>{label}</p>

      {renderTypes[i] === "check" ? (
        <Checkbox className="mr-1" checked={true} readOnly />
      ) : (
        <p className="text-orange font-bold">{inputs[i]}</p>
      )}
    </div>
  ));
}
