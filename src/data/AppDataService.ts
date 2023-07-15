import { BACKEND_URL_PATH } from "@Src/constants";
import { AppCharacter, Party } from "@Src/types";
import characters from "./characters";

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
  characters: Record<string, DataControl<AppCharacter>> = {};

  constructor() {
    Object.entries(characters).forEach(([name, data]) => {
      this.characters[name] = {
        fetched: false,
        data,
      };
    });
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

    const response: Response<AppCharacter> = await fetch(BACKEND_URL_PATH.character.byName(name))
      .then((res) => res.json())
      .catch((err) => ({
        code: 500,
        message: err.message,
        data: null,
      }));

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

  getAppCharacter(name: string) {
    return this.characters[name].data;
  }

  getPartyData(party: Party) {
    //
  }
}
