import { Button } from "@Src/pure-components";
import { FaEraser } from "react-icons/fa";

interface ClearAllButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}
export const ClearAllButton = (props: ClearAllButtonProps) => {
  return (
    <Button size="small" icon={<FaEraser />} {...props}>
      Clear all
    </Button>
  );
};
