export function renderEquippedChar(user: string) {
  return (
    <div className="mt-4 px-6 py-1 flex bg-[#ffe7bb]">
      <p className="font-bold text-black">Equipped: {user}</p>
    </div>
  );
}
