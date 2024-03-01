import clsx from "clsx";
import "./styles.scss";

type CheckboxSize = "small" | "medium";

interface CheckboxProps {
  className?: string;
  name?: string;
  /** Default to 'medium' */
  size?: CheckboxSize;
  defaultChecked?: boolean;
  checked?: boolean;
  readOnly?: boolean;
  children?: React.ReactNode;
  onChange?: (checked: boolean) => void;
}
export const Checkbox = ({ className, size = "medium", readOnly, children, onChange, ...rest }: CheckboxProps) => {
  const inner = (
    <span
      className={clsx(
        "styled-checkbox bg-light-600 rounded cursor-pointer overflow-hidden select-none relative shrink-0",
        `size-${size}`,
        !children && className
      )}
    >
      <input
        type="checkbox"
        className="absolute full-stretch z-10 opacity-0 cursor-pointer peer"
        onChange={(e) => onChange?.(e.target.checked)}
        {...rest}
      />
      <span className="styled-checkbox-visual absolute full-stretch bg-green-200 opacity-0 peer-checked:opacity-100 transition-opacity duration-150 select-none" />
    </span>
  );

  if (children) {
    return (
      <label className={clsx("flex items-center", className)}>
        {inner}
        <span className="ml-2">{children}</span>
      </label>
    );
  }
  return inner;
};
