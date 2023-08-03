import type { AppCharacter, AppWeapon, Party, PartyData } from "@Src/types";
import { BACKEND_URL_PATH, GENSHIN_DEV_URL_PATH } from "@Src/constants";
import { pickProps } from "@Src/utils";
import characters from "./characters";
import weapons from "./weapons";

type Response<T> = Promise<{
  code: number;
  message?: string;
  data: T | null;
}>;

type DataControl<T> = {
  status: "unfetched" | "fetching" | "fetched";
  data: T;
};

type Subscriber<T> = (data: T) => void;

type CharacterSubscriber = Subscriber<AppCharacter>;
type WeaponSubscriber = Subscriber<AppWeapon>;

export class AppDataService {
  private characters: Record<PropertyKey, DataControl<AppCharacter>> = {};
  private characterSubscribers: Map<string, Set<CharacterSubscriber>> = new Map();

  private weapons: Array<DataControl<AppWeapon>> = [];
  private weaponSubscribers: Map<string, Set<WeaponSubscriber>> = new Map();

  constructor() {
    Object.entries(characters).forEach(([name, data]) => {
      this.characters[name] = {
        status: "unfetched",
        data,
      };
    });

    for (const list of Object.values(weapons)) {
      list.forEach((item) => {
        this.weapons[item.code] = {
          status: "unfetched",
          data: item,
        };
      });
    }
  }

  private async fetchData<T>(url: string): Response<T> {
    return await fetch(url)
      .then((res) => res.json())
      .catch((err) => ({
        code: 500,
        message: err.message,
        data: null,
      }));
  }

  public subscribeCharacter(name: string, subscriber: CharacterSubscriber) {
    const existSubscribers = this.characterSubscribers.get(name);

    if (existSubscribers) {
      existSubscribers.add(subscriber);
    } else {
      this.characterSubscribers.set(name, new Set([subscriber]));
    }

    return () => this.unsubscribeCharacter(name, subscriber);
  }

  public unsubscribeCharacter(name: string, subscriber: CharacterSubscriber) {
    this.characterSubscribers.get(name)?.delete(subscriber);
  }

  async fetchCharacter(name: string): Response<AppCharacter> {
    const control = this.characters[name];

    if (!control) {
      return {
        code: 404,
        message: "Character not found",
        data: null,
      };
    }

    if (control.status === "fetched") {
      return {
        code: 200,
        data: control.data,
      };
    }

    control.status = "fetching";
    const response = await this.fetchData<AppCharacter>(BACKEND_URL_PATH.character.byName(name));

    if (response.data) {
      control.status = "fetched";
      Object.assign(control.data, response.data);

      const characterSubscribers = this.characterSubscribers.get(name);

      if (characterSubscribers) {
        characterSubscribers.forEach((subscriber) => {
          subscriber(control.data);
        });
      }

      return {
        ...response,
        data: control.data,
      };
    }

    return response;
  }

  async fetchConsDescriptions(name: string): Response<string[]> {
    const { constellation } = this.characters[name].data;

    if (constellation[0]) {
      if (constellation[0].description) {
        return {
          code: 200,
          data: constellation.map((cons) => cons.description || "[Description missing]"),
        };
      }

      const response = await fetch(GENSHIN_DEV_URL_PATH.character(name))
        .then((res) => res.json())
        .catch((err) => ({
          code: 500,
          message: err.message,
          data: null,
        }));

      if (response?.constellations?.length) {
        const descriptions: string[] = [];

        constellation.forEach((cons, i) => {
          const description = response.constellations[i].description || "[Description missing]";

          descriptions.push(description);
          cons.description = description;
        });

        return {
          code: 200,
          data: descriptions,
        };
      }

      return {
        ...response,
        data: [],
      };
    }

    return {
      code: 200,
      data: [],
    };
  }

  getCharStatus(name: string) {
    return this.characters[name].status;
  }

  getCharData(name: string) {
    return this.characters[name].data;
  }

  getPartyData(party: Party): PartyData {
    return party.map((teammate) => {
      if (teammate) {
        const keys: Array<keyof AppCharacter> = ["code", "name", "icon", "nation", "vision", "weaponType", "EBcost"];
        return pickProps(this.characters[teammate.name].data, keys);
      }
      return null;
    });
  }

  // WEAPON

  async fetchWeapon(code: number): Response<AppWeapon> {
    const control = this.weapons[code];

    if (!control) {
      return {
        code: 404,
        message: "Weapon not found",
        data: null,
      };
    }

    if (control.status === "fetched") {
      return {
        code: 200,
        data: control.data,
      };
    }

    control.status = "fetching";
    const response = await this.fetchData<AppWeapon>(BACKEND_URL_PATH.weapon.byCode(code));

    if (response.data) {
      control.status = "fetched";
      Object.assign(control.data, response.data);

      const weaponSubscribers = this.weaponSubscribers.get(`${code}`);

      if (weaponSubscribers) {
        weaponSubscribers.forEach((subscriber) => {
          subscriber(control.data);
        });
      }

      return {
        ...response,
        data: control.data,
      };
    }

    return response;
  }
}
