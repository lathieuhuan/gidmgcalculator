import { BACKEND_URL_PATH } from "@Src/constants";
import { AppCharacter, AppWeapon, Party, PartyData } from "@Src/types";
import { pickProps } from "@Src/utils";
import characters from "./characters";
import weapons from "./weapons";

type Response<T> = {
  code: number;
  message?: string;
  data: T | null;
};

type DataControl<T> = {
  fetched: boolean;
  data: T;
};

export class AppDataService {
  private characters: Record<PropertyKey, DataControl<AppCharacter>> = {};
  private weapons: Array<DataControl<AppWeapon>> = [];

  constructor() {
    Object.entries(characters).forEach(([name, data]) => {
      this.characters[name] = {
        fetched: false,
        data,
      };
    });

    for (const list of Object.values(weapons)) {
      list.forEach((item) => {
        this.weapons.push({
          fetched: false,
          data: item,
        });
      });
    }
  }

  async fetchData<T>(url: string): Promise<Response<T>> {
    const result = await fetch(url)
      .then((res) => res.json())
      .catch((err) => ({
        code: 500,
        message: err.message,
        data: null,
      }));
    return result as Response<T>;
  }

  async fetchCharacter(name: string): Promise<Response<AppCharacter>> {
    const control = this.characters[name];

    if (!control) {
      return {
        code: 404,
        message: "Character not found",
        data: null,
      };
    }

    if (control.fetched) {
      return {
        code: 200,
        data: control.data,
      };
    }

    const response = await this.fetchData<AppCharacter>(BACKEND_URL_PATH.character.byName(name));

    if (response.data) {
      control.fetched = true;
      Object.assign(control.data, response.data);

      return {
        ...response,
        data: control.data,
      };
    }

    return response;
  }

  async fetchWeapon(code: number): Promise<Response<AppWeapon>> {
    const control = this.weapons.find((weapon) => weapon.data.code === code);

    if (!control) {
      return {
        code: 404,
        message: "Character not found",
        data: null,
      };
    }

    if (control.fetched) {
      return {
        code: 200,
        data: control.data,
      };
    }

    const response = await this.fetchData<AppWeapon>(BACKEND_URL_PATH.weapon.byCode(code));

    if (response.data) {
      control.fetched = true;
      Object.assign(control.data, response.data);

      return {
        ...response,
        data: control.data,
      };
    }

    return response;
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

  getWeaponData(code: number) {
    return this.weapons.find((weapon) => weapon.data.code === code);
  }
}
