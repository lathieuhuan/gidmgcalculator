import cn from "classnames";
import { wikiImg } from "@Src/utils";
import { findCharacter } from "@Data/controllers";
import { CloseButton } from "@Styled/Inputs";

interface CharFilledSlotProps {
  name: string;
  mutable: boolean;
  onClick: () => void;
  onRemove: () => void;
}
export function CharFilledSlot({
  name,
  mutable,
  onClick,
  onRemove,
}: CharFilledSlotProps) {
  const { icon } = findCharacter(name)!;
  return (
    <>
      <div className="zoomin-on-hover overflow-hidden rounded-full bg-darkblue-3">
        <img
          className={cn(
            "w-full rounded-[inherit]",
            mutable && "cursor-pointer"
          )}
          src={wikiImg(icon)}
          alt={name}
          draggable={false}
          onClick={onClick}
        />
      </div>
      {mutable && (
        <CloseButton
          className="absolute -bottom-1 -right-2.5"
          onClick={onRemove}
        />
      )}
    </>
  );
}
