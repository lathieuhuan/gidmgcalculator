export function OwnerLabel({ owner }: { owner?: string | null }) {
  return owner === undefined ? null : (
    <div className="mt-4 px-6 py-1 flex bg-[#ffe7bb]">
      <p className="font-bold text-black">Equipped: {owner || "None"}</p>
    </div>
  );
}
