import clsx from "clsx";
import { Star } from "./Star";

interface RarityStarsProps {
  className?: string;
  rarity: number;
}
export const RarityStars = ({ className, rarity }: RarityStarsProps) => {
  const rarityCls: Record<number, string> = {
    5: "text-rarity-5",
    4: "text-rarity-4",
    3: "text-rarity-3",
  };

  return (
    <div className={clsx("flex items-center text-lg", rarityCls[rarity] ?? "text-rarity-1", className)}>
      {Array.from({ length: rarity }, (_, i) => (
        <Star key={i} />
      ))}
    </div>
  );
};
