import type { CalcArtifact, UserArtifact } from "@Src/types";
import { ButtonGroup, ButtonGroupItem } from "@Src/pure-components";
import { OwnerLabel } from "../OwnerLabel";
import { ArtifactView, ArtifactViewProps } from "./ArtifactView";
import { CSSProperties, MouseEvent } from "react";

export type ArtifactCardAction<T extends CalcArtifact | UserArtifact = CalcArtifact> = Omit<
  ButtonGroupItem,
  "onClick"
> & {
  onClick: (e: MouseEvent<HTMLButtonElement>, artifact: T) => void;
};

interface ArtifactCardProps<T extends CalcArtifact | UserArtifact>
  extends Omit<ArtifactViewProps<T>, "className" | "artifact"> {
  wrapperCls?: string;
  className?: string;
  style?: CSSProperties;
  withActions?: boolean;
  withOwnerLabel?: boolean;
  artifact?: T;
  actions?: ArtifactCardAction<T>[];
}
export function ArtifactCard<T extends CalcArtifact | UserArtifact>({
  wrapperCls = "",
  className = "",
  style,
  artifact,
  actions,
  withActions = !!actions?.length,
  withOwnerLabel,
  ...viewProps
}: ArtifactCardProps<T>) {
  return (
    <div className={"flex flex-col " + wrapperCls}>
      <div className={"grow hide-scrollbar p-4 bg-dark-900 rounded-lg flex flex-col " + className} style={style}>
        <div className="grow hide-scrollbar">
          <ArtifactView artifact={artifact} {...viewProps} />
        </div>

        {artifact && withActions && actions?.length ? (
          <ButtonGroup
            className="mt-4"
            buttons={actions.map((action) => {
              return {
                ...action,
                onClick: (e) => action.onClick(e, artifact),
              };
            })}
          />
        ) : null}
      </div>

      {withOwnerLabel ? <OwnerLabel className="mt-4" item={artifact} /> : null}
    </div>
  );
}
