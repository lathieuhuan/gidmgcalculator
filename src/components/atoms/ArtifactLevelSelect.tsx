import type { Rarity } from "@Src/types";

interface ArtifactLevelSelectProps {
  className?: string;
  mutable?: boolean;
  rarity: Rarity;
  level: number;
  maxLevel?: number;
  onChangeLevel?: (newLevel: number) => void;
}
export function ArtifactLevelSelect({
  className = "",
  mutable,
  rarity,
  level,
  maxLevel = 0,
  onChangeLevel,
}: ArtifactLevelSelectProps) {
  if (mutable) {
    return (
      <div className={"rounded-circle bg-darkblue-3 " + className}>
        <select
          className={`px-2 pt-2 pb-1 text-lg text-rarity-${rarity} font-bold appearance-none cursor-pointer`}
          value={level}
          onChange={(e) => onChangeLevel?.(+e.target.value)}
        >
          {[...Array(maxLevel / 4 + 1).keys()].map((_, lv) => (
            <option key={lv} className="text-base" value={lv * 4}>
              +{lv * 4}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <div
      className={
        "px-2 pt-2 pb-1 w-12 bg-darkblue-3 rounded-circle cursor-default opacity-60 " + className
      }
    >
      <p className={`text-lg text-rarity-${rarity} font-bold`}>{"+" + level}</p>
    </div>
  );
}
