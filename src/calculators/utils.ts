import { turnArr } from "@Src/utils";

export function addOrInit(obj: any, key: string | number, value: number) {
  turnArr(key).forEach((k) => {
    obj[k] = (obj[k] || 0) + value;
  });
}
