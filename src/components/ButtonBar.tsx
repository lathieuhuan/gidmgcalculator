import clsx from "clsx";
import { Button } from "@Components";

export interface ButtonBarButton {
  text: string;
  disabled?: boolean;
  variant?: "positive" | "negative" | "neutral" | "default";
  onClick?: () => void;
}
interface ButtonBarProps {
  className?: string;
  buttons: ButtonBarButton[];
  autoFocusIndex?: number;
}
export const ButtonBar = ({ className, buttons, autoFocusIndex }: ButtonBarProps) => {
  return (
    <div className={clsx("flex justify-center", !className?.includes("space-x-") && "space-x-8", className)}>
      {buttons.map((button, i) => {
        return (
          <Button
            key={i}
            className="button-focus-shadow"
            disabled={button.disabled}
            variant={button.variant || (i === buttons.length - 1 ? "positive" : !i ? "negative" : "neutral")}
            onClick={button.onClick}
            autoFocus={i === autoFocusIndex}
          >
            {button.text}
          </Button>
        );
      })}
    </div>
  );
};
