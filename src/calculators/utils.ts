import type { TrackerRecord } from "@Src/types";

export function addOrInit<T extends Partial<Record<K, number | undefined>>, K extends keyof T>(
  obj: T,
  key: K,
  value: number
) {
  obj[key] = (((obj[key] as number | undefined) || 0) + value) as T[K];
}

export function addTrackerRecord(list: TrackerRecord[] | undefined, desc: string, value: number) {
  if (!list) {
    return;
  }

  const existed = list.find((note: any) => note.desc === desc);
  if (existed) {
    existed.value += value;
  } else {
    list.push({ desc, value });
  }
}
