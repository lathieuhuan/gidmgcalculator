export const deepCopy = <T>(item: T): T => JSON.parse(JSON.stringify(item));

export const randomNumber = (max: number, min = 0, step = 1) => {
  return Math.floor(Math.random() * ((max - min) / step + 1)) * step + min;
};

// export const randomString = (n: number) => {
//   return Math.random()
//     .toString(36)
//     .slice(2, 2 + n);
// };

export function pickProps<M, T extends keyof M>(obj: M, keys: T[]) {
  const result = {} as Pick<M, T>;

  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

export const getImgSrc = (src?: string) => {
  if (import.meta.env.DEV) return "";
  if (!src) return "";
  return src.split("/")[0].length === 1 ? `https://static.wikia.nocookie.net/gensin-impact/images/${src}.png` : src;
};

export const getSearchParam = (key: string) => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(key);
};

export const toArray = <T>(subject: T | T[]): T[] => {
  return Array.isArray(subject) ? subject : [subject];
};

// export const pickOne = <T>(subject: T | T[], index: number): T => {
//   return Array.isArray(subject) ? subject[index] : subject;
// };

export const applyToOneOrMany = <T>(base: T | T[], callback: (base: T, index?: number) => T) => {
  return Array.isArray(base) ? base.map(callback) : callback(base);
};

const find = (key: string) => {
  return <T>(arr: T[], value?: string | number | null): T | undefined => {
    if (value === undefined) {
      return undefined;
    }
    return arr.find((item) => (item as any)?.[key] === value);
  };
};
const findIndex = (key: string) => {
  return <T>(arr: T[], value: string | number) => {
    return arr.findIndex((item) => (item as any)[key] === value);
  };
};

export const findById = find("ID");
export const findByIndex = find("index");
export const findByCode = find("code");
export const findByName = find("name");

export const indexById = findIndex("ID");
export const indexByName = findIndex("name");

export const round = (n: number, x: number) => {
  const pow = Math.pow(10, x);
  return Math.round(n * pow) / pow;
};

export const applyPercent = (n: number, percent: number) => Math.round((n * percent) / 100);

export const toMult = (n: number) => 1 + n / 100;

export const genNumberSequenceOptions = (max: number | undefined = 0, startsAt0: boolean = false, min: number = 1) => {
  const result = [...Array(max)].map((_, i) => {
    const value = i + min;
    return { label: value, value };
  });
  return startsAt0 ? [{ label: 0, value: 0 }].concat(result) : result;
};

const destructName = (name: string) => {
  const lastWord = name.match(/\s+\(([1-9]+)\)$/);

  if (lastWord?.index && lastWord[1]) {
    return {
      nameRoot: name.slice(0, lastWord.index),
      version: lastWord[1],
    };
  }

  return {
    nameRoot: name,
    version: null,
  };
};

export const getCopyName = (originalName: string, existedNames: string[]) => {
  const { nameRoot } = destructName(originalName);
  const versions = [];

  for (const existedName of existedNames) {
    const destructed = destructName(existedName);

    if (destructed.nameRoot === nameRoot && destructed.version) {
      versions[+destructed.version] = true;
    }
  }

  for (let i = 1; i <= 100; i++) {
    if (!versions[i]) {
      return nameRoot + ` (${i})`;
    }
  }

  return undefined;
};

export const getAppDataError = (type: "character", code: number | string) => {
  return `Cannot get ${type} config (ERROR_CODE: ${code})`;
};

export const removeEmpty = <T extends Record<string, any>>(obj: T): T => {
  const copy = {} as T;

  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      if (obj[key].length) {
        copy[key] = obj.key;
      }
    } else if (!["", null, undefined].includes(obj[key])) {
      copy[key] = obj[key];
    }
  }
  return copy;
};
