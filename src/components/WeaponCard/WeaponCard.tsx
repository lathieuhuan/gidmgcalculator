import clsx, { ClassValue } from "clsx";
import type { CSSProperties, MouseEvent } from "react";
import type { CalcWeapon, UserWeapon } from "@Src/types";
import { ButtonGroup, ButtonGroupItem } from "@Src/pure-components";
import { OwnerLabel } from "../OwnerLabel";
import { WeaponView, WeaponViewProps } from "./WeaponView";

type WeaponCardAction<T extends CalcWeapon | UserWeapon = CalcWeapon> = Omit<ButtonGroupItem, "onClick"> & {
  onClick: (e: MouseEvent<HTMLButtonElement>, weapon: T) => void;
};

interface WeaponCardProps<T extends CalcWeapon | UserWeapon> extends Omit<WeaponViewProps<T>, "className" | "weapon"> {
  wrapperCls?: string;
  className?: ClassValue;
  style?: CSSProperties;
  /** Default to true */
  withGutter?: boolean;
  withActions?: boolean;
  withOwnerLabel?: boolean;
  weapon?: T;
  actions?: WeaponCardAction<T>[];
}
export function WeaponCard<T extends CalcWeapon | UserWeapon>({
  wrapperCls = "",
  className,
  style,
  weapon,
  actions,
  withGutter = true,
  withActions = !!actions?.length,
  withOwnerLabel,
  ...viewProps
}: WeaponCardProps<T>) {
  return (
    <div className={"flex flex-col " + wrapperCls}>
      <div
        className={clsx("grow hide-scrollbar bg-dark-900 flex flex-col", withGutter && "p-4 rounded-lg", className)}
        style={style}
      >
        <div className="grow hide-scrollbar">
          <WeaponView weapon={weapon} {...viewProps} />
        </div>

        {weapon && withActions && actions?.length ? (
          <ButtonGroup
            className="mt-4"
            buttons={actions.map((action) => {
              return {
                ...action,
                onClick: (e) => action.onClick(e, weapon),
              };
            })}
          />
        ) : null}
      </div>

      {withOwnerLabel ? <OwnerLabel className="mt-4" item={weapon} /> : null}
    </div>
  );
}
