import type { AppCharacter, Party, PartyData, Talent } from "@Src/types";
import type { StandardResponse } from "../types";
import type { DataControl, ServiceSubscriber } from "./types";

import { BACKEND_URL, GENSHIN_DEV_URL } from "@Src/constants";
import { pickProps } from "@Src/utils";
import { BaseService } from "./BaseService";

type CharacterSubscriber = ServiceSubscriber<AppCharacter>;

export class AppCharacterService extends BaseService {
  private characters: Array<DataControl<AppCharacter>> = [];
  private subscribers: Map<string, Set<CharacterSubscriber>> = new Map();

  constructor() {
    super();
    // this.characters = characters.map((character) => ({
    //   status: "fetched",
    //   data: character,
    // }));
  }

  populateCharacters(characters: AppCharacter[]) {
    this.characters = characters.map((character) => ({
      status: "fetched",
      data: character,
    }));
  }

  private getControl(name: string) {
    return this.characters.find((character) => character.data.name === name);
  }

  public subscribe(name: string, subscriber: CharacterSubscriber) {
    const existSubscribers = this.subscribers.get(name);

    if (existSubscribers) {
      existSubscribers.add(subscriber);
    } else {
      this.subscribers.set(name, new Set([subscriber]));
    }

    return () => this.unsubscribeCharacter(name, subscriber);
  }

  private unsubscribeCharacter(name: string, subscriber: CharacterSubscriber) {
    this.subscribers.get(name)?.delete(subscriber);
  }

  async fetch(name: string): StandardResponse<AppCharacter> {
    const control = this.getControl(name);

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
    const response = await this.fetchData<AppCharacter>(BACKEND_URL.character.byName(name));

    if (response.data) {
      control.status = "fetched";
      Object.assign(control.data, response.data);

      const subscribers = this.subscribers.get(name);

      if (subscribers) {
        subscribers.forEach((subscriber) => {
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

  private parseGenshinDevData(response: any, appCharacter?: AppCharacter) {
    if (!appCharacter) return;
    const EMPTY_MSG = "[Description missing]";
    const { constellation = [], activeTalents, passiveTalents = [] } = appCharacter;
    const consDescriptions: string[] = [];
    const talentDescriptions: string[] = [];

    if (response?.constellations?.length) {
      constellation.forEach((cons, i) => {
        const description = response.constellations[i]?.description || EMPTY_MSG;
        consDescriptions.push(description);
        cons.description = description;
      });
    }
    if (response?.skillTalents?.length) {
      const processDescription = (talent: Talent, type: string) => {
        const description = response.skillTalents.find((talent: any) => talent.type === type)?.description || EMPTY_MSG;
        const activeTalent = activeTalents[talent];

        if (activeTalent) {
          activeTalent.description = description;
        }
        talentDescriptions.push(description);
      };

      processDescription("NAs", "NORMAL_ATTACK");
      processDescription("ES", "ELEMENTAL_SKILL");
      processDescription("EB", "ELEMENTAL_BURST");
    }
    if (response?.passiveTalents?.length) {
      //
    }

    return {
      consDescriptions,
      talentDescriptions,
    };
  }

  private setConsDescriptions(name: string, descriptions: string[], consRef?: AppCharacter["constellation"]) {
    const constellation = consRef || this.getControl(name)?.data?.constellation || [];

    constellation.forEach((cons, i) => {
      cons.description = descriptions?.[i] || "";
    });
  }

  async fetchConsDescriptions(name: string): StandardResponse<string[]> {
    const { constellation = [], activeTalents } = this.getControl(name)?.data || {};

    if (constellation[0]) {
      if (constellation[0].description) {
        return {
          code: 200,
          data: constellation.map((cons) => cons.description || "[Description missing]"),
        };
      }

      const response = await fetch(GENSHIN_DEV_URL.character(name))
        .then((res) => res.json())
        .catch((err) => ({
          code: 500,
          message: err.message,
          data: null,
        }));

      if (response?.constellations?.length) {
        const descriptions: string[] = [];

        constellation.forEach((cons, i) => {
          const description = response.constellations[i]?.description || "[Description missing]";

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

  getAll(): AppCharacter[] {
    return this.characters.map((control) => control.data);
  }

  getStatus(name: string) {
    const control = this.getControl(name);
    return control?.status || "unfetched";
  }

  get(name: string) {
    const control = this.getControl(name);
    return control!.data;
  }

  getPartyData(party: Party): PartyData {
    return party.map((teammate) => {
      if (teammate) {
        const keys: Array<keyof AppCharacter> = ["code", "name", "icon", "nation", "vision", "weaponType", "EBcost"];
        return pickProps(this.getControl(teammate.name)!.data, keys);
      }
      return null;
    });
  }
}
