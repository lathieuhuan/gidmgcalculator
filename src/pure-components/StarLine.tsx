interface StarLineProps {
  className?: string;
  rarity: number;
}
export const StarLine = ({ rarity, className = "" }: StarLineProps) => {
  return (
    <div className={"flex items-center " + className}>
      {[...Array(rarity)].map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={"w-5 h-5 " + (rarity === 5 ? "fill-rarity-5" : "fill-rarity-4")}
        >
          <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
        </svg>
      ))}
    </div>
  );
};
