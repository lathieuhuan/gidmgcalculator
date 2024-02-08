import clsx from "clsx";
import "./styles.scss";

type RadioSize = "small" | "large";

const sizeCls: Record<RadioSize, string> = {
  small: "size-small w-4 h-4",
  large: "size-large w-6 h-6",
};

interface RadioProps {
  size?: RadioSize;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}
export const Radio = ({ size = "small", checked, onChange }: RadioProps) => {
  return (
    <span className="styled-radio flex rounded-circle cursor-pointer overflow-hidden select-none relative">
      <input
        type="radio"
        className="absolute full-stretch z-10 opacity-0 cursor-pointer peer"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span
        className={clsx(
          "styled-radio-visual flex rounded-circle border-2 border-light-800 peer-checked:border-blue-600 select-none",
          sizeCls[size]
        )}
      />
    </span>
  );
};
