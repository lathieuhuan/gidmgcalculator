import cn from "classnames";
import type { ModifierInput, UsersSetup } from "@Src/types";
import { CharFilledSlot } from "@Components/minors";
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

export type SetupOptions = Array<Pick<UsersSetup, "ID" | "type" | "name" | "char" | "party">>;

interface CombineMenuProps {
  options: SetupOptions;
  pickedIDs: number[];
  notFull: boolean;
  onClickOption: (ID: number) => void;
}
export function CombineMenu({ options, pickedIDs, notFull, onClickOption }: CombineMenuProps) {
  return (
    <div className="mt-2 pr-4 grow custom-scrollbar">
      <div>
        {!options.length && (
          <div className="h-40 flex-center">
            <p className="text-h6 font-bold">No Setups available for choosing...</p>
          </div>
        )}
        {options.map((setup) => {
          const { ID } = setup;
          const picked = pickedIDs.includes(ID);

          return (
            <div
              key={ID}
              className={cn(
                "mb-2 p-4 rounded-lg bg-darkblue-1 flex flex-col md1:flex-row md1:items-center",
                !picked && !notFull && "opacity-50"
              )}
              style={{ boxShadow: picked ? "0 0 10px 3px green inset" : undefined }}
              onClick={() => onClickOption(ID)}
            >
              <div className="md1:w-40 md1:mr-4">
                <p className="text-h6 font-bold text-orange">{setup.name}</p>
              </div>
              <div className="mt-2 md1:mt-0 flex space-x-4">
                <div className="w-16 rounded-circle shadow-3px-2px shadow-orange">
                  <CharFilledSlot mutable={false} name={setup.char.name} />
                </div>
                {setup.party.map((teammate, j) => {
                  if (teammate) {
                    return (
                      <div key={j} className="w-16 rounded-circle">
                        <CharFilledSlot mutable={false} name={teammate.name} />
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
