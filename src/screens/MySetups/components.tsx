import type { ModifierInput } from "@Src/types";
import { VISION_TYPES } from "@Src/constants";

interface ModifierWrapperProps {
  className?: string;
  title: string;
  children: JSX.Element;
}
export function ModifierWrapper({ className = "", title, children }: ModifierWrapperProps) {
  return (
    <div className={"py-4 shrink-0 " + className}>
      <p className="mb-2 text-lg text-center text-orange font-bold uppercase">{title}</p>
      <div className="custom-scrollbar">{children}</div>
    </div>
  );
}

interface InputConfig {
  selfLabels?: string[];
  labels?: string[];
  renderTypes: string[];
  options?: string[][];
}
export function renderSetters(
  inputConfig: InputConfig | undefined,
  inputs: ModifierInput[],
  useSelfLabels?: boolean
) {
  if (!inputConfig || !inputs) {
    return [];
  }

  const { renderTypes, options = [] } = inputConfig;
  const labels = (useSelfLabels ? inputConfig.selfLabels : inputConfig.labels) || [];

  return labels.map((label, i) => {
    let setterValue;

    switch (renderTypes[i]) {
      case "check":
        setterValue = <input type="checkbox" className="mr-1 scale-150" checked={true} readOnly />;
        break;
      case "anemoable":
      case "dendroable":
        setterValue = <p className="text-orange capitalize">{VISION_TYPES[inputs[i]]}</p>;
        break;
      case "choices":
        setterValue = <p className="text-orange capitalize">{options[i][inputs[i]]}</p>;
        break;
      default:
        setterValue = <p className="text-orange capitalize">{inputs[i]}</p>;
        break;
    }
    return (
      <div key={i} className="flex justify-end align-center">
        <p className={(renderTypes[i] === "check" ? "mr-4" : "mr-2") + " text-right"}>{label}</p>
        {setterValue}
      </div>
    );
  });
}
