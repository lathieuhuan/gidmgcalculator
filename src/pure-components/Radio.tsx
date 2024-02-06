interface RadioProps {
  size?: "default" | "large";
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}
export const Radio = ({ size = "default", checked, onChange }: RadioProps) => {
  return (
    <input
      type="radio"
      className={size === "default" ? "w-4 h-4 p-1" : "w-6 h-6 p-1.5"}
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
    />
  );
};
