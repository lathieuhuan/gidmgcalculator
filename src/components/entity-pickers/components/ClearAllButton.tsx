import { Button } from "@Src/pure-components";
import { BiReset } from "react-icons/bi";

interface ClearAllButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}
export const ClearAllButton = (props: ClearAllButtonProps) => {
  return (
    <Button size="small" icon={<BiReset className="text-lg" />} {...props}>
      Clear all
    </Button>
  );
};
