import clsx from "clsx";
import { Button } from "./button";

export interface ButtonGroupItem {
  text: string;
  disabled?: boolean;
  variant?: "positive" | "negative" | "neutral" | "default";
  onClick?: () => void;
}
interface ButtonGroupProps {
  className?: string;
  buttons: ButtonGroupItem[];
  /** Default to space-x-8 (2rem) */
  space?: string;
  autoFocusIndex?: number;
}
export const ButtonGroup = ({ className, buttons, space = "space-x-8", autoFocusIndex }: ButtonGroupProps) => {
  return (
    <div className={clsx("flex justify-center", space, className)}>
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
