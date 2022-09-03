import cn from "classnames";
import { Checkbox, ModifierTemplate } from "@Src/styled-components";
import { ModifierInput } from "@Src/types";

interface ModifierWrapperProps {
  className?: string;
  title: string;
  children: JSX.Element;
}
export function ModifierWrapper({ className, title, children }: ModifierWrapperProps) {
  return (
    <div className={cn("py-4", className)}>
      <p className="mb-2 text-h5 text-center text-orange font-bold">{title}</p>
      <div className="w-75 custom-scrollbar">{children}</div>
    </div>
  );
}

export function renderSetters(labels: string[], renderType: string[], inputs: ModifierInput[]) {
  return labels.map((label, i) => (
    <div key={i} className="mt-1 flex justify-end align-center">
      <p className={cn(renderType[i] === "check" ? "mr-4" : "mr-2", "text-right")}>{label}</p>

      {renderType[i] === "check" ? (
        <Checkbox className="mr-1" checked={true} readOnly />
      ) : (
        <p className="text-orange font-bold">{inputs[i]}</p>
      )}
    </div>
  ));
}
